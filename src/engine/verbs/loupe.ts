import { BOARD_H, BOARD_W } from "../../board/space";
import { describePerson, drawPerson, randomPerson, type PersonTraits } from "../art/draw";
import { forSeat } from "../seats";
import type { Seat, VerbInstance, VerbUse } from "../types";
import type { Thing, World } from "../world";
import { deg, num, rand, str } from "./util";

const SEAT_COLORS = ["#ef6f6c", "#5b8def", "#f6c445", "#5cc58a"];

/**
 * loupe — a piece is a magnifying glass. The table shows only tiny colour
 * dabs; inside the lens the scene is crisp and every character turns to face
 * whoever is holding it (the lens "up" follows the piece's nose).
 */
export function loupe(world: World, u: VerbUse): VerbInstance {
  const role = str(u, "role", "loupe");
  const radius = num(u, "radius", 160);
  const zoom = num(u, "zoom", 2.6);
  world.flags.lowDetail = true;
  return {
    update() {
      for (const c of world.piecesWith(role)) {
        world.focus.push({
          x: c.x, y: c.y, r: radius, dir: deg(c.orientation),
          seat: world.seatOf(c.x, c.y), glyph: c.glyphId, zoom,
        });
      }
    },
    draw(g, layer) {
      if (layer !== "over") return;
      for (const f of world.focus) {
        // handle, pointing back toward the holder
        const back = f.dir + Math.PI;
        g.save();
        g.translate(f.x, f.y);
        g.rotate(back);
        g.fillStyle = "#6b4a2b";
        g.beginPath();
        g.roundRect(f.r * 0.95, -18, 120, 36, 18);
        g.fill();
        g.restore();
        // magnified view
        g.save();
        g.beginPath();
        g.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        g.clip();
        g.translate(f.x, f.y);
        g.scale(f.zoom, f.zoom);
        g.translate(-f.x, -f.y);
        world.drawScene(g, true, f.dir + Math.PI / 2);
        g.restore();
        // glass sheen + rim (warms up when something wanted is in view)
        g.save();
        const sheen = g.createLinearGradient(f.x - f.r, f.y - f.r, f.x + f.r, f.y + f.r);
        sheen.addColorStop(0, "rgba(255,255,255,0.28)");
        sheen.addColorStop(0.4, "rgba(255,255,255,0)");
        g.fillStyle = sheen;
        g.beginPath(); g.arc(f.x, f.y, f.r, 0, Math.PI * 2); g.fill();
        g.lineWidth = 16;
        g.strokeStyle = f.hot ? world.style.palette.glow : "#3d2c1c";
        if (f.hot) {
          g.shadowColor = world.style.palette.glow;
          g.shadowBlur = 24 + Math.sin(world.time * 10) * 10;
        }
        g.beginPath(); g.arc(f.x, f.y, f.r, 0, Math.PI * 2); g.stroke();
        g.restore();
      }
    },
  };
}

interface Wanted {
  thing: Thing;
  foundBy: Seat | null;
  hold: number;
}

const keyOf = (p: PersonTraits): string =>
  [p.hat, p.hatColor, p.shirt, p.stripes, p.prop, p.glasses, p.hair].join("|");

/**
 * hunt — Where's-Waldo / Mamoko search. Each round hides a crowd with a few
 * "wanted" characters (plus look-alike decoys). Centre one in your lens and
 * hold still to claim it. Bigger crowds each round.
 */
