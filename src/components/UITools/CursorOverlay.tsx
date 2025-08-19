// CursorOverlay.tsx
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function CursorOverlay({ boardRef }: { boardRef: React.RefObject<HTMLCanvasElement> }) {
  const tool = useSelector((state: RootState) => state.drawing.tool);
  const color = useSelector((state: RootState) => state.drawing.color);
  const size = useSelector((state: RootState) => state.drawing.size);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = boardRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    // hide native cursor
    canvas.style.cursor = "none";

    const handleMove = (e: PointerEvent) => {
    //   const rect = canvas.getBoundingClientRect();
      const x = e.clientX
      const y = e.clientY

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;

      // Update cursor style based on tool
      if (tool === "pen") {
        cursor.style.width = `${2}px`;
        cursor.style.height = `${2}px`;
        cursor.style.border = `2px solid ${color}`;
        cursor.style.background = color;
        cursor.style.opacity = "0.6";
      } else if (tool === "eraser") {
        cursor.style.width = `${size}px`;
        cursor.style.height = `${size}px`;
        cursor.style.border = "2px solid #000";
        cursor.style.background = "#fff";
        cursor.style.opacity = "0.8";
      }
    };

    canvas.addEventListener("pointermove", handleMove);
    return () => {
      canvas.style.cursor = "default";
      canvas.removeEventListener("pointermove", handleMove);
    };
  }, [boardRef, tool, color, size]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "absolute",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        zIndex: 1,
      }}
    />
  );
}
