'use client';

import { useSyncExternalStore } from 'react';

type State = {
  /** False while the home intro is still playing; the nav waits for it. */
  ready: boolean;
  sound: boolean;
};

let state: State = { ready: false, sound: true };
const subs = new Set<() => void>();

export const getState = () => state;

export function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  subs.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function useStore<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => pick(state),
    () => pick(state),
  );
}
