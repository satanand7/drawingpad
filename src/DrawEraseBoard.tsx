import { useState } from "react";
import { useGrid } from "./hooks/useGrid";
import { useCanvasBoard } from "./hooks/useCanvasBoard";
import { Toolbar } from "./components/UITools/ToolBar";
import { CanvasArea } from "./components/UITools/CanvasArea";

export default function DrawEraseBoard() {
  const [color, setColor] = useState<string>("#22d3ee");
  const [size, setSize] = useState<number>(8);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  const { gridRef } = useGrid(30);

  const { boardRef, handleClear, handleUndo, handleRedo, handleSave } =
    useCanvasBoard({
      tool,
      color,
      size,
    });

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-gray-200">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
      />
      <CanvasArea gridRef={gridRef} boardRef={boardRef} />
    </div>
  );
}
