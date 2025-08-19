import { useState } from "react";
import { useGrid } from "./hooks/useGrid";
import { useCanvasBoard } from "./hooks/useCanvasBoard";
import { Toolbar } from "./components/UITools/ToolBar";
import { CanvasArea } from "./components/UITools/CanvasArea";

export default function DrawEraseBoard() {
  const [color, setColor] = useState<string>("#22d3ee");
  const [size, setSize] = useState<number>(8);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [lineSpacing, setLineSpacing] = useState<number>(30);

  const { gridRef } = useGrid(lineSpacing, showGrid);

  const { boardRef, handleClear, handleUndo, handleRedo, handleSave, handleSaveServer } =
    useCanvasBoard({
      tool,
      color,
      size,
    });

  return (
    <div className="h-screen flex flex-col bg-[#0f172a00] text-gray-200">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        showGrid={showGrid}
        toggleGrid={() => setShowGrid(!showGrid)}
        onChangeGridSize={setLineSpacing}
        lineSpacing={lineSpacing}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onSaveServer={handleSaveServer}
      />
      <CanvasArea gridRef={gridRef} boardRef={boardRef} />
    </div>
  );
}
