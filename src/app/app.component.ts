import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { InferenceSession, Tensor } from 'onnxruntime-web';
import { AppContextService } from './services/app-context.service';

/* @ts-ignore */
import npyjs from 'npyjs';
import { onnxMaskToImage } from './helpers/maskUtils';
import { modelInputProps, modelScaleProps } from './helpers/interfaces';
import { handleImageScale } from './helpers/scaleHelper';
import { modelData } from '@antv/sam/dist/api/onnxModel';
import * as ort from 'onnxruntime-web';
import { Subscription } from 'rxjs';
import { onnxMaskToPolygon } from '@antv/sam/dist/utils/mask';
import * as _ from 'lodash';

declare var cv: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedTab: number = 1;

  title = 'angular-chartjs';

  model: InferenceSession | null = null;
  tensor: Tensor | null = null;
  modelScale: modelScaleProps | null = null;
  clicksSubscription!: Subscription;
  clicks: modelInputProps[] | null = null;
  @ViewChild('imageEl') imageEl!: ElementRef<HTMLImageElement>;
  shouldFitToWidth = true;

  private readonly IMAGE_PATH = './assets/data/dogs.jpg';
  private readonly IMAGE_EMBEDDING = './assets/data/dogs_embedding.npy';
  private readonly MODEL_DIR = './assets/model/sam_onnx_example.onnx';

  constructor(public appContext: AppContextService) {}

  async ngOnInit() {
    try {
      ort.env.wasm.wasmPaths = './assets/onnxruntime-web/';
      this.model = await ort.InferenceSession.create(this.MODEL_DIR);
      await this.loadImage(this.IMAGE_PATH);
      this.tensor = await this.loadNpyTensor(this.IMAGE_EMBEDDING, 'float32');

      this.clicksSubscription = this.appContext.clicks$.subscribe((clicks) => {
        this.clicks = clicks;
        if (clicks) {
          this.runONNX();
        }
      });
    } catch (error) {
      console.error('Error initializing the model or loading data:', error);
    }

    // this.clicksSubscription = this.appContext.clicks$.subscribe((clicks) => {
    //   this.clicks = clicks;
    // });

    if (typeof cv !== 'undefined' && cv.getBuildInformation) {
      // OpenCV is loaded
      console.log('OpenCV loaded');
      // Now you can use OpenCV functions
    } else {
      console.error('OpenCV not loaded');
    }
  }

  loadImage(url: string): void {
    try {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        this.modelScale = {
          height,
          width,
          samScale,
        };
        img.width = width;
        img.height = height;
        this.appContext.setImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  }

  async loadNpyTensor(tensorFile: string, dType: any): Promise<Tensor | null> {
    try {
      const npLoader = new npyjs();
      const npArray = await npLoader.load(tensorFile);
      return new ort.Tensor(dType, npArray.data, npArray.shape);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async runONNX() {
    try {
      if (!this.model || !this.clicks || !this.tensor || !this.modelScale) {
        return;
      }

      console.log();
      
      // Prepare the model input in the correct format
      const feeds = modelData({
        clicks: this.clicks,
        tensor: this.tensor,
        modelScale: this.modelScale,
      });

      if (!feeds) return;

      // Run the ONNX model
      const results = await this.model.run(feeds);
      const output = results[this.model.outputNames[0]];
      const maskImage = onnxMaskToImage(
        output.data,
        output.dims[2],
        output.dims[3]
      );
      console.log(this.extractBoundaryPoints('my-image'));
      this.appContext.setMaskImg(maskImage);
    } catch (e) {
      console.error('Error running ONNX model:', e);
    }
  }

  extractBoundaryPoints(imageId: string) {
    const imageEl = document.getElementById(imageId) as HTMLImageElement;
    if (!imageEl) return;
    let src = cv.imread(imageId);
    let gray = new cv.Mat();
    let cannyOutput = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(gray, cannyOutput, 100, 200, 3, false);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    // Find contours
    cv.findContours(
      cannyOutput,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );


    // Extract points from the contours
    let boundaryPoints: [number, number][] = [];
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);

      // Simplify contour
      let epsilon = 0.005 * cv.arcLength(cnt, true);
      let approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, epsilon, true);

      for (let j = 0; j < approx.data32S.length; j += 2) {
        boundaryPoints.push([approx.data32S[j], approx.data32S[j + 1]]);
      }

      cnt.delete();
      approx.delete();
    }

    // Cleanup
    src.delete();
    gray.delete();
    cannyOutput.delete();
    contours.delete();
    hierarchy.delete();

    return boundaryPoints;
  }

  // getBoundaryPoints(maskImage: HTMLImageElement): Promise<[number, number][]> {
  //   return new Promise((resolve, reject) => {
  //     // Check if the image is already loaded
  //     if (maskImage.complete && maskImage.naturalWidth !== 0) {
  //       // Process the already loaded image
  //       resolve(this.processImage(maskImage));
  //     } else {
  //       // Set up load event listener if the image is not yet loaded
  //       maskImage.onload = () => {
  //         resolve(this.processImage(maskImage));
  //       };
  //       maskImage.onerror = () => {
  //         reject(new Error('Error loading mask image'));
  //       };
  //     }
  //   });
  // }

  // processImage(image: HTMLImageElement): [number, number][] {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   canvas.width = image.width;
  //   canvas.height = image.height;
  //   context?.drawImage(image, 0, 0);

  //   const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
  //   const data = imageData?.data;

  //   const points: [number, number][] = [];
  //   for (let y = 0; y < canvas.height; y++) {
  //     for (let x = 0; x < canvas.width; x++) {
  //       const index = (y * canvas.width + x) * 4;
  //       if (data && data[index] < 255) {
  //         // Adjust based on mask's color
  //         points.push([x, y]);
  //       }
  //     }
  //   }

  //   // Optional: Simplify the points array
  //   // ...

  //   return points;
  // }

  drawPolygonInSvg(points: [number, number][]): void {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svgElement = document.createElementNS(svgNs, 'svg');
    const polygon = document.createElementNS(svgNs, 'polygon');

    // Convert points array to a string format suitable for SVG
    const pointsAttr = points.map((p) => p.join(',')).join(' ');
    polygon.setAttribute('points', pointsAttr);
    polygon.style.fill = 'none';
    polygon.style.stroke = 'red'; // Example: red outline
    polygon.style.strokeWidth = '2';

    svgElement.appendChild(polygon);
    document.body.appendChild(svgElement); // Append wherever appropriate in your DOM
  }

  base64ToBlob(base64: any): void {
    const blob = fetch(`data:image/jpeg;base64,${base64}`)
      .then((res) => res.blob())
      .then((blob) => {
        // Now you have a Blob which you can use with HTMLImageElement or Canvas API
        const img = new Image();
        img.onload = () => {
          // You can now use img with Canvas API for further processing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx!.drawImage(img, 0, 0);
          // ... more processing ...
        };
        img.src = URL.createObjectURL(blob);
      });
  }
}
