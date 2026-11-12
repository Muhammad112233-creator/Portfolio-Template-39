export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  role: string;
  client: string;
  services: string;
  /** One sentence for the work index. */
  line: string;
  credit: { label: string; name: string };
  chips: string[];
  live: string;
  challenge: string;
  solution: string;
  overview: string[];
  cover: string;
  hero: string;
  /** A string is a full-width shot, a pair sits side by side. */
  gallery: (string | [string, string])[];
};

const shots = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/projects/${slug}/${String(i + 1).padStart(2, '0')}.webp`);

function build(p: Omit<Project, 'cover' | 'hero' | 'gallery'>): Project {
  const s = shots(p.slug, 6);
  return {
    ...p,
    cover: `/projects/${p.slug}/cover.webp`,
    hero: s[0],
    gallery: [s[1], [s[2], s[3]], s[4], s[5]],
  };
}

export const projects: Project[] = [
  build({
    slug: 'saffron-salt',
    name: 'Saffron & Salt',
    kind: 'E-commerce',
    year: '2026',
    role: 'Solo developer',
    client: 'Saffron & Salt',
    services: 'E-commerce, Headless Commerce',
    line: 'A family spice house from Anarkali selling single-origin spices by the gram, on a headless storefront that weighs, prices and ships every order on its own.',
    credit: { label: 'Design', name: 'In-house' },
    chips: ['E-commerce', 'Next.js 16', 'React', 'TypeScript', 'Shopify Storefront API', 'Stripe', 'Sanity', 'Vercel'],
    live: '#',
    challenge:
      'Spices were sold in fixed jars, so customers either over-bought or left. Shipping was a flat fee that lost money on heavy orders and scared off small ones, and the team re-typed every order into a courier portal by hand.',
    solution:
      'Customers now pick a weight on a slider and the price follows by the gram. Shipping is worked out from the real parcel weight and city, labels print themselves, and the kitchen sees one tidy packing list per order on a tablet.',
    overview: [
      'Saffron & Salt has blended spices in Lahore since 1974, for restaurants and home cooks who know the difference. They wanted to sell online without flattening three generations of craft into a generic shop template.',
      'The new storefront, built in Next.js on top of Shopify, carries 62 spices and 14 house blends with by-the-gram pricing, recipe pages that add their own ingredients to the basket, and subscriptions for the staples.',
      'Behind the counter the team has a packing screen, automatic courier labels and stock alerts sent to WhatsApp, all without logging in to an admin panel.',
    ],
  }),
  build({
    slug: 'kiln-studio',
    name: 'Kiln Studio',
    kind: 'Portfolio',
    year: '2026',
    role: 'Design & development',
    client: 'Kiln Studio',
    services: 'Portfolio, Art Direction',
    line: 'A Lisbon ceramics studio whose work is slow and quiet, so the site is too: big photographs, soft transitions and a shop that opens four times a year.',
    credit: { label: 'Photography', name: 'Studio archive' },
    chips: ['Portfolio', 'Next.js 16', 'React', 'GSAP', 'Lenis', 'Sanity', 'Figma', 'Vercel'],
    live: '#',
    challenge:
      'Every piece is made once and sells within hours of a kiln opening. The old site showed sold-out work for months and gave collectors no way to know when the next batch would land.',
    solution:
      'The catalogue became an archive, and the shop a small event: a countdown to each kiln opening, a waiting list with early access, and pieces that move themselves to the archive the moment they sell.',
    overview: [
      'Kiln Studio is two potters and one wood-fired kiln on a hillside in Alfama. Their stoneware is collected from Tokyo to New York, and their inbox was full of people asking the same question: when?',
      'The site answers it. A calm, image-led archive of every firing since 2019, studio notes written by the potters, and a quarterly shop that opens to the waiting list first.',
      'It is built to be left alone: the potters add a firing from their phone, and the pages, the mailing and the countdown look after themselves.',
    ],
  }),
  build({
    slug: 'northwind-cycles',
    name: 'Northwind Cycles',
    kind: 'E-commerce',
    year: '2025',
    role: 'Solo developer',
    client: 'Northwind Cycles',
    services: 'E-commerce, Booking',
    line: 'A Leeds workshop that builds steel bikes to order. The configurator shows the real price and lead time as you choose, and books your fitting in the same breath.',
    credit: { label: 'Design', name: 'Hale & Marsh' },
    chips: ['E-commerce', 'Booking', 'Next.js 15', 'React Three Fiber', 'Stripe', 'Cal.com API', 'PostgreSQL', 'Vercel'],
    live: '#',
    challenge:
      'A custom bike took eleven emails to quote. Half of the people who asked for a price never replied, and workshop time was lost to questions the website could have answered.',
    solution:
      'A step-by-step builder prices frame, groupset, wheels and paint as they are picked, shows an honest lead time, takes a deposit and offers fitting slots from the workshop calendar.',
    overview: [
      'Northwind builds around ninety steel bikes a year in a railway arch in Leeds. Every one is fitted to its rider, which made buying one a slow exchange of emails and spreadsheets.',
      'The new site turns that conversation into a builder with 3D paint previews, live pricing and a deposit checkout. Riders book a fitting when they order and follow their frame through the workshop on a tracking page.',
      'Quotes that took a week now take four minutes, and the workshop starts each morning with a build sheet instead of an inbox.',
    ],
  }),
  build({
    slug: 'paper-lantern',
    name: 'Paper Lantern',
    kind: 'Agency Website',
    year: '2025',
    role: 'Creative developer',
    client: 'Paper Lantern',
    services: 'Agency Website, Motion',
    line: 'A two-person branding studio with a loud portfolio and a tiny budget for upkeep. The site folds, unfolds and loads in under a second.',
    credit: { label: 'Design', name: 'Paper Lantern' },
    chips: ['Agency website', 'Next.js 15', 'GSAP', 'WebGL', 'MDX', 'Figma', 'Vercel'],
    live: '#',
    challenge:
      'The studio rebuilt its portfolio every year and abandoned it every spring. Case studies took days to publish, so the best work stayed in a folder nobody saw.',
    solution:
      'Case studies are now written in plain text files with a handful of layout blocks. Paper-fold transitions and colour themes come free with each one, so publishing takes an afternoon.',
    overview: [
      'Paper Lantern makes identities for bakeries, bookshops and the occasional bank. Their own site had to be as bold as the work, yet simple enough for two busy people to keep alive.',
      'It was designed in their Figma file and built as a small kit of folding sections, each themed by the colours of the project it shows.',
      'Eighteen case studies went live in the first month. The previous site managed five in two years.',
    ],
  }),
  build({
    slug: 'tessel',
    name: 'Tessel',
    kind: 'Product Website',
    year: '2025–2026',
    role: 'Frontend lead',
    client: 'Tessel',
    services: 'Product Website, Web App',
    line: 'An invoicing tool for freelancers. The marketing site and the app share one design system, so the product looks the same before and after you sign up.',
    credit: { label: 'Product', name: 'Tessel team' },
    chips: ['Product website', 'Web app', 'Next.js 16', 'TypeScript', 'Supabase', 'Stripe Billing', 'Resend', 'Vercel'],
    live: '#',
    challenge:
      'The landing page promised one product and the app delivered another. Sign-ups dropped off on the first screen, where the interface suddenly changed fonts, colours and tone.',
    solution:
      'One component library now drives both. The landing page uses live product components with sample data, so the demo on the home page is the real thing, not a screenshot.',
    overview: [
      'Tessel helps freelancers send invoices, chase late payments politely and see what they will earn next month. It is built by a team of four spread across Karachi and Berlin.',
      'I led the frontend: a shared design system, the marketing site, onboarding and the dashboard, with billing on Stripe and data on Supabase.',
      'Trial-to-paid conversion rose by a third in the first quarter after launch, mostly because the first screen finally looked like the thing people had been promised.',
    ],
  }),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** The four shown in the orbit on the home page. */
export const featured = projects.slice(0, 4);
