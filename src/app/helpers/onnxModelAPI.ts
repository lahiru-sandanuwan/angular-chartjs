import { Tensor } from 'onnxruntime-web';
import { modeDataProps } from './interfaces';

interface ModelDataReturn {
  image_embeddings: Tensor;
  point_coords: Tensor;
  point_labels: Tensor;
  orig_im_size: Tensor;
  mask_input: Tensor;
  has_mask_input: Tensor;
}

const modelData = ({
  clicks,
  tensor,
  modelScale,
}: modeDataProps): ModelDataReturn | void => {
  const imageEmbedding = tensor;
  let pointCoords: Float32Array;
  let pointLabels: Float32Array;
  let pointCoordsTensor: Tensor | undefined;
  let pointLabelsTensor: Tensor | undefined;

  // Check there are input click prompts
  if (clicks) {
    let n = clicks.length;

    pointCoords = new Float32Array(2 * (n + 1));
    pointLabels = new Float32Array(n + 1);

    for (let i = 0; i < n; i++) {
      pointCoords[2 * i] = clicks[i].x * modelScale.samScale;
      pointCoords[2 * i + 1] = clicks[i].y * modelScale.samScale;
      pointLabels[i] = clicks[i].clickType;
    }

    pointCoords[2 * n] = 0.0;
    pointCoords[2 * n + 1] = 0.0;
    pointLabels[n] = -1.0;

    pointCoordsTensor = new Tensor('float32', pointCoords, [1, n + 1, 2]);
    pointLabelsTensor = new Tensor('float32', pointLabels, [1, n + 1]);
  }

  const imageSizeTensor = new Tensor('float32', [
    modelScale.height,
    modelScale.width,
  ]);

  if (pointCoordsTensor === undefined || pointLabelsTensor === undefined)
    return;

  const maskInput = new Tensor(
    'float32',
    new Float32Array(256 * 256),
    [1, 1, 256, 256]
  );
  const hasMaskInput = new Tensor('float32', [0]);

  return {
    image_embeddings: imageEmbedding,
    point_coords: pointCoordsTensor,
    point_labels: pointLabelsTensor,
    orig_im_size: imageSizeTensor,
    mask_input: maskInput,
    has_mask_input: hasMaskInput,
  };
};

export { modelData };
