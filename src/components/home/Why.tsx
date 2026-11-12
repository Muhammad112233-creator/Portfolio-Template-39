'use client';

import { useCallback, useEffect, useState } from 'react';
import ClientLogo from '@/components/site/ClientLogo';
import { DrawnArrow, Hand } from '@/components/site/Hand';
import type { ClientName } from '@/content/clients';
import { reviews } from '@/content/reviews';
import { home } from '@/content/site';
import { pad2 } from '@/lib/math';
import s from './Why.module.css';

const EVERY = 6500;

function Reviews() {
  const [i, setI] = useState(0);
  const [turn, setTurn] = useState(0);
  const go = useCallback((step: number) => {
    setI((v) => (v + step + reviews.length) % reviews.length);
    setTurn((v) => v + 1);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => go(1), EVERY);
    return () => window.clearTimeout(id);
  }, [turn, go]);

  const r = reviews[i];
  return (
    <section className={s.review} aria-labelledby="why-reviews" data-why-in="side">
      <h3 className={s.reviewLabel} id="why-reviews">
        {home.why.reviewsLabel}
      </h3>
      <span className={s.reviewTrack} aria-hidden="true">
        <span key={turn} className={s.reviewFill} style={{ animationDuration: `${EVERY}ms` }} />
      </span>
      <div className={s.reviewBar}>
        <span className={s.reviewArrows}>
          <button type="button" aria-label="Previous review" onClick={() => go(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next review" onClick={() => go(1)}>
            →
          </button>
        </span>
        <span className={s.reviewCount}>
          {pad2(i + 1)}/{pad2(reviews.length)}
        </span>
      </div>
      <figure key={i} className={s.reviewBody}>
        <blockquote className={s.reviewQuote}>“{r.quote}”</blockquote>
        <figcaption className={s.reviewFrom}>
          <ClientLogo name={r.brand as ClientName} className={s.reviewLogo} />
          <span className={s.reviewWho}>
            <span className={s.reviewBy}>
              <span aria-label={`${r.score} out of 5`}>★ {r.score.toFixed(1)}</span> · {r.project}
            </span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

/** The white page under the sky: headline, Bolt at his desk, reviews. */
export default function Why() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const seen = () => 'whyShown' in root.dataset && setShown(true);
    seen();
    const mo = new MutationObserver(seen);
    mo.observe(root, { attributes: true, attributeFilter: ['data-why-shown'] });
    return () => mo.disconnect();
  }, []);

  return (
    <section className={`${s.frame} home-titles col-lines`} aria-labelledby="why-title" data-lines-in="">
      <header className={s.header} data-why-in="top">
        <h2 className={s.headline} id="why-title">
          <span>{home.why.headline[0]}</span>
          <span>{home.why.headline[1]}</span>
        </h2>
      </header>

      {/* Bolt and his desk are drawn here by the 3D layer (see Actor.tsx). */}
      <div className={s.scene} data-actor="why" aria-hidden="true" />

      <div className={s.note} aria-hidden="true">
        <DrawnArrow className={s.noteArrow} shown={shown} delay={0.9} d="M50 8C32 6 16 14 9 36M9 36l-5-10M9 36l10-5" />
        <Hand className={s.noteWords} shown={shown} delay={1.3}>
          {home.why.note[0]}
          <br />
          {home.why.note[1]}
        </Hand>
      </div>

      <Reviews />

      <p className={s.copy} data-why-in="side">
        {home.why.copy}
      </p>

      <span className={s.doodle} aria-hidden="true" data-why-in="pet">
        <svg viewBox="0 0 160 100" fill="none" stroke="#111" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M128 72c16 3 26-8 22-22" />
          <path d="M30 80c-9-19 0-41 22-47l-2-17 15 12c8-2 16-2 24 0l15-12-2 17c21 6 31 27 24 47z" fill="#fff" />
          <path d="M50 16l-2 17 15-5zM104 16l2 17-15-5z" fill="#111" />
          <path d="M58 54q5 5 10 0M86 54q5 5 10 0" />
          <path d="M74 62l3 3 3-3M77 65v4" />
          <path d="M22 80h118" />
        </svg>
      </span>
    </section>
  );
}
