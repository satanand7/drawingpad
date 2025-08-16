import { useRef, useCallback, useEffect } from "react";
import {  getSnapshotsFromDB, saveSnapshotToDB } from "../db";

export function useHistory(ctxRef: React.RefObject<CanvasRenderingContext2D>, boardRef: React.RefObject<HTMLCanvasElement>) {
  const historyRef = useRef<ImageData[]>([]);
  const futureRef = useRef<ImageData[]>([]);

  const saveSnapshot = useCallback(async () => {
    const canvas = boardRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snapshot);
    futureRef.current = []; // clear redo stack
    saveSnapshotToDB(snapshot);

  }, [boardRef, ctxRef]);

  const restoreFromImageData = useCallback((img: ImageData) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.putImageData(img, 0, 0);
  }, [ctxRef]);

  const undo = useCallback(() => {
    if (historyRef.current.length < 2) return;
    const current = historyRef.current.pop();
    if (current) futureRef.current.push(current);

    const prev = historyRef.current[historyRef.current.length - 1];
    if (prev) restoreFromImageData(prev);
  }, [restoreFromImageData]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop();
    if (next) {
      historyRef.current.push(next);
      restoreFromImageData(next);
    }
  }, [restoreFromImageData]);

  useEffect(() => {
    (async () => {
      const savedSnapshots = await getSnapshotsFromDB();
      if (savedSnapshots.length) {
        // restore the last snapshot
        const last = savedSnapshots[savedSnapshots.length - 1].snapshot;
        if (last && ctxRef.current) ctxRef.current.putImageData(last, 0, 0);
        historyRef.current = savedSnapshots.map(s => s.snapshot);
      }
    })();
  }, [ctxRef]);

  return { saveSnapshot, undo, redo };
}
