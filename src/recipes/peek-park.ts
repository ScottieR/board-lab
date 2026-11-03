import type { GameRecipe } from "../engine/types";

// Peek Park — Where's Waldo / Mamoko on a table. From the table everyone sees
// a busy park as tiny colour dabs; only your magnifying glass shows who's who,
// turned to face you. First to centre a wanted character claims it.
export default {
  id: "peek-park",
  title: "Peek Park",
  archetype: "search-and-find",
  pitch: "Slide your magnifying glass around the busy park to spot the wanted characters before anyone else!",
  ages: [5, 99],
  players: [1, 4],
  mode: "versus",
  style: "storybook-town",
  pieces: [{ glyphs: "any", role: "loupe", name: "Magnifying glass" }],
  kinds: {
    person: { look: { draw: "person", size: 30 }, tags: ["person"] },
  },
  rules: [
    { verb: "scene", kind: "park" },
    { verb: "hunt", crowd: 60, perRound: 15, wanted: 3, decoys: 2, hold: 0.45, size: 30 },
    { verb: "wander", tag: "person", speed: 5 },
    { verb: "loupe", role: "loupe", radius: 160, zoom: 2.6 },
    { verb: "prompt", text: "Grab a magnifying glass and find the people on the cards!" },
  ],
} satisfies GameRecipe;
