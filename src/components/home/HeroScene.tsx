'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Robot, { type RobotApi } from '@/components/three/Robot';
import Sky from '@/components/three/Sky';
import Stage3D from '@/components/three/Stage3D';
import { Island, Notebook, Workstation } from '@/components/three/props';
import { beat, clamp01, easeOutCubic, lerp, smooth } from '@/lib/math';
import { SKY_LIGHTS, SKY_ORDER, skyClock, skyMix } from '@/lib/sky';
import { BEATS, INTRO, PUSH_GAP, pushFrac, type HeroStory } from './heroStory';

const tmp = new THREE.Color();
function blend(out: THREE.Color, mix: number[], key: 'ambient' | 'key' | 'fill') {
  out.setRGB(0, 0, 0);
  SKY_ORDER.forEach((phase, i) => {
    tmp.set(SKY_LIGHTS[phase][key]);
    out.r += tmp.r * mix[i];
    out.g += tmp.g * mix[i];
    out.b += tmp.b * mix[i];
  });
}
const weigh = (mix: number[], key: 'ai' | 'ki' | 'fi') => SKY_ORDER.reduce((sum, phase, i) => sum + SKY_LIGHTS[phase][key] * mix[i], 0);
const backOut = (t: number) => {
  const c = clamp01(t) - 1;
  return 1 + 2.4 * c * c * c + 1.4 * c * c;
};

