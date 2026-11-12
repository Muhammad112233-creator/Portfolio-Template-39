'use client';

import { site } from '@/content/site';
import { useStore } from '@/lib/store';
import Monogram from './Monogram';
import s from './chrome.module.css';

/** Small tab on the right edge. Point it at your repo, your CV, or delete it. */
export default function Ribbon() {
  const ready = useStore((st) => st.ready);
  return (
    <a
      className={s.ribbon}
      href={site.repo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get this template"
      data-hidden={ready ? undefined : ''}
    >
      <Monogram still title="" />
      <span>Free template</span>
    </a>
  );
}
