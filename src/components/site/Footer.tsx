'use client';

import { useEffect, useRef, useState } from 'react';
import { footerPages, home, site, socials } from '@/content/site';
import { scrollToY } from '@/lib/scroll';
import Monogram from './Monogram';
import RollText from './RollText';
import TextAnim from './TextAnim';
import TLink from './TLink';

const SKY = 'linear-gradient(to bottom, #a7c3e2 0%, #c6d6e8 44%, #d6dee7 66%, #dde1e5 100%)';

function LocalTime() {
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: site.location.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

const label = 'm-0 mb-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] opacity-60';

export default function Footer({ fade = '#ffffff' }: { fade?: string }) {
  const ref = useRef<HTMLElement>(null);

  // While the sky part of the footer is under the nav, the nav turns to ink.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const check = () => {
      const top = el.getBoundingClientRect().top;
      const on = top < 40 && window.matchMedia('(min-width: 768px)').matches;
      if (on) root.dataset.footSky = '';
      else delete root.dataset.footSky;
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      delete root.dataset.footSky;
    };
  }, []);

  return (
    <div className="relative z-[1]">
      <footer
        ref={ref}
        id="contact"
        aria-labelledby="contact-title"
        className="relative flex flex-col overflow-hidden px-[4vw] pb-[4vw] pt-[12svh] md:min-h-[100svh] md:px-[var(--page-x)] md:pb-[var(--page-x)] md:pt-[46svh]"
        style={{ background: SKY }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-1 h-[30%]"
          aria-hidden="true"
          style={{
            background: `linear-gradient(to bottom, ${fade} 0%, ${fade} 6%, color-mix(in srgb, ${fade} 70%, transparent) 32%, transparent 100%)`,
          }}
        />
        <div className="relative mt-auto">
          <div className="relative flex flex-col gap-10 overflow-hidden bg-[#050505] px-[6vw] pb-6 pt-10 text-[#f2efe8] md:gap-12 md:px-[5vw] md:pb-8 md:pt-14">
            {/* the giant greeting behind everything */}
            <span
              className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-grotesk text-[34vw] font-bold leading-none tracking-[-0.06em] text-[#111110]"
              aria-hidden="true"
            >
              {site.greeting}
            </span>

            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <TextAnim className="type-text opacity-70" aria-hidden="true">
                  {home.footer.kicker}
                </TextAnim>
                <TextAnim as="h2" id="contact-title" className="type-title mt-2 md:mt-3">
                  {home.footer.title[0]}
                  <br />
                  {home.footer.title[1]}
                </TextAnim>
              </div>
              <div className="md:text-right">
                <TextAnim className="type-text opacity-70">{home.footer.emailLabel}</TextAnim>
                <a
                  className="group mt-2 block w-fit font-grotesk text-[clamp(1.25rem,5.2vw,3rem)] font-medium leading-[1.15] tracking-[-0.03em] md:ml-auto"
                  href={`mailto:${site.email}`}
                >
                  <TextAnim as="span" className="block whitespace-nowrap">
                    {site.email}
                  </TextAnim>
                  <span
                    className="mt-1 block h-px origin-left scale-x-0 bg-current transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.2,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </a>
                <TextAnim className="type-text mt-2 opacity-70" aria-hidden="true">
                  {home.footer.reply}
                </TextAnim>
              </div>
            </div>

            <div className="type-text relative grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[#f2efe8]/20 pt-6 md:grid-cols-4 md:gap-8">
              <nav className="grid grid-cols-2 content-start gap-x-6 gap-y-1.5" aria-label="Footer">
                <p className={`${label} col-span-2`}>Pages</p>
                {footerPages.map((p) => (
                  <TLink key={p.href} className="link-draw w-fit" href={p.href}>
                    <RollText text={p.label} />
                  </TLink>
                ))}
              </nav>
              <div className="flex flex-col gap-1.5">
                <p className={label}>Social</p>
                {socials.map((x) => (
                  <a key={x.label} className="link-draw w-fit" href={x.href} target="_blank" rel="noopener noreferrer">
                    <RollText text={x.label} />
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className={label}>Local time</p>
                <p className="m-0">
                  <LocalTime /> in {site.location.country}
                </p>
                <p className="m-0 opacity-60">{site.location.gmt}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className={label}>Status</p>
                <p className="m-0 flex items-center gap-2">
                  <i className="block h-2.5 w-2.5 rounded-full bg-[var(--sage)]" aria-hidden="true" />
                  {site.status}
                </p>
              </div>
            </div>

            <div className="type-text relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 text-[#f2efe8]" aria-hidden="true">
                  <Monogram still />
                </div>
                <span className="opacity-70">
                  © {site.year} {site.name}
                </span>
              </div>
              <button className="link-draw" type="button" onClick={() => scrollToY(0, 1.6)}>
                <RollText text="Back to top" /> ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
