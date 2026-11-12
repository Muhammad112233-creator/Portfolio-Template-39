'use client';

import { asset } from './asset';
import { getState, setState } from './store';

const KEY = 'sound';
let ctx: AudioContext | null = null;
const buffers: Record<string, AudioBuffer | undefined> = {};
const loading: Record<string, boolean> = {};

export function initSound() {
  try {
    if (localStorage.getItem(KEY) === 'off') setState({ sound: false });
  } catch {}
}

export function toggleSound() {
  const sound = !getState().sound;
  setState({ sound });
  try {
    localStorage.setItem(KEY, sound ? 'on' : 'off');
  } catch {}
  if (sound) play('click');
}

/** Shared context, so the playground synth and the UI sounds use one output. */
export function audioContext() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

async function load(name: string) {
  if (buffers[name] || loading[name]) return;
  loading[name] = true;
  try {
    const res = await fetch(asset(`/audio/${name}.mp3`));
    buffers[name] = await audioContext().decodeAudioData(await res.arrayBuffer());
  } catch {
    loading[name] = false;
  }
}

export function play(name: 'click' | 'whoosh', gain = 0.45) {
  if (!getState().sound || typeof window === 'undefined') return;
  const buffer = buffers[name];
  if (!buffer) {
    void load(name);
    return;
  }
  const ac = audioContext();
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = 0.94 + Math.random() * 0.14;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(g).connect(ac.destination);
  src.start();
}

export function preloadSounds() {
  void load('click');
  void load('whoosh');
}
