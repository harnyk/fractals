import Complex from "complex.js";

function calculateFractalPoint(c: Complex, max: number) {
  let z = new Complex(0);
  let n = 0;
  while (n < max) {
    z = z.mul(z).add(c);
    // if (z.abs() > 2) {
    //   return z;
    // }
    if (z.im > 2 || z.im < -2 || z.re > 2 || z.re < -2) {
      return z;
    }
    n++;
  }
  return z;
}

export interface RenderFractalWindow {
  size: number;
  centerX: number;
  centerY: number;
  zoom: number;
}

export interface RenderFractalOptions extends RenderFractalWindow {
  maxIterations: number;
  colorizer: Colorizer;
}

type ColorizerFn = (z: Complex, buf: Uint8ClampedArray, index: number) => void;

export enum Colorizer {
  Psychedelic = "psychedelic",
  Rainbow = "rainbow",
  BlackAndWhite = "blackAndWhite",
}

const colorizerMap: { [key in Colorizer]: ColorizerFn } = {
  psychedelic: (z: Complex, buf: Uint8ClampedArray, index: number) => {
    buf[index] = Math.floor(z.re * 255);
    buf[index + 1] = Math.floor(z.im * 255);
    buf[index + 2] = Math.floor(z.re * 255);
    buf[index + 3] = 255;
  },
  rainbow: (z: Complex, buf: Uint8ClampedArray, index: number) => {
    const v = z.abs();
    const brightness = v * 255;
    const hue = (z.arg() / (2 * Math.PI) + 1) * 255;
    buf[index] = hue;
    buf[index + 1] = brightness;
    buf[index + 2] = 255 - hue;
    buf[index + 3] = 255;
  },
  blackAndWhite: (z: Complex, buf: Uint8ClampedArray, index: number) => {
    const v = z.abs();
    const brightness = v * 255;
    buf[index] = brightness;
    buf[index + 1] = brightness;
    buf[index + 2] = brightness;
    buf[index + 3] = 255;
  },
};

export function screenCoordinatesToComplex(
  { size, centerX, centerY, zoom }: RenderFractalWindow,
  x: number,
  y: number
): Complex {
  const zoomByWidth = zoom / size;

  return new Complex(zoomByWidth * (x - centerX), zoomByWidth * (y - centerY));
}

export function complexToScreenCoordinates(
  { size, centerX, centerY, zoom }: RenderFractalWindow,
  c: Complex
): { x: number; y: number } {
  const zoomByWidth = zoom / size;

  return {
    x: centerX + c.re / zoomByWidth,
    y: centerY + c.im / zoomByWidth,
  };
}

export function renderFractal(
  canvas: HTMLCanvasElement,
  {
    size,
    maxIterations,
    centerX,
    centerY,
    zoom,
    colorizer,
  }: RenderFractalOptions
) {
  let ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  let imageData = ctx.createImageData(size, size);
  let data = imageData.data;

  const colorizerFn = colorizerMap[colorizer];

  console.time("renderFractal");
  let i = 0;
  const zoomBySize = zoom / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = new Complex(
        zoomBySize * (x - centerX),
        zoomBySize * (y - centerY)
      );
      let z = calculateFractalPoint(c, maxIterations);
      i += 4;
      colorizerFn(z, data, i);
    }
  }
  ctx.putImageData(imageData, 0, 0);
  console.timeEnd("renderFractal");
}
