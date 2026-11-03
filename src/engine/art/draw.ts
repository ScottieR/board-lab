// Art kit drawers. Everything is vector/canvas code (no image files) so it is
// crisp at any size, animates freely, and recolors per style card. When the
// Studio generates images, they plug in as `look.image` alongside these.

/** Procedural little person for search-and-find games. */
export interface PersonTraits {
  skin: string;
  hair: string;
  hat: "none" | "cap" | "beanie" | "tophat" | "crown" | "bow";
  hatColor: string;
  shirt: string;
  stripes: boolean;
  pants: string;
  prop: "none" | "balloon" | "umbrella" | "icecream" | "dog" | "kite" | "book";
  propColor: string;
  glasses: boolean;
}

export const PERSON_OPTIONS = {
  skin: ["#f2c9a0", "#d9a273", "#a86f45", "#6e4528", "#f7d7bd"],
  hair: ["#2b1d14", "#7a4a22", "#e0b04c", "#c2502a", "#9aa0a6"],
  hat: ["none", "none", "cap", "beanie", "tophat", "crown", "bow"] as PersonTraits["hat"][],
  color: ["#ef6f6c", "#5b8def", "#f6c445", "#5cc58a", "#a36bd6", "#ff9f43", "#3cc6d6", "#f2f2f2"],
  prop: ["none", "none", "balloon", "umbrella", "icecream", "dog", "kite", "book"] as PersonTraits["prop"][],
};

const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

export function randomPerson(): PersonTraits {
  return {
    skin: pick(PERSON_OPTIONS.skin),
    hair: pick(PERSON_OPTIONS.hair),
    hat: pick(PERSON_OPTIONS.hat),
    hatColor: pick(PERSON_OPTIONS.color),
    shirt: pick(PERSON_OPTIONS.color),
    stripes: Math.random() < 0.3,
    pants: pick(["#34495e", "#5b8def", "#7a5230", "#2d2d2d", "#a36bd6"]),
    prop: pick(PERSON_OPTIONS.prop),
    propColor: pick(PERSON_OPTIONS.color),
    glasses: Math.random() < 0.25,
  };
}

/**
 * Draw a person standing at (0,0) = feet, upright, `h` px tall.
 * `bob` animates a gentle idle bounce.
 */
