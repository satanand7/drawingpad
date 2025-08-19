import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export function useGrid() {

  const lineSpacing = useSelector((state:RootState)=> state.drawing.lineSpacing)
  const showGrid = useSelector((state:RootState)=> state.drawing.showGrid)


  const gridRef = useRef<HTMLCanvasElement>(null!);

  const drawGrid = useCallback(() => {
    const canvas = gridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;

    for (let y = lineSpacing; y < height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [lineSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = gridRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (showGrid) {
      drawGrid();
    }
  }, [showGrid, drawGrid]);

  useEffect(() => {
    resizeCanvas();
    let frame: number;
    const handler = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(resizeCanvas);
    };
    window.addEventListener("resize", handler);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handler);
    };
  }, [resizeCanvas]);

  return { gridRef } as const;
}
