// Style cards: a game's whole visual + sonic identity in one place.
//
// Taste rules baked in here (see docs/DESIGN_CODEX.md):
//  - A small, harmonious palette per game (ground, 2-3 accents, light, ink).
//    Nothing is ever default-blue-on-white or pure #000.
//  - Light is a design material: every style says where the light comes from
//    and what the glow color is.
//  - One font voice, rounded and friendly; text is rare and big.
//  - Sound is tuned to a root note so effects layer musically.
// The Studio's art generation uses `artPrompt` so generated images match.

export interface StyleCard {
  id: string;
  name: string;
  mood: string;
  palette: {
    ground: string; // main background
    ground2: string; // secondary / pattern
    accent: string;
    accent2: string;
    glow: string; // light, highlights, success
    ink: string; // text
    shadow: string; // soft shadow color (rgba)
  };
  font: string;
  rootHz: number;
  /** Appended to every image-generation prompt for this game. */
  artPrompt: string;
}

export const STYLES: Record<string, StyleCard> = {
  "moonlit-garden": {
    id: "moonlit-garden",
    name: "Moonlit Garden",
    mood: "hushed, magical, a little brave",
    palette: {
      ground: "#244536", ground2: "#2f5a45", accent: "#ffd166", accent2: "#7bdff2",
      glow: "#ffe9a8", ink: "#fff6dc", shadow: "rgba(6,10,24,0.45)",
    },
    font: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
    rootHz: 392, // G4
    artPrompt:
      "top-down storybook illustration, soft gouache texture, moonlit night garden, deep greens and indigo with warm lantern light, rounded friendly shapes, no text",
  },
  "storybook-town": {
    id: "storybook-town",
    name: "Storybook Town",
    mood: "busy, sunny, full of tiny stories",
    palette: {
      ground: "#cfe3a8", ground2: "#b9d48d", accent: "#ef6f6c", accent2: "#5b8def",
      glow: "#fff4c2", ink: "#2b2a33", shadow: "rgba(40,50,20,0.25)",
    },
    font: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
    rootHz: 523.25, // C5
    artPrompt:
      "dense search-and-find picture book illustration in the style of a Polish children's book, flat shapes, warm sunny palette, dozens of tiny characters each doing something, clean outlines, no text",
  },
  "candy-lab": {
    id: "candy-lab",
    name: "Candy Lab",
    mood: "bubbly, surprising, slightly silly",
    palette: {
      ground: "#1e1b3a", ground2: "#2a2650", accent: "#ff7ab6", accent2: "#64e1c5",
      glow: "#fff1a8", ink: "#f4f0ff", shadow: "rgba(0,0,0,0.4)",
    },
    font: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
    rootHz: 440, // A4
    artPrompt:
      "playful mad-scientist laboratory, glossy glass beakers, candy colors glowing on a deep indigo bench, soft rim light, rounded chunky shapes, no text",
  },
};

export function styleOf(id: string): StyleCard {
  return STYLES[id] ?? STYLES["moonlit-garden"];
}