export function hunt(world: World, u: VerbUse): VerbInstance {
  const crowd = num(u, "crowd", 55);
  const perRound = num(u, "perRound", 12);
  const wantedCount = num(u, "wanted", 3);
  const decoys = num(u, "decoys", 2);
  const hold = num(u, "hold", 0.45);
  const size = num(u, "size", 30);
  let wanted: Wanted[] = [];
  // Keep the crowd out from under the wanted-cards on each long edge.
  const cardZone = (x: number, y: number): boolean =>
    (y > BOARD_H - 230 && x < 800) || (y < 230 && x > BOARD_W - 800);

  const place = (traits: PersonTraits): Thing => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < 200; i++) {
      x = rand(70, BOARD_W - 70);
      y = rand(110, BOARD_H - 70);
      if (!cardZone(x, y) && !world.things.some((t) => Math.hypot(t.x - x, t.y - y) < 34)) break;
    }
    const t = world.spawn("person", x, y, { traits });
    t.look = { draw: "person", size };
    return t;
  };

  const variant = (p: PersonTraits): PersonTraits => {
    const v = { ...p };
    const which = Math.floor(Math.random() * 3);
    const other = randomPerson();
    if (which === 0) { v.hat = other.hat; v.hatColor = other.hatColor; }
    else if (which === 1) { v.shirt = other.shirt; v.stripes = !p.stripes; }
    else v.prop = other.prop === p.prop ? "none" : other.prop;
    return v;
  };

  return {
    onRound() {
      wanted = [];
      const total = crowd + perRound * (world.round - 1);
      const targets: PersonTraits[] = [];
      while (targets.length < wantedCount) {
        const p = randomPerson();
        // wanted characters are distinctive: always a hat or a prop
        if (p.hat === "none" && p.prop === "none") p.hat = "beanie";
        if (!targets.some((q) => keyOf(q) === keyOf(p))) targets.push(p);
      }
      const keys = new Set(targets.map(keyOf));
      for (const p of targets) {
        const t = place(p);
        t.data.wanted = true;
        wanted.push({ thing: t, foundBy: null, hold: 0 });
      }
      for (const p of targets) for (let i = 0; i < decoys; i++) {
        const v = variant(p);
        if (!keys.has(keyOf(v))) place(v);
      }
      while (world.withTag("person").length < total) {
        const p = randomPerson();
        if (!keys.has(keyOf(p))) place(p);
      }
    },
    update(dt) {
      if (world.betweenRounds) return;
      // People stand on their feet and, inside a lens, lean toward that
      // holder's "up" (the lens direction) — so aim for the middle of the body.
      const bodyDist = (w: Wanted, f: (typeof world.focus)[number]): number =>
        Math.hypot(w.thing.x + Math.cos(f.dir) * size * 0.5 - f.x, w.thing.y + Math.sin(f.dir) * size * 0.5 - f.y);
      for (const f of world.focus) {
        f.hot = wanted.some((w) => w.foundBy === null && bodyDist(w, f) < f.r / f.zoom);
      }
      for (const w of wanted) {
        if (w.foundBy !== null) continue;
        // the lens with this character closest to its centre is the one claiming it
        let claimer: (typeof world.focus)[number] | undefined;
        let best = Infinity;
        for (const f of world.focus) {
          const d = bodyDist(w, f);
          if (d < (f.r / f.zoom) * 0.5 && d < best) { best = d; claimer = f; }
        }
        if (!claimer) { w.hold = Math.max(0, w.hold - dt); continue; }
        w.hold += dt;
        if (w.hold >= hold) {
          const f = claimer;
          w.foundBy = f.seat;
          w.thing.data.found = true;
          world.fx.burst(f.x, f.y, SEAT_COLORS[f.seat], 26);
          world.fx.ring(f.x, f.y, world.style.palette.glow, f.r * 1.2);
          world.sfx.play("chime", 1.1);
          world.award(f.seat, 1, f.x, f.y - f.r * 0.6);
        }
      }
      if (wanted.length && wanted.every((w) => w.foundBy !== null)) {
        if (world.recipe.mode === "versus") {
          const best = Math.max(...world.scores);
          const leaders = world.scores.map((s, i) => (s === best ? i : -1)).filter((i) => i >= 0);
          world.celebrate("All found! 🔍", leaders.length === 1 ? `${["Bottom", "Right", "Top", "Left"][leaders[0]]} side leads with ${best}!` : "It's a tie!");
        } else world.celebrate("All found! 🔍", "A bigger crowd is coming…");
        world.nextRoundIn(4);
      }
    },
    draw(g, layer) {
      if (layer !== "hud") return;
      // Wanted cards on both long edges, upright for that side.
      for (const seat of [0, 2] as Seat[]) {
        forSeat(g, seat, 110, () => {
          const startX = -740;
          wanted.forEach((w, i) => {
            const x = startX + i * 160;
            g.save();
            g.translate(x, 0);
            g.fillStyle = "rgba(255,252,240,0.96)";
            g.shadowColor = "rgba(0,0,0,0.25)";
            g.shadowBlur = 14;
            g.beginPath(); g.roundRect(-70, -90, 140, 180, 18); g.fill();
            g.shadowBlur = 0;
            g.translate(0, 62);
            drawPerson(g, w.thing.data.traits as PersonTraits, 120, world.time * 2 + i);
            g.restore();
            if (w.foundBy !== null) {
              g.save();
              g.translate(x, 0);
              g.fillStyle = SEAT_COLORS[w.foundBy] + "cc";
              g.beginPath(); g.roundRect(-70, -90, 140, 180, 18); g.fill();
              g.font = "bold 80px system-ui";
              g.textAlign = "center";
              g.textBaseline = "middle";
              g.fillStyle = "#fff";
              g.fillText("✓", 0, 0);
              g.restore();
            }
          });
          g.font = `bold 22px ${world.style.font}`;
          g.fillStyle = world.style.palette.ink;
          g.textAlign = "left";
          g.fillText("FIND:", startX - 70, -102);
        });
      }
      if (world.recipe.mode === "versus") {
        for (const seat of [0, 1, 2, 3] as Seat[]) {
          if (!world.scores[seat] && !world.focus.some((f) => f.seat === seat)) continue;
          forSeat(g, seat, 50, () => {
            g.translate(seat % 2 === 0 ? 760 : 0, 0);
            g.fillStyle = SEAT_COLORS[seat];
            g.beginPath(); g.roundRect(-60, -30, 120, 60, 30); g.fill();
            g.font = `bold 34px ${world.style.font}`;
            g.fillStyle = "#fff";
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.fillText(`⭐ ${world.scores[seat]}`, 0, 2);
          });
        }
      }
    },
  };
}

/** Kid-readable description of a wanted character (for the Studio/voice). */
export function wantedWords(t: Thing): string {
  return describePerson(t.data.traits as PersonTraits).join(", ");
}
