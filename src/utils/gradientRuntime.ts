/**
 * Gradient runtime utilities
 * - Used to drive both DOM background animation and Three.js lighting/material colors
 * - Keeps logic pure and reusable (no DOM/Three dependencies)
 */

/**
 * clamp01
 * Clamp a number into [0, 1].
 */
export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * wrap01
 * Wrap a number into [0, 1) (useful for phase offsets).
 */
export const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

/**
 * triangle01
 * Convert a 0..1 time value to a 0..1..0 triangle wave, matching:
 * 0% -> 0, 50% -> 1, 100% -> 0
 *
 * This mimics a common CSS keyframes pattern for "gradient back-and-forth" motion.
 */
export const triangle01 = (t: number): number => {
  const x = wrap01(t);
  return x < 0.5 ? x * 2 : (1 - x) * 2;
};

/**
 * lerp
 * Linear interpolation.
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * clamp01(t);

const parseHexColor = (hex: string): { r: number; g: number; b: number } | null => {
  const text = hex.trim();
  const match = text.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;

  const raw = match[1];
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;

  return { r, g, b };
};

const toHex2 = (value: number): string => {
  const v = Math.round(Math.min(255, Math.max(0, value)));
  return v.toString(16).padStart(2, '0');
};

/**
 * lerpHexColor
 * Interpolate between two hex colors (#RGB / #RRGGBB) and return a #RRGGBB string.
 */
export const lerpHexColor = (a: string, b: string, t: number): string => {
  const ca = parseHexColor(a);
  const cb = parseHexColor(b);
  if (!ca || !cb) return a;

  const r = lerp(ca.r, cb.r, t);
  const g = lerp(ca.g, cb.g, t);
  const bb = lerp(ca.b, cb.b, t);
  return `#${toHex2(r)}${toHex2(g)}${toHex2(bb)}`;
};

/**
 * pickStop
 * Pick two neighboring stops for a given phase t, and return the local interpolation factor.
 *
 * Assumption: stops are evenly distributed along 0..1.
 */
export const pickStop = (stops: string[], t: number): { a: string; b: string; localT: number } => {
  if (!stops.length) return { a: '#000000', b: '#000000', localT: 0 };
  if (stops.length === 1) return { a: stops[0], b: stops[0], localT: 0 };

  const x = wrap01(t);
  const scaled = x * stops.length;
  const index = Math.floor(scaled);
  const localT = scaled - index;

  const a = stops[index % stops.length];
  const b = stops[(index + 1) % stops.length];
  return { a, b, localT };
};

/**
 * sampleStopsColor
 * Return an interpolated color from `stops` at phase `t`.
 */
export const sampleStopsColor = (stops: string[], t: number): string => {
  const { a, b, localT } = pickStop(stops, t);
  return lerpHexColor(a, b, localT);
};

