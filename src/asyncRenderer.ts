import { RenderFractalOptions } from "./fractals";
import MyWorker from "./webWorker?worker";

const worker = new MyWorker();

export async function renderFractalWithWebWorker(
  canvas: HTMLCanvasElement,
  { size, maxIterations, center, zoom, colorizer }: RenderFractalOptions
) {
  const win = { size, center, zoom };
  let ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  let imageData = ctx.createImageData(size, size);
  let data = imageData.data;

  worker.postMessage({
    data: {
      data,
      size,
      maxIterations,
      center,
      zoom,
      colorizer,
    },
  });

  worker.onmessage = (event) => {
    console.log("worker sent message", event);
  };
}
