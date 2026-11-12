'use client';

import { useEffect, useRef } from 'react';
import TLink from '@/components/site/TLink';
import { featured } from '@/content/projects';
import { home } from '@/content/site';
import { orbit } from './orbit';
import s from './WorkOrbit.module.css';

/** Bolt up close, with the latest projects circling him. Drag to spin them. */
export default function WorkOrbit() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let lastX = 0;
    let lastT = 0;
    const down = (e: PointerEvent) => {
      orbit.dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!orbit.dragging) return;
      const now = performance.now();
      const dt = Math.max(8, now - lastT) / 1000;
      orbit.velocity = ((e.clientX - lastX) / window.innerWidth) * 3.2 / dt;
      lastX = e.clientX;
      lastT = now;
    };
    const up = () => {
      orbit.dragging = false;
      el.style.cursor = '';
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <section className={`${s.section} col-lines`} id="work" aria-labelledby="work-title" data-lines-in="">
      <div className={s.pin}>
        <div ref={stage} className={s.stage} data-cursor="Drag">
          {/* where Bolt stands, far too close (see Actor.tsx) */}
          <div className={s.mark} data-actor="orbit" aria-hidden="true" />
          <h2 className={s.title} id="work-title">
            {home.work.title}
            <i className={s.period} />
          </h2>
        </div>
      </div>
      <div className={s.room}>
        <div className={s.more}>
          <p className={s.moreText}>{home.work.left}</p>
          <TLink className="btn" href="/work">
            {home.work.cta}
          </TLink>
        </div>
        <ul className="sr-only" aria-label="Projects">
          {featured.map((p) => (
            <li key={p.slug}>
              <TLink href={`/work/${p.slug}`}>
                {p.name}, {p.year}
              </TLink>
            </li>
          ))}
        </ul>
        <p className={`${s.moreText} ${s.moreRight}`}>{home.work.right}</p>
      </div>
    </section>
  );
}
