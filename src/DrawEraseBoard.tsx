import React, { useRef, useEffect, useState } from "react";

export default function DrawEraseBoard() {
  const gridRef = useRef<HTMLCanvasElement>(null!);
  const boardRef = useRef<HTMLCanvasElement>(null!);

  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState<string>("#22d3ee");
  const [size, setSize] = useState<number>(8);
  const [sizeLabel, setSizeLabel] = useState<string>("8px");

  const historyRef = useRef<string[]>([]);
  const futureRef = useRef<string[]>([]);
  const drawingRef = useRef<boolean>(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const dpr = window.devicePixelRatio || 1;
  
  /** Resize canvas and redraw grid */
  const resizeCanvas = () => {
    const canvas = boardRef.current;
    const gridCanvas = gridRef.current;
    if (!canvas || !gridCanvas) return;

    const { clientWidth: w, clientHeight: h } = canvas.parentElement as HTMLElement;
    
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gridCanvas.style.width = `${w}px`;
    gridCanvas.style.height = `${h}px`;
    // Resolution
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    // gridCanvas.width = Math.floor(w * dpr);
    // gridCanvas.height = Math.floor(h * dpr);

    // canvas.width = w;
    // canvas.height = h;
    gridCanvas.width = w;
    gridCanvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale before applying again
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;
    ctxRef.current = ctx;

    drawGrid(gridCanvas);
  };

  /** Draw horizontal grid lines */
  const drawGrid = (gridCanvas: HTMLCanvasElement) => {
    const gridCtx = gridCanvas.getContext("2d");
    if (!gridCtx) return;

    const { width, height } = gridCanvas.getBoundingClientRect();
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
  };

  /** Save snapshot for undo/redo */
  const saveSnapshot = () => {
    const canvas = boardRef.current;
    if (!canvas) return;
    try {
      historyRef.current.push(canvas.toDataURL());
      if (historyRef.current.length > 100) historyRef.current.shift();
      futureRef.current = [];
    } catch (e) {
      console.error(e);
    }
  };

  /** Restore canvas state */
  const restoreFromDataURL = (url: string) => {
    const canvas = boardRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
    };
    img.src = url;
  };

  /** Drawing functions */
  const startStroke = (x: number, y: number, pressure = 1) => {
    drawingRef.current = true;
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    applyStrokeStyle(pressure);
  };

  const moveStroke = (x: number, y: number, pressure = 1) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    applyStrokeStyle(pressure);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    ctxRef.current?.closePath();
    saveSnapshot();
  };

  const applyStrokeStyle = (pressure = 1) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const width = Math.max(0.5, size * (pressure || 1));
    ctx.lineWidth = width;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
  };

  /** Undo/Redo handlers */
  const handleUndo = () => {
    if (historyRef.current.length < 2) return;
    const current = historyRef.current.pop();
    if (current) futureRef.current.push(current);
    const prev = historyRef.current[historyRef.current.length - 1];
    if (prev) restoreFromDataURL(prev);
  };

  const handleRedo = () => {
    if (!futureRef.current.length) return;
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(next);
    restoreFromDataURL(next);
  };

  /** Clear and Save */
  const handleClear = () => {
    const canvas = boardRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  };

  const handleSave = () => {
    const canvas = boardRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  /** Pointer events */
  useEffect(() => {
    const canvas = boardRef.current;
    if (!canvas) return;

    const handleDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      startStroke(e.clientX - rect.left, e.clientY - rect.top, e.pressure);
    };

    const handleMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      moveStroke(e.clientX - rect.left, e.clientY - rect.top, e.pressure);
    };

    canvas.addEventListener("pointerdown", handleDown);
    canvas.addEventListener("pointermove", handleMove);
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
      canvas.addEventListener(t, endStroke)
    );

    return () => {
      canvas.removeEventListener("pointerdown", handleDown);
      canvas.removeEventListener("pointermove", handleMove);
    };
  }, [tool, size, color]);

  /** Init + resize */
  useEffect(() => {
    resizeCanvas();
    saveSnapshot();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  /** Keyboard shortcuts */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleClear();
      }
      if (e.key.toLowerCase() === "p") setTool("pen");
      if (e.key.toLowerCase() === "e") setTool("eraser");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tool]);

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-gray-200">
      {/* Toolbar */}
      <header className="flex gap-3 flex-wrap items-center p-3 border-b border-white/10 bg-[#111827]">
        <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
          <button
            onClick={() => setTool("pen")}
            aria-pressed={tool === "pen"}
            className={tool === "pen" ? "outline outline-cyan-400" : ""}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool("eraser")}
            aria-pressed={tool === "eraser"}
            className={tool === "eraser" ? "outline outline-cyan-400" : ""}
          >
            🧽 Eraser
          </button>
        </div>
        <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full items-center">
          <label htmlFor="color">Color</label>
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full items-center">
          <label htmlFor="size">Size</label>
          <input
            id="size"
            type="range"
            min={1}
            max={80}
            value={size}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSize(val);
              setSizeLabel(val + "px");
            }}
          />
          <span>{sizeLabel}</span>
        </div>
        <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
          <button onClick={handleUndo}>↩️ Undo</button>
          <button onClick={handleRedo}>↪️ Redo</button>
          <button onClick={handleClear}>🗑️ Clear</button>
          <button onClick={handleSave}>💾 Download</button>
        </div>
      </header>

      {/* Canvas */}
      <main className="relative flex-1 overflow-hidden">
        <canvas ref={gridRef} className="absolute inset-0" />
        <canvas ref={boardRef} className="absolute inset-0" />
        <div className="absolute bottom-2 right-2 text-xs opacity-70">
          Tip: use a stylus for pressure-sensitive strokes.
        </div>
      </main>
    </div>
  );
}
