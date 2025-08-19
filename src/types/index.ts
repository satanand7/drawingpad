export type Tool = "pen" | "eraser";


export interface DrawingState {
  tool: "pen" | "eraser";
  color: string;
  size: number;
  penSize: number;
  eraserSize: number;
  showGrid: boolean;
  lineSpacing: number;
}