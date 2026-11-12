'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { home } from '@/content/site';
import s from './ServicesIntro.module.css';

/** One pinned screen: the job title in huge type, with Bolt standing on it. */
export default function ServicesIntro() {
  const pin = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { title, why, list, tags } = home.intro;
  return (
    <section className={s.intro} aria-label={title.join(' ')}>
      <div ref={pin} className={s.pin} data-in={seen ? '' : undefined}>
        <div className={s.guides} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <h2 className={s.title}>
          <span>{title[0]}</span> <span>
            {title[1]}
            <i className={s.period} />
          </span>
        </h2>
        <ol className={s.what}>
          {list.map(([name, tail], i) => (
            <li key={name} style={{ '--i': i } as CSSProperties}>
              <span>{name}</span>
              <span>{tail}</span>
            </li>
          ))}
        </ol>
        <div className={s.why}>
          <p>{why}</p>
        </div>
        <p className={s.where}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
        {/* where Bolt stands (see Actor.tsx) */}
        <div className={s.stop} data-actor="intro" aria-hidden="true" />
      </div>
    </section>
  );
}
