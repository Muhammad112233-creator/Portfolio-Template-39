'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { clamp01 } from '@/lib/math';
import { gsap, registerGsap, scrollToY } from '@/lib/scroll';
import s from './PageTurn.module.css';

type Pt = [number, number];

/** Keep the part of a polygon on one side of the line  p·d = c. */
function cut(points: Pt[], dx: number, dy: number, c: number, keepAhead: boolean): Pt[] {
  const side = ([x, y]: Pt) => (keepAhead ? 1 : -1) * (x * dx + y * dy - c);
  const out: Pt[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const sa = side(a);
    const sb = side(b);
    if (sa >= 0) out.push(a);
    if (sa >= 0 !== sb >= 0) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

const polygon = (pts: Pt[]) => (pts.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`);

/**
 * The sky is a page, and this turns it.
 *
 * The section inside sits pinned underneath the hero. As you scroll through
 * the last screen of the hero, a crease sweeps from the bottom-right corner
 * to the top-left: everything past the crease is cut out of the hero, and
 * the lifted part is drawn folded back over it (mirrored across the crease,
 * minus the strip that is wrapped around the curl).
 */
export default function PageTurn({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const flapHolder = useRef<HTMLDivElement>(null);
  const flap = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    const stage = document.getElementById('hero-stage');
    if (!el || !stage || !flap.current || !flapHolder.current || !shade.current) return;
    const root = document.documentElement;
    const flapEl = flap.current;
    const holder = flapHolder.current;
    const shadeEl = shade.current;

    let W = 0, H = 0, L = 1, top = 0;
    const measure = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      L = Math.hypot(W, H);
      top = el.getBoundingClientRect().top + window.scrollY;
      last = -1;
    };
    let last = -1;

    const draw = () => {
      const p = clamp01((window.scrollY - top) / H);
      const e = Math.min(1, p / 0.82);
      if (e === last) return;
      last = e;

      if (e > 0.0005) root.dataset.whyShown = '';
      if (e > 0.6) delete root.dataset.navSolid;
      else root.dataset.navSolid = '';

      const turning = e > 0.0005 && e < 0.9995;
      holder.style.visibility = shadeEl.style.visibility = turning ? 'visible' : 'hidden';
      if (!turning) {
        stage.style.clipPath = '';
        stage.style.visibility = e >= 0.9995 ? 'hidden' : '';
        delete root.dataset.turning;
        return;
      }
      root.dataset.turning = '';
      stage.style.visibility = '';

      // the crease, measured along the diagonal from the top-left corner
      const dx = W / L, dy = H / L;
      const c = L + (-0.42 * H - L) * e;
      const curl = 0.12 * Math.PI * H;
      const page: Pt[] = [[0, 0], [W, 0], [W, H], [0, H]];

      stage.style.clipPath = polygon(cut(page, dx, dy, c, false));

      const lifted = cut(page, dx, dy, c + curl, true);
      const folded = lifted.map<Pt>(([x, y]) => {
        const k = 2 * (x * dx + y * dy - c) - curl;
        return [x - dx * k, y - dy * k];
      });
      flapEl.style.clipPath = polygon(folded);

      const deg = (Math.atan2(W, -H) * 180) / Math.PI;
      const depth = Math.max(60, L - c - curl);
      flapEl.style.background = `linear-gradient(${deg}deg, #c3d0e0 ${c - depth}px, #e6ecf3 ${c - depth * 0.5}px, #ffffff ${c - Math.min(90, depth * 0.3)}px, #cfd8e4 ${c}px)`;
      shadeEl.style.background = `linear-gradient(${deg}deg, rgba(12,16,24,0) ${c - 1}px, rgba(12,16,24,0.26) ${c}px, rgba(12,16,24,0.08) ${c + H * 0.07}px, rgba(12,16,24,0) ${c + H * 0.2}px)`;
    };

    // Do not leave the page half turned: after a pause, finish it either way.
    let idle = 0;
    let lastY = window.scrollY;
    let dir = 1;
    const settle = () => {
      const p = (window.scrollY - top) / H;
      if (p <= 0.004 || p >= 0.82) return;
      const e = p / 0.82;
      const forward = dir > 0 ? e > 0.3 : e > 0.7;
      scrollToY(top + (forward ? H * 0.84 : 0), 0.9);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 450);
    };

    measure();
    gsap.ticker.add(draw);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    const late = window.setTimeout(measure, 600);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
      window.clearTimeout(late);
      stage.style.clipPath = '';
      stage.style.visibility = '';
      delete root.dataset.turning;
      delete root.dataset.whyShown;
    };
  }, []);

  return (
    <>
      <div ref={wrap} className={s.wrap} data-page-turn>
        <div className={s.pin}>{children}</div>
      </div>
      <div ref={shade} className={s.shade} aria-hidden="true" />
      <div ref={flapHolder} className={s.flapHolder} aria-hidden="true">
        <div ref={flap} className={s.flap} />
      </div>
    </>
  );
}
