import { MouseEvent, RefObject, useCallback, useState } from "react";
import { RenderFractalWindow, screenCoordinatesToComplex } from "./fractals";

export enum MouseTool {
  ZoomIn = "zoom-in",
  ZoomOut = "zoom-out",
  ZoomWindow = "zoom-window",
}

interface DragState {
  startX: number;
  startY: number;
}

export function getMousePosition(event: MouseEvent<HTMLCanvasElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export const useZoomOnClick = (
  win: RenderFractalWindow,
  canvas: RefObject<HTMLCanvasElement>,
  zoomFactor: number,
  onChangeRenderWindow?: (newWin: RenderFractalWindow) => void
) => {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const { x, y } = getMousePosition(e);
        const newZoom = win.zoom / zoomFactor;
        const c = screenCoordinatesToComplex(
          { size: win.size, zoom: newZoom, center: win.center },
          x,
          y
        );

        if (onChangeRenderWindow) {
          onChangeRenderWindow({
            size: win.size,
            zoom: newZoom,
            center: c,
          });
        }
      }
    },
    [canvas.current, win, onChangeRenderWindow]
  );

  return { eventHandlers: { onClick: handleClick } };
};

export const useZoomWindow = (
  win: RenderFractalWindow,
  canvas: RefObject<HTMLCanvasElement>,
  onChangeRenderWindow?: (newWin: RenderFractalWindow) => void
) => {
  const [dragState, setDragState] = useState<DragState | null>(null);

  const handleDrag = (mouseX: number, mouseY: number) => {
    if (canvas.current && dragState) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        const centerX = dragState.startX;
        const centerY = dragState.startY;
        const Δx = Math.abs(mouseX - centerX);
        const Δy = Math.abs(mouseY - centerY);
        const radius = Math.sqrt(Δx * Δx + Δy * Δy);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

        //draw thick white circle
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        
        
        //draw black circle
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
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

  const handleDragEnd = (x: number, y: number) => {
    if (dragState) {
      //Center is the start of the drag
      const newCenter = screenCoordinatesToComplex(
        win,
        dragState.startX,
        dragState.startY
      );
      //Zoom is the diameter of the circle
      const Δx = Math.abs(x - dragState.startX);
      const Δy = Math.abs(y - dragState.startY);
      const radius = Math.sqrt(Δx * Δx + Δy * Δy);
      const newZoom = (win.zoom * radius * 2) / win.size;

      setDragState(null);
      if (onChangeRenderWindow) {
        onChangeRenderWindow({
          size: win.size,
          zoom: newZoom,
          center: newCenter,
        });
      }
      //clear overlay
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (canvas.current) {
        const { x, y } = getMousePosition(e);
        const c = screenCoordinatesToComplex(win, x, y);

        if (dragState) {
          handleDrag(x, y);
        }
      }
    },
    [canvas, win]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      console.log("handleMouseUp");
      if (dragState) {
        const { x, y } = getMousePosition(e);
        e.stopPropagation();
        handleDragEnd(x, y);
      }
    },
    [dragState, canvas.current]
  );

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

  return {
    eventHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
  };
};
