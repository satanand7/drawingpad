
import React from "react";

type BgGridProps = {
  control: React.RefObject<HTMLCanvasElement>;
};

export default function BgGrid({ control }: BgGridProps) {
  return (
    <canvas id="grid" ref={control}></canvas>
  );
}
