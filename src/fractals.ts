import Complex from "complex.js";

type PointData = [z: Complex, iterations: number, diverged: boolean];

function calculateFractalPoint(c: Complex, max: number): PointData {
  let z = new Complex(0);
  let n = 0;
  while (n < max) {
    z = z.mul(z).add(c);
    if (z.im * z.im + z.re * z.re > 4) {
      return [z, n, true];
    }

    n++;
  }
  return [z, n, false];
}

export interface RenderFractalWindow {
  size: number;
  center: Complex;
  zoom: number;
}

export interface RenderFractalOptions extends RenderFractalWindow {
  maxIterations: number;
  colorizer: Colorizer;
}

type ColorizerFn = (
  p: PointData,
  buf: Uint8ClampedArray,
  index: number
) => void;

export enum Colorizer {
  Psychedelic = "psychedelic",
  Rainbow = "rainbow",
  BlackAndWhite = "blackAndWhite",
  Iterations = "iterations",
}

function hsvrgb(
  hsv: [number, number, number],
  rgb: Uint8ClampedArray,
  index: number
): void {
  const h = hsv[0] / 60;
  const s = hsv[1] / 100;
  let v = hsv[2] / 100;
  const hi = Math.floor(h) % 6;

  const f = h - Math.floor(h);
  const p = 255 * v * (1 - s);
  const q = 255 * v * (1 - s * f);
  const t = 255 * v * (1 - s * (1 - f));
  v *= 255;

  rgb[index] = [v, q, p, p, t, v][hi];
  rgb[index + 1] = [t, v, v, q, p, p][hi];
  rgb[index + 2] = [p, p, t, v, v, q][hi];
  rgb[index + 3] = 255;
}

const colorizerMap: { [key in Colorizer]: ColorizerFn } = {
  psychedelic: (p: PointData, buf: Uint8ClampedArray, index: number) => {
    const [z, iterations, diverged] = p;
    if (diverged) {
      const hue = z.abs() * 100;
      hsvrgb([hue, 100, iterations], buf, index);
    } else {
      hsvrgb([0, 0, 0], buf, index);
    }
  },
  rainbow: (p: PointData, buf: Uint8ClampedArray, index: number) => {
    const [z] = p;
    const v = z.abs();
    const brightness = v * 255;
    const hue = (z.arg() / (2 * Math.PI) + 1) * 255;
    buf[index] = hue;
    buf[index + 1] = brightness;
    buf[index + 2] = 255 - hue;
    buf[index + 3] = 255;
  },
  blackAndWhite: (p: PointData, buf: Uint8ClampedArray, index: number) => {
    const [z] = p;
    const v = z.abs();
    const brightness = v * 255;
    buf[index] = brightness;
    buf[index + 1] = brightness;
    buf[index + 2] = brightness;
    buf[index + 3] = 255;
  },
  iterations: (p: PointData, buf: Uint8ClampedArray, index: number) => {
    const [, iterations, diverged] = p;
    const value = diverged ? iterations : 0;
    const hue = (value / 200) * 255;
    hsvrgb([hue, 100, value], buf, index);
  },
};

export function screenCoordinatesToComplex(
  { size, center, zoom }: RenderFractalWindow,
  x: number,
  y: number
): Complex {
  const zoomByWidth = zoom / size;

  // return new Complex(zoomByWidth * (x - centerX), zoomByWidth * (y - centerY));
  return new Complex(
    zoomByWidth * (x - size / 2),
    zoomByWidth * (y - size / 2)
  ).add(center);
}

export function complexToScreenCoordinates(
  { size, center, zoom }: RenderFractalWindow,
  c: Complex
): { x: number; y: number } {
  const zoomByWidth = zoom / size;

  const d = c.sub(center);

  return {
    x: d.re / zoomByWidth + size / 2,
    y: d.im / zoomByWidth + size / 2,
  };

  // return {
  //   x: centerX + c.re / zoomByWidth,
  //   y: centerY + c.im / zoomByWidth,
  // };
}

export function renderFractalOnImageData(
  data: Uint8ClampedArray,
  { size, maxIterations, center, zoom, colorizer }: RenderFractalOptions
) {
  const win = { size, center, zoom };

  const colorizerFn = colorizerMap[colorizer];

  let i = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = screenCoordinatesToComplex(win, x, y);
      let z = calculateFractalPoint(c, maxIterations);
      i += 4;
      colorizerFn(z, data, i);
    }
  }
}

export function renderFractal(
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

  const colorizerFn = colorizerMap[colorizer];

  console.time("renderFractal");
  renderFractalOnImageData(data, {
    size,
    maxIterations,
    center,
    zoom,
    colorizer,
  });
  ctx.putImageData(imageData, 0, 0);
  console.timeEnd("renderFractal");
}
