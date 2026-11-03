import type { GameRecipe } from "../engine/types";

// Night Lights, rebuilt as a recipe: same game, now made of reusable verbs.
export default {
  id: "night-lights",
  title: "Night Lights",
  archetype: "reveal-in-the-dark",
  pitch: "Turn your lantern to find the critters hiding in the dark garden — owls need two lights!",
  ages: [4, 99],
  players: [1, 4],
  mode: "coop",
  style: "moonlit-garden",
  pieces: [{ glyphs: "any", role: "lantern", name: "Lantern" }],
  kinds: {
    frog: { look: { emoji: "🐸", size: 76 }, tags: ["critter", "hidden"] },
    hedgehog: { look: { emoji: "🦔", size: 76 }, tags: ["critter", "hidden"] },
    bunny: { look: { emoji: "🐇", size: 76 }, tags: ["critter", "hidden"] },
    fox: { look: { emoji: "🦊", size: 76 }, tags: ["critter", "hidden"] },
    snail: { look: { emoji: "🐌", size: 70 }, tags: ["critter", "hidden"] },
    ladybug: { look: { emoji: "🐞", size: 64 }, tags: ["critter", "hidden"] },
    raccoon: { look: { emoji: "🦝", size: 76 }, tags: ["critter", "hidden"] },
    turtle: { look: { emoji: "🐢", size: 76 }, tags: ["critter", "hidden"] },
    owl: { look: { emoji: "🦉", size: 80 }, tags: ["critter", "hidden", "shy"] },
  },
  rules: [
    { verb: "scene", kind: "garden" },
    { verb: "scatter", kinds: ["owl"], count: 1, perRound: 1, max: 3, fromRound: 2, spacing: 190 },
    { verb: "scatter", kinds: ["frog", "hedgehog", "bunny", "fox", "snail", "ladybug", "raccoon", "turtle"], count: 6, perRound: 1, max: 11, spacing: 190 },
    { verb: "wander", tag: "critter", speed: 8 },
    { verb: "beam", role: "lantern", range: 560, angle: 60 },
    { verb: "glow", role: "finger", radius: 110 },
    { verb: "darkness", alpha: 0.97 },
    { verb: "find", tag: "hidden", time: 0.7, shyTag: "shy", shyNeeds: 2, label: "found", confetti: ["🐸", "🦔", "✨", "⭐"] },
    { verb: "prompt", text: "Put a lantern down and turn it to look around" },
  ],
} satisfies GameRecipe;
