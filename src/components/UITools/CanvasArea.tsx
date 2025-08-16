import React, { type RefObject } from "react";

interface CanvasAreaProps {
  gridRef: RefObject<HTMLCanvasElement>;
  boardRef: RefObject<HTMLCanvasElement>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({ gridRef, boardRef }) => {
  return (
    <main className="relative flex-1 overflow-hidden">
      <canvas ref={gridRef} className="absolute inset-0" />
      <canvas ref={boardRef} className="absolute inset-0" />
      <div className="absolute bottom-2 right-2 text-xs opacity-70">
        Tip: use a stylus for pressure-sensitive strokes.
      </div>
    </main>
  );
};
