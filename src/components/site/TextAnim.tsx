'use client';

import { createElement, useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { gsap, registerGsap, SplitText } from '@/lib/scroll';

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  /** 'scroll' reveals when it enters the viewport; a boolean reveals on demand. */
  play?: 'scroll' | boolean;
  delay?: number;
  stagger?: number;
};

/** Splits the text into lines and lets each one rise from behind a mask. */
export default function TextAnim({ as = 'p', children, play = 'scroll', delay = 0, stagger = 0.09, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const wanted = useRef(play);
  wanted.current = play;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.visibility = 'visible';
      return;
    }
    registerGsap();
    let split: SplitText | null = null;
    let dead = false;

    const make = () => {
      if (dead) return;
      split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit: (self) => {
          el.style.visibility = 'visible';
          const scroll = wanted.current === 'scroll';
          tween.current = gsap.from(self.lines, {
            yPercent: 135,
            duration: 1.05,
            ease: 'power4.out',
            stagger,
            delay,
            paused: !scroll && wanted.current !== true,
            scrollTrigger: scroll ? { trigger: el, start: 'top 88%', once: true } : undefined,
          });
          return tween.current;
        },
      });
    };

    // Lines are measured, so wait for the real font.
    if (document.fonts?.status === 'loaded') make();
    else document.fonts.ready.then(make);

    return () => {
      dead = true;
      tween.current?.scrollTrigger?.kill();
      tween.current?.kill();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (play === true) tween.current?.play();
  }, [play]);

  return createElement(as, { ref, style: { visibility: 'hidden' }, ...rest }, children);
}
