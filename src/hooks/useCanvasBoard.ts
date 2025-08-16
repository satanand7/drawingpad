import { useRef, useEffect, useCallback } from "react";

export type Tool = "pen" | "eraser";

const dpr = window.devicePixelRatio || 1;


export function useCanvasBoard({
    tool,
    color,
    size,
    setTool

}: {
    tool: Tool;
    color: string;
    size: number;
    setTool: (tool: Tool) => void;
}) {
    const boardRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawingRef = useRef<boolean>(false);

    const historyRef = useRef<string[]>([]);
    const futureRef = useRef<string[]>([]);



    /**
     * Resizes the canvas element to match its parent container.
     *
     * @returns {void}
     */
    const resizeCanvas = (): void => {
        const canvas = boardRef.current;
        if (!canvas) return;

        const { clientWidth: w, clientHeight: h } = canvas.parentElement as HTMLElement;

        // CSS sizing
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        // Resolution
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale before applying again
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.imageSmoothingEnabled = true;

        ctxRef.current = ctx;
    };


    const saveSnapshot = useCallback(() => {
        const canvas = boardRef.current;
        if (!canvas) return;
        try {
            historyRef.current.push(canvas.toDataURL());
            if (historyRef.current.length > 100) historyRef.current.shift();
            futureRef.current = [];
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        resizeCanvas();
        saveSnapshot();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [saveSnapshot]);


    // apply stroke style
    const applyStrokeStyle = useCallback(
        (pressure = 1) => {
            const ctx = ctxRef.current;
            if (!ctx) return;

            const width = Math.max(0.5, size * (pressure || 1));
            ctx.lineWidth = width;

            if (tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(0,0,0,1)";
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = color;
            }
            ctx.lineCap = "round";   // smoother strokes
            ctx.lineJoin = "round";  // smoother connections
        },
        [tool, color, size]
    );

    const moveStroke = useCallback(
        (x: number, y: number, pressure = 1) => {
            if (!drawingRef.current) return;
            const ctx = ctxRef.current;
            if (!ctx) return;

            // ✅ dynamically adjust style for each segment
            applyStrokeStyle(pressure);

            ctx.lineTo(x, y);
            ctx.stroke();

            // start a new path from here → prevents width "averaging"
            ctx.beginPath();
            ctx.moveTo(x, y);
        },
        [applyStrokeStyle]
    );




    // start a stroke
    const startStroke = useCallback(
        (x: number, y: number, pressure = 1) => {
            drawingRef.current = true;
            const ctx = ctxRef.current;
            if (!ctx) return;

            ctx.beginPath();
            ctx.moveTo(x, y);

            // apply initial style
            applyStrokeStyle(pressure);
        },
        [applyStrokeStyle]
    );

    // end stroke
    const endStroke = useCallback(() => {
        if (!drawingRef.current) return;
        drawingRef.current = false;

        const ctx = ctxRef.current;
        if (ctx) {
            ctx.closePath();
        }

        saveSnapshot();
    }, [saveSnapshot]);


    useEffect(() => {
        const canvas = boardRef.current;
        if (!canvas) return;

        let rafId: number | null = null;


        const handleDown = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            startStroke(e.clientX - rect.left, e.clientY - rect.top, e.pressure);
        };

        const handleMove = (e: PointerEvent) => {
            if (!drawingRef.current) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const pressure = e.pressure;
            if(rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                moveStroke(x, y, pressure);
            })
        };

        canvas.addEventListener("pointerdown", handleDown);
        canvas.addEventListener("pointermove", handleMove);
        ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
            canvas.addEventListener(t, endStroke)
        );



        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            canvas.removeEventListener("pointerdown", handleDown);
            canvas.removeEventListener("pointermove", handleMove);
            ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
                canvas.removeEventListener(t, endStroke)
            );
        };
    }, [tool, size, color, endStroke, moveStroke, startStroke]);


    const restoreFromDataURL = (url: string) => {
        const canvas = boardRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
        };
        img.src = url;
    };


    const handleUndo = useCallback(() => {
        if (historyRef.current.length < 2) return;
        const current = historyRef.current.pop();
        if (current) futureRef.current.push(current);
        const prev = historyRef.current[historyRef.current.length - 1];
        if (prev) restoreFromDataURL(prev);
    }, []);

    const handleRedo = useCallback(() => {
        if (!futureRef.current.length) return;
        const next = futureRef.current.pop();
        if (!next) return;
        historyRef.current.push(next);
        restoreFromDataURL(next);
    }, []);

    const handleSave = useCallback(() => {
        const canvas = boardRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "drawing.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, []);

    const handleClear = useCallback(() => {
        const canvas = boardRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveSnapshot();
    }, [saveSnapshot]);

    const handleKey = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            handleUndo();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            handleRedo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            handleSave();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            handleClear();
        }

        if (e.key.toLowerCase() === "p") setTool("pen");
        if (e.key.toLowerCase() === "e") setTool("eraser");

    }, [handleUndo, handleRedo, handleSave, handleClear, setTool]);


    /** Keyboard shortcuts */
    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [tool, handleKey]);


    return {
        boardRef,
        handleUndo,
        handleRedo,
        handleSave,
        handleClear,
    }

}

