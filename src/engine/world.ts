import type { BoardContact } from "@board.fun/web-sdk";
import type { InputFrame } from "../board/input";
import { BOARD_H, BOARD_W } from "../board/space";
import { styleOf, type StyleCard } from "./art/styles";
import { Fx } from "./fx";
import { seatOf } from "./seats";
import { Sfx } from "./sfx";
import type { GameRecipe, Look, Seat } from "./types";

/** Anything living on the table that isn't a physical piece. */
export interface Thing {
  id: number;
  kind: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tags: Set<string>;
  look: Look;
  data: Record<string, unknown>;
  born: number;
  hidden?: boolean;
  removed?: boolean;
}

/** A light source for darkness/reveal verbs. */
export interface Light {
  x: number;
  y: number;
  r: number;
  /** Cone direction (radians) and half-angle; omit for a round glow. */
  dir?: number;
  half?: number;
  color: string;
  glyph: number; // 0 = finger
}

/** A magnified focus area (loupe). */
export interface Focus {
  x: number;
  y: number;
  r: number;
  dir: number;
  seat: Seat;
  glyph: number;
  zoom: number;
  /** Set by search verbs when something wanted is in view ("warmer"). */
  hot?: boolean;
}

type Handler = (payload: Record<string, unknown>) => void;

const EMPTY: InputFrame = {
  contacts: [], pieces: [], fingers: [],
  placed: [], lifted: [], grabbed: [], released: [], taps: [],
};

export class World {
  readonly recipe: GameRecipe;
  readonly style: StyleCard;
  readonly fx = new Fx();
  readonly sfx = new Sfx();
  time = 0;
  round = 1;
  things: Thing[] = [];
  lights: Light[] = [];
  focus: Focus[] = [];
  input: InputFrame = EMPTY;
  scores: [number, number, number, number] = [0, 0, 0, 0];
  teamScore = 0;
  flags = { lowDetail: false, paused: false };
  banner: { text: string; sub?: string; start: number; until: number } | null = null;
  private nextId = 1;
  private handlers = new Map<string, Handler[]>();
  private pendingRound = 0;
  /** Set by the runtime: starts a new round on every verb. */
  startRound: () => void = () => {};
  /** Set by the runtime: paint ground + things (used by lenses/magnifiers). */
  drawScene: (g: CanvasRenderingContext2D, detail: boolean, upright: number) => void = () => {};

  constructor(recipe: GameRecipe) {
    this.recipe = recipe;
    this.style = styleOf(recipe.style);
    this.sfx.root = this.style.rootHz;
  }

  // ---- events -------------------------------------------------------------
  on(event: string, fn: Handler): void {
    const list = this.handlers.get(event) ?? [];
    list.push(fn);
    this.handlers.set(event, list);
  }
  emit(event: string, payload: Record<string, unknown> = {}): void {
    for (const fn of this.handlers.get(event) ?? []) fn(payload);
  }

  // ---- pieces -------------------------------------------------------------
  roleOf(c: BoardContact): string | undefined {
    if (c.glyphId === 0) return "finger";
    const exact = this.recipe.pieces.find((p) => Array.isArray(p.glyphs) && p.glyphs.includes(c.glyphId));
    if (exact) return exact.role;
    return this.recipe.pieces.find((p) => p.glyphs === "any")?.role;
  }
  piecesWith(role: string): BoardContact[] {
    if (role === "finger") return this.input.fingers;
    return this.input.pieces.filter((c) => this.roleOf(c) === role);
  }
  nameOf(c: BoardContact): string | undefined {
    return this.recipe.pieces.find((p) => Array.isArray(p.glyphs) && p.glyphs.includes(c.glyphId))?.name;
  }

  // ---- things -------------------------------------------------------------
  spawn(kind: string, x: number, y: number, data: Record<string, unknown> = {}): Thing {
    const k = this.recipe.kinds?.[kind];
    const t: Thing = {
      id: this.nextId++,
      kind,
      x, y, vx: 0, vy: 0,
      tags: new Set([kind, ...(k?.tags ?? [])]),
      look: { ...(k?.look ?? { emoji: "❓" }) },
      data,
      born: this.time,
    };
    this.things.push(t);
    return t;
  }
  withTag(tag: string): Thing[] {
    return this.things.filter((t) => !t.removed && t.tags.has(tag));
  }
  clearThings(): void {
    this.things = [];
  }

  // ---- light --------------------------------------------------------------
  /** How many lights shine on a point (cones and glows). */
  lightAt(x: number, y: number): number {
    let n = 0;
    for (const l of this.lights) {
      const dx = x - l.x;
      const dy = y - l.y;
      const d = Math.hypot(dx, dy);
      if (d > l.r) continue;
      if (l.dir === undefined || d < 70) { n++; continue; }
      let diff = Math.atan2(dy, dx) - l.dir;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (Math.abs(diff) <= (l.half ?? Math.PI)) n++;
    }
    return n;
  }

  // ---- scoring & moments --------------------------------------------------
  seatOf(x: number, y: number): Seat {
    return seatOf(x, y);
  }
  award(seat: Seat | null, points: number, x: number, y: number): void {
    if (this.recipe.mode === "versus" && seat !== null) this.scores[seat] += points;
    else this.teamScore += points;
    this.fx.float(x, y - 60, `+${points}`, this.style.palette.glow, 46);
    this.emit("scored", { seat, points });
  }
  celebrate(text: string, sub?: string, seconds = 3): void {
    this.banner = { text, sub, start: this.time, until: this.time + seconds };
    this.fx.confetti(BOARD_W / 2, BOARD_H / 2, ["🎉", "⭐", "✨", "🎈"], 26);
    this.sfx.play("tada");
  }
  /** Ask the runtime to start the next round after a pause. */
  nextRoundIn(seconds: number): void {
    if (!this.pendingRound) this.pendingRound = this.time + seconds;
  }
  tickRounds(): void {
    if (this.pendingRound && this.time >= this.pendingRound) {
      this.pendingRound = 0;
      this.round++;
      this.startRound();
    }
  }
  get betweenRounds(): boolean {
    return this.pendingRound > 0;
  }
}
