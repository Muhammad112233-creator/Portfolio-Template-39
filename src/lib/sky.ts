'use client';

import { clamp01, smooth } from './math';

export type SkyPhase = 'day' | 'sunset' | 'night';
export const SKY_ORDER: SkyPhase[] = ['day', 'sunset', 'night'];

/** One full day takes this long when nobody touches the dial. */
export const SKY_TURN_SECONDS = 150;
/** Pressing a dial button hurries the clock there in this time. */
export const SKY_RUSH_SECONDS = 2.4;

/** Where each phase sits on the dial (0..1). */
export const SKY_STOP: Record<SkyPhase, number> = { day: 0, sunset: 1 / 3, night: 2 / 3 };

export const SKY_LIGHTS: Record<SkyPhase, { ambient: string; key: string; fill: string; ai: number; ki: number; fi: number }> = {
  day: { ambient: '#d8e7fb', key: '#fff0d6', fill: '#cfe0f5', ai: 1.15, ki: 2.3, fi: 0.7 },
  sunset: { ambient: '#e7d3cc', key: '#ffb070', fill: '#9fb2d2', ai: 0.95, ki: 2.5, fi: 0.6 },
  night: { ambient: '#9db3d6', key: '#c6d6f2', fill: '#7d93ba', ai: 0.85, ki: 1.5, fi: 0.75 },
};

/** How much of each phase is in the sky at clock position `u`. Returns [day, sunset, night]. */
export function skyMix(u: number): [number, number, number] {
  const t = ((u % 1) + 1) % 1;
  const ramp = (a: number, b: number) => smooth(clamp01((t - a) / (b - a)));
  // day → sunset → night → (a short dawn) → day
  const toSunset = ramp(0.1, 0.3);
  const toNight = ramp(0.38, 0.6);
  const dawn = ramp(0.78, 0.9);
  const toDay = ramp(0.88, 1);
  let day = 1 - toSunset;
  let sunset = toSunset * (1 - toNight);
  let night = toNight;
  if (t > 0.78) {
    night = 1 - dawn;
    sunset = dawn * (1 - toDay);
    day = toDay;
  }
  return [day, sunset, night];
}

export function phaseAt(u: number): SkyPhase {
  const [d, s, n] = skyMix(u);
  return n >= d && n >= s ? 'night' : s > d ? 'sunset' : 'day';
}

type Clock = { u: number; rush: null | { from: number; to: number; t: number }; paused: boolean };

/** One clock for the whole page: the shader, the lights and the dial all read it. */
export const skyClock: Clock = { u: 0, rush: null, paused: false };

export function tickSky(dt: number) {
  const c = skyClock;
  if (c.rush) {
    c.rush.t = Math.min(1, c.rush.t + dt / SKY_RUSH_SECONDS);
    c.u = c.rush.from + (c.rush.to - c.rush.from) * smooth(c.rush.t);
    if (c.rush.t >= 1) c.rush = null;
  } else if (!c.paused) {
    c.u += dt / SKY_TURN_SECONDS;
  }
  return c.u;
}

/** Always travel forward in time, like a real day. */
export function rushTo(phase: SkyPhase) {
  const now = skyClock.u;
  const turn = Math.floor(now);
  let to = turn + SKY_STOP[phase];
  if (to <= now + 0.02) to += 1;
  skyClock.rush = { from: now, to, t: 0 };
}
