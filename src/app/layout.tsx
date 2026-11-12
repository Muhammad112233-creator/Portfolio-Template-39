import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import Providers from '@/components/site/Providers';
import { site } from '@/content/site';
import './globals.css';

const grotesk = localFont({
  src: '../fonts/SpaceGrotesk-Variable.woff2',
  variable: '--font-space-grotesk',
  weight: '300 700',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../fonts/SpaceMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/SpaceMono-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { title: `${site.name} — ${site.role}`, description: site.description, type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a7c3e2',
};

/**
 * Runs before first paint. On a narrow screen there is no room for the
 * desk-push story, so the hero is short there (see lib/device.ts).
 */
const stageScript = `(function(){try{var d=document.documentElement;function f(){var n=(innerWidth/innerHeight)*8.2843<7.5;d.style.setProperty('--hero-h',n?'150svh':'370svh');if(n)d.setAttribute('data-narrow','');else d.removeAttribute('data-narrow')}f();addEventListener('resize',f)}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: stageScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
