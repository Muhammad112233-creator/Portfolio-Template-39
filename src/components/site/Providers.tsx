'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, registerGsap, ScrollTrigger, setLenis } from '@/lib/scroll';
import { initSound, play, preloadSounds } from '@/lib/sound';
import { setState } from '@/lib/store';
import Cursor from './Cursor';
import NavBar from './NavBar';
import Ribbon from './Ribbon';
import { TransitionProvider } from './Transition';

/** Smooth scrolling, wired into GSAP so pinned scenes stay in step. */
function useSmoothScroll() {
  useEffect(() => {
    registerGsap();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.4 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

/** A tick on every press, and buttons that lean toward the pointer. */
function useMicroInteractions() {
  useEffect(() => {
    initSound();
    let primed = false;
    const down = (e: PointerEvent) => {
      if (!primed) {
        primed = true;
        preloadSounds();
      }
      if ((e.target as Element | null)?.closest?.('a, button, [role="button"], summary')) play('click');
    };
    window.addEventListener('pointerdown', down);

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const armed = new WeakSet<Element>();
    const over = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnetic]');
      if (!el || armed.has(el)) return;
      armed.add(el);
      const strength = parseFloat(el.dataset.magnetic || '0.2') || 0.2;
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        x((ev.clientX - (r.left + r.width / 2)) * strength * 2);
        y((ev.clientY - (r.top + r.height / 2)) * strength * 2);
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true });
      });
    };
    if (fine) document.addEventListener('mouseover', over);

    return () => {
      window.removeEventListener('pointerdown', down);
      document.removeEventListener('mouseover', over);
    };
  }, []);
}

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useSmoothScroll();
  useMicroInteractions();

  // Inner pages have no intro, so the nav can show straight away.
  useEffect(() => {
    const home = pathname === '/' || pathname === '';
    if (!home) setState({ ready: true });
  }, [pathname]);

  return (
    <TransitionProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Cursor />
      <NavBar />
      <Ribbon />
      {children}
    </TransitionProvider>
  );
}
