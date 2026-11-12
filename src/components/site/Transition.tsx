'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, jumpToTop, registerGsap, ScrollTrigger } from '@/lib/scroll';
import { play } from '@/lib/sound';
import Monogram from './Monogram';

type Go = (href: string) => void;
const Ctx = createContext<Go>(() => {});
export const useGo = () => useContext(Ctx);

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

/**
 * Page changes hide behind four dark columns: they drop in, the route
 * swaps underneath, and they fall away again.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const state = useRef<'idle' | 'covering' | 'waiting'>('idle');
  const failsafe = useRef<number>(0);

  const reveal = useCallback(() => {
    const el = cover.current;
    if (!el || state.current === 'idle') return;
    state.current = 'idle';
    window.clearTimeout(failsafe.current);
    const main = document.getElementById('main-content');
    main?.classList.add('pt-arrive');
    window.setTimeout(() => main?.classList.remove('pt-arrive'), 1400);
    gsap.to(el.children, {
      yPercent: 101,
      duration: 0.56,
      stagger: 0.07,
      ease: 'power4.inOut',
      onComplete: () => {
        delete el.dataset.on;
        gsap.set(el.children, { yPercent: -101 });
      },
    });
  }, []);

  const go = useCallback<Go>(
    (href) => {
      const el = cover.current;
      const [path, hash] = href.split('#');
      if (clean(path || '/') === clean(pathname)) {
        const target = hash ? document.getElementById(hash) : null;
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (!el || state.current !== 'idle') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(href);
        return;
      }
      registerGsap();
      state.current = 'covering';
      el.dataset.on = '';
      play('whoosh', 0.3);
      router.prefetch(href);
      gsap.fromTo(
        el.children,
        { yPercent: -101 },
        {
          yPercent: 0,
          duration: 0.56,
          stagger: 0.07,
          ease: 'power4.inOut',
          onComplete: () => {
            state.current = 'waiting';
            router.push(href);
            // Never leave the visitor behind a closed curtain.
            failsafe.current = window.setTimeout(reveal, 5000);
          },
        },
      );
    },
    [pathname, router, reveal],
  );

  // The new route has rendered: go to the top and lift the cover.
  useEffect(() => {
    jumpToTop();
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      reveal();
    }, 180);
    return () => window.clearTimeout(id);
  }, [pathname, reveal]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={cover} className="pt-cover" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i}>
            <Monogram className="pt-mark" still />
          </i>
        ))}
      </div>
    </Ctx.Provider>
  );
}
