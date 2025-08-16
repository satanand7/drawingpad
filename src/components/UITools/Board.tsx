type BoardProps = {
  control: React.RefObject<HTMLCanvasElement>
}
export default function Board({ control }: BoardProps) {
  return (
    <canvas id="board" ref={control}></canvas>
  )
}
