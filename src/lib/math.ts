export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 before `from`, 1 after `to`, linear in between. */
export function beat(v: number, [from, to]: readonly [number, number]) {
  const span = to - from;
  if (span <= 0) return v >= to ? 1 : 0;
  return clamp01((v - from) / span);
}

export const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOutCubic = (t: number) => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** Frame-rate independent follow. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
