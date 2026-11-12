import type { CSSProperties, ReactNode } from 'react';
import type { ClientName } from '@/content/clients';

/**
 * Wordmarks for the demo brands, drawn with type and a tiny glyph each so the
 * template ships no third-party logos. For real clients, drop SVG files in
 * /public and render <img> here instead.
 */
const glyph = (children: ReactNode, viewBox = '0 0 24 24') => (
  <svg viewBox={viewBox} width="1em" height="1em" fill="currentColor" aria-hidden="true" style={{ flex: 'none' }}>
    {children}
  </svg>
);

const serif = "Georgia, 'Times New Roman', serif";
const marks: Record<ClientName, { text: ReactNode; style: CSSProperties; icon?: ReactNode; after?: boolean }> = {
  'Saffron & Salt': {
    text: 'Saffron & Salt',
    style: { fontFamily: serif, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.01em' },
  },
  'Kiln Studio': {
    text: 'KILN',
    style: { fontWeight: 300, letterSpacing: '0.42em', fontSize: '1.1em' },
    icon: glyph(<path d="M3 21V11a9 9 0 0 1 18 0v10h-4V11a5 5 0 0 0-10 0v10z" />),
  },
  'Northwind Cycles': {
    text: 'NORTHWIND',
    style: { fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.9em' },
    icon: glyph(<path fillRule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />),
  },
  'Paper Lantern': {
    text: (
      <>
        paper
        <br />
        lantern
      </>
    ),
    style: { fontFamily: serif, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.6em', lineHeight: 1.15 },
  },
  Tessel: {
    text: 'tessel',
    style: { fontWeight: 700, letterSpacing: '-0.05em', fontSize: '1.25em' },
    icon: glyph(<path d="M2 2h9v9H2zM13 13h9v9h-9zM13 2h9v9h-9z" opacity=".95" />),
    after: true,
  },
  'Harbour Dental': {
    text: 'harbour',
    style: { fontWeight: 500, letterSpacing: '-0.03em', fontSize: '1.1em' },
    icon: glyph(<path d="M2 14c3.3 0 3.3-4 6.7-4s3.3 4 6.6 4 3.4-4 6.700-4v4c-3.300 0-3.300 4-6.700 4s-3.300-4-6.600-4-3.400 4-6.700 4z" />),
  },
  'Miro Coffee': {
    text: 'MIRO',
    style: { fontFamily: 'var(--font-tech)', fontWeight: 700, letterSpacing: '0.2em', fontSize: '0.9em' },
    icon: glyph(<path fillRule="evenodd" d="M12 2c5 0 9 4.500 9 10s-4 10-9 10-9-4.500-9-10 4-10 9-10Zm1 3c-3 3 1 5-1 7s-2 4 0 7c3-3-1-5 1-7s2-4 0-7Z" />),
  },
  'Atlas Outdoor': {
    text: 'ATLAS',
    style: { fontWeight: 600, letterSpacing: '0.16em' },
    icon: glyph(<path d="M12 3 2 21h7l3-6 3 6h7z" />),
  },
  'Bloom & Co': {
    text: 'bloom&co',
    style: { fontWeight: 500, letterSpacing: '-0.04em', fontSize: '1.15em' },
    icon: glyph(<path d="M12 2v7.600L18.600 5.800l1 1.700L13 11.300h7.600v2H13l6.600 3.800-1 1.700L12 15v7h-2v-7l-6.600 3.800-1-1.700L9 13.300H1.400v-2H9L2.400 7.500l1-1.700L10 9.600V2z" transform="translate(1 0) scale(.92)" />),
  },
};

export default function ClientLogo({ name, className, style }: { name: ClientName; className?: string; style?: CSSProperties }) {
  const m = marks[name];
  return (
    <span
      className={className}
      role="img"
      aria-label={name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4em',
        flexDirection: m.after ? 'row-reverse' : 'row',
        fontFamily: 'var(--font-grotesk)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {m.icon}
      <span style={m.style}>{m.text}</span>
    </span>
  );
}
