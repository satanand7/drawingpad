export type Tool = "pen" | "eraser";


export interface DrawingState {
  tool: "pen" | "eraser";
  color: string;
  size: number;
  showGrid: boolean;
  lineSpacing: number;
}