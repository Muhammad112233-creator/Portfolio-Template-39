'use client';

import { forwardRef, useMemo, type ComponentProps } from 'react';
import * as THREE from 'three';

/* Cheap, repeatable 3D value noise (no dependency, same result every load). */
function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const f = (t: number) => t * t * (3 - 2 * t);
  const xf = f(x - xi), yf = f(y - yi), zf = f(z - zi);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return mix(
    mix(mix(c(0, 0, 0), c(1, 0, 0), xf), mix(c(0, 1, 0), c(1, 1, 0), xf), yf),
    mix(mix(c(0, 0, 1), c(1, 0, 1), xf), mix(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  );
}

const MOSS = new THREE.Color('#7d9647');
const MOSS_DARK = new THREE.Color('#566b32');
const STONE = new THREE.Color('#8a7765');
const STONE_DARK = new THREE.Color('#54463b');

/**
 * A floating island: a ball of rock, flattened on top and pulled to a point
 * underneath, mossy wherever the surface faces the sky.
 * Local origin is the middle of the top surface.
 */
function islandGeometry(seed: number, depth: number, flip: boolean) {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = noise3(v.x * 1.6 + seed, v.y * 1.6 + seed * 0.3, v.z * 1.6) - 0.5;
    const n2 = noise3(v.x * 4.2 + seed, v.y * 4.2, v.z * 4.2 + seed) - 0.5;
    const spread = 1 + n * 0.55 + n2 * 0.12;
    const flat = Math.hypot(v.x, v.z);
    let y = v.y;
    if (y > 0) y = y * 0.16 + n2 * 0.05;
    else y = y * depth * (1.15 - flat * 0.45) + n * 0.25 * -y;
    pos.setXYZ(i, v.x * spread, flip ? -y : y, v.z * spread);
  }
  geo.computeVertexNormals();
  const normal = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const up = normal.getY(i);
    const grain = noise3(pos.getX(i) * 3 + seed, pos.getY(i) * 3, pos.getZ(i) * 3);
    if (up > 0.45) c.copy(MOSS_DARK).lerp(MOSS, grain);
    else c.copy(STONE_DARK).lerp(STONE, Math.min(1, grain * 0.9 + Math.max(0, up + 0.6) * 0.5));
    c.toArray(colors, i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

type IslandProps = ComponentProps<'group'> & { seed?: number; depth?: number; flip?: boolean };

export const Island = forwardRef<THREE.Group, IslandProps>(function Island({ seed = 1, depth = 1.5, flip = false, ...rest }, ref) {
  const geometry = useMemo(() => islandGeometry(seed, depth, flip), [seed, depth, flip]);
  return (
    <group ref={ref} {...rest}>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
});

/** A small boulder to sit on. Origin at the bottom. */
export const Boulder = forwardRef<THREE.Group, ComponentProps<'group'> & { seed?: number }>(function Boulder({ seed = 5, ...rest }, ref) {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const k = 1 + (noise3(x * 1.8 + seed, y * 1.8, z * 1.8) - 0.5) * 0.5;
      pos.setXYZ(i, x * k * 1.15, (y * k + 1) * 0.5, z * k);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
  return (
    <group ref={ref} {...rest}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#cdbfa9" flatShading roughness={1} />
      </mesh>
    </group>
  );
});

/** Draw a glowing "website" for a screen: a few blocks of colour, nothing readable. */
function screenTexture(kind: 'code' | 'glow') {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 160;
  const g = c.getContext('2d')!;
  if (kind === 'glow') {
    const bg = g.createLinearGradient(0, 0, 256, 160);
    bg.addColorStop(0, '#2a0b5e');
    bg.addColorStop(0.5, '#c026d3');
    bg.addColorStop(1, '#ff7ab8');
    g.fillStyle = bg;
    g.fillRect(0, 0, 256, 160);
    g.fillStyle = 'rgba(255,255,255,.9)';
    g.fillRect(22, 26, 96, 12);
    g.fillRect(22, 46, 140, 12);
    g.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i < 4; i++) g.fillRect(22, 76 + i * 12, 70 + ((i * 37) % 60), 5);
    g.fillStyle = '#dde4c3';
    g.fillRect(22, 132, 54, 14);
  } else {
    g.fillStyle = '#12151c';
    g.fillRect(0, 0, 256, 160);
    const ink = ['#7dd3fc', '#f0abfc', '#bef264', '#fca5a5', '#e5e7eb'];
    for (let i = 0; i < 13; i++) {
      let x = 14 + (i % 4 === 0 ? 0 : 12) + (i % 3 === 2 ? 12 : 0);
      for (let j = 0; j < 4; j++) {
        const w = 14 + ((i * 31 + j * 17) % 44);
        g.fillStyle = ink[(i + j * 2) % ink.length];
        g.fillRect(x, 12 + i * 11, w, 4);
        x += w + 6;
        if (x > 210) break;
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** An open laptop. Origin under the middle of the base; the screen faces +z. */
export const Notebook = forwardRef<THREE.Group, ComponentProps<'group'> & { open?: number }>(function Notebook({ open = 1.9, ...rest }, ref) {
  const map = useMemo(() => screenTexture('code'), []);
  return (
    <group ref={ref} {...rest}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.3, 0.06, 0.9]} />
        <meshStandardMaterial color="#d9d6cf" roughness={0.4} metalness={0.3} />
      </mesh>
      <group position={[0, 0.06, -0.45]} rotation={[Math.PI / 2 - open, 0, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.3, 0.9, 0.05]} />
          <meshStandardMaterial color="#e6e2da" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.45, 0.027]}>
          <planeGeometry args={[1.18, 0.78]} />
          <meshBasicMaterial map={map} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
});

/**
 * A floating desk with a monitor and a PC tower. Origin at the middle of the
 * plank's top surface.
 */
export const Workstation = forwardRef<THREE.Group, ComponentProps<'group'> & { legs?: boolean; screen?: 'code' | 'glow' }>(function Workstation(
  { legs = false, screen = 'glow', ...rest },
  ref,
) {
  const map = useMemo(() => screenTexture(screen), [screen]);
  return (
    <group ref={ref} {...rest}>
      {/* plank */}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[3.6, 0.14, 1.5]} />
        <meshStandardMaterial color="#e9dcc3" roughness={0.8} />
      </mesh>
      {legs &&
        [
          [-1.65, -0.6],
          [1.65, -0.6],
          [-1.65, 0.6],
          [1.65, 0.6],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -1.14, z]}>
            <boxGeometry args={[0.12, 2, 0.12]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.6} />
          </mesh>
        ))}
      {/* monitor */}
      <mesh position={[-0.35, 0.03, -0.2]}>
        <boxGeometry args={[0.7, 0.06, 0.4]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.3, -0.25]}>
        <boxGeometry args={[0.1, 0.5, 0.08]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.95, -0.2]}>
        <boxGeometry args={[1.9, 1.15, 0.08]} />
        <meshStandardMaterial color="#17171a" roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.95, -0.155]}>
        <planeGeometry args={[1.78, 1.03]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      {/* tower */}
      <mesh position={[1.25, 0.65, -0.1]}>
        <boxGeometry args={[0.6, 1.3, 1.1]} />
        <meshStandardMaterial color="#1b1b1f" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[1.25, 0.65, 0.455]}>
        <planeGeometry args={[0.42, 1.1]} />
        <meshBasicMaterial color="#ff5fb0" toneMapped={false} />
      </mesh>
      {/* keyboard */}
      <mesh position={[-0.35, 0.03, 0.42]}>
        <boxGeometry args={[1.1, 0.05, 0.36]} />
        <meshStandardMaterial color="#26262b" roughness={0.6} />
      </mesh>
    </group>
  );
});

/** Soft round shadow to ground a character on a white page. */
export const BlobShadow = forwardRef<THREE.Mesh, ComponentProps<'mesh'> & { scale?: number; opacity?: number }>(function BlobShadow(
  { scale = 1, opacity = 0.22, ...rest },
  ref,
) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, 'rgba(20,20,20,1)');
    grad.addColorStop(1, 'rgba(20,20,20,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} scale={[3.2 * scale, 1.9 * scale, 1]} {...rest}>
      <planeGeometry />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
});
