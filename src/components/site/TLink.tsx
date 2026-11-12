'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useGo } from './Transition';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** A normal link that plays the page transition before it navigates. */
export default function TLink({ href, onClick, children, ...rest }: Props) {
  const go = useGo();
  const external = /^(https?:|mailto:|tel:|#)/.test(href);

  if (external) {
    const newTab = href.startsWith('http');
    return (
      <a href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...(rest as ComponentProps<'a'>)}>
        {children}
      </a>
    );
  }

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
