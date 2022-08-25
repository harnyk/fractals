import Complex from "complex.js";
import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Colorizer,
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

function getMousePosition(event: MouseEvent<HTMLCanvasElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
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
        const { x, y } = getMousePosition(e);
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

  const handleDrag = (mouseX: number, mouseY: number) => {
    if (overlay.current && dragState) {
      const ctx = overlay.current.getContext("2d");
      if (ctx) {
        const centerX = dragState.startX;
        const centerY = dragState.startY;
        const Δx = Math.abs(mouseX - centerX);
        const Δy = Math.abs(mouseY - centerY);
        const radius = Math.sqrt(Δx * Δx + Δy * Δy);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        ctx.clearRect(0, 0, overlay.current.width, overlay.current.height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        //draw a radius line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        const crosshairSize = 10;
        const boldCrosshairSize = 12;

        //draw a white cross in thick line at the center
        ctx.beginPath();
        ctx.moveTo(centerX - boldCrosshairSize, centerY);
        ctx.lineTo(centerX + boldCrosshairSize, centerY);
        ctx.moveTo(centerX, centerY - boldCrosshairSize);
        ctx.lineTo(centerX, centerY + boldCrosshairSize);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        ctx.stroke();

        //draw a black cross at the center
        ctx.beginPath();
        ctx.moveTo(centerX - crosshairSize, centerY);
        ctx.lineTo(centerX + crosshairSize, centerY);
        ctx.moveTo(centerX, centerY - crosshairSize);
        ctx.lineTo(centerX, centerY + crosshairSize);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    }
  };

  const handleClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      console.log("click");
      if (canvas.current) {
        const { x, y } = getMousePosition(e);
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

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const { x, y } = getMousePosition(e);
        console.log("set drag state", x, y);
        setDragState({
          startX: x,
          startY: y,
        });
      }
    },
    [canvas.current]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      console.log("handleMouseUp");
      if (dragState) {
        const { x, y } = getMousePosition(e);
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};
