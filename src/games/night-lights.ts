import type { BoardContact } from "@board.fun/web-sdk";
import type { InputFrame } from "../board/input";
import { BOARD_H, BOARD_W } from "../board/space";
import type { Game } from "./types";

// NIGHT LIGHTS — co-op flashlight hide-and-seek.
//
// The garden is dark. Every Piece on the table is a lantern: its *rotation*
// aims a beam of light. Shine a beam on a hidden critter long enough and it's
// found. Shy critters (🦉) only come out when two beams cross on them, so
// siblings have to coordinate. Fingers make a small glow so the littlest
// player can join without a Piece.
//
// Why it's a Board game and not a tablet game: the physical act of turning a
// Piece to sweep a beam, and two kids reaching in from opposite sides of the
// table to cross their lights.

const BEAM_RANGE = 560;
const BEAM_HALF_ANGLE = (30 * Math.PI) / 180;
const FINGER_GLOW = 110;
const FIND_TIME = 0.7; // seconds of light to find a critter

const CRITTERS = ["🐸", "🦔", "🐇", "🦊", "🐌", "🐞", "🦝", "🐿️", "🐢", "🦋"];
const SHY = "🦉";

const LANTERN_COLORS = ["#ffd166", "#7bdff2", "#f7a8d8", "#b8f2a6", "#ffb07c", "#c8b6ff"];
const lanternColor = (glyphId: number): string =>
  LANTERN_COLORS[(glyphId - 1) % LANTERN_COLORS.length];

interface Critter {
  x: number;
  y: number;
  emoji: string;
  shy: boolean; // needs two lights at once
  lit: number; // accumulated seconds
  found: boolean;
  foundAt: number;
  wiggle: number;
}

interface Bush {
  x: number;
  y: number;
  r: number;
  hue: number;
}

