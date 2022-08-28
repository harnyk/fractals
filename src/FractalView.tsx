import { css } from "@emotion/css";
import Complex from "complex.js";
import { FC, useEffect, useRef } from "react";
import { renderFractalWithWebWorker } from "./asyncRenderer";
import {
  Colorizer,
  RenderFractalWindow,
  screenCoordinatesToComplex,
} from "./fractals";
import {
  getMousePosition,
  MouseTool,
  useZoomOnClick,
  useZoomWindow,
} from "./tools";
import { useWorker } from "./useWorker";

interface FractalViewProps {
  size: number;
  zoom: number;
  center: Complex;
  iterations: number;
  colorizer: Colorizer;
  mouseTool: MouseTool;
  onMouseMove: (x: number, y: number, c: Complex) => void;
  onChangeRenderWindow?: (renderWindow: RenderFractalWindow) => void;
}

export const FractalView: FC<FractalViewProps> = ({
  center,
  size,
  iterations,
  zoom,
  colorizer,
  mouseTool = MouseTool.ZoomIn,
  onMouseMove,
  onChangeRenderWindow,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLCanvasElement>(null);

  const zoomInTool = useZoomOnClick(
    { center, size, zoom },
    overlay,
    2,
    onChangeRenderWindow
  );

  const zoomOutTool = useZoomOnClick(
    { center, size, zoom },
    overlay,
    0.5,
    onChangeRenderWindow
  );

  const zoomWindowTool = useZoomWindow(
    { center, size, zoom },
    overlay,
    onChangeRenderWindow
  );

  const tool =
    mouseTool === MouseTool.ZoomIn
      ? zoomInTool
      : mouseTool === MouseTool.ZoomOut
      ? zoomOutTool
      : zoomWindowTool;

  const worker = useWorker();

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (!ctx) {
        return;
      }
      const imageData = ctx.getImageData(0, 0, size, size);
      const buffer = imageData.data;
      worker.run({
        imageData: buffer,
        center,
        size,
        maxIterations: iterations,
        zoom,
        colorizer,
      });
    }
  }, [canvas, size, iterations, zoom, colorizer]);

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (!ctx) {
        return;
      }

      if (worker.data) {
        const imageData = ctx.getImageData(0, 0, size, size);
        imageData.data.set(worker.data);
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [canvas.current, worker.data]);

  const events = {
    ...tool.eventHandlers,
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if ("onMouseMove" in tool.eventHandlers) {
        tool.eventHandlers.onMouseMove?.(e);
      }
      const { x, y } = getMousePosition(e);
      const c = screenCoordinatesToComplex({ size, zoom, center }, x, y);
      onMouseMove(x, y, c);
    },
  };

  return (
    <div
      className={css({
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
        border: "1px solid black",
      })}
    >
      <canvas
        ref={canvas}
        style={{ cursor: "crosshair", top: 0, left: 0, position: "absolute" }}
        width={size}
        height={size}
      />
      <canvas
        ref={overlay}
        width={size}
        height={size}
        style={{ cursor: "crosshair", top: 0, left: 0, position: "absolute" }}
        {...events}
      />
    </div>
  );
};
