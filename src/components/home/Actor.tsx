'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Robot, { ROBOT_HEIGHT, type RobotApi } from '@/components/three/Robot';
import Stage3D from '@/components/three/Stage3D';
import { BlobShadow, Workstation } from '@/components/three/props';
import { featured } from '@/content/projects';
import { asset } from '@/lib/asset';
import { clamp01, easeInOutCubic, lerp, smooth } from '@/lib/math';
import { orbit } from './orbit';

const CARDS = 8;
const backOut = (t: number) => {
  const c = clamp01(t) - 1;
  return 1 + 2.4 * c * c * c + 1.4 * c * c;
};

/**
 * One Bolt for three sections. He is glued to three invisible boxes in the
 * page ([data-actor="why" | "intro" | "orbit"]): wherever those boxes are on
 * screen, that is where he is drawn, and between sections he leaps from one
 * to the next. Move or resize a box in CSS and he follows.
 */
function Scene() {
  const robot = useRef<RobotApi>(null);
  const desk = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const dom = useRef<Record<'why' | 'intro' | 'orbit', HTMLElement | null>>({ why: null, intro: null, orbit: null });
  const mem = useRef({ shownAt: -1, arrivedAt: -1, angle: 0 });
  const seat = useMemo(() => new THREE.Vector3(), []);

  const covers = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return featured.map((p) => {
      const t = loader.load(asset(p.cover));
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
  }, []);

  useEffect(() => {
    const q = (name: string) => document.querySelector<HTMLElement>(`[data-actor="${name}"]`);
    dom.current = { why: q('why'), intro: q('intro'), orbit: q('orbit') };
  }, []);

  useFrame((st, raw) => {
    const bot = robot.current;
    const { why, intro, orbit: orbitEl } = dom.current;
    if (!bot || !why || !intro || !orbitEl) return;
    const dt = Math.min(raw, 0.05);
    const t = st.clock.elapsedTime;
    const m = mem.current;

    // a box in the page → feet position and height in the 3D world
    const unit = viewport.height / size.height;
    const box = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - size.width / 2) * unit, y: (size.height / 2 - r.bottom) * unit, h: r.height * unit, w: r.width * unit };
    };
    const A = box(why);
    const B = box(intro);
    const C = box(orbitEl);

    // how far along each leap we are
    const t1 = clamp01(1 - intro.closest('section')!.getBoundingClientRect().top / size.height);
    const t2 = clamp01(1 - orbitEl.closest('section')!.getBoundingClientRect().top / size.height);
    const e1 = easeInOutCubic(t1);
    const e2 = easeInOutCubic(t2);

    // the desk arrives with the page turn
    const shown = 'whyShown' in document.documentElement.dataset;
    if (shown && m.shownAt < 0) m.shownAt = t;
    if (!shown) m.shownAt = -1;
    const pop = shown ? backOut((t - m.shownAt - 0.1) / 0.9) : 0;
    const u = Math.min(A.h / 7.2, A.w / 8.4);
    desk.current.visible = pop > 0.001 && A.y < viewport.height;
    desk.current.position.set(A.x + (1 - pop) * 1.4, A.y - (1 - pop) * 1.6, 0);
    desk.current.scale.setScalar(Math.max(0.0001, u * pop));
    desk.current.updateMatrixWorld();
    seat.set(-2.15, 0.98, 0.55);
    desk.current.localToWorld(seat);

    // Bolt
    const kA = (u * 3.7) / ROBOT_HEIGHT;
    const kB = B.h / ROBOT_HEIGHT;
    const kC = C.h / ROBOT_HEIGHT;
    const g = bot.group;
    g.visible = pop > 0.001;
    const px = lerp(lerp(seat.x, B.x, e1), C.x, e2);
    const py = lerp(lerp(seat.y, B.y, e1), C.y, e2) + Math.sin(Math.PI * t1) * 0.9 + Math.sin(Math.PI * t2) * 0.5;
    const pz = lerp(seat.z, 0, e1);
    g.position.set(px, py, pz);
    g.scale.setScalar(Math.max(0.0001, lerp(lerp(kA, kB, e1), kC, e2) * Math.min(1, pop)));
    g.rotation.set(0.2 * (1 - e1), (1 - e1) * 0.95 + (e1 + e2) * Math.PI * 2, 0);

    const j1 = t1 > 0 && t1 < 1 ? Math.sin(Math.PI * t1) : 0;
    const j2 = t2 > 0 && t2 < 1 ? Math.sin(Math.PI * t2) : 0;
    const jump = Math.max(j1, j2);
    const sit = 1 - smooth(t1 * 3);
    if (t1 >= 0.999 && t2 <= 0.001) {
      if (m.arrivedAt < 0) {
        m.arrivedAt = t;
        bot.restart('Wave');
      }
    } else m.arrivedAt = -1;
    const wave = m.arrivedAt >= 0 ? Math.sin(Math.PI * clamp01((t - m.arrivedAt - 0.15) / 1.8)) : 0;
    const waveW = Math.min(0.92, wave * 1.6);
    bot.pose(
      dt,
      {
        Sitting: sit * 0.88,
        Jump: jump * 0.9 * (1 - sit),
        Wave: waveW,
        Idle: Math.max(0, 1 - sit * 0.88 - jump * 0.9 * (1 - sit) - waveW),
      },
      { Sitting: 1, Jump: j1 > 0 ? t1 : t2 },
    );

    const grounded = e1 * (1 - j2) * (1 - e2 * 0.5);
    shadow.current.position.set(px, lerp(B.y, C.y, e2) + 0.02, 0);
    shadow.current.scale.set(2.9 * lerp(kB, kC, e2), 1.5 * lerp(kB, kC, e2), 1);
    (shadow.current.material as THREE.MeshBasicMaterial).opacity = 0.2 * grounded;

    // the ring of work
    const appear = backOut((t2 - 0.55) / 0.45);
    ring.current.visible = appear > 0.001;
    if (!orbit.dragging) orbit.velocity *= Math.exp(-dt * 2.4);
    m.angle += (0.24 + orbit.velocity) * dt;
    ring.current.position.set(C.x, C.y + C.h * 0.6, 0);
    ring.current.rotation.set(0.36, m.angle, 0);
    ring.current.scale.setScalar(Math.max(0.0001, C.h * 0.52 * appear));
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight intensity={2.2} color="#fff4e2" position={[4, 7, 8]} />
      <directionalLight intensity={0.7} color="#cfe0f5" position={[-6, 2, 4]} />

      <group ref={desk} rotation={[0.2, 0, 0]}>
        <Workstation legs screen="code" position={[1.15, 2.75, 0]} rotation={[0, -0.75, 0]} scale={1.22} />
        <mesh position={[-2.15, 0.49, 0.55]}>
          <cylinderGeometry args={[0.72, 0.6, 0.98, 20]} />
          <meshStandardMaterial color="#26262b" roughness={0.7} />
        </mesh>
        <BlobShadow position={[0.3, 0.01, 0.2]} scale={2.3} opacity={0.16} />
      </group>

      <Robot ref={robot} />
      <BlobShadow ref={shadow} opacity={0} />

      <group ref={ring}>
        {Array.from({ length: CARDS }, (_, i) => {
          const a = (i / CARDS) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a), 0, Math.cos(a)]} rotation={[0, a, 0]}>
              <planeGeometry args={[0.66, 0.4125]} />
              <meshBasicMaterial map={covers[i % covers.length]} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function Actor() {
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  // Only alive between the page turn and the end of the work section.
  useEffect(() => {
    const check = () => {
      const turn = document.querySelector('[data-page-turn]');
      const work = document.getElementById('work');
      if (!turn || !work) return;
      const vh = window.innerHeight;
      const top = turn.getBoundingClientRect().top;
      const bottom = work.getBoundingClientRect().bottom;
      setNear(top < vh * 2.5 && bottom > -vh);
      setActive(top < vh * 0.5 && bottom > 0);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <Stage3D className="pointer-events-none fixed inset-0 z-[5]" style={{ visibility: active ? 'visible' : 'hidden' }} mounted={near} active={active}>
      <Scene />
    </Stage3D>
  );
}
