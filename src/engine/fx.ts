// Juice: every action gets an immediate, visible, satisfying response.
// Particles, pops, floating "+1"s, rings and a little screen shake.

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number;
  size: number; color: string;
  kind: "dot" | "emoji" | "ring" | "spark";
  text?: string;
  spin: number; rot: number;
  gravity: number;
}

interface Floater {
  x: number; y: number; text: string; color: string; life: number; size: number;
}

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

export class Fx {
  private parts: Particle[] = [];
  private floaters: Floater[] = [];
  shake = 0;

  burst(x: number, y: number, color: string, count = 18, speed = 320): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(0.35, 1) * speed;
      this.parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 0, max: rand(0.5, 0.9), size: rand(5, 11), color,
        kind: Math.random() < 0.3 ? "spark" : "dot", spin: rand(-6, 6), rot: 0, gravity: 260,
      });
    }
  }

  confetti(x: number, y: number, emojis: string[], count = 14): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(180, 520);
      this.parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120,
        life: 0, max: rand(1, 1.6), size: rand(28, 48), color: "#fff",
        kind: "emoji", text: emojis[i % emojis.length], spin: rand(-4, 4), rot: 0, gravity: 420,
      });
    }
  }

  ring(x: number, y: number, color: string, size = 140): void {
    this.parts.push({
      x, y, vx: 0, vy: 0, life: 0, max: 0.55, size, color,
      kind: "ring", spin: 0, rot: 0, gravity: 0,
    });
  }

  /** Gentle rising motes, e.g. bubbles or embers. */
  mote(x: number, y: number, color: string, text?: string): void {
    this.parts.push({
      x: x + rand(-20, 20), y, vx: rand(-20, 20), vy: rand(-90, -40),
      life: 0, max: rand(0.8, 1.6), size: text ? rand(22, 34) : rand(4, 9), color,
      kind: text ? "emoji" : "dot", text, spin: 0, rot: 0, gravity: -10,
    });
  }

  float(x: number, y: number, text: string, color = "#fff", size = 40): void {
    this.floaters.push({ x, y, text, color, life: 0, size });
  }

  kick(amount = 10): void {
    this.shake = Math.max(this.shake, amount);
  }

  update(dt: number): void {
    for (const p of this.parts) {
      p.life += dt;
      p.vy += p.gravity * dt;
      p.vx *= 1 - 1.6 * dt;
      p.vy *= 1 - 0.6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
    }
    this.parts = this.parts.filter((p) => p.life < p.max);
    for (const f of this.floaters) {
      f.life += dt;
      f.y -= 70 * dt;
    }
    this.floaters = this.floaters.filter((f) => f.life < 1.1);
    this.shake = Math.max(0, this.shake - 60 * dt);
  }

  draw(g: CanvasRenderingContext2D): void {
    g.save();
    for (const p of this.parts) {
      const t = p.life / p.max;
      g.globalAlpha = 1 - t * t;
      if (p.kind === "ring") {
        g.beginPath();
        g.arc(p.x, p.y, p.size * (0.3 + t), 0, Math.PI * 2);
        g.strokeStyle = p.color;
        g.lineWidth = 10 * (1 - t);
        g.stroke();
      } else if (p.kind === "emoji") {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.font = `${Math.round(p.size)}px serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(p.text ?? "✨", 0, 0);
        g.restore();
      } else if (p.kind === "spark") {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(Math.atan2(p.vy, p.vx));
        g.fillStyle = p.color;
        g.fillRect(-p.size, -1.5, p.size * 2, 3);
        g.restore();
      } else {
        g.beginPath();
        g.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        g.fillStyle = p.color;
        g.fill();
      }
    }
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (const f of this.floaters) {
      const t = f.life / 1.1;
      g.globalAlpha = 1 - t * t;
      const s = t < 0.15 ? 0.6 + (t / 0.15) * 0.5 : 1.1 - Math.min(0.1, (t - 0.15));
      g.font = `bold ${Math.round(f.size * s)}px system-ui, sans-serif`;
      g.lineWidth = 6;
      g.strokeStyle = "rgba(0,0,0,0.35)";
      g.strokeText(f.text, f.x, f.y);
      g.fillStyle = f.color;
      g.fillText(f.text, f.x, f.y);
    }
    g.restore();
  }
}

/** Ease helpers for pops and settles. */
export const ease = {
  outBack(t: number): number {
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  outCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  },
};
