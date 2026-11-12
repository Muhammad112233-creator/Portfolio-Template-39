import { beat, lerp } from '@/lib/math';

/**
 * The hero is a little film that scroll plays back. `r` runs 0 → 1 over the
 * first two screens of scrolling; each beat says when something happens.
 */
export const BEATS = {
  /** headline, intro and dial fade out */
  heroHold: [0.1, 0.24],
  /** the two islands drift off to their corners */
  islandsExit: [0.04, 0.26],
  laptopAway: [0.04, 0.12],
  /** Bolt hops down to where the desk will be */
  toDesk: [0.04, 0.34],
  deskIn: [0.2, 0.44],
  toPush: [0.32, 0.42],
  /** ...and pushes it across the screen, uncovering the name */
  push: [0.44, 0.94],
  nameFade: [0.38, 0.42],
  settle: [0.94, 1],
} as const;

/** Then a short tail (`a`, 0 → 1 over the next 70% of a screen). */
export const TAIL = {
  nameOut: [0.08, 0.4],
  lineIn: [0.35, 0.6],
} as const;

/** Seconds, counted from the moment the loader lets go. */
export const INTRO = {
  islandsGlide: 1.6,
  dropAt: 0.9,
  drop: 1.0,
  laptopPop: 0.6,
  headlineAt: 1.1,
  navAt: 2.1,
  done: 2.7,
} as const;

/** Where the desk is during the push, in stage widths from the centre. */
export function pushFrac(r: number) {
  return lerp(-0.36, 0.83, beat(r, BEATS.push));
}

/** How far behind the desk Bolt walks, in world units at scale 1. */
export const PUSH_GAP = 2.75;

export type HeroStory = {
  /** story progress 0..1 (on narrow screens: plain scroll progress) */
  r: number;
  /** seconds since the intro began, -1 while loading */
  intro: number;
  narrow: boolean;
};
