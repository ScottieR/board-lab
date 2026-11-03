import type { InputFrame } from "../board/input";
import { BOARD_H, BOARD_W } from "../board/space";
import type { Game } from "../games/types";
import { drawEmoji, drawPerson, type PersonTraits } from "./art/draw";
import { ease } from "./fx";
import { forSeat } from "./seats";
import type { GameRecipe, Layer, VerbInstance } from "./types";
import { VERBS } from "./verbs";
import { World, type Thing } from "./world";

// Turns a GameRecipe into a playable Game. Verbs run in recipe order; each
// can draw on four layers. The runtime owns the frame: background, things,
// juice, banners.

export function createRecipeGame(recipe: GameRecipe): Game {
  const world = new World(recipe);
  const verbs: VerbInstance[] = [];
  const sensors: VerbInstance[] = [];
  for (const use of recipe.rules) {
    const def = VERBS[use.verb];
    if (!def?.create) {
      console.warn(`[engine] verb "${use.verb}" is not built yet — skipped`);
      continue;
    }
    const v = def.create(world, use);
    verbs.push(v);
    if (def.sense) sensors.push(v);
  }
  // Sensors (lights, lenses) update first so rules always see this frame's state.
  const updateOrder = [...sensors, ...verbs.filter((v) => !sensors.includes(v))];

  world.startRound = (): void => {
    world.clearThings();
    world.banner = null;
    for (const v of verbs) v.onRound?.();
  };
  world.startRound();
  // Handy for debugging and automated playtests in the browser.
  (window as unknown as { __world?: World }).__world = world;

  world.drawScene = (g, detail, upright): void => {
    g.fillStyle = world.style.palette.ground;
    g.fillRect(0, 0, BOARD_W, BOARD_H);
    layer(g, "ground");
    for (const t of world.things) if (!t.hidden) drawThing(g, world, t, detail, upright);
  };

  const layer = (g: CanvasRenderingContext2D, l: Layer): void => {
    for (const v of verbs) v.draw?.(g, l);
  };

  return {
    id: recipe.id,
    name: recipe.title,
    update(input: InputFrame, dt: number) {
      world.time += dt;
      world.input = input;
      world.lights = [];
      world.focus = [];
      for (const v of updateOrder) v.update?.(dt);
      world.things = world.things.filter((t) => !t.removed);
      world.fx.update(dt);
      world.tickRounds();
    },
    draw(g) {
      g.save();
      if (world.fx.shake > 0) {
        g.translate((Math.random() - 0.5) * world.fx.shake, (Math.random() - 0.5) * world.fx.shake);
      }
      g.fillStyle = world.style.palette.ground;
      g.fillRect(-20, -20, BOARD_W + 40, BOARD_H + 40);
      layer(g, "ground");
      for (const t of world.things) if (!t.hidden) drawThing(g, world, t, !world.flags.lowDetail);
      layer(g, "things");
      layer(g, "over");
      world.fx.draw(g);
      layer(g, "hud");
      if (world.banner && world.time < world.banner.until) {
        // Big moments read from each long side, near the players, leaving the
        // middle of the table (where the action is) clear.
        drawBanner(g, world, world.banner.text, world.banner.sub);
      }
      g.restore();
    },
  };
}

/** Default renderer for a thing. Detail=false draws a tiny low-detail version. */
export function drawThing(g: CanvasRenderingContext2D, world: World, t: Thing, detail: boolean, upright = 0): void {
  const age = world.time - t.born;
  const pop = age < 0.35 ? ease.outBack(age / 0.35) : 1;
  const size = (t.look.size ?? 72) * pop * ((t.data.scale as number) ?? 1);
  g.save();
  g.translate(t.x, t.y);
  if (upright) g.rotate(upright);
  if (t.look.draw === "person") {
    const traits = t.data.traits as PersonTraits;
    if (detail) {
      drawPerson(g, traits, size, world.time * 3 + t.id);
    } else {
      // Low detail: three colour dabs. Enough to tempt, not enough to identify.
      const s = size / 10;
      g.fillStyle = traits.hat !== "none" ? traits.hatColor : traits.hair;
      g.beginPath(); g.arc(0, -s * 7.5, s * 1.4, 0, Math.PI * 2); g.fill();
      g.fillStyle = traits.shirt;
      g.beginPath(); g.arc(0, -s * 4.6, s * 1.9, 0, Math.PI * 2); g.fill();
      g.fillStyle = traits.pants;
      g.beginPath(); g.arc(0, -s * 1.6, s * 1.4, 0, Math.PI * 2); g.fill();
    }
  } else if (t.look.emoji) {
    const bob = Math.sin(world.time * 2.6 + t.id) * 3;
    g.translate(0, bob);
    drawEmoji(g, t.look.emoji, size);
  } else {
    g.fillStyle = t.look.color ?? world.style.palette.accent;
    g.beginPath(); g.arc(0, 0, size / 2, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

function drawBanner(g: CanvasRenderingContext2D, world: World, text: string, sub?: string): void {
  const p = world.style.palette;
  const age = world.time - world.banner!.start;
  const s = age < 0.3 ? ease.outBack(Math.max(0, age) / 0.3) : 1;
  for (const seat of [0, 2] as const) {
    forSeat(g, seat, 250, () => {
      g.scale(s, s);
      g.font = `bold 60px ${world.style.font}`;
      const w = Math.max(g.measureText(text).width, sub ? 520 : 0) + 90;
      g.fillStyle = "rgba(0,0,0,0.45)";
      g.beginPath(); g.roundRect(-w / 2, -62, w, sub ? 150 : 110, 40); g.fill();
      g.fillStyle = p.glow;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, 0, -8);
      if (sub) {
        g.font = `30px ${world.style.font}`;
        g.fillStyle = p.ink;
        g.fillText(sub, 0, 52);
      }
    });
  }
}
