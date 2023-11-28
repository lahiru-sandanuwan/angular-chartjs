import { offsetPolygon, simplifyPolygon } from "./vector";
import * as d3 from 'd3-contour';


function getImageExtent(
    input: any,
    width: number,
    height: number,
    pad: number = 15,
  ) {
    let minx = width;
    let maxx = 0;
    let miny = height;
    let maxy = 0;
    for (let i = 0; i < input.length; i++) {
      // Threshold the onnx model mask prediction at 0.0
      // This is equivalent to thresholding the mask using predictor.model.mask_threshold
      // in python
  
      if (input[i] > 0.0) {
        let x = i % width;
        let y = Math.floor(i / width);
        minx = Math.min(minx, x);
        maxx = Math.max(maxx, x);
        miny = Math.min(miny, y);
        maxy = Math.max(maxy, y);
      }
    }
    return [minx - pad, maxx + pad, miny - pad, maxy + pad];
  }

  function getImageDataByRegion(
    minx: number,
    miny: number,
    maxx: number,
    maxy: number,
    imageData: number[],
    width: number,
  ) {
    const data: number[] = [];
    let destIndex = 0;
    for (let y = miny; y < maxy; y++) {
      for (let x = minx; x < maxx; x++) {
        const sourceIndex = y * width + x;
        data[destIndex++] = imageData[sourceIndex] > 0 ? 1 : -1;
      }
    }
    return data;
  }
  
export function onnxMaskToPolygon(
    input: any,
    width: number,
    height: number,
    simplifyThreshold: number = 5,
  ) {
    const [minx, maxx, miny, maxy] = getImageExtent(input, width, height);
    const bboxData = getImageDataByRegion(minx, miny, maxx, maxy, input, width);
  
    const bboxWidth = maxx - minx;
    const bboxHeight = maxy - miny;
    const contours = d3
      .contours()
      .size([bboxWidth, bboxHeight])
      .smooth(false)
      .thresholds(2);
    const lines = contours(bboxData);
    const newPolgon = offsetPolygon(lines[1], [minx, miny]);
    return simplifyPolygon(newPolgon, simplifyThreshold);
  }