import React from "react";

interface ToolbarProps {
  tool: "pen" | "eraser";
  setTool: (tool: "pen" | "eraser") => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  onUndo,
  onRedo,
  onClear,
  onSave,
}) => {
  return (
    <header className="flex gap-3 flex-wrap items-center p-3 border-b border-white/10 bg-[#111827]">
      {/* Tools */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
        <button
          onClick={() => setTool("pen")}
          aria-label="Pen tool"
          aria-pressed={tool === "pen"}
          className={tool === "pen" ? "outline outline-cyan-400" : ""}
        >
          ✏️
        </button>
        <button
          onClick={() => setTool("eraser")}
          aria-label="Eraser tool"
          aria-pressed={tool === "eraser"}
          className={tool === "eraser" ? "outline outline-cyan-400" : ""}
        >
          🧽
        </button>
      </div>

      {/* Color Picker */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full items-center">
        <label htmlFor="color">Color</label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      {/* Size Slider */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full items-center">
        <label htmlFor="size">Size</label>
        <input
          id="size"
          type="range"
          min={1}
          max={120}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <span>{size}px</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
        <button onClick={onUndo}>↩️ Undo</button>
        <button onClick={onRedo}>↪️ Redo</button>
        <button onClick={onClear}>🗑️ Clear</button>
        <button onClick={onSave}>💾 Download</button>
      </div>
    </header>
  );
};
