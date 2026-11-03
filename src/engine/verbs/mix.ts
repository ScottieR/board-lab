import type { BoardContact } from "@board.fun/web-sdk";
import { BOARD_H, BOARD_W } from "../../board/space";
import { drawBeaker, drawEmoji } from "../art/draw";
import { forSeat, textBothSides } from "../seats";
import type { Seat, VerbInstance, VerbUse } from "../types";
import type { World } from "../world";
import { angleDelta, list, num, str } from "./util";

export interface Element {
  name: string;
  emoji: string;
  color: string;
}

interface BeakerState {
  content: string;
  lastAngle: number;
  stir: number;
  fill: number;
}

/**
 * mix — pieces are beakers holding an element. Bring two together and a tube
 * connects them; twist one to pour it into the other. Known pairs react into
 * something new (Little Alchemy style); every first-time result is a
 * discovery for the Lab Book. Tap a beaker to empty it back to its base.
 */
export function mix(world: World, u: VerbUse): VerbInstance {
  const role = str(u, "role", "beaker");
  const reach = num(u, "reach", 260);
  const stirNeeded = num(u, "stir", 80);
  const radius = num(u, "radius", 92);
  const elements = (u.elements ?? {}) as Record<string, Element>;
  const combos = list<[string, string, string]>(u, "combos", []);
  const base = (u.base ?? {}) as Record<string, string>;
  const baseCycle = list<string>(u, "baseCycle", Object.values(base));
  const goals = list<string>(u, "goals", []);
  const hintAfter = num(u, "hintAfter", 35);

  const state = new Map<number, BeakerState>();
  const discovered = new Set<string>();
  const results = [...new Set(combos.map((c) => c[2]))];
  let goalIndex = 0;
  let goalSince = 0;

  const baseOf = (glyph: number): string =>
    base[String(glyph)] ?? baseCycle[(glyph - 1) % Math.max(1, baseCycle.length)] ?? "water";
  const el = (id: string): Element => elements[id] ?? { name: id, emoji: "❓", color: "#888888" };
  const react = (a: string, b: string): string | undefined =>
    combos.find((c) => (c[0] === a && c[1] === b) || (c[0] === b && c[1] === a))?.[2];
  const recipeFor = (result: string): [string, string] | undefined => {
    const c = combos.find((x) => x[2] === result);
    return c ? [c[0], c[1]] : undefined;
  };

  const get = (c: BoardContact): BeakerState => {
    let s = state.get(c.glyphId);
    if (!s) {
      s = { content: baseOf(c.glyphId), lastAngle: c.orientation, stir: 0, fill: 1 };
      state.set(c.glyphId, s);
    }
    return s;
  };

  /** The closest other beaker within reach — that's who you're pouring into. */
  const partnerOf = (c: BoardContact, bs: BoardContact[]): BoardContact | undefined => {
    let best: BoardContact | undefined;
    let bestD = reach;
    for (const o of bs) {
      if (o.glyphId === c.glyphId) continue;
      const d = Math.hypot(o.x - c.x, o.y - c.y);
      if (d < bestD) { bestD = d; best = o; }
    }
    return best;
  };
  /** Tubes to draw: every beaker links to its nearest neighbour (deduped). */
  const pairs = (): [BoardContact, BoardContact][] => {
    const bs = world.piecesWith(role);
    const seen = new Set<string>();
    const out: [BoardContact, BoardContact][] = [];
    for (const c of bs) {
      const o = partnerOf(c, bs);
      if (!o) continue;
      const key = [c.glyphId, o.glyphId].sort((x, y) => x - y).join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([c, o]);
    }
    return out;
  };

  const pour = (from: BoardContact, to: BoardContact): void => {
    const sf = get(from);
    const st = get(to);
    const result = react(sf.content, st.content);
    if (!result) {
      world.fx.burst(to.x, to.y, "#9aa0a6", 14, 200);
      world.fx.mote(to.x, to.y, "#fff", "💨");
      world.sfx.play("fizz");
      world.fx.float(to.x, to.y - 120, "fizzle…", "#c9c4e0", 34);
      return;
    }
    const isNew = !discovered.has(result);
    st.content = result;
    st.fill = 0.2;
    sf.content = baseOf(from.glyphId);
    sf.fill = 0.2;
    const e = el(result);
    world.fx.burst(to.x, to.y, e.color, isNew ? 40 : 22, isNew ? 480 : 320);
    world.fx.ring(to.x, to.y, e.color, 200);
    world.fx.kick(isNew ? 14 : 6);
    if (isNew) {
      discovered.add(result);
      world.fx.confetti(to.x, to.y, [e.emoji, "✨"], 12);
      world.fx.float(to.x, to.y - 150, `NEW! ${e.name}`, world.style.palette.glow, 50);
      world.sfx.play("tada");
      world.award(null, 1, to.x, to.y);
    } else {
      world.fx.float(to.x, to.y - 140, e.name, "#fff", 36);
      world.sfx.play("chime");
    }
    if (goals[goalIndex] === result) {
      world.celebrate(`You made ${e.emoji} ${e.name}!`, "Professor Hoot is delighted 🦉", 3);
      goalIndex++;
      goalSince = world.time;
    }
    if (discovered.size === results.length) world.celebrate("Lab Book complete! 🧪", "You discovered everything!", 5);
  };

  return {
    onRound() {
      state.clear();
      goalSince = world.time;
    },
    update(dt) {
      // finger tap on a beaker: empty it back to its starting element
      for (const tap of world.input.taps) {
        for (const c of world.piecesWith(role)) {
          if (Math.hypot(tap.x - c.x, tap.y - c.y) < radius) {
            const s = get(c);
            s.content = baseOf(c.glyphId);
            s.fill = 0.2;
            world.sfx.play("pop");
            world.fx.burst(c.x, c.y, el(s.content).color, 10, 200);
          }
        }
      }
      for (const c of world.piecesWith(role)) {
        const s = get(c);
        s.fill = Math.min(1, s.fill + dt * 1.5);
        if (Math.random() < dt * 3) world.fx.mote(c.x + (Math.random() - 0.5) * radius, c.y, el(s.content).color);
      }
      // Twisting a beaker pours it into its nearest neighbour.
      const bs = world.piecesWith(role);
      for (const c of bs) {
        const s = get(c);
        const d = Math.abs(angleDelta(s.lastAngle, c.orientation));
        s.lastAngle = c.orientation;
        const partner = partnerOf(c, bs);
        if (!partner) { s.stir = Math.max(0, s.stir - dt * 60); continue; }
        if (d > 0.5 && d < 60) {
          s.stir += d;
          if (Math.random() < 0.3) world.sfx.play("tick", 1 + s.stir / stirNeeded);
        } else s.stir = Math.max(0, s.stir - dt * 15);
        if (s.stir >= stirNeeded) {
          s.stir = 0;
          pour(c, partner);
        }
      }
    },
    draw(g, layer) {
      if (layer === "things") {
        // tubes between paired beakers, with liquid flowing toward the stirred one's partner
        for (const [a, b] of pairs()) {
          const sa = get(a);
          const sb = get(b);
          const grad = g.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, el(sa.content).color);
          grad.addColorStop(1, el(sb.content).color);
          g.save();
          g.lineCap = "round";
          g.strokeStyle = "rgba(255,255,255,0.35)";
          g.lineWidth = 34;
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          g.strokeStyle = grad;
          g.lineWidth = 20;
          g.setLineDash([24, 18]);
          g.lineDashOffset = -world.time * 80;
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          g.restore();
          // stir progress arcs
          for (const c of [a, b]) {
            const s = get(c);
            if (s.stir <= 0) continue;
            g.beginPath();
            g.arc(c.x, c.y, radius + 18, -Math.PI / 2, -Math.PI / 2 + (s.stir / stirNeeded) * Math.PI * 2);
            g.strokeStyle = world.style.palette.glow;
            g.lineWidth = 10;
            g.lineCap = "round";
            g.stroke();
          }
        }
        for (const c of world.piecesWith(role)) {
          const s = get(c);
          const e = el(s.content);
          g.save();
          g.translate(c.x, c.y);
          drawBeaker(g, radius, e.color, s.fill, world.time + c.glyphId);
          g.rotate(((c.orientation + 90) * Math.PI) / 180);
          drawEmoji(g, e.emoji, 64 + (1 - s.fill) * 30);
          g.restore();
        }
      }
      if (layer === "hud") {
        // Lab Book: a row of discovery slots on both long edges
        const n = results.length;
        const slot = Math.min(56, 1500 / Math.max(1, n));
        for (const seat of [0, 2] as Seat[]) {
          forSeat(g, seat, 40, () => {
            const x0 = -((n - 1) * slot) / 2;
            results.forEach((r, i) => {
              const x = x0 + i * slot;
              const have = discovered.has(r);
              g.beginPath();
              g.arc(x, 0, slot * 0.42, 0, Math.PI * 2);
              g.fillStyle = have ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.05)";
              g.fill();
              if (have) {
                g.save(); g.translate(x, 0); drawEmoji(g, el(r).emoji, slot * 0.6); g.restore();
              } else {
                g.font = `bold ${Math.round(slot * 0.4)}px ${world.style.font}`;
                g.fillStyle = "rgba(255,255,255,0.3)";
                g.textAlign = "center";
                g.textBaseline = "middle";
                g.fillText("?", x, 2);
              }
            });
            g.font = `bold 22px ${world.style.font}`;
            g.fillStyle = world.style.palette.ink;
            g.textAlign = "center";
            g.fillText(`LAB BOOK  ${discovered.size} / ${n}`, 0, -44);
          });
        }
        // Professor's request, with a hint once kids have been stuck a while
        const goal = goals[goalIndex];
        if (goal) {
          const e = el(goal);
          const stuck = world.time - goalSince > hintAfter;
          const rec = recipeFor(goal);
          const hint = stuck && rec ? `   (try ${el(rec[0]).emoji} + ${el(rec[1]).emoji})` : "";
          textBothSides(g, `🦉 Can you make ${e.emoji} ${e.name}?${hint}`, 118, `bold 30px ${world.style.font}`, world.style.palette.glow);
        }
      }
    },
  };
}

/** Exposed for the Studio: which pairs are possible from a set of elements. */
export function reachable(combos: [string, string, string][], start: string[]): Set<string> {
  const have = new Set(start);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [a, b, r] of combos) if (have.has(a) && have.has(b) && !have.has(r)) { have.add(r); grew = true; }
  }
  return have;
}

export const LAB_CENTER = { x: BOARD_W / 2, y: BOARD_H / 2 };