export function drawPerson(g: CanvasRenderingContext2D, p: PersonTraits, h: number, bob = 0): void {
  const u = h / 10; // unit
  g.save();
  g.translate(0, -Math.abs(Math.sin(bob)) * u * 0.3);
  // shadow
  g.save();
  g.scale(1, 0.35);
  g.beginPath();
  g.arc(0, 0, u * 2.2, 0, Math.PI * 2);
  g.fillStyle = "rgba(0,0,0,0.18)";
  g.fill();
  g.restore();
  // prop behind (balloon/kite string)
  if (p.prop === "balloon" || p.prop === "kite") {
    g.strokeStyle = "rgba(60,60,60,0.7)";
    g.lineWidth = u * 0.15;
    g.beginPath();
    g.moveTo(u * 1.6, -u * 4.5);
    g.lineTo(u * 2.6, -u * 9.5);
    g.stroke();
    g.fillStyle = p.propColor;
    g.beginPath();
    if (p.prop === "balloon") g.ellipse(u * 2.6, -u * 10.6, u * 1.2, u * 1.45, 0, 0, Math.PI * 2);
    else { g.moveTo(u * 2.6, -u * 12); g.lineTo(u * 3.8, -u * 10.3); g.lineTo(u * 2.6, -u * 9); g.lineTo(u * 1.4, -u * 10.3); }
    g.fill();
  }
  // legs
  g.fillStyle = p.pants;
  roundRect(g, -u * 1.2, -u * 3.2, u * 1.0, u * 3.2, u * 0.4);
  roundRect(g, u * 0.2, -u * 3.2, u * 1.0, u * 3.2, u * 0.4);
  // body
  g.fillStyle = p.shirt;
  roundRect(g, -u * 1.6, -u * 6.4, u * 3.2, u * 3.6, u * 1.0);
  if (p.stripes) {
    g.save();
    g.beginPath();
    g.rect(-u * 1.6, -u * 6.4, u * 3.2, u * 3.6);
    g.clip();
    g.fillStyle = "rgba(255,255,255,0.75)";
    for (let i = 0; i < 4; i++) g.fillRect(-u * 1.6, -u * 6 + i * u * 0.9, u * 3.2, u * 0.4);
    g.restore();
  }
  // arms
  g.fillStyle = p.skin;
  g.beginPath(); g.arc(-u * 1.75, -u * 4.0, u * 0.45, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(u * 1.75, -u * 4.0, u * 0.45, 0, Math.PI * 2); g.fill();
  // head
  g.beginPath();
  g.arc(0, -u * 7.6, u * 1.35, 0, Math.PI * 2);
  g.fill();
  // hair
  g.fillStyle = p.hair;
  g.beginPath();
  g.arc(0, -u * 7.9, u * 1.38, Math.PI * 1.05, Math.PI * 1.95);
  g.fill();
  // eyes
  g.fillStyle = "#222";
  g.beginPath(); g.arc(-u * 0.45, -u * 7.5, u * 0.16, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(u * 0.45, -u * 7.5, u * 0.16, 0, Math.PI * 2); g.fill();
  if (p.glasses) {
    g.strokeStyle = "#222";
    g.lineWidth = u * 0.14;
    g.beginPath(); g.arc(-u * 0.45, -u * 7.5, u * 0.38, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(u * 0.45, -u * 7.5, u * 0.38, 0, Math.PI * 2); g.stroke();
  }
  // hat
  g.fillStyle = p.hatColor;
  switch (p.hat) {
    case "cap":
      g.beginPath(); g.arc(0, -u * 8.3, u * 1.3, Math.PI, 0); g.fill();
      g.fillRect(0, -u * 8.45, u * 2, u * 0.35);
      break;
    case "beanie":
      g.beginPath(); g.arc(0, -u * 8.2, u * 1.4, Math.PI, 0); g.fill();
      g.beginPath(); g.arc(0, -u * 9.7, u * 0.4, 0, Math.PI * 2); g.fill();
      break;
    case "tophat":
      g.fillRect(-u * 1.6, -u * 8.75, u * 3.2, u * 0.4);
      g.fillRect(-u * 1.0, -u * 10.6, u * 2.0, u * 1.9);
      break;
    case "crown":
      g.fillStyle = "#f6c445";
      g.beginPath();
      g.moveTo(-u * 1.1, -u * 8.6); g.lineTo(-u * 1.1, -u * 9.8); g.lineTo(-u * 0.55, -u * 9.2);
      g.lineTo(0, -u * 10.1); g.lineTo(u * 0.55, -u * 9.2); g.lineTo(u * 1.1, -u * 9.8); g.lineTo(u * 1.1, -u * 8.6);
      g.fill();
      break;
    case "bow":
      g.beginPath(); g.arc(u * 0.9, -u * 8.9, u * 0.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(u * 1.6, -u * 8.9, u * 0.5, 0, Math.PI * 2); g.fill();
      break;
  }
  // front props
  if (p.prop === "umbrella") {
    g.strokeStyle = "#333";
    g.lineWidth = u * 0.18;
    g.beginPath(); g.moveTo(u * 1.8, -u * 4); g.lineTo(u * 1.8, -u * 10); g.stroke();
    g.fillStyle = p.propColor;
    g.beginPath(); g.arc(u * 1.8, -u * 10, u * 2.4, Math.PI, 0); g.fill();
  } else if (p.prop === "icecream") {
    g.fillStyle = "#e0a96d";
    g.beginPath(); g.moveTo(u * 1.4, -u * 4.6); g.lineTo(u * 2.4, -u * 4.6); g.lineTo(u * 1.9, -u * 3.2); g.fill();
    g.fillStyle = p.propColor;
    g.beginPath(); g.arc(u * 1.9, -u * 5.0, u * 0.65, 0, Math.PI * 2); g.fill();
  } else if (p.prop === "dog") {
    g.fillStyle = p.propColor === "#f2f2f2" ? "#c9a27e" : "#c9a27e";
    roundRect(g, u * 2.0, -u * 1.6, u * 2.4, u * 1.2, u * 0.5);
    g.beginPath(); g.arc(u * 4.4, -u * 1.9, u * 0.7, 0, Math.PI * 2); g.fill();
    g.fillRect(u * 2.2, -u * 0.6, u * 0.35, u * 0.6);
    g.fillRect(u * 3.8, -u * 0.6, u * 0.35, u * 0.6);
  } else if (p.prop === "book") {
    g.fillStyle = p.propColor;
    g.fillRect(-u * 1.0, -u * 5.2, u * 2.0, u * 1.4);
  }
  g.restore();
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

/** Words a kid could use to describe a person ("red top hat, stripes, dog"). */
export function describePerson(p: PersonTraits): string[] {
  const out: string[] = [];
  if (p.hat !== "none") out.push(p.hat === "crown" ? "crown" : `${p.hat}`);
  if (p.stripes) out.push("stripes");
  if (p.glasses) out.push("glasses");
  if (p.prop !== "none") out.push(p.prop);
  return out;
}

/** Draw an emoji centered at (0,0). */
export function drawEmoji(g: CanvasRenderingContext2D, e: string, size: number): void {
  g.font = `${Math.round(size)}px serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(e, 0, size * 0.04);
}

/** Glass beaker with liquid, drawn around a piece at (0,0). */
export function drawBeaker(
  g: CanvasRenderingContext2D,
  r: number,
  liquid: string,
  fill: number,
  wobble: number,
): void {
  g.save();
  // glow pool on the table
  const pool = g.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.9);
  pool.addColorStop(0, liquid + "66");
  pool.addColorStop(1, liquid + "00");
  g.fillStyle = pool;
  g.beginPath(); g.arc(0, 0, r * 1.9, 0, Math.PI * 2); g.fill();
  // glass
  g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fill();
  // liquid (top-down: a disc with a wavy rim)
  g.save();
  g.beginPath(); g.arc(0, 0, r * 0.86, 0, Math.PI * 2); g.clip();
  g.beginPath();
  const lr = r * 0.86 * Math.sqrt(Math.max(0.15, fill));
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 24) {
    const rr = lr + Math.sin(a * 5 + wobble * 3) * r * 0.03;
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.fillStyle = liquid;
  g.fill();
  // highlight
  g.beginPath();
  g.ellipse(-lr * 0.35, -lr * 0.4, lr * 0.35, lr * 0.18, -0.6, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fill();
  g.restore();
  // rim
  g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2);
  g.lineWidth = r * 0.09;
  g.strokeStyle = "rgba(255,255,255,0.65)";
  g.stroke();
  g.beginPath(); g.arc(0, 0, r, -2.5, -1.6);
  g.lineWidth = r * 0.09;
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.stroke();
  g.restore();
}
