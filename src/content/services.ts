export type Capability = { title: string; text: string; art: 'browser' | 'code' | 'pay' | 'search' | 'figma' | 'deploy' | 'cube' | 'shader' | 'scroll' | 'motion' | 'type' | 'product' | 'theme' | 'headless' | 'app' | 'page' | 'speed' | 'flow' | 'chat' | 'inbox' | 'link' | 'doc' };

export type Service = {
  id: string;
  /** Short name for the home page list and the tab bar. */
  name: string;
  short: string;
  title: string;
  tools: string;
  band: [string, string];
  intro: string;
  specs: [string, string][];
  stack: string[];
  cards: Capability[];
  promises: string[];
};

export const services: Service[] = [
  {
    id: 'websites',
    name: 'Websites',
    short: 'Websites',
    title: 'Websites',
    tools: 'Marketing sites, booking, payments',
    band: ['Websites', 'that win you enquiries'],
    intro:
      'A site only earns its place when the unglamorous parts hold up. You get the design, the pages and the motion, plus the data, logins and payments behind them, set up so search engines and AI answer engines can actually read it.',
    specs: [
      ['Frontend', 'Next.js, React & TypeScript'],
      ['Backend', 'APIs, databases & webhooks'],
      ['Payments', 'Stripe, PayFast & invoices'],
      ['Search', 'SEO, schema & AI visibility'],
      ['After launch', 'Hosting, uptime & support'],
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Supabase', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'GSAP', 'Stripe', 'Vercel'],
    cards: [
      { title: 'Websites & web apps', text: 'Marketing sites, portfolios and small web apps designed around your brand. Fast, accessible and easy to extend.', art: 'browser' },
      { title: 'APIs & backends', text: 'The parts nobody sees: databases, webhooks and scheduled jobs, typed end to end and written for the next person.', art: 'code' },
      { title: 'Payments & checkout', text: 'Card and wallet checkouts where every price is confirmed on the server, so nobody edits it in the browser.', art: 'pay' },
      { title: 'Search & AI visibility', text: 'Clean structure, schema and speed for Google, plus a place in the answers people now ask chat assistants for.', art: 'search' },
      { title: 'From file or from scratch', text: 'Bring a Figma file, a site you admire or a blank page. I take it from there with layout, type, colour and motion as one job.', art: 'figma' },
      { title: 'Launch & hosting', text: 'Deployed with caching per page, images sized for every screen and scores that stay green after launch.', art: 'deploy' },
    ],
    promises: [
      'A fixed quote and a launch date in writing before any work starts.',
      'A private preview link from week one, updated as each page lands.',
      'Ninety days of fixes and questions after launch, included.',
    ],
  },
  {
    id: 'motion-3d',
    name: 'Motion & 3D',
    short: 'Motion',
    title: 'Motion & 3D',
    tools: 'Scroll stories, WebGL scenes',
    band: ['Motion & 3D', 'people talk about'],
    intro:
      'Some ideas need more than a flat page. A product people can turn in 3D, a story that unfolds as they scroll, a brand they want to poke at: that is what keeps a visitor around and makes them remember you.',
    specs: [
      ['3D scenes', 'Three.js & React Three Fiber'],
      ['Shaders', 'Custom GLSL & visual effects'],
      ['Scroll', 'GSAP, Lenis & scroll stories'],
      ['3D assets', 'Blender modelling & lighting'],
      ['Devices', 'Tuned for mid-range phones'],
    ],
    stack: ['Three.js', 'React Three Fiber', 'GLSL', 'GSAP', 'Lenis', 'Blender', 'Figma', 'Spline'],
    cards: [
      { title: 'Real-time 3D', text: 'Products, worlds and characters you can move around, running in the browser with Three.js and React Three Fiber.', art: 'cube' },
      { title: 'Custom shaders', text: 'Skies, liquids, distortion and grain written by hand in GLSL, so the picture is yours and nobody else has it.', art: 'shader' },
      { title: 'Product viewers', text: 'Your product modelled, lit and put in front of the customer. Every colour and option, no photo shoot.', art: 'product' },
      { title: 'Scroll-driven stories', text: 'Pages that unfold as they are scrolled: pinned scenes, timelines and reveals choreographed with GSAP.', art: 'scroll' },
      { title: 'Motion design', text: 'Transitions, hovers and micro-moments with weight and timing. Motion that explains, never just decorates.', art: 'motion' },
      { title: 'Design & art direction', text: 'Built from your Figma file or references, or designed here from scratch, with type, colour and motion tested as moving prototypes.', art: 'type' },
    ],
    promises: [
      'Modelled and lit in Blender, then shaded by hand, so the picture is yours alone.',
      'Every scene tuned to run smoothly on a phone, not only on a studio laptop.',
      'A still-image fallback for old devices, so nobody gets a blank page.',
    ],
  },
  {
    id: 'online-shops',
    name: 'Online shops',
    short: 'Shops',
    title: 'Online Shops',
    tools: 'Shopify builds, product pages, checkout',
    band: ['Online shops', 'that are easy to buy from'],
    intro:
      'A shop has one job: make buying feel easy. From a custom theme to a fully headless storefront, you get the build that fits your catalogue, with product pages that answer questions before anyone has to ask.',
    specs: [
      ['Storefront', 'Custom themes or headless builds'],
      ['Products', 'Variants, bundles & product pages'],
      ['Apps', 'Polaris & Shopify Admin API'],
      ['Checkout', 'Payments, upsells & extensions'],
      ['Growth', 'Speed, SEO & conversion'],
    ],
    stack: ['Shopify', 'Liquid', 'Hydrogen', 'Remix', 'Polaris', 'Storefront API', 'Metafields', 'Checkout UI', 'Klaviyo', 'GSAP', 'Tailwind CSS'],
    cards: [
      { title: 'Custom Shopify themes', text: 'Online Store 2.0 themes designed for your brand from a blank file, with every section editable by your team.', art: 'theme' },
      { title: 'Headless storefronts', text: 'Next.js or Hydrogen in front, Shopify behind: total design freedom, with Shopify still running checkout and orders.', art: 'headless' },
      { title: 'Shopify apps', text: 'Embedded admin apps built with Polaris and the Admin API: tools that do one job well for your store.', art: 'app' },
      { title: 'Product pages', text: 'Galleries, size guides, reviews and bundles laid out so the answer is on screen before the question forms.', art: 'page' },
      { title: 'Checkout & payments', text: 'Local gateways, cash on delivery, wallets and tidy post-purchase emails, tested with real orders.', art: 'pay' },
      { title: 'Speed & conversion', text: 'Image budgets, lazy sections and honest A/B tests, so the shop gets faster and the basket gets fuller.', art: 'speed' },
    ],
    promises: [
      'Your team can edit every section without calling me.',
      'Checkout tested with real cards and real couriers before launch.',
      'A handover video for products, discounts and orders.',
    ],
  },
  {
    id: 'automations',
    name: 'Automations',
    short: 'Automations',
    title: 'Automations',
    tools: 'Chat helpers, auto-replies, follow-ups',
    band: ['Automations', 'that save you hours'],
    intro:
      'Most small teams lose hours every week to work a machine could do. Connect the tools you already use and the repetitive parts run themselves: inboxes sort, leads land in the right place, questions get answered at three in the morning.',
    specs: [
      ['Workflows', 'n8n, Make & Zapier'],
      ['Assistants', 'OpenAI, Claude & your knowledge'],
      ['Inbox & leads', 'Routing, scoring & drafted replies'],
      ['Integrations', 'CRM, e-commerce & internal tools'],
      ['Handover', 'Documentation & team training'],
    ],
    stack: ['n8n', 'Make', 'Zapier', 'OpenAI', 'Claude', 'LangChain', 'Supabase', 'Airtable', 'Slack', 'WhatsApp API'],
    cards: [
      { title: 'Workflow automation', text: 'Orders, forms, invoices and reminders wired together so nothing is typed twice or forgotten on a Friday.', art: 'flow' },
      { title: 'Chat assistants', text: 'A helper trained on your own pages and policies that answers customers in your tone, and knows when to hand over.', art: 'chat' },
      { title: 'Inbox & lead routing', text: 'Enquiries read, tagged and sent to the right person with a drafted reply waiting for a quick edit.', art: 'inbox' },
      { title: 'Integrations', text: 'Your CRM, shop, sheets and chat talking to each other through clean, monitored connections.', art: 'link' },
      { title: 'Reports that write themselves', text: 'A plain weekly summary of sales, leads and loose ends in your inbox every Monday morning.', art: 'doc' },
      { title: 'Handover & training', text: 'Clear notes and a short video, so your team can change a step without breaking the chain.', art: 'deploy' },
    ],
    promises: [
      'We automate the boring, measurable tasks first, not the risky ones.',
      'A person always signs off anything that reaches a customer.',
      'Every workflow is logged, so you can see what ran and why.',
    ],
  },
];
