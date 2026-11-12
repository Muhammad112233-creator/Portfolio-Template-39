'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/scroll';
import s from './chrome.module.css';

/** Letters that roll over, one after another, when the parent link is hovered. */
export default function RollText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest('a, button');
    if (!el || !host || !window.matchMedia('(hover: hover)').matches) return;
    const letters = el.querySelectorAll('[data-l]');
    const roll = () => {
      gsap.fromTo(letters, { yPercent: 0 }, { yPercent: 100, duration: 0.55, ease: 'power3.inOut', stagger: 0.04, overwrite: true });
    };
    host.addEventListener('mouseenter', roll);
    return () => host.removeEventListener('mouseenter', roll);
  }, [text]);

  return (
    <span ref={ref} className={s.roll}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className={s.rollSpace} aria-hidden="true" />
        ) : (
          <span key={i} className={s.rollLetter} data-l aria-hidden="true">
            {ch}
            <span className={s.rollCopy}>{ch}</span>
          </span>
        ),
      )}
    </span>
  );
}
