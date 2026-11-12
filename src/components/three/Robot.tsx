'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ComponentProps } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { asset } from '@/lib/asset';
import { damp } from '@/lib/math';

export const ROBOT_URL = asset('/models/robot.glb');
/** Height of the model in its own units, feet at y = 0. */
export const ROBOT_HEIGHT = 4.77;

export type ClipName =
  | 'Dance'
  | 'Death'
  | 'Idle'
  | 'Jump'
  | 'No'
  | 'Punch'
  | 'Running'
  | 'Sitting'
  | 'Standing'
  | 'ThumbsUp'
  | 'Walking'
  | 'WalkJump'
  | 'Wave'
  | 'Yes';

export type Pose = Partial<Record<ClipName, number>>;

export type RobotApi = {
  group: THREE.Group;
  /**
   * Blend clips by weight (they should add up to about 1).
   * A clip listed in `scrub` is frozen at that position (0..1) instead of
   * playing, which is how scroll drives one-off moves such as Jump.
   */
  pose: (dt: number, weights: Pose, scrub?: Pose) => void;
  /** Rewind a free-running clip (a wave should start at its beginning). */
  restart: (name: ClipName) => void;
  /** 0..1 on one of the head's blend shapes. */
  face: (name: 'Angry' | 'Surprised' | 'Sad', amount: number) => void;
};

type Props = ComponentProps<'group'>;

/**
 * Bolt. The model is "RobotExpressive" by Tomás Laulhé (CC0), which ships
 * with fourteen animation clips; every scene on the site is built from them.
 * Swap public/models/robot.glb for your own rigged character and adjust the
 * clip names above.
 */
const Robot = forwardRef<RobotApi, Props>(function Robot(props, ref) {
  const gltf = useGLTF(ROBOT_URL);
  const group = useRef<THREE.Group>(null!);
  const weights = useRef<Record<string, number>>({});

  const { scene, mixer, actions, heads } = useMemo(() => {
    const scene = cloneSkinned(gltf.scene) as THREE.Group;
    const heads: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      if (mesh.morphTargetDictionary) heads.push(mesh);
    });
    const mixer = new THREE.AnimationMixer(scene);
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of gltf.animations) {
      const action = mixer.clipAction(clip);
      action.setEffectiveWeight(0);
      action.play();
      actions[clip.name] = action;
    }
    return { scene, mixer, actions, heads };
  }, [gltf]);

  useEffect(
    () => () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    },
    [mixer, scene],
  );

  useImperativeHandle(
    ref,
    () => ({
      get group() {
        return group.current;
      },
      pose(dt, target, scrub) {
        for (const name in actions) {
          const action = actions[name];
          const want = target[name as ClipName] ?? 0;
          const now = weights.current[name] ?? 0;
          const next = Math.abs(want - now) < 0.002 ? want : damp(now, want, 14, dt);
          weights.current[name] = next;
          action.setEffectiveWeight(next);
          const at = scrub?.[name as ClipName];
          if (at !== undefined) {
            action.timeScale = 0;
            action.time = Math.min(Math.max(at, 0), 0.995) * action.getClip().duration;
          } else {
            action.timeScale = 1;
          }
        }
        mixer.update(dt);
      },
      restart(name) {
        const action = actions[name];
        if (action) action.time = 0;
      },
      face(name, amount) {
        for (const head of heads) {
          const i = head.morphTargetDictionary?.[name];
          if (i !== undefined && head.morphTargetInfluences) head.morphTargetInfluences[i] = amount;
        }
      },
    }),
    [actions, mixer, heads],
  );

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
});

export default Robot;

useGLTF.preload(ROBOT_URL);
