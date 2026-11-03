import { BOARD_H, BOARD_W } from "../board/space";
import type { Seat } from "./types";

// Players sit on all four sides. Text and personal HUD face the seat it's for.

/** Which side of the table a point is nearest to. */
export function seatOf(x: number, y: number): Seat {
  const d = [BOARD_H - y, BOARD_W - x, y, x];
  let best = 0;
  for (let i = 1; i < 4; i++) if (d[i] < d[best]) best = i;
  return best as Seat;
}

/** Rotation (radians) that makes content upright for a seat. */
export function seatAngle(seat: Seat): number {
  return [0, -Math.PI / 2, Math.PI, Math.PI / 2][seat];
}

/** Point `inset` px in from the middle of a seat's edge. */
export function seatAnchor(seat: Seat, inset: number): { x: number; y: number } {
  switch (seat) {
    case 0: return { x: BOARD_W / 2, y: BOARD_H - inset };
    case 1: return { x: BOARD_W - inset, y: BOARD_H / 2 };
    case 2: return { x: BOARD_W / 2, y: inset };
    case 3: return { x: inset, y: BOARD_H / 2 };
  }
}

/** Run `fn` with the canvas rotated to face `seat`, origin at its anchor. */
export function forSeat(
  g: CanvasRenderingContext2D,
  seat: Seat,
  inset: number,
  fn: () => void,
): void {
  const a = seatAnchor(seat, inset);
  g.save();
  g.translate(a.x, a.y);
  g.rotate(seatAngle(seat));
  fn();
  g.restore();
}

/** Draw the same text facing both long sides (where most kids sit). */
export function textBothSides(
  g: CanvasRenderingContext2D,
  text: string,
  inset: number,
  font: string,
  color: string,
): void {
  for (const seat of [0, 2] as Seat[]) {
    forSeat(g, seat, inset, () => {
      g.font = font;
      g.fillStyle = color;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, 0, 0);
    });
  }
}
