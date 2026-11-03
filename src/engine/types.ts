// The Game Recipe: a JSON-shaped description of a whole game.
//
// This is the contract between the kids' Studio (where Claude designs and
// edits games in conversation) and the engine (which runs them). Claude edits
// recipes, never engine code, so a game can't "break" mid-chat. New mechanics
// are added to the engine as verbs, and every game can then use them.

export type Seat = 0 | 1 | 2 | 3; // 0 bottom, 1 right, 2 top, 3 left

export type GameMode =
  | "coop" // everyone wins together
  | "versus" // seats compete, scores per seat
  | "toy"; // no goal, just play (Toca-style)

/** What a physical Piece means in this game. */
export interface PieceRole {
  /** Glyph ids from the active Piece Set, or "any" for every piece not otherwise listed. */
  glyphs: number[] | "any";
  /** Role id the verbs refer to, e.g. "lantern", "beaker", "loupe". */
  role: string;
  /** Kid-facing name, e.g. "Captain Fluff". */
  name?: string;
}

/** How a thing looks. The art kit turns this into pixels. */
export interface Look {
  emoji?: string;
  /** A drawer from the art kit, e.g. "person". */
  draw?: string;
  color?: string;
  /** Diameter in board px (1920x1080 board ≈ 92.6 px per inch). */
  size?: number;
}

export interface ThingKind {
  look: Look;
  tags?: string[];
}

/** One use of a verb, with its parameters. */
export interface VerbUse {
  verb: string;
  [param: string]: unknown;
}

export interface GameRecipe {
  id: string;
  title: string;
  /** Archetype this recipe instantiates (see engine/archetypes.ts). */
  archetype: string;
  /** One sentence a kid would say to describe it. */
  pitch: string;
  ages: [number, number];
  players: [number, number];
  mode: GameMode;
  /** Style card id (engine/art/styles.ts) — palette, light, mood, sound. */
  style: string;
  pieces: PieceRole[];
  kinds?: Record<string, ThingKind>;
  /** The verbs, in the order they update and draw. */
  rules: VerbUse[];
}

/** Draw layers, back to front. */
export type Layer = "ground" | "things" | "over" | "hud";

export interface ParamDoc {
  type: "number" | "string" | "boolean" | "tag" | "role" | "kind" | "table" | "list";
  doc: string;
  default?: unknown;
}

/** Live behavior created from a VerbUse. */
export interface VerbInstance {
  onRound?(): void;
  update?(dt: number): void;
  draw?(g: CanvasRenderingContext2D, layer: Layer): void;
}
