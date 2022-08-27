import Complex from "complex.js";
import { FC, useEffect, useRef } from "react";
import { Colorizer, renderFractal, RenderFractalWindow } from "./fractals";
import { MouseTool, useZoomOnClick, useZoomWindow } from "./tools";

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

//--------------------------------------------------------------------------------

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

  useEffect(() => {
    if (canvas.current) {
      renderFractal(canvas.current, {
        size,
        zoom,
        center,
        maxIterations: iterations,
        colorizer,
      });
    }
  }, [canvas, size, iterations, zoom, colorizer]);

  return (
    <div style={{ position: "relative", width: "100%", height: size }}>
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
        {...tool.eventHandlers}
      />
    </div>
  );
};