export function createNightLights(): Game {
  let round = 0;
  let time = 0;
  let critters: Critter[] = [];
  let bushes: Bush[] = [];
  let celebrateUntil = 0;
  let lights: BoardContact[] = [];
  let fingers: BoardContact[] = [];

  const dark = document.createElement("canvas");
  dark.width = BOARD_W;
  dark.height = BOARD_H;
  const dctx = dark.getContext("2d")!;

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * BOARD_W,
    y: Math.random() * BOARD_H,
    r: Math.random() * 1.8 + 0.4,
  }));

  const newRound = (): void => {
    round++;
    const count = Math.min(5 + round, 12);
    const shyCount = round >= 2 ? Math.min(round - 1, 3) : 0;
    bushes = Array.from({ length: 22 }, () => ({
      x: 80 + Math.random() * (BOARD_W - 160),
      y: 80 + Math.random() * (BOARD_H - 160),
      r: 60 + Math.random() * 70,
      hue: 110 + Math.random() * 40,
    }));
    critters = [];
    // keep critters away from the edges and each other
    while (critters.length < count) {
      const x = 160 + Math.random() * (BOARD_W - 320);
      const y = 140 + Math.random() * (BOARD_H - 280);
      if (critters.some((c) => Math.hypot(c.x - x, c.y - y) < 190)) continue;
      const shy = critters.length < shyCount;
      critters.push({
        x, y,
        emoji: shy ? SHY : CRITTERS[Math.floor(Math.random() * CRITTERS.length)],
        shy, lit: 0, found: false, foundAt: 0,
        wiggle: Math.random() * Math.PI * 2,
      });
    }
  };
  newRound();

  /** How many light sources are on this point right now. */
  const lightCount = (x: number, y: number): number => {
    let n = 0;
    for (const p of lights) {
      const dx = x - p.x;
      const dy = y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist > BEAM_RANGE) continue;
      if (dist < 70) { n++; continue; } // right under the lantern
      const facing = (p.orientation * Math.PI) / 180;
      let diff = Math.atan2(dy, dx) - facing;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (Math.abs(diff) <= BEAM_HALF_ANGLE) n++;
    }
    for (const f of fingers) if (Math.hypot(x - f.x, y - f.y) < FINGER_GLOW) n++;
    return n;
  };

  const drawBeams = (g: CanvasRenderingContext2D): void => {
    for (const p of lights) {
      const facing = (p.orientation * Math.PI) / 180;
      const grad = g.createRadialGradient(p.x, p.y, 20, p.x, p.y, BEAM_RANGE);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.75, "rgba(0,0,0,0.85)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.arc(p.x, p.y, BEAM_RANGE, facing - BEAM_HALF_ANGLE, facing + BEAM_HALF_ANGLE);
      g.closePath();
      g.fill();
      g.beginPath();
      g.arc(p.x, p.y, 110, 0, Math.PI * 2);
      g.fill();
    }
    for (const f of fingers) {
      const grad = g.createRadialGradient(f.x, f.y, 10, f.x, f.y, FINGER_GLOW);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(f.x, f.y, FINGER_GLOW, 0, Math.PI * 2);
      g.fill();
    }
  };

  return {
    id: "night-lights",
    name: "Night Lights",
    update(input: InputFrame, dt: number) {
      time += dt;
      lights = input.pieces;
      fingers = input.fingers;
      if (celebrateUntil) {
        if (time > celebrateUntil) {
          celebrateUntil = 0;
          newRound();
        }
        return;
      }
      for (const c of critters) {
        if (c.found) continue;
        const n = lightCount(c.x, c.y);
        const enough = c.shy ? n >= 2 : n >= 1;
        c.lit = enough ? c.lit + dt : Math.max(0, c.lit - dt * 0.5);
        if (c.lit >= FIND_TIME) {
          c.found = true;
          c.foundAt = time;
        }
      }
      if (critters.every((c) => c.found)) celebrateUntil = time + 3.5;
    },
    draw(g) {
      // --- the garden (fully lit) ---
      const sky = g.createLinearGradient(0, 0, 0, BOARD_H);
      sky.addColorStop(0, "#2d4a3e");
      sky.addColorStop(1, "#1f3a2c");
      g.fillStyle = sky;
      g.fillRect(0, 0, BOARD_W, BOARD_H);
      for (const b of bushes) {
        g.fillStyle = `hsl(${b.hue} 35% 26%)`;
        g.beginPath();
        g.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = `hsl(${b.hue} 40% 32%)`;
        g.beginPath();
        g.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.55, 0, Math.PI * 2);
        g.fill();
      }
      g.textAlign = "center";
      g.textBaseline = "middle";
      for (const c of critters) {
        const bob = Math.sin(time * 3 + c.wiggle) * 4;
        const pop = c.found ? Math.min(1, (time - c.foundAt) * 4) : 0;
        g.font = `${Math.round(76 + pop * 18 - (c.found ? 0 : 0))}px serif`;
        // shake while being lit, so kids know they're close
        const shake = !c.found && c.lit > 0 ? Math.sin(time * 40) * 4 * (c.lit / FIND_TIME) : 0;
        g.fillText(c.emoji, c.x + shake, c.y + bob);
      }

      // --- darkness with beams cut out ---
      dctx.globalCompositeOperation = "source-over";
      dctx.clearRect(0, 0, BOARD_W, BOARD_H);
      dctx.fillStyle = "rgba(6, 8, 24, 0.97)";
      dctx.fillRect(0, 0, BOARD_W, BOARD_H);
      dctx.fillStyle = "#fff";
      for (const s of stars) {
        dctx.globalAlpha = 0.4 + 0.4 * Math.sin(time * 2 + s.x);
        dctx.beginPath();
        dctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        dctx.fill();
      }
      dctx.globalAlpha = 1;
      dctx.globalCompositeOperation = "destination-out";
      drawBeams(dctx);
      g.drawImage(dark, 0, 0);

      // found critters glow through the dark so the table sees progress
      for (const c of critters) {
        if (!c.found) continue;
        g.save();
        g.globalAlpha = 0.9;
        g.shadowColor = "#ffe9a8";
        g.shadowBlur = 30;
        g.font = "84px serif";
        g.fillText(c.emoji, c.x, c.y);
        g.restore();
      }

      // tinted beam edges per lantern
      for (const p of lights) {
        const facing = (p.orientation * Math.PI) / 180;
        g.save();
        g.globalCompositeOperation = "lighter";
        g.globalAlpha = 0.12;
        g.fillStyle = lanternColor(p.glyphId);
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.arc(p.x, p.y, BEAM_RANGE, facing - BEAM_HALF_ANGLE, facing + BEAM_HALF_ANGLE);
        g.closePath();
        g.fill();
        g.restore();
        g.beginPath();
        g.arc(p.x, p.y, 92, 0, Math.PI * 2);
        g.strokeStyle = lanternColor(p.glyphId);
        g.lineWidth = 6;
        g.stroke();
      }

      // --- HUD: progress readable from all four sides ---
      const found = critters.filter((c) => c.found).length;
      const label = `${found} / ${critters.length} found`;
      g.font = "bold 34px system-ui, sans-serif";
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.fillText(label, BOARD_W / 2, 40);
      g.save();
      g.translate(BOARD_W / 2, BOARD_H - 40);
      g.rotate(Math.PI);
      g.fillText(label, 0, 0);
      g.restore();

      if (critters.some((c) => c.shy && !c.found)) {
        g.font = "24px system-ui, sans-serif";
        g.fillStyle = "rgba(255,233,168,0.8)";
        g.fillText("🦉 Owls are shy — cross two lights to find them!", BOARD_W / 2, 82);
      }
      if (lights.length === 0 && fingers.length === 0 && !celebrateUntil) {
        g.font = "bold 44px system-ui, sans-serif";
        g.fillStyle = "rgba(255,233,168,0.9)";
        g.fillText("Put a lantern on the table and turn it to look around", BOARD_W / 2, BOARD_H / 2);
      }
      if (celebrateUntil) {
        g.font = "bold 96px system-ui, sans-serif";
        g.fillStyle = "#ffe9a8";
        g.fillText(`Everyone found! 🎉`, BOARD_W / 2, BOARD_H / 2 - 40);
        g.font = "40px system-ui, sans-serif";
        g.fillText(`Round ${round + 1} coming up…`, BOARD_W / 2, BOARD_H / 2 + 50);
      }
    },
  };
}
