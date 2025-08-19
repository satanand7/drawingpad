import { useGrid } from "./hooks/useGrid";
import { useCanvasBoard } from "./hooks/useCanvasBoard";
import { Toolbar } from "./components/UITools/ToolBar";
import { CanvasArea } from "./components/UITools/CanvasArea";
import CursorOverlay from "./components/UITools/CursorOverlay";


export default function DrawEraseBoard() {
  const { gridRef } = useGrid();
  const { boardRef, handleClear, handleUndo, handleRedo, handleSave, handleSaveServer } =
    useCanvasBoard();

  return (
    <div className="h-screen flex flex-col bg-[#0f172a00] text-gray-200">
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onSaveServer={handleSaveServer}
      />
      <CanvasArea gridRef={gridRef} boardRef={boardRef} />
      <CursorOverlay boardRef={boardRef} />
    </div>
  );
}
