import type { ParamDoc, VerbInstance, VerbUse } from "../types";
import type { World } from "../world";
import { prompt, scatter, scene, wander } from "./core";
import { beam, darkness, find, glow } from "./light";
import { hunt, loupe } from "./loupe";
import { mix } from "./mix";

// The verb library: the vocabulary games are written in.
//
// `ready` verbs run today. `planned` verbs are designed (so Claude can
// already propose games with them and the archetype catalog can reference
// them) and get built as the games that need them are made.
//
// Each verb names the Board superpower it uses — PLACE, LIFT, TURN, HOLD,
// SLIDE, TAP, TOGETHER (multiple pieces/players) or PHONE (private screen).

export interface VerbDef {
  id: string;
  kidName: string;
  summary: string;
  uses: string[];
  status: "ready" | "planned";
  /** Sensing verbs (lights, lenses) update before rule verbs that read them. */
  sense?: boolean;
  params: Record<string, ParamDoc>;
  create?: (world: World, use: VerbUse) => VerbInstance;
}

const p = (type: ParamDoc["type"], doc: string, def?: unknown): ParamDoc => ({ type, doc, default: def });

const DEFS: VerbDef[] = [
  // ---------------------------------------------------------------- world
  { id: "scene", kidName: "Pick a place", status: "ready", uses: [], create: scene,
    summary: "Paints the table: a garden, a park, a lab bench (more scenes come from the art kit / image generation).",
    params: { kind: p("string", "garden | park | lab", "garden") } },
  { id: "scatter", kidName: "Hide things around", status: "ready", uses: [], create: scatter,
    summary: "Places things around the table each round, spaced apart, with more each round.",
    params: { kinds: p("list", "kind ids to choose from"), count: p("number", "how many", 6), perRound: p("number", "extra per round", 0), fromRound: p("number", "first round they appear", 1), spacing: p("number", "min gap px", 150) } },
  { id: "wander", kidName: "Things move around", status: "ready", uses: [], create: wander,
    summary: "Things amble about, turning gently and staying on the table.",
    params: { tag: p("tag", "which things"), speed: p("number", "px per second", 30) } },
  { id: "prompt", kidName: "Tell players what to do", status: "ready", uses: [], create: prompt,
    summary: "A short pulsing instruction while the table is empty. Prefer pictures; keep to ~8 words.",
    params: { text: p("string", "the instruction") } },

  // ---------------------------------------------------------------- light & seeing
  { id: "beam", sense: true, kidName: "Flashlight", status: "ready", uses: ["TURN", "SLIDE"], create: beam,
    summary: "A piece casts a cone of light where its nose points. Turn it to sweep.",
    params: { role: p("role", "which pieces", "lantern"), range: p("number", "beam length px", 560), angle: p("number", "beam width degrees", 60) } },
  { id: "glow", sense: true, kidName: "Glowing fingers", status: "ready", uses: ["TAP"], create: glow,
    summary: "Fingers (or a piece role) make a small round light — lets non-piece players help.",
    params: { role: p("role", "finger or a piece role", "finger"), radius: p("number", "glow size px", 110) } },
  { id: "darkness", kidName: "Nighttime", status: "ready", uses: [], create: darkness,
    summary: "The table is dark; only lights reveal it. Found things keep glowing.",
    params: { alpha: p("number", "how dark 0-1", 0.97), stars: p("boolean", "twinkling stars", true) } },
  { id: "find", kidName: "Find the hidden ones", status: "ready", uses: ["TOGETHER"], create: find,
    summary: "Shine light on hidden things long enough to find them; shy ones need several lights at once. All found = next round.",
    params: { tag: p("tag", "what to find"), time: p("number", "seconds of light", 0.7), shyTag: p("tag", "tag needing teamwork", "shy"), shyNeeds: p("number", "lights needed for shy ones", 2), label: p("string", "progress word", "found") } },
  { id: "loupe", sense: true, kidName: "Magnifying glass", status: "ready", uses: ["SLIDE", "TURN"], create: loupe,
    summary: "A piece is a magnifier: tiny details only show inside the lens, upright for whoever holds it.",
    params: { role: p("role", "which pieces", "loupe"), radius: p("number", "lens size px", 160), zoom: p("number", "magnification", 2.6) } },
  { id: "hunt", kidName: "Where's the…?", status: "ready", uses: ["SLIDE"], create: hunt,
    summary: "A crowd hides wanted characters (and look-alikes). Centre one in a lens and hold still to claim it.",
    params: { crowd: p("number", "crowd size", 55), perRound: p("number", "more each round", 12), wanted: p("number", "how many to find", 3), decoys: p("number", "look-alikes per wanted", 2) } },

  // ---------------------------------------------------------------- making & combining
  { id: "mix", kidName: "Mix potions", status: "ready", uses: ["TOGETHER", "TURN", "TAP"], create: mix,
    summary: "Pieces are containers of elements. Bring two together and twist one to pour; known pairs make something new (discovery book).",
    params: { elements: p("table", "id -> {name, emoji, color}"), combos: p("list", "[a, b, result] triples"), base: p("table", "glyph id -> starting element"), goals: p("list", "results the Professor asks for, in order"), stir: p("number", "degrees of twist to pour", 80) } },
  { id: "stamp", kidName: "Stamp it down", status: "planned", uses: ["PLACE"],
    summary: "Putting a piece down creates something at that spot (a tree, a footprint, a house).",
    params: { role: p("role", "stamper pieces"), kind: p("kind", "what appears") } },
  { id: "build", kidName: "Build & level up", status: "planned", uses: ["PLACE", "HOLD"],
    summary: "Place a piece on a plot to build; hold it there to upgrade (shop → bigger shop). Upgrades cost resources.",
    params: { plots: p("list", "plot positions"), levels: p("list", "level looks and costs") } },
  { id: "grow", kidName: "Grow over time", status: "planned", uses: [],
    summary: "Things grow through stages when their needs (water, light, neighbours) are met; neglect wilts gently, never dies.",
    params: { tag: p("tag", "growing things"), stages: p("list", "looks per stage"), needs: p("table", "need -> amount") } },
  { id: "spread", kidName: "It spreads!", status: "planned", uses: [],
    summary: "A cellular spread across a grid (grass greening barren land, lava, a rumour, a virus) that pieces block or boost.",
    params: { from: p("kind", "what spreads"), into: p("kind", "what it turns into"), rate: p("number", "cells per second") } },
  { id: "orders", kidName: "Orders up!", status: "planned", uses: ["PLACE", "TOGETHER"],
    summary: "Customers/creatures queue with requests and patience timers; deliver the right thing to fulfil them (cooking, shops, monster buffet).",
    params: { menu: p("list", "possible requests"), patience: p("number", "seconds"), rush: p("boolean", "speeds up over time") } },
  { id: "carry", kidName: "Pick up & deliver", status: "planned", uses: ["SLIDE", "LIFT"],
    summary: "A piece picks up things it passes over and drops them in a zone (supplies to the wagon, sheep to the barn).",
    params: { role: p("role", "carrier pieces"), tag: p("tag", "carriable things"), capacity: p("number", "how many at once", 1) } },
  { id: "zone", kidName: "Special places", status: "planned", uses: ["PLACE"],
    summary: "Named areas of the table (home corners, a jar, a sink, a vault) that verbs can reference.",
    params: { zones: p("list", "{id, shape, x, y, w, h, seat?}") } },

  // ---------------------------------------------------------------- movement & action
  { id: "stealth", kidName: "Sneaky mode", status: "planned", uses: ["HOLD", "SLIDE"],
    summary: "Hand on your piece = you're moving and can be seen; let go and you freeze into a disguise.",
    params: { role: p("role", "sneaky pieces"), disguise: p("kind", "what you look like frozen") } },
  { id: "watchers", kidName: "Guards are looking", status: "planned", uses: [],
    summary: "AI guards/rangers patrol with visible vision cones; spotting a moving sneaky piece triggers a (funny) chase.",
    params: { count: p("number", "how many"), patrol: p("string", "loop | random"), cone: p("number", "vision degrees") } },
  { id: "deflect", kidName: "Bounce & mirror", status: "planned", uses: ["TURN", "PLACE"],
    summary: "Lasers, balls or light bounce off pieces at the angle they're turned (mirror puzzles, marble runs).",
    params: { role: p("role", "mirror pieces"), source: p("table", "where beams start"), targets: p("list", "goals to hit") } },
  { id: "dial", kidName: "Turn to choose", status: "planned", uses: ["TURN"],
    summary: "Turning a piece sets a number or picks from a ring of options (a bid, a volume, a recipe, a destination).",
    params: { role: p("role", "dial pieces"), options: p("list", "values around the ring") } },
  { id: "flick", kidName: "Push & bump", status: "planned", uses: ["SLIDE"],
    summary: "Pieces shove virtual pucks/creatures they move into; speed of the slide sets the push (air hockey, curling, sumo).",
    params: { role: p("role", "pusher pieces"), friction: p("number", "0-1") } },
  { id: "draw", kidName: "Draw on the table", status: "planned", uses: ["TAP"],
    summary: "Fingers (or a stylus) draw paths, walls, rivers or bridges that become part of the world.",
    params: { becomes: p("string", "wall | path | water | bridge"), ink: p("number", "how much you can draw") } },
  { id: "timer", kidName: "Beat the clock", status: "planned", uses: [],
    summary: "A round timer with a visible, non-scary countdown (sand pouring, sun setting).",
    params: { seconds: p("number", "round length"), look: p("string", "sand | sun | candle") } },

  // ---------------------------------------------------------------- turns, cards, stories
  { id: "turns", kidName: "Take turns", status: "planned", uses: ["PLACE"],
    summary: "Whose turn it is, shown at their seat; a turn ends when they place/lift their piece.",
    params: { order: p("string", "clockwise | free") } },
  { id: "dice", kidName: "Roll dice", status: "planned", uses: ["TAP", "LIFT"],
    summary: "Shake-and-roll dice in the middle of the table (or privately on a phone).",
    params: { count: p("number", "dice"), faces: p("list", "custom faces") } },
  { id: "tiles", kidName: "Tiles & dominoes", status: "planned", uses: ["SLIDE", "PHONE"],
    summary: "A shared tile area (trains, melds, mahjong walls) plus private racks on each player's phone/iPad.",
    params: { set: p("string", "dominoes | rummy | mahjong | custom"), rules: p("string", "matching rule") } },
  { id: "hand", kidName: "Secret hand", status: "planned", uses: ["PHONE"],
    summary: "Each player's private cards/dice/role live on their own phone; the table shows only public info.",
    params: { deal: p("number", "cards each") } },
  { id: "vote", kidName: "Everyone chooses", status: "planned", uses: ["PLACE", "TOGETHER"],
    summary: "Each player places their piece on an option; the combined choice steers what happens (stories, Ouija, team plans).",
    params: { options: p("list", "choices"), combine: p("string", "majority | blend | all-agree") } },
  { id: "story", kidName: "Tell a story", status: "planned", uses: ["PLACE"],
    summary: "An AI narrator voices scenes and reacts to votes, finds and builds; stories are saved as a picture-book recap.",
    params: { premise: p("string", "story seed"), voice: p("string", "narrator voice") } },
  { id: "planchette", kidName: "Spirit pointer", status: "planned", uses: ["TOGETHER", "HOLD"],
    summary: "One piece glides between letters/answers only while several players have fingers on or around it (Ouija).",
    params: { board: p("string", "letters | yes-no | custom"), answers: p("string", "spooky | silly") } },
  { id: "journey", kidName: "Big journey", status: "planned", uses: ["SLIDE", "TURN"],
    summary: "A trail map with distance, supplies, weather and events between stops (Oregon Trail).",
    params: { stops: p("list", "landmarks"), supplies: p("table", "starting supplies") } },
  { id: "dress", kidName: "Dress up & play pretend", status: "planned", uses: ["PLACE", "SLIDE"],
    summary: "Toca-style toy: characters you dress and move between rooms; objects react when touched. No goals, no fail.",
    params: { rooms: p("list", "places"), wardrobe: p("list", "outfits") } },
  { id: "care", kidName: "Take care of them", status: "planned", uses: ["PLACE", "HOLD"],
    summary: "Characters with needs (hungry, sick, sleepy) that tools fix (doctor, vet, pet care); always recover.",
    params: { needs: p("list", "needs"), tools: p("table", "role -> fixes need") } },
  { id: "terrain", kidName: "Shape the land", status: "planned", uses: ["PLACE", "TURN", "HOLD"],
    summary: "Raise/lower land, pour water, seed life; the ecosystem responds beautifully (Terra Nil / Nature).",
    params: { biomes: p("list", "biomes that can appear") } },
];

export const VERBS: Record<string, VerbDef> = Object.fromEntries(DEFS.map((d) => [d.id, d]));
export const VERB_LIST = DEFS;
