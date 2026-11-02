import type { InputFrame } from "../board/input";

/** Every prototype in the lab implements this. Coordinates are board px (1920x1080). */
export interface Game {
  id: string;
  name: string;
  update(input: InputFrame, dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
