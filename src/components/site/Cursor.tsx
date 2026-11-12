'use client';

import { useEffect, useRef } from 'react';
import s from './chrome.module.css';

/**
 * A white disc that trails the pointer and inverts whatever is under it.
 * It grows over links and shows a word over anything with data-cursor="…".
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const root = document.documentElement;

    const setState = (target: Element | null) => {
      const tagged = target?.closest<HTMLElement>('[data-cursor]');
      const field = target?.closest('input, textarea, select');
      const link = target?.closest('a, button, [role="button"], summary, label');
      let state = '';
      if (tagged) {
        state = 'label';
        if (label.current) label.current.textContent = tagged.dataset.cursor || '';
      } else if (field) state = 'text';
      else if (link) state = 'link';
      if (el.dataset.state !== state) {
        el.dataset.state = state;
        if (state === 'label') root.dataset.dot = 'none';
        else if (state === 'link') root.dataset.dot = 'small';
        else delete root.dataset.dot;
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      el.style.translate = `${e.clientX}px ${e.clientY}px`;
      el.dataset.on = '';
      setState(e.target as Element | null);
    };
    const down = () => (el.dataset.down = '');
    const up = () => delete el.dataset.down;
    const leave = () => delete el.dataset.on;

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('mouseleave', leave);
      delete root.dataset.dot;
    };
  }, []);

  return (
    <div ref={ref} className={s.cursor} aria-hidden="true">
      <div className={s.cursorDisc}>
        <span ref={label} />
      </div>
    </div>
  );
}
