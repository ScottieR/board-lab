import { BOARD_H, BOARD_W } from "../../board/space";
import { textBothSides } from "../seats";
import type { VerbInstance, VerbUse } from "../types";
import type { World } from "../world";
import { list, num, rand, seeded, str } from "./util";

// Core verbs: scenery, populating the table, movement, instructions.

/** scene — painted ground for the table (garden, park, lab bench). */
export function scene(world: World, u: VerbUse): VerbInstance {
  const kind = str(u, "kind", "garden");
  let seed = 1;
  const p = world.style.palette;
  return {
    onRound() {
      seed = Math.floor(Math.random() * 1e9);
    },
    draw(g, layer) {
      if (layer !== "ground") return;
      const r = seeded(seed);
      if (kind === "garden") {
        for (let i = 0; i < 24; i++) {
          const x = 60 + r() * (BOARD_W - 120);
          const y = 60 + r() * (BOARD_H - 120);
          const s = 60 + r() * 80;
          g.fillStyle = p.ground2;
          g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,255,255,0.06)";
          g.beginPath(); g.arc(x - s * 0.25, y - s * 0.25, s * 0.55, 0, Math.PI * 2); g.fill();
        }
      } else if (kind === "park") {
        // soft mown stripes
        g.fillStyle = p.ground2;
        for (let x = 0; x < BOARD_W; x += 120) g.fillRect(x, 0, 60, BOARD_H);
        // winding path
        g.strokeStyle = "#ead9b0";
        g.lineWidth = 90;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(-40, BOARD_H * (0.3 + r() * 0.4));
        g.bezierCurveTo(BOARD_W * 0.3, -100 + r() * 300, BOARD_W * 0.6, BOARD_H + 100 - r() * 300, BOARD_W + 40, BOARD_H * (0.3 + r() * 0.4));
        g.stroke();
        // pond
        const px = BOARD_W * (0.2 + r() * 0.6);
        const py = BOARD_H * (0.25 + r() * 0.5);
        g.fillStyle = "#8fd3e8";
        g.beginPath(); g.ellipse(px, py, 190, 120, r() * 2, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(255,255,255,0.5)";
        g.lineWidth = 3;
        for (let i = 1; i < 3; i++) {
          g.beginPath();
          g.ellipse(px, py, 60 * i + ((world.time * 20) % 40), 36 * i + ((world.time * 12) % 24), 0, 0, Math.PI * 2);
          g.stroke();
        }
        // trees and flower beds
        for (let i = 0; i < 26; i++) {
          const x = r() * BOARD_W;
          const y = r() * BOARD_H;
          if (r() < 0.55) {
            const s = 40 + r() * 45;
            g.fillStyle = "rgba(40,60,20,0.18)";
            g.beginPath(); g.arc(x + 12, y + 14, s, 0, Math.PI * 2); g.fill();
            g.fillStyle = r() < 0.5 ? "#7fb069" : "#5e9e5a";
            g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
            g.fillStyle = "rgba(255,255,255,0.12)";
            g.beginPath(); g.arc(x - s * 0.3, y - s * 0.3, s * 0.45, 0, Math.PI * 2); g.fill();
          } else {
            const colors = ["#ef6f6c", "#f6c445", "#ffffff", "#a36bd6"];
            for (let k = 0; k < 9; k++) {
              g.fillStyle = colors[Math.floor(r() * colors.length)];
              g.beginPath(); g.arc(x + (r() - 0.5) * 70, y + (r() - 0.5) * 40, 5, 0, Math.PI * 2); g.fill();
            }
          }
        }
      } else if (kind === "lab") {
        // wooden bench with a subtle grid and warm vignette
        const grad = g.createRadialGradient(BOARD_W / 2, BOARD_H / 2, 100, BOARD_W / 2, BOARD_H / 2, BOARD_W * 0.7);
        grad.addColorStop(0, p.ground2);
        grad.addColorStop(1, p.ground);
        g.fillStyle = grad;
        g.fillRect(0, 0, BOARD_W, BOARD_H);
        g.strokeStyle = "rgba(255,255,255,0.04)";
        g.lineWidth = 2;
        for (let x = 0; x < BOARD_W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, BOARD_H); g.stroke(); }
        for (let y = 0; y < BOARD_H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(BOARD_W, y); g.stroke(); }
      }
    },
  };
}

/** scatter — put things on the table each round, spaced apart, more each round. */
export function scatter(world: World, u: VerbUse): VerbInstance {
  const kinds = list<string>(u, "kinds", [str(u, "kind", "thing")]);
  const base = num(u, "count", 6);
  const perRound = num(u, "perRound", 0);
  const max = num(u, "max", 40);
  const fromRound = num(u, "fromRound", 1);
  const spacing = num(u, "spacing", 150);
  const margin = num(u, "margin", 150);
  return {
    onRound() {
      if (world.round < fromRound) return;
      const count = Math.min(max, base + perRound * (world.round - fromRound));
      let guard = 0;
      let placed = 0;
      while (placed < count && guard++ < 3000) {
        const x = rand(margin, BOARD_W - margin);
        const y = rand(margin, BOARD_H - margin);
        if (world.things.some((t) => Math.hypot(t.x - x, t.y - y) < spacing)) continue;
        world.spawn(kinds[Math.floor(Math.random() * kinds.length)], x, y);
        placed++;
      }
    },
  };
}

/** wander — things amble around the table, turning gently, staying on it. */
export function wander(world: World, u: VerbUse): VerbInstance {
  const tag = str(u, "tag", "critter");
  const speed = num(u, "speed", 30);
  const margin = num(u, "margin", 90);
  return {
    update(dt) {
      for (const t of world.withTag(tag)) {
        if (t.data.found || t.data.frozen) continue;
        let a = (t.data.heading as number) ?? Math.random() * Math.PI * 2;
        a += (Math.random() - 0.5) * 2.4 * dt;
        if (t.x < margin || t.x > BOARD_W - margin || t.y < margin || t.y > BOARD_H - margin) {
          a = Math.atan2(BOARD_H / 2 - t.y, BOARD_W / 2 - t.x);
        }
        t.data.heading = a;
        t.x += Math.cos(a) * speed * dt;
        t.y += Math.sin(a) * speed * dt;
      }
    },
  };
}

/** prompt — friendly instruction shown while the table is empty. */
export function prompt(world: World, u: VerbUse): VerbInstance {
  const text = str(u, "text", "Put a piece on the table!");
  return {
    draw(g, layer) {
      if (layer !== "hud") return;
      if (world.input.contacts.length > 0 || world.betweenRounds) return;
      const pulse = 0.75 + Math.sin(world.time * 3) * 0.25;
      g.globalAlpha = pulse;
      textBothSides(g, text, BOARD_H / 2 - 50, `bold 44px ${world.style.font}`, world.style.palette.glow);
      g.globalAlpha = 1;
    },
  };
}
