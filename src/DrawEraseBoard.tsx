import { useState } from "react";
import { useGrid } from "./hooks/useGrid";
import { useCanvasBoard } from "./hooks/useCanvasBoard";

export default function DrawEraseBoard() {

    const [color, setColor] = useState<string>("#22d3ee");
    const [size, setSize] = useState<number>(8);
    const [sizeLabel, setSizeLabel] = useState<string>("8px");
    const [tool, setTool] = useState<"pen" | "eraser">("pen");

    const { gridRef } = useGrid();

    const { boardRef, handleClear, handleUndo, handleRedo, handleSave } = useCanvasBoard({
        tool,
        setTool,
        color,
        size,
    });


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
