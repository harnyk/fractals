import Complex from "complex.js";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import { renderFractal, screenCoordinatesToComplex } from "./fractals";

export const FractalView: FC<{
  size: number;
  zoom: number;
  centerX: number;
  centerY: number;

  iterations: number;

  onMouseMove?: (x: number, y: number, c: Complex) => void;
  onClick?: (x: number, y: number, c: Complex) => void;
}> = ({ centerX, centerY, size, iterations, zoom, onMouseMove, onClick }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      renderFractal(canvas.current, {
        size,
        zoom,
        centerX,
        centerY,
        maxIterations: iterations,
      });
    }
  }, [canvas, size, iterations, zoom]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const x = e.clientX - canvas.current.offsetLeft;
        const y = e.clientY - canvas.current.offsetTop;
        const c = screenCoordinatesToComplex(
          {
            size,
            zoom,
            centerX,
            centerY,
          },
          x,
          y
        );
        if (onMouseMove) {
          onMouseMove(x, y, c);
        }
      }
    },
    [canvas, size, zoom, onMouseMove]
  );
  const handleClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const x = e.clientX - canvas.current.offsetLeft;
        const y = e.clientY - canvas.current.offsetTop;
        const c = screenCoordinatesToComplex(
          {
            size,
            zoom,
            centerX,
            centerY,
          },
          x,
          y
        );
        if (onClick) {
          onClick(x, y, c);
        }
      }
    },
    [canvas, size, zoom, onMouseMove]
  );

  return (
    <canvas
      ref={canvas}
      width={size}
      height={size}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};
