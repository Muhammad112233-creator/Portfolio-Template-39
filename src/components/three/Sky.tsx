'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

/**
 * A painted sky in one fragment shader: three colour ramps (day, sunset,
 * night) mixed by uMix, drifting clouds from layered noise, and at night
 * stars plus three hanging curtains of aurora.
 */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uMix;
  uniform float uAspect;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      s += a * noise(p);
      p = p * 2.02 + vec2(11.3, 7.9);
      a *= 0.5;
    }
    return s;
  }
  vec3 ramp(vec3 top, vec3 mid, vec3 low, float y) {
    return y > 0.5 ? mix(mid, top, smoothstep(0.5, 1.0, y)) : mix(low, mid, smoothstep(0.0, 0.5, y));
  }

  vec3 aurora(vec2 p, float y, float t) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float x = p.x * (0.55 + fi * 0.2) + fi * 4.1;
      float ridge = fbm(vec2(x * 1.1 + t * 0.03, fi * 3.3 + t * 0.02));
      float top = 0.97 - fi * 0.27 + (ridge - 0.5) * 0.5;
      float below = top - y;
      float rays = 0.4 + 0.6 * noise(vec2(x * 17.0 + t * 0.15, fi * 7.0));
      float glow = exp(-pow(below / 0.1, 2.0));
      float trail = smoothstep(-0.02, 0.05, below) * exp(-below * (3.0 + fi)) * rays;
      float patchy = smoothstep(0.3, 0.62, fbm(vec2(x * 0.7 - t * 0.025, fi * 5.0 + 2.0)));
      acc += vec3(0.04, 0.9, 0.56) * (glow * 0.7 + trail) * patchy * (1.0 - fi * 0.2);
    }
    return acc;
  }

  void main() {
    float y = vUv.y;
    vec2 p = vec2(vUv.x * uAspect, y);

    vec3 day = ramp(vec3(0.47, 0.62, 0.84), vec3(0.66, 0.77, 0.89), vec3(0.87, 0.88, 0.9), y);
    vec3 dusk = ramp(vec3(0.38, 0.45, 0.66), vec3(0.72, 0.62, 0.66), vec3(0.94, 0.75, 0.58), y);
    vec3 dark = ramp(vec3(0.015, 0.05, 0.16), vec3(0.03, 0.1, 0.25), vec3(0.03, 0.07, 0.19), y);

    // clouds live on a flat ceiling seen in perspective: big overhead, small and
    // squashed toward the horizon, none in the haze at the bottom
    float inv = 1.0 / (y * 1.1 + 0.32);
    vec2 q = vec2((p.x - 0.5 * uAspect) * inv * 0.75, inv * 1.6) * 2.1 + vec2(uTime * 0.014, 0.0);
    float warp = fbm(q * 1.4 + vec2(0.0, uTime * 0.01));
    float d = fbm(q + warp * 0.6);
    float cover = smoothstep(0.5, 0.7, d) * smoothstep(0.05, 0.4, y);
    float core = smoothstep(0.5, 0.86, d);
    float shade = fbm(q * 2.3 + 4.0);

    vec3 dayCloud = mix(vec3(0.84, 0.83, 0.9), vec3(1.0), core) - 0.05 * shade;
    dayCloud = mix(dayCloud, vec3(0.98, 0.9, 0.93), 0.3 * smoothstep(0.35, 1.0, vUv.x));
    vec3 duskCloud = mix(vec3(0.55, 0.43, 0.56), vec3(1.0, 0.68, 0.6), core) + 0.05 * shade;

    vec3 sky = day * uMix.x + dusk * uMix.y + dark * uMix.z;
    vec3 cloud = dayCloud * uMix.x + duskCloud * uMix.y + vec3(0.05, 0.1, 0.2) * uMix.z;
    vec3 col = mix(sky, cloud, cover * (uMix.x * 0.92 + uMix.y * 0.9));

    if (uMix.z > 0.001) {
      vec2 g = gl_FragCoord.xy / 2.6;
      float h = hash(floor(g));
      float star = step(0.9962, h) * (0.6 + 0.4 * sin(uTime * 2.0 + h * 90.0)) * smoothstep(0.95, 0.15, length(fract(g) - 0.5) * 2.0);
      col += vec3(0.85, 0.92, 1.0) * star * uMix.z * smoothstep(0.08, 0.45, y);
      col += aurora(p, y, uTime) * uMix.z;
    }

    col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.014;
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Mix = [number, number, number];

/** Fills the whole canvas, behind everything else in the scene. */
export default function Sky({ mix }: { mix: Mix | (() => Mix) }) {
  const material = useRef<THREE.ShaderMaterial>(null!);
  const size = useThree((s) => s.size);
  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 40 },
      uMix: { value: new THREE.Vector3(1, 0, 0) },
      uAspect: { value: 1.6 },
    }),
    [],
  );

  useFrame((_, dt) => {
    const u = material.current.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uAspect.value = size.width / size.height;
    const m = typeof mix === 'function' ? mix() : mix;
    u.uMix.value.set(m[0], m[1], m[2]);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} depthTest={false} depthWrite={false} />
    </mesh>
  );
}
