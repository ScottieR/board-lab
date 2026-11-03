import type { VerbUse } from "../types";

export const num = (u: VerbUse, k: string, d: number): number =>
  typeof u[k] === "number" ? (u[k] as number) : d;
export const str = (u: VerbUse, k: string, d: string): string =>
  typeof u[k] === "string" ? (u[k] as string) : d;
export const bool = (u: VerbUse, k: string, d: boolean): boolean =>
  typeof u[k] === "boolean" ? (u[k] as boolean) : d;
export const list = <T,>(u: VerbUse, k: string, d: T[]): T[] =>
  Array.isArray(u[k]) ? (u[k] as T[]) : d;

export const rand = (a: number, b: number): number => a + Math.random() * (b - a);
export const deg = (d: number): number => (d * Math.PI) / 180;

/** Seeded RNG so a round's scenery is stable while it's on screen. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Smallest signed difference between two angles in degrees. */
export function angleDelta(a: number, b: number): number {
  return ((b - a + 540) % 360) - 180;
}
