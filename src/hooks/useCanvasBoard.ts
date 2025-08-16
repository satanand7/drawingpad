import { useCanvasContext } from "./useCanvasContext";
import { useHistory } from "./useHistory";
import { useDrawing } from "./useDrawing";
import type { Tool } from "../types";
import { useCallback } from "react";
import { clearSnapshotsDB } from "../db";

export function useCanvasBoard({
    tool,
    color,
    size,
}: {
    tool: Tool;
    color: string;
    size: number;
}) {
    const { boardRef, ctxRef } = useCanvasContext();
    const { saveSnapshot, undo, redo } = useHistory(ctxRef, boardRef);

    useDrawing({ boardRef, ctxRef, tool, color, size, saveSnapshot });



    const handleSaveServer = useCallback(async () => {
        const canvas = boardRef.current;
        if (!canvas) return;
        const base64 = canvas.toDataURL("image/png");
        await fetch("/api/drawing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drawing: base64 }),
        });
    }, [boardRef]);

    const handleSave = () => {
        const canvas = boardRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "drawing.png";
        a.click();
    };

    const handleClear = () => {
        const canvas = boardRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
         clearSnapshotsDB()   
        // saveSnapshot();
    };


   

    return { boardRef, handleUndo: undo, handleRedo: redo, handleSave, handleClear, handleSaveServer };
}
