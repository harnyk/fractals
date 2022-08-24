import Complex from "complex.js";
import {
  DragEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Colorizer,
  complexToScreenCoordinates,
  renderFractal,
  RenderFractalWindow,
  screenCoordinatesToComplex,
} from "./fractals";

interface FractalViewProps {
  size: number;
  zoom: number;
  center: Complex;
  iterations: number;
  colorizer: Colorizer;
  onMouseMove: (x: number, y: number, c: Complex) => void;
  onChangeRenderWindow?: (renderWindow: RenderFractalWindow) => void;
}

interface DragState {
  startX: number;
  startY: number;
}

export const FractalView: FC<FractalViewProps> = ({
  center,
  size,
  iterations,
  zoom,
  colorizer,
  onMouseMove,
  onChangeRenderWindow,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

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

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const x = e.clientX - canvas.current.offsetLeft;
        const y = e.clientY - canvas.current.offsetTop;
        const c = screenCoordinatesToComplex({ size, zoom, center }, x, y);
        if (onMouseMove) {
          onMouseMove(x, y, c);
        }

        if (dragState) {
          handleDrag(x, y);
        }
      }
    },
    [canvas, size, zoom, onMouseMove]
  );

  const handleDrag = (x: number, y: number) => {
    if (overlay.current && dragState) {
      const ctx = overlay.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, overlay.current.width, overlay.current.height);
        ctx.beginPath();
        ctx.rect(
          dragState.startX,
          dragState.startY,
          x - dragState.startX,
          y - dragState.startY
        );
        ctx.stroke();
      }
    }
  };

  const handleDragEnd = (x: number, y: number) => {
    if (dragState) {
      const x1 = Math.min(dragState.startX, x);
      const x2 = Math.max(dragState.startX, x);
      const y1 = Math.min(dragState.startY, y);
      const y2 = Math.max(dragState.startY, y);
      console.log(x1, x2, y1, y2);
      const c1 = screenCoordinatesToComplex({ size, zoom, center }, x1, y1);
      const c2 = screenCoordinatesToComplex({ size, zoom, center }, x2, y2);
      const newCenter = c1.add(c2).div(2);
      const newZoom = (zoom * (x2 - x1)) / size;
      console.log(newCenter, newZoom);
      setDragState(null);
      //clear overlay
      if (overlay.current) {
        const ctx = overlay.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, overlay.current.width, overlay.current.height);
        }
      }
    }
  };

  const handleClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      console.log("click");
      if (canvas.current) {
        const x = e.clientX - canvas.current.offsetLeft;
        const y = e.clientY - canvas.current.offsetTop;
        const newZoom = zoom / 2;
        const c = screenCoordinatesToComplex(
          { size, zoom: newZoom, center },
          x,
          y
        );

        if (onChangeRenderWindow) {
          onChangeRenderWindow({
            size,
            zoom: newZoom,
            center: c,
          });
        }
      }
    },
    [canvas.current, size, zoom, center, onChangeRenderWindow]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const x = e.clientX - canvas.current!.offsetLeft;
      const y = e.clientY - canvas.current!.offsetTop;
      console.log("set drag state", x, y);
      setDragState({
        startX: x,
        startY: y,
      });
    },
    [canvas.current]
  );
  const handleMouseUp = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      console.log("handleMouseUp");
      if (dragState) {
        const x = e.clientX - canvas.current!.offsetLeft;
        const y = e.clientY - canvas.current!.offsetTop;
        handleDragEnd(x, y);
      }
    },
    [dragState, canvas.current]
  );

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
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ cursor: "crosshair", top: 0, left: 0, position: "absolute" }}
        // onMouseDown={handleMouseDown}
        // onMouseUp={handleMouseUp}
      />
    </div>
  );
};
