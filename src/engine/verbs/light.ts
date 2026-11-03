import { BOARD_H, BOARD_W } from "../../board/space";
import { textBothSides } from "../seats";
import type { VerbInstance, VerbUse } from "../types";
import type { World } from "../world";
import { bool, deg, list, num, str } from "./util";

// Light verbs: pieces as lanterns/torches, darkness, finding things in the light.

const COLORS = ["#ffd166", "#7bdff2", "#f7a8d8", "#b8f2a6", "#ffb07c", "#c8b6ff", "#ff8fab", "#9be7ff"];

/** beam — a piece casts a cone of light where it points. Turn it to sweep. */
export function beam(world: World, u: VerbUse): VerbInstance {
  const role = str(u, "role", "lantern");
  const range = num(u, "range", 560);
  const half = deg(num(u, "angle", 60) / 2);
  return {
    update() {
      for (const c of world.piecesWith(role)) {
        world.lights.push({
          x: c.x, y: c.y, r: range, dir: deg(c.orientation), half,
          color: COLORS[(c.glyphId - 1) % COLORS.length], glyph: c.glyphId,
        });
      }
    },
    draw(g, layer) {
      if (layer !== "over") return;
      for (const l of world.lights) {
        if (l.dir === undefined) continue;
        g.save();
        g.globalCompositeOperation = "lighter";
        g.globalAlpha = 0.12;
        g.fillStyle = l.color;
        g.beginPath();
        g.moveTo(l.x, l.y);
        g.arc(l.x, l.y, l.r, l.dir - (l.half ?? 0), l.dir + (l.half ?? 0));
        g.closePath();
        g.fill();
        g.restore();
        g.beginPath();
        g.arc(l.x, l.y, 92, 0, Math.PI * 2);
        g.strokeStyle = l.color;
        g.lineWidth = 6;
        g.stroke();
      }
    },
  };
}

/** glow — fingers (or a piece role) make a small round light. */
export function glow(world: World, u: VerbUse): VerbInstance {
  const role = str(u, "role", "finger");
  const radius = num(u, "radius", 110);
  return {
    update() {
      for (const c of world.piecesWith(role)) {
        world.lights.push({ x: c.x, y: c.y, r: radius, color: "#fff", glyph: c.glyphId });
      }
    },
  };
}

/** darkness — the table is night; only lights cut through. */
export function darkness(world: World, u: VerbUse): VerbInstance {
  const alpha = num(u, "alpha", 0.97);
  const stars = bool(u, "stars", true);
  const canvas = document.createElement("canvas");
  canvas.width = BOARD_W;
  canvas.height = BOARD_H;
  const d = canvas.getContext("2d")!;
  const sky = Array.from({ length: 90 }, () => ({
    x: Math.random() * BOARD_W, y: Math.random() * BOARD_H, r: Math.random() * 1.8 + 0.4,
  }));
  return {
    draw(g, layer) {
      if (layer !== "over") return;
      d.globalCompositeOperation = "source-over";
      d.clearRect(0, 0, BOARD_W, BOARD_H);
      d.fillStyle = `rgba(6, 8, 24, ${alpha})`;
      d.fillRect(0, 0, BOARD_W, BOARD_H);
      if (stars) {
        d.fillStyle = "#fff";
        for (const s of sky) {
          d.globalAlpha = 0.4 + 0.4 * Math.sin(world.time * 2 + s.x);
          d.beginPath(); d.arc(s.x, s.y, s.r, 0, Math.PI * 2); d.fill();
        }
        d.globalAlpha = 1;
      }
      d.globalCompositeOperation = "destination-out";
      for (const l of world.lights) {
        const grad = d.createRadialGradient(l.x, l.y, 10, l.x, l.y, l.r);
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(l.dir === undefined ? 0.2 : 0.75, "rgba(0,0,0,0.88)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        d.fillStyle = grad;
        d.beginPath();
        if (l.dir !== undefined) {
          d.moveTo(l.x, l.y);
          d.arc(l.x, l.y, l.r, l.dir - (l.half ?? 0), l.dir + (l.half ?? 0));
          d.closePath();
          d.fill();
          d.beginPath();
          d.arc(l.x, l.y, 110, 0, Math.PI * 2);
        } else {
          d.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        }
        d.fill();
      }
      g.drawImage(canvas, 0, 0);
      // found things glow through the dark so everyone sees progress
      for (const t of world.things) {
        if (!t.data.found) continue;
        g.save();
        g.shadowColor = world.style.palette.glow;
        g.shadowBlur = 30;
        g.font = `${Math.round((t.look.size ?? 72) * 1.15)}px serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(t.look.emoji ?? "✨", t.x, t.y);
        g.restore();
      }
    },
  };
}

/**
 * find — shine light on hidden things long enough and they're found.
 * Shy things need several lights at once (teamwork). Finding them all wins
 * the round; each new round adds more.
 */
export function find(world: World, u: VerbUse): VerbInstance {
  const tag = str(u, "tag", "hidden");
  const time = num(u, "time", 0.7);
  const shyTag = str(u, "shyTag", "shy");
  const shyNeeds = num(u, "shyNeeds", 2);
  const points = num(u, "points", 1);
  const label = str(u, "label", "found");
  const winText = str(u, "winText", "Everyone found! 🎉");
  const confetti = list<string>(u, "confetti", ["🎉", "⭐", "✨"]);
  return {
    update(dt) {
      if (world.betweenRounds) return;
      const all = world.withTag(tag);
      for (const t of all) {
        if (t.data.found) continue;
        const needs = t.tags.has(shyTag) ? shyNeeds : 1;
        const n = world.lightAt(t.x, t.y);
        const lit = ((t.data.lit as number) ?? 0);
        const next = n >= needs ? lit + dt : Math.max(0, lit - dt * 0.5);
        if (n > 0 && lit === 0) world.sfx.play("tick", 1.5);
        t.data.lit = next;
        // tremble while being found so kids know they're close
        t.data.scale = 1 + Math.min(1, next / time) * 0.15 * Math.sin(world.time * 40);
        if (next >= time) {
          t.data.found = true;
          t.data.scale = 1.15;
          world.fx.burst(t.x, t.y, world.style.palette.glow, 22);
          world.fx.ring(t.x, t.y, world.style.palette.glow);
          world.sfx.play("chime", 1 + Math.random() * 0.25);
          world.award(null, points, t.x, t.y);
        }
      }
      if (all.length > 0 && all.every((t) => t.data.found)) {
        world.celebrate(winText, `Round ${world.round + 1} coming up…`);
        world.fx.confetti(BOARD_W / 2, BOARD_H / 2, confetti, 20);
        world.nextRoundIn(3.5);
      }
    },
    draw(g, layer) {
      if (layer !== "hud") return;
      const all = world.withTag(tag);
      const found = all.filter((t) => t.data.found).length;
      textBothSides(g, `${found} / ${all.length} ${label}`, 42, `bold 34px ${world.style.font}`, world.style.palette.ink);
      if (all.some((t) => t.tags.has(shyTag) && !t.data.found)) {
        textBothSides(g, `${all.find((t) => t.tags.has(shyTag))?.look.emoji ?? ""} Shy ones need ${shyNeeds} lights at once!`, 86, `24px ${world.style.font}`, world.style.palette.glow);
      }
    },
  };
}
