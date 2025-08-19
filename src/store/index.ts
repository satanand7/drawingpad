import { configureStore, type PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { DrawingState, Tool } from "../types";

const initialState: DrawingState = {
    tool: "pen",
    color: "#22d3ee",
    penSize: 8,
    eraserSize: 8,
    size: 8,
    showGrid: true,
    lineSpacing: 30
};


const drawingSlice = createSlice({
    name: "drawing",
    initialState,
    reducers: {
        setTool: (state, action: PayloadAction<Tool>) => {
            state.tool = action.payload;
        },
        setColor: (state, action: PayloadAction<string>) => {
            console.log(action.payload);
            state.color = action.payload;
        },
        setPenSize: (state, action: PayloadAction<number>) => {
            state.penSize = action.payload;
        },
        setSize: (state, action: PayloadAction<number>) => {
            if (state.tool === "eraser") {
                state.eraserSize = action.payload;
            }
            if (state.tool === "pen"){
                state.penSize = action.payload;
            }
        },
        toggleGrid: (state, action: PayloadAction<boolean>) => {
            state.showGrid = action.payload;
        },
        setLineSpacing: (state, action: PayloadAction<number>) => {
            console.log(action.payload);
            state.lineSpacing = action.payload;
        },
    },
});

const store = configureStore({
    reducer: {
        drawing: drawingSlice.reducer,
    },
});

export const actions = drawingSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;