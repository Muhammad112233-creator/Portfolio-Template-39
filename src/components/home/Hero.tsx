'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { DrawnArrow, Hand } from '@/components/site/Hand';
import TextAnim from '@/components/site/TextAnim';
import { home, site } from '@/content/site';
import { asset } from '@/lib/asset';
import { isNarrowStage, isSoftwareGL, VIEW_UNITS } from '@/lib/device';
import { beat } from '@/lib/math';
import { gsap, lockScroll, registerGsap, ScrollTrigger } from '@/lib/scroll';
import { phaseAt, rushTo, SKY_ORDER, skyClock, tickSky, type SkyPhase } from '@/lib/sky';
import { setState } from '@/lib/store';
import { BEATS, INTRO, PUSH_GAP, pushFrac, TAIL, type HeroStory } from './heroStory';
import s from './Hero.module.css';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const icons: Record<SkyPhase, React.ReactNode> = {
  day: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  sunset: (
    <>
      <path d="M12 10V3M8.5 6.5 12 10l3.5-3.5" />
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M2 18h20M5 22h14" />
    </>
  ),
  night: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />,
};

type Stage = 'boot' | 'intro' | 'live';

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const story = useRef<HeroStory>({ r: 0, intro: -1, narrow: false }).current;
  const [mode, setMode] = useState<'pending' | '3d' | 'lite'>('pending');
  const [stage, setStage] = useState<Stage>('boot');
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [headline, setHeadline] = useState(false);
  const [phase, setPhase] = useState<SkyPhase>('day');
  const [out, setOut] = useState(false);
  const [noteOn, setNoteOn] = useState(false);

  const knob = useRef<HTMLSpanElement>(null);
  const dial = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLParagraphElement>(null);

  // 3D if there is a real GPU, a still picture if not.
  useEffect(() => {
    const lite = isSoftwareGL();
    setMode(lite ? 'lite' : '3d');
    if (lite) {
      const img = new Image();
      img.onload = img.onerror = () => setLoaded(true);
      img.src = asset('/images/hero-lite.webp');
    }
    setState({ ready: false });
    lockScroll(true);
    const failsafe = window.setTimeout(() => setLoaded(true), 9000);
    return () => {
      window.clearTimeout(failsafe);
      setState({ ready: true });
    };
  }, []);

  // Loader counter: creeps to 85 while things load, then runs to 100.
  useEffect(() => {
    if (stage !== 'boot') return;
    let shown = 0;
    const started = performance.now();
    const id = window.setInterval(() => {
      const creep = 85 * (1 - Math.exp(-(performance.now() - started) / 1400));
      const target = loaded ? 100 : creep;
      shown = Math.min(100, shown + Math.max(1, (target - shown) * 0.2));
      if (!loaded) shown = Math.min(shown, creep);
      setCount(Math.round(shown));
      if (loaded && shown >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => setStage('intro'), 250);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [loaded, stage]);

  // The intro: islands glide in, Bolt drops onto his seat, the words arrive.
  useEffect(() => {
    if (stage !== 'intro') return;
    const started = performance.now();
    const clock = () => {
      story.intro = (performance.now() - started) / 1000;
    };
    gsap.ticker.add(clock);
    const finish = () => {
      setHeadline(true);
      setNoteOn(true);
      setState({ ready: true });
      setStage('live');
    };
    const timers = [
      window.setTimeout(() => setHeadline(true), INTRO.headlineAt * 1000),
      window.setTimeout(() => setState({ ready: true }), INTRO.navAt * 1000),
      window.setTimeout(finish, INTRO.done * 1000),
    ];
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('keydown', skip);
      window.setTimeout(() => gsap.ticker.remove(clock), 4000);
    };
  }, [stage, story]);

  useEffect(() => {
    if (stage !== 'live') return;
    lockScroll(false);
    const id = window.setTimeout(() => setNoteOn(true), 300);
    return () => window.clearTimeout(id);
  }, [stage]);

  // Scroll drives the story; a ticker drives the sky.
  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const root = document.documentElement;
    const letters = Array.from(name.current?.querySelectorAll<HTMLElement>('[data-letter]') ?? []);
    let edges: number[] = [];
    let unit = 100;
    const measure = () => {
      story.narrow = isNarrowStage();
      edges = letters.map((l) => l.getBoundingClientRect().right);
      const worldW = (window.innerWidth / window.innerHeight) * VIEW_UNITS;
      unit = (window.innerHeight / VIEW_UNITS) * Math.min(1, worldW / 11.5);
    };
    measure();

    const apply = (p: number) => {
      const narrow = story.narrow;
      const r = narrow ? Math.min(1, p * 3) : Math.min(1, (p * 2.7) / 2);
      const a = narrow ? 0 : Math.min(1, Math.max(0, (p * 2.7 - 2) / 0.7));
      story.r = r;
      setOut(r > (narrow ? 0.5 : BEATS.heroHold[0]));
      setNoteOn((was) => (r > 0.03 ? false : was));
      if (dial.current) {
        const o = 1 - beat(r, narrow ? [0.4, 0.8] : BEATS.heroHold);
        dial.current.style.opacity = String(o);
        dial.current.style.pointerEvents = o < 0.5 ? 'none' : '';
      }
      if (narrow) return;
      // letters show once Bolt's back has passed them
      const back = window.innerWidth * (0.5 + pushFrac(r)) - (PUSH_GAP + 1.05) * unit;
      const begun = r >= BEATS.push[0];
      letters.forEach((l, i) => (l.style.opacity = begun && edges[i] < back ? '1' : '0'));
      if (name.current) name.current.style.opacity = String(beat(r, BEATS.nameFade) * (1 - beat(a, TAIL.nameOut)));
      if (line.current) line.current.style.opacity = String(beat(a, TAIL.lineIn));
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${story.narrow ? window.innerHeight * 0.5 : window.innerHeight * 2.7}`,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
    });

    let last: SkyPhase | '' = '';
    const tick = (_t: number, delta: number) => {
      const visible = el.getBoundingClientRect().bottom > 0;
      if (!visible) {
        if (last) {
          last = '';
          delete root.dataset.sky;
        }
        return;
      }
      const u = tickSky(Math.min(delta, 100) / 1000);
      const now = phaseAt(u);
      if (now !== last) {
        last = now;
        root.dataset.sky = now;
        setPhase(now);
      }
      if (knob.current) knob.current.style.transform = `translateX(${(((u % 1) + 1) % 1) * 100}%)`;
    };
    gsap.ticker.add(tick);
    root.dataset.navSolid = '';

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      delete root.dataset.sky;
      delete root.dataset.navSolid;
      skyClock.rush = null;
    };
  }, [story]);

  const live = stage === 'live';
  const chars = Array.from(site.name);

  return (
    <>
      <section ref={section} id="hero" className="relative z-10 w-full" style={{ height: 'var(--hero-h, 370svh)' }}>
        <div id="hero-stage" className={`sticky top-0 h-[100svh] w-full overflow-hidden ${s.stage}`}>
          {mode === '3d' && <HeroScene story={story} onReady={() => setLoaded(true)} />}
          {mode === 'lite' && <img className={s.lite} src={asset('/images/hero-lite.webp')} alt="" draggable={false} />}

          <div
            className={`hero-ink pointer-events-none absolute inset-x-0 top-[19svh] z-10 flex select-none flex-col items-center px-[4vw] text-center md:top-[10svh] md:px-[6vw]`}
            data-out={out ? '' : undefined}
          >
            <TextAnim as="h1" className="hero-headline max-w-[16em]" play={headline}>
              {home.hero.headline[0]}
              <br />
              {home.hero.headline[1]}
            </TextAnim>
          </div>

          <div className={`${s.note} hero-ink`} data-out={out ? '' : undefined} aria-hidden="true">
            <DrawnArrow className={s.noteArrow} shown={noteOn} delay={0.2} d="M52 34C40 12 22 8 6 22M6 22l2-12M6 22l12 2" />
            <Hand className={s.noteWords} shown={noteOn} delay={0.7}>
              {home.hero.note[0]}
              <br />
              {home.hero.note[1]}
            </Hand>
          </div>

          <div className="hero-ink pointer-events-none absolute bottom-10 right-[4vw] z-10 hidden max-w-[25em] text-right md:block" data-out={out ? '' : undefined}>
            <TextAnim className="type-text hero-intro text-pretty" play={headline} delay={0.25}>
              {home.hero.intro}
            </TextAnim>
          </div>

          <div
            ref={dial}
            className={`absolute bottom-6 left-8 z-30 transition-opacity duration-700 ease-out md:bottom-10 md:left-1/2 md:-translate-x-1/2 ${live ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="sky-ink inline-flex flex-col items-center gap-2 md:gap-2.5">
              <div className="flex items-center gap-1.5 md:gap-2">
                {SKY_ORDER.map((p) => {
                  const on = p === phase;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 md:h-9 md:w-9 ${
                        on ? 'border-current/50 opacity-100' : 'border-transparent opacity-40 hover:border-current/25 hover:opacity-75'
                      }`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                      aria-label={p[0].toUpperCase() + p.slice(1)}
                      title={p[0].toUpperCase() + p.slice(1)}
                      aria-pressed={on}
                      onClick={() => rushTo(p)}
                    >
                      <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {icons[p]}
                      </svg>
                    </button>
                  );
                })}
              </div>
              <div className="relative h-[2px] w-full rounded-full bg-current/25">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="absolute top-1/2 h-[7px] w-[1px] -translate-y-1/2 bg-current/35" style={{ left: `${(i * 100) / 3}%` }} aria-hidden="true" />
                ))}
                <span ref={knob} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden="true">
                  <span
                    className="absolute left-0 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                    style={{ boxShadow: '0 0 8px 2px rgba(255,238,205,0.45)' }}
                  />
                </span>
              </div>
            </div>
          </div>

          <div ref={name} className="pointer-events-none absolute inset-0 z-10" style={{ opacity: 0 }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-3 md:px-16">
              <h2 className="sky-ink translate-x-0 whitespace-nowrap font-grotesk text-[2rem] font-light uppercase leading-[0.85] tracking-tight md:translate-x-[6vw] md:text-7xl lg:text-[9rem]" aria-label={site.name}>
                {chars.map((ch, i) => (
                  <span key={i} data-letter aria-hidden="true" style={{ opacity: 0, transition: 'opacity 140ms linear' }}>
                    {ch === ' ' ? '\u00a0' : ch}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center px-16 md:flex">
            <p ref={line} className="hero-headline hero-ink text-center" style={{ opacity: 0, transition: 'none' }}>
              {home.hero.after}
            </p>
          </div>
        </div>
      </section>

      {/* loader */}
      <div className={`${s.loader} ${stage === 'boot' ? '' : s.loaderGone}`} aria-hidden="true">
        <p className={s.loaderLabel}>{site.tagline}</p>
        <p className={s.loaderCount}>
          {[Math.floor(count / 100) % 10, Math.floor(count / 10) % 10, count % 10].map((digit, i) => (
            <span key={i} className={s.digit}>
              <span style={{ transform: `translateY(${-digit}em)` }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
