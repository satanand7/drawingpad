type ToolBarProps = {
  sizeControl: React.RefObject<HTMLInputElement>,
  colorControl: React.RefObject<HTMLInputElement>,
  sizeValControl: React.RefObject<HTMLSpanElement>,
  penControl: React.RefObject<HTMLButtonElement>,
  eraserControl: React.RefObject<HTMLButtonElement>,
  undoControl: React.RefObject<HTMLButtonElement>,
  redoControl: React.RefObject<HTMLButtonElement>,
  clearControl: React.RefObject<HTMLButtonElement>,
  saveControl: React.RefObject<HTMLButtonElement>,
}


export default function ToolBar({
  sizeControl, colorControl, 
  sizeValControl,
  penControl, eraserControl,
  undoControl, redoControl,
  clearControl, saveControl

}: ToolBarProps) {
  return (
    <header>
    <div className="group" role="group" aria-label="Tool">
      <button ref={penControl} id="penBtn" aria-pressed="true" title="Pen (P)">✏️ Pen</button>
      <button ref={eraserControl} id="eraserBtn" aria-pressed="false" title="Eraser (E)">🧽 Eraser</button>
    </div>
    <div className="group" role="group" aria-label="Color">
      <label htmlFor="color">Color</label>
      <input ref={colorControl} id="color" type="color" />
    </div>
    <div className="group" role="group" aria-label="Brush size">
      <label htmlFor="size">Size</label>
      <input ref={sizeControl} id="size" type="range" min="1" max="80" step="1" />
      <span ref={sizeValControl} id="sizeVal">8px</span>
    </div>
    <div className="group" role="group" aria-label="Actions">
      <button ref={undoControl} id="undoBtn" title="Undo (Ctrl/Cmd+Z)">↩️ Undo</button>
      <button ref={redoControl} id="redoBtn" title="Redo (Ctrl/Cmd+Shift+Z)">↪️ Redo</button>
      <button ref={clearControl} id="clearBtn" title="Clear (Ctrl/Cmd+K)">🗑️ Clear</button>
      <button ref={saveControl} id="saveBtn" title="Download PNG (Ctrl/Cmd+S)">💾 Download</button>
    </div>
  </header>
  )
}
