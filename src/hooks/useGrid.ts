import { useEffect, useRef, useCallback } from "react";

export function useGrid() {
  const gridRef = useRef<HTMLCanvasElement>(null!);

  const drawGrid = useCallback((gridCanvas?: HTMLCanvasElement) => {
    const canvas = gridCanvas ?? gridRef.current;
    if (!canvas) return;
    const gridCtx = canvas.getContext("2d");
    if (!gridCtx) return;

    const { width, height } = canvas.getBoundingClientRect();
    gridCtx.clearRect(0, 0, width, height);
    gridCtx.strokeStyle = "rgba(255,255,255,0.1)";
    gridCtx.lineWidth = 1;
    const lineSpacing = 30;
    for (let y = lineSpacing; y < height; y += lineSpacing) {
      gridCtx.beginPath();
      gridCtx.moveTo(0, y);
      gridCtx.lineTo(width, y);
      gridCtx.stroke();
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = gridRef.current;
    if (!canvas) return;
    const { clientWidth: w, clientHeight: h } = canvas.parentElement as HTMLElement;

    canvas.width = w;
    canvas.height = h;
    drawGrid();
  }, [drawGrid]);

  

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  return { gridRef } as const;
}