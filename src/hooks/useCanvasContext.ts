import { useRef, useEffect } from "react";

const dpr = window.devicePixelRatio || 1;

export function useCanvasContext() {
  const boardRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D>(null!);

  const resizeCanvas = () => {
    const canvas = boardRef.current;
    if (!canvas) return;

    const { clientWidth: w, clientHeight: h } = canvas.parentElement as HTMLElement;

    // CSS sizing
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Resolution
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;

    ctxRef.current = ctx;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return { boardRef, ctxRef, resizeCanvas };
}
