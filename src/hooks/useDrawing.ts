import { useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export function useDrawing({
  boardRef,
  ctxRef,
  saveSnapshot,
}: {
  boardRef: React.RefObject<HTMLCanvasElement>;
  ctxRef: React.RefObject<CanvasRenderingContext2D>;
  saveSnapshot: () => void;
}) {

  const tool = useSelector((state: RootState) => state.drawing.tool);
  const color = useSelector((state: RootState) => state.drawing.color);
  const penSize = useSelector((state: RootState) => state.drawing.penSize);
  const eraserSize = useSelector((state: RootState) => state.drawing.eraserSize);
  const size = tool === "pen" ? penSize : eraserSize;

  const drawingRef = useRef(false);

  const applyStrokeStyle = useCallback(
    (pressure = 1) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.lineWidth = Math.max(0.5, size * (pressure || 1));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
      }
    },
    [tool, color, size, ctxRef]
  );

  const startStroke = useCallback(
    (x: number, y: number, pressure = 1) => {
      drawingRef.current = true;
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
      applyStrokeStyle(pressure);
    },
    [applyStrokeStyle, ctxRef]
  );

  const moveStroke = useCallback(
    (x: number, y: number, pressure = 1) => {
      if (!drawingRef.current) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      applyStrokeStyle(pressure);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [applyStrokeStyle, ctxRef]
  );

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    ctxRef.current?.closePath();
    saveSnapshot();
  }, [saveSnapshot, ctxRef]);

  useEffect(() => {
    const canvas = boardRef.current;
    if (!canvas) return;

    let rafId: number | null = null;

    const handleDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      startStroke(e.clientX - rect.left, e.clientY - rect.top, e.pressure);
    };

    const handleMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        moveStroke(x, y, pressure);
      });
    };

    canvas.addEventListener("pointerdown", handleDown);
    canvas.addEventListener("pointermove", handleMove);
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
      canvas.addEventListener(t, endStroke)
    );

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", handleDown);
      canvas.removeEventListener("pointermove", handleMove);
      ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
        canvas.removeEventListener(t, endStroke)
      );
    };
  }, [boardRef, startStroke, moveStroke, endStroke]);
}
