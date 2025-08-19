import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, type AppDispatch, type RootState } from "../../store";
import { useDebounce } from "../../hooks/useDebounce";

interface ToolbarProps {
  showGrid: boolean;
  lineSpacing: number;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onSaveServer: () => void;
  toggleGrid: () => void;
  onChangeGridSize: (size: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  onSaveServer,
}) => {

  const tool = useSelector((state: RootState) => state.drawing.tool);
  const color = useSelector((state: RootState) => state.drawing.color);
  const size = useSelector((state: RootState) => state.drawing.size);
  const showGrid = useSelector((state: RootState) => state.drawing.showGrid);
  const lineSpacing = useSelector((state:RootState)=> state.drawing.lineSpacing)


  const dispatch: AppDispatch = useDispatch();

  const debounce = useDebounce(500);


  return (
    <header className="flex gap-3 flex-wrap items-center p-3 border-b border-white/10 bg-[#111827]">
      {/* Tools */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
        <button
          onClick={() => dispatch(actions.setTool("pen"))}
          aria-label="Pen tool"
          aria-pressed={tool === "pen"}
          className={tool === "pen" ? "outline outline-cyan-400" : ""}
        >
          ✏️
        </button>
        <button
          onClick={() => dispatch(actions.setTool("eraser"))}
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
          onChange={(e) => {
            const value = e.target.value;   // capture value synchronously
            debounce(() => dispatch(actions.setColor(value)));
          }}
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
          onChange={(e) => dispatch(actions.setSize(Number(e.target.value)))}
        />
        <span>{size}px</span>
      </div>

      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full items-center">
        <input type="checkbox" id="grid" checked={showGrid} onChange={() => dispatch(actions.toggleGrid(!showGrid))} />
        <label htmlFor="grid">
          Grid
        </label>
        {showGrid && <span className="flex items-center gap-2"><input type="range" min={30} max={120} value={lineSpacing} onChange={(e) => dispatch(actions.setLineSpacing(Number(e.target.value)))} /> {lineSpacing}px</span>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 bg-[#1f2937] px-3 py-2 rounded-full">
        <button onClick={onUndo}>↩️ Undo</button>
        <button onClick={onRedo}>↪️ Redo</button>
        <button onClick={onClear}>🗑️ Clear</button>
        <button onClick={onSave}>💾 Download</button>
        <button onClick={onSaveServer}>💾 Upload</button>
      </div>
    </header>
  );
};
