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
import * as d3 from 'd3';
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

  ngOnInit(): void {
      
  }

  // async ngOnInit() {
  //   try {
  //     ort.env.wasm.wasmPaths = './assets/onnxruntime-web/';
  //     this.model = await ort.InferenceSession.create(this.MODEL_DIR);
  //     await this.loadImage(this.IMAGE_PATH);
  //     this.tensor = await this.loadNpyTensor(this.IMAGE_EMBEDDING, 'float32');

  //     this.clicksSubscription = this.appContext.clicks$.subscribe((clicks) => {
  //       if (clicks) {
  //         this.runONNX();
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error initializing the model or loading data:', error);
  //   }

  //   this.clicksSubscription = this.appContext.clicks$.subscribe((clicks) => {
  //     this.clicks = clicks;
  //   });

  //   if (typeof cv !== 'undefined' && cv.getBuildInformation) {
  //     // OpenCV is loaded
  //     console.log('OpenCV loaded');
  //     // Now you can use OpenCV functions
  //   } else {
  //     console.error('OpenCV not loaded');
  //   }
  // }

  getMouseClick(): void {}

  // async initModel(): Promise<void> {
  //   const modelDir = './assets/model/sam_onnx_example.onnx';
  //   ort.env.wasm.wasmPaths = './assets/onnxruntime-web/';

  //   try {
  //     this.model = await ort.InferenceSession.create(modelDir);
  //     // console.log(session);

  //     console.log('Model loaded successfully');
  //     // Further processing here
  //   } catch (e) {
  //     console.error('Failed to load the model', e);
  //   }
  // }

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

      console.log(output);

      // console.log(output.toDataURL());

      // Convert the output to an image and update the mask image
      const maskImage = onnxMaskToImage(
        output.data,
        output.dims[2],
        output.dims[3]
      );

      this.appContext.setMaskImg(maskImage);
      // const imgData = output.toImageData();

      // console.log(imgData);

      // const polygons = onnxMaskToPolygon(
      //   output.data,
      //   output.dims[2],
      //   output.dims[3]
      // );

      // console.log(polygons);
      // this.drawPolygon();
    } catch (e) {
      console.error('Error running ONNX model:', e);
    }
  }

  drawPolygon(): void {
    // const svg = d3.select('svg');
    // points.forEach((polygon: any) => {
    //   svg
    //     .append('polygon')
    //     .attr('points', polygon.map((point: any) => point.join(',')).join(' '))
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 2)
    //     .attr('fill', 'none');
    // });

    // const svg = d3.select('svg');
    // svg
    //   .append('polygon')
    //   .attr('points', points as any)
    //   .attr('fill', 'limegreen')
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', 2);
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
