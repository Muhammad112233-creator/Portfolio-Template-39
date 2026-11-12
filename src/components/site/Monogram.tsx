import type { CSSProperties } from 'react';
import s from './chrome.module.css';
import { site } from '@/content/site';

/**
 * The mark: a blocky "R" with a full stop. Four loose pieces, so it can
 * assemble itself on load and breathe apart on hover.
 * Replace the shapes with your own initial; keep the --order / --dx / --dy
 * variables and the motion comes for free.
 */
const pieces: { d: string; order: number; dx: number; dy: number }[] = [
  { d: 'M24 24h72v252H24z', order: 0, dx: -1, dy: 0 },
  { d: 'M110 24h58a72 72 0 0 1 0 144h-58v-56h54a16 16 0 0 0 0-32h-54z', order: 1, dx: 0.5, dy: -1 },
  { d: 'M110 180h70l72 96h-70z', order: 2, dx: 0.4, dy: 1 },
  { d: 'M268 224a26 26 0 1 1 0 52a26 26 0 0 1 0-52z', order: 3, dx: 1, dy: 0.5 },
];

export default function Monogram({ className, title = site.name, still = false }: { className?: string; title?: string; still?: boolean }) {
  return (
    <svg className={`${s.mark} ${className ?? ''}`} viewBox="0 0 300 300" fill="currentColor" role="img" aria-label={title}>
      {pieces.map((p) => (
        <path
          key={p.order}
          d={p.d}
          className={still ? undefined : s.piece}
          style={{ '--order': p.order, '--dx': p.dx, '--dy': p.dy } as CSSProperties}
        />
      ))}
    </svg>
  );
}