function Scene({ story, onReady }: { story: HeroStory; onReady: () => void }) {
  const robot = useRef<RobotApi>(null);
  const lean = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);
  const pebbleA = useRef<THREE.Group>(null!);
  const pebbleB = useRef<THREE.Group>(null!);
  const desk = useRef<THREE.Group>(null!);
  const lap = useRef<THREE.Group>(null!);
  const ambient = useRef<THREE.AmbientLight>(null!);
  const key = useRef<THREE.DirectionalLight>(null!);
  const fill = useRef<THREE.DirectionalLight>(null!);
  const mix = useRef<[number, number, number]>([1, 0, 0]);
  const told = useRef(false);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = state.clock.elapsedTime;
    const bot = robot.current;
    if (!bot) return;
    if (!told.current) {
      told.current = true;
      onReady();
    }

    // the light follows the sky
    const m = (mix.current = skyMix(skyClock.u));
    blend(ambient.current.color, m, 'ambient');
    blend(key.current.color, m, 'key');
    blend(fill.current.color, m, 'fill');
    ambient.current.intensity = weigh(m, 'ai');
    key.current.intensity = weigh(m, 'ki');
    fill.current.intensity = weigh(m, 'fi');

    const W = viewport.width;
    const H = viewport.height;
    const narrow = story.narrow;
    const k = narrow ? Math.min(0.66, Math.max(0.4, W / 6.6)) : Math.min(1, W / 11.5) * 0.66; // character scale
    const s = k / 0.66; // everything else scales with it
    const it = story.intro;
    const r = narrow ? 0 : story.r;
    const drift = narrow ? story.r : 0;

    const seatX = narrow ? 0.5 * s : -W / 2 + 4.2 * s;
    const seatY = narrow ? -H * 0.2 : -H / 2 + 2.35 * s;
    const floorY = -H / 2 + 1.9 * s;

    // islands glide in, bob, and leave for their corners
    const glide = it < 0 ? 0 : easeOutCubic(it / INTRO.islandsGlide);
    const exit = smooth(beat(r, BEATS.islandsExit)) + drift * 0.35;
    const bob = Math.sin(t * 0.7) * 0.05;
    left.current.scale.setScalar(s);
    left.current.position.set(seatX - 2.3 * s - (1 - glide) * 7 - exit * 8, seatY + bob - (1 - glide) * 2.5 - exit * 4, -0.6);
    right.current.scale.setScalar(s);
    right.current.position.set(
      (narrow ? W / 2 + 1.4 : W / 2 - 0.9 * s) + (1 - glide) * 7 + exit * 8,
      H / 2 + (narrow ? 2.2 : 1.5 * s) - bob + (1 - glide) * 2.5 + exit * 4,
      -1.2,
    );
    right.current.rotation.z = 0.12 + Math.sin(t * 0.3) * 0.01;
    pebbleA.current.position.set(W * 0.3 + exit * 6, H * 0.02 + Math.sin(t * 0.9 + 1) * 0.12 - (1 - glide) * 4 - exit * 3, -1);
    pebbleA.current.rotation.y = t * 0.15;
    pebbleB.current.position.set(-W * 0.05 - exit * 2, H * 0.36 + Math.sin(t * 0.6 + 2) * 0.1 + (1 - glide) * 3 + exit * 4, -2);
    pebbleB.current.rotation.y = -t * 0.1;

    // Bolt: seat → hop → walk behind the desk
    const dropped = it < 0 ? 0 : easeOutCubic((it - INTRO.dropAt) / INTRO.drop);
    const toDesk = beat(r, BEATS.toDesk);
    const hop = smooth(toDesk);
    const turn = smooth(beat(r, BEATS.toPush));
    const push = beat(r, BEATS.push);
    const deskX = pushFrac(r) * W;
    const walkX = deskX - PUSH_GAP * s;
    const startX = pushFrac(0) * W - PUSH_GAP * s;

    const g = bot.group;
    g.visible = it >= INTRO.dropAt;
    g.scale.setScalar(k);
    const x = push > 0 ? walkX : lerp(seatX, startX, hop);
    const y = lerp(seatY + bob, floorY, hop) + Math.sin(Math.PI * hop) * 1.5 * s + (1 - dropped) * H * 1.1;
    lean.current.position.set(x, y, 0);
    lean.current.rotation.z = -0.14 * Math.min(1, push * 14);
    g.rotation.y = lerp(0.55, Math.PI / 2, turn) + (1 - dropped) * 2.2;

    const jumping = Math.sin(Math.PI * toDesk);
    const walking = push > 0 ? 1 : 0;
    const sitting = (1 - hop) * (1 - jumping * 0.7);
    bot.pose(
      dt,
      {
        Sitting: sitting * 0.85,
        Idle: sitting * 0.15 + hop * (1 - walking) * (1 - jumping),
        Jump: jumping * (1 - walking),
        Walking: walking,
      },
      { Sitting: 1, Jump: toDesk, Walking: ((walkX * 0.42) % 1 + 1) % 1 },
    );

    // the laptop on his knees
    const pop = it < 0 ? 0 : backOut((it - INTRO.dropAt - INTRO.drop * 0.8) / INTRO.laptopPop);
    const away = 1 - smooth(beat(r, BEATS.laptopAway));
    lap.current.scale.setScalar(Math.max(0.0001, k * 1.1 * pop * away));
    lap.current.position.set(x + 1.2 * k, y + 0.95 * k, 1.3 * k);
    lap.current.rotation.y = 0.55 + Math.PI;

    // the desk
    const arrive = beat(r, BEATS.deskIn);
    desk.current.visible = arrive > 0 && !narrow;
    desk.current.scale.setScalar(Math.max(0.0001, s * 0.78 * backOut(arrive)));
    desk.current.position.set(deskX, floorY + 1.72 * s + (1 - easeOutCubic(arrive)) * 2 + Math.sin(t * 1.1) * 0.03, 0.2);
  });

  return (
    <>
      <Sky mix={() => mix.current} />
      <ambientLight ref={ambient} />
      <hemisphereLight args={['#ffffff', '#c9b79c', 0.9]} />
      <directionalLight ref={key} position={[5, 7, 6]} />
      <directionalLight ref={fill} position={[-6, 1, 4]} />

      <group ref={left}>
        <Island seed={2.4} depth={1.55} scale={[3.5, 3.5, 2.6]} />
      </group>
      <group ref={right}>
        <Island seed={7.1} depth={1.7} scale={[2.7, 2.7, 2.2]} />
      </group>
      <Island ref={pebbleA} seed={4.2} depth={1.2} scale={0.34} />
      <Island ref={pebbleB} seed={9.5} depth={1.3} scale={0.3} />

      <group ref={lean}>
        <Robot ref={robot} />
      </group>
      <Notebook ref={lap} open={1.95} />
      <Workstation ref={desk} rotation={[0, -0.25, 0]} />
    </>
  );
}

export default function HeroScene({ story, onReady }: { story: HeroStory; onReady: () => void }) {
  return (
    <Stage3D className="absolute inset-0" margin="10%">
      <Scene story={story} onReady={onReady} />
    </Stage3D>
  );
}
