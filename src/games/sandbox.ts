import type { BoardContact } from "@board.fun/web-sdk";
import type { InputFrame } from "../board/input";
import type { Game } from "./types";

/** Contact debugger: shows every finger and Piece with its glyph id, angle and hand state. */
export function createSandbox(): Game {
  let frame: InputFrame | null = null;
  const log: string[] = [];
  const note = (s: string): void => {
    log.unshift(s);
    log.length = Math.min(log.length, 12);
  };
  const id = (c: BoardContact): string => `glyph ${c.glyphId} (#${c.contactId})`;

  return {
    id: "sandbox",
    name: "Sandbox",
    update(f) {
      frame = f;
      f.placed.forEach((c) => note(`placed  ${id(c)}`));
      f.lifted.forEach((c) => note(`lifted  ${id(c)}`));
      f.grabbed.forEach((c) => note(`grabbed ${id(c)}`));
      f.released.forEach((c) => note(`released ${id(c)}`));
      f.taps.forEach((c) => note(`tap at ${Math.round(c.x)},${Math.round(c.y)}`));
    },
    draw(ctx) {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 1920, 1080);
      for (const c of frame?.contacts ?? []) {
        const piece = c.glyphId > 0;
        ctx.beginPath();
        ctx.arc(c.x, c.y, piece ? 84 : 20, 0, Math.PI * 2);
        ctx.fillStyle = piece ? "rgba(255,107,157,0.85)" : "rgba(0,210,255,0.85)";
        ctx.fill();
        if (piece) {
          const r = (c.orientation * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + Math.cos(r) * 84, c.y + Math.sin(r) * 84);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.font = "18px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText(`${Math.round(c.orientation)}° ${c.isTouched ? "held" : ""}`, c.x, c.y - 100);
        }
      }
      ctx.fillStyle = "#99a6bf";
      ctx.font = "20px ui-monospace, monospace";
      ctx.textAlign = "left";
      log.forEach((l, i) => ctx.fillText(l, 40, 60 + i * 28));
    },
  };
}
