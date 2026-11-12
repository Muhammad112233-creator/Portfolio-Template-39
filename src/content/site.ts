/**
 * Everything personal lives in this folder.
 * Change the values here and the whole site follows.
 */

export const site = {
  name: 'Rayan A. Malik',
  firstName: 'Rayan',
  wordmark: 'MadebyRayan',
  role: 'Design Engineer',
  /** Shown under the loader counter and in the browser tab. */
  tagline: 'Rayan A. Malik · Design Engineer',
  description:
    'Rayan A. Malik is an independent design engineer in Lahore building websites, online shops and the small automations behind them.',
  url: 'https://madebyrayan.dev',
  email: 'hello@madebyrayan.dev',
  whatsapp: 'https://wa.me/',
  /** The little robot that walks you through the site. */
  mascot: 'Bolt',
  greeting: 'Salam',
  location: {
    city: 'Lahore',
    country: 'Pakistan',
    timeZone: 'Asia/Karachi',
    gmt: 'GMT +5',
  },
  status: 'Booking new projects',
  year: 2026,
  /** Link behind the small ribbon on the right edge. */
  repo: 'https://github.com/',
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Playground', href: '/playground' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerPages = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Photography', href: '/photography' },
  { label: 'Playground', href: '/playground' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

// Point these at your own profiles.
export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'X', href: 'https://x.com/' },
] as const;

export const home = {
  hero: {
    headline: ['Websites that earn.', 'Shops that stay busy.'],
    intro:
      "I'm Rayan, a developer from Lahore. I plan, design and build the website, the shop and the small automations behind them, so the right people find you, stay a while and place an order.",
    note: ['Meet Bolt,', 'my co-pilot.'],
    after: "Let's keep it simple.",
  },
  why: {
    headline: ['Be seen. Be trusted.', 'Be booked.'],
    note: ['Bolt, building', 'your next site.'],
    reviewsLabel: 'From past clients',
    copy: 'A website should bring in work, not just sit there looking nice. I build ones that show up in search, load in a blink and turn a curious visit into an enquiry.',
  },
  intro: {
    title: ['Design', 'Engineer'],
    why: 'I only measure one thing: whether your site pulls its weight. Good looks are the easy part. It also has to load fast, answer the obvious questions and keep working long after launch day.',
    list: [
      ['Websites', 'that win you enquiries'],
      ['Motion & 3D', 'people talk about'],
      ['Online shops', 'that are easy to buy from'],
      ['Automations', 'that save you hours'],
    ],
    tags: ['Independent', 'Based in Lahore', 'Working worldwide'],
  },
  work: {
    title: 'Recent Work',
    left: 'Live sites for real businesses. Each one planned, designed and coded by me, first sketch to launch.',
    cta: 'View all work',
    right:
      'They load quickly on a cheap phone, stay up on a busy day and feel calm to use. After launch I stick around to keep it that way.',
  },
  laptop: ['Your brand, ready for business.', 'Lift the lid and meet the people who trusted me first.'],
  clients: {
    title: "Brands I've built for.",
    lede: 'Studios, shops and startups from Lahore to Lisbon who handed me their front door on the internet.',
    walk: 'From Lahore to Lisbon',
    oops: 'Whoops!',
    servicesTitle: "Here's what I build",
    cta: 'All services',
    note: 'Take one or mix a few. You deal with me the whole way, from the first call to launch day: we plan it together, I build every piece myself and try it on real phones before it ships. Afterwards I stay close to keep it quick, mend what breaks and add what you need next.',
  },
  craft: {
    first: ['Half', 'Sketch,'],
    second: ['Half', 'Code.'],
    copy: 'Every site starts in a sketchbook and ends in my editor. What you sign off on paper is what goes live, pixel for pixel.',
  },
  process: {
    title: 'How a project runs',
    statement:
      'First we talk and plan, then I sketch, build and launch. You speak to me the whole way, never an account manager, and you always know what comes next.',
    steps: [
      {
        word: 'Talk',
        line: 'We talk through your business and the people you serve. You leave with a written plan and a fixed quote.',
        film: '/films/step1.mp4',
        poster: '/films/step1.jpg',
      },
      {
        word: 'Sketch',
        line: 'I draw the pages and a click-through prototype. Change your mind here, while it is still cheap.',
        film: '/films/step2.mp4',
        poster: '/films/step2.jpg',
      },
      {
        word: 'Build',
        line: 'I code every part myself and send a private link, so you watch it grow week by week.',
        film: '/films/step3.mp4',
        poster: '/films/step3.jpg',
      },
      {
        word: 'Launch',
        line: 'We test on real phones, go live together, and I stay on call for the first ninety days.',
        film: '/films/step4.mp4',
        poster: '/films/step4.jpg',
      },
    ],
  },
  footer: {
    kicker: "Made it this far? I'm flattered.",
    title: ['Have something', 'worth building?'],
    emailLabel: 'Write to me',
    reply: 'I reply within one working day.',
  },
} as const;
