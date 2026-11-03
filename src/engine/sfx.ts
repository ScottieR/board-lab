// Tiny synthesized sound kit (no audio files to license or load). Every
// meaningful action gets a sound; sounds are short, soft and pitched to the
// style's key so stacked effects stay pleasant rather than noisy.

type SoundName = "pop" | "chime" | "fizz" | "whoosh" | "thud" | "tada" | "tick" | "boop" | "sparkle";

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;
  /** Base note (Hz) for the current style; chimes are built on it. */
  root = 523.25; // C5

  constructor() {
    const unlock = (): void => {
      this.ensure();
      void this.ctx?.resume();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
  }

  private ensure(): void {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slideTo?: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || ctx.state !== "running") return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const gn = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(gn).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol: number, lowpass: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || ctx.state !== "running") return;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = lowpass;
    const gn = ctx.createGain();
    gn.gain.value = vol;
    src.connect(f).connect(gn).connect(this.master);
    src.start();
  }

  play(name: SoundName, pitch = 1): void {
    if (this.muted) return;
    this.ensure();
    const r = this.root * pitch;
    switch (name) {
      case "pop": this.tone(r * 1.5, 0.12, "sine", 0.5, 0, r * 0.75); break;
      case "boop": this.tone(r, 0.15, "triangle", 0.35); break;
      case "tick": this.tone(r * 2, 0.04, "square", 0.08); break;
      case "thud": this.tone(110, 0.18, "sine", 0.6, 0, 55); break;
      case "whoosh": this.noise(0.35, 0.25, 1400); break;
      case "fizz": this.noise(0.5, 0.18, 4200); this.tone(r * 0.5, 0.3, "sawtooth", 0.05, 0, r * 0.25); break;
      case "chime": // major arpeggio
        [1, 1.25, 1.5].forEach((m, i) => this.tone(r * m, 0.5, "sine", 0.3, i * 0.06));
        break;
      case "sparkle":
        [2, 2.5, 3, 4].forEach((m, i) => this.tone(r * m, 0.25, "sine", 0.12, i * 0.04));
        break;
      case "tada":
        [1, 1.25, 1.5, 2].forEach((m, i) => this.tone(r * m, 0.7, "triangle", 0.28, i * 0.09));
        this.tone(r * 2.5, 0.9, "sine", 0.2, 0.36);
        break;
    }
  }
}
