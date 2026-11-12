'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav, site, socials } from '@/content/site';
import { gsap, lockScroll, registerGsap } from '@/lib/scroll';
import { toggleSound } from '@/lib/sound';
import { useStore } from '@/lib/store';
import Monogram from './Monogram';
import RollText from './RollText';
import TLink from './TLink';
import s from './NavBar.module.css';

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

export default function NavBar() {
  const pathname = clean(usePathname());
  const ready = useStore((st) => st.ready);
  const sound = useStore((st) => st.sound);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Unroll the panel from its top edge, then let the links rise in.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    registerGsap();
    const rise = el.querySelectorAll('[data-rise]');
    const foot = el.querySelectorAll('[data-foot]');
    gsap.killTweensOf([el, rise, foot]);
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.out' });
      gsap.fromTo(rise, { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.05, delay: 0.12 });
      gsap.fromTo(foot, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, delay: 0.3 });
    } else {
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(el, { visibility: 'hidden' }),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', key);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const tab = open ? 0 : -1;

  return (
    <>
      <div className={s.scrim} data-on={open ? '' : undefined} onClick={close} aria-hidden="true" />

      <div ref={panel} id="site-menu" className={s.panel} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <TLink className={s.panelHead} href="/" tabIndex={tab} data-foot onClick={close}>
          <Monogram still />
          <span>{site.wordmark}</span>
        </TLink>

        <ul className={s.links}>
          {nav.map((item) => {
            const current = clean(item.href) === pathname;
            return (
              <li key={item.href} className={s.item}>
                <TLink
                  className={`${s.link} ${current ? s.current : ''}`}
                  href={item.href}
                  tabIndex={tab}
                  aria-current={current ? 'page' : undefined}
                  onClick={close}
                >
                  <span className={s.linkMask}>
                    <span className={s.linkInner} data-rise>
                      <span className={s.name}>
                        <RollText text={item.label} />
                      </span>
                    </span>
                  </span>
                </TLink>
              </li>
            );
          })}
        </ul>

        <div className={s.foot} data-foot>
          <div>
            <a className="link-swap" href={`mailto:${site.email}`} tabIndex={tab}>
              {site.email}
            </a>
            <ul className={s.socials}>
              {socials.map((x) => (
                <li key={x.label}>
                  <a className="link-draw" href={x.href} target="_blank" rel="noopener noreferrer" tabIndex={tab}>
                    <RollText text={x.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <span className={s.hi} aria-hidden="true">
            say {site.greeting.toLowerCase()}
          </span>
        </div>
      </div>

      <header className={s.bar} data-hidden={ready ? undefined : ''} data-open={open ? '' : undefined}>
        <TLink className={`${s.box} ${s.logo}`} href="/" aria-label={`${site.name} - home`} data-magnetic="0.2">
          <Monogram />
        </TLink>
        <TLink className={`${s.box} ${s.wordmark}`} href="/">
          {site.wordmark}
        </TLink>
        <div className={s.right}>
          <button
            type="button"
            className={`${s.box} ${s.music} ${sound ? s.musicOn : ''}`}
            aria-label={sound ? 'Sound off' : 'Sound on'}
            aria-pressed={sound}
            data-magnetic="0.2"
            onClick={toggleSound}
          >
            <span className={s.musicWord} aria-hidden="true">
              Sound
            </span>
            <svg viewBox="0 0 20 16" aria-hidden="true">
              {[1, 6, 11, 16].map((x) => (
                <rect key={x} className={s.eq} x={x} y="0" width="2.4" height="16" rx="1.2" />
              ))}
            </svg>
          </button>
          <button
            ref={button}
            type="button"
            className={`${s.box} ${s.menuBox} ${open ? s.open : ''}`}
            data-magnetic="0.2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={s.word}>
              <span>MENU</span>
              <span aria-hidden="true">CLOSE</span>
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
