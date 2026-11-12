'use client';

import { Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { isLowEnd } from '@/lib/device';

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Take over from the built-in observers: mount / draw only when told. */
  mounted?: boolean;
  active?: boolean;
  /** Mount the canvas this far before it scrolls into view. */
  margin?: string;
  fov?: number;
  z?: number;
  /** Listen for pointer events on another element (the canvas itself ignores them). */
  eventSource?: HTMLElement | null;
  onReady?: () => void;
};

/**
 * One WebGL canvas for one part of the page. It is only created when its
 * place on the page is near the viewport and it stops drawing when it
 * leaves, so a long page never runs more than a canvas or two at a time.
 */
export default function Stage3D({ children, className, style, mounted, active, margin = '60%', fov = 45, z = 10, eventSource, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const [low] = useState(() => isLowEnd());

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: `${margin} 0px ${margin} 0px` });
    const live = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { rootMargin: '5% 0px 5% 0px' });
    io.observe(el);
    live.observe(el);
    return () => {
      io.disconnect();
      live.disconnect();
    };
  }, [margin]);

  return (
    <div ref={wrap} className={className} style={style} aria-hidden="true">
      {(mounted ?? near) && (
        <Canvas
          flat
          dpr={low ? 1 : [1, 1.75]}
          frameloop={(active ?? seen) ? 'always' : 'never'}
          gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov, position: [0, 0, z], near: 0.1, far: 100 }}
          eventSource={eventSource ?? undefined}
          eventPrefix={eventSource ? 'client' : undefined}
          style={{ pointerEvents: 'none' }}
          onCreated={() => onReady?.()}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
