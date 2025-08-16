import { useRef, useEffect } from "react";

const dpr = window.devicePixelRatio || 1;

export function useCanvasContext() {
  const boardRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D>(null!);

  const resizeCanvas = () => {
    const canvas = boardRef.current;
    const ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;

    const oldImage = ctx.getImageData(0, 0, canvas.width, canvas.height);


    const { clientWidth: w, clientHeight: h } = canvas.parentElement as HTMLElement;
    // CSS sizing
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Resolution
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    const newCtx = canvas.getContext("2d");
    if (!newCtx) return;

    newCtx.setTransform(1, 0, 0, 1, 0, 0);
    newCtx.scale(dpr, dpr);
    newCtx.lineCap = "round";
    newCtx.lineJoin = "round";
    newCtx.imageSmoothingEnabled = true;

    ctxRef.current = newCtx;

    // Restore previous content
    newCtx.putImageData(oldImage, 0, 0);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return { boardRef, ctxRef, resizeCanvas };
}
