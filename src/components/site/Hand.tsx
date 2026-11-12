import type { CSSProperties, ReactNode } from 'react';
import s from './chrome.module.css';

/** A note that writes itself in, left to right. Set `shown` when it should appear. */
export function Hand({ children, shown, delay = 0, className }: { children: ReactNode; shown: boolean; delay?: number; className?: string }) {
  return (
    <span className={`${s.hand} ${className ?? ''}`} data-in={shown ? '' : undefined} style={{ '--write-delay': `${delay}s` } as CSSProperties}>
      <span className={s.ink}>{children}</span>
    </span>
  );
}

/** A loose arrow that draws itself. `d` is any SVG path in a 56×48 box. */
export function DrawnArrow({
  shown,
  delay = 0,
  className,
  d = 'M52 6C34 4 14 12 8 38M8 38l-5-11M8 38l11-5',
  viewBox = '0 0 56 48',
  style,
}: {
  shown: boolean;
  delay?: number;
  className?: string;
  d?: string;
  viewBox?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`${s.drawn} ${className ?? ''}`}
      viewBox={viewBox}
      strokeWidth={1.6}
      aria-hidden="true"
      data-in={shown ? '' : undefined}
      style={{ '--draw-delay': `${delay}s`, ...style } as CSSProperties}
    >
      {d.split(/(?=M)/).map((seg, i) => (
        <path key={i} d={seg} pathLength={1} />
      ))}
    </svg>
  );
}
