// Demo brands. The marks themselves are drawn in components/site/ClientLogo.tsx.
export const clients = [
  'Saffron & Salt',
  'Kiln Studio',
  'Northwind Cycles',
  'Paper Lantern',
  'Tessel',
  'Harbour Dental',
  'Miro Coffee',
  'Atlas Outdoor',
  'Bloom & Co',
] as const;

export type ClientName = (typeof clients)[number];

/** Which marks sit in each of the three drifting rows on the home page. */
export const clientRows: ClientName[][] = [
  ['Kiln Studio', 'Saffron & Salt', 'Atlas Outdoor', 'Paper Lantern', 'Miro Coffee', 'Tessel', 'Kiln Studio', 'Saffron & Salt', 'Atlas Outdoor'],
  ['Tessel', 'Northwind Cycles', 'Kiln Studio', 'Harbour Dental', 'Saffron & Salt', 'Bloom & Co', 'Tessel', 'Northwind Cycles', 'Kiln Studio'],
  ['Miro Coffee', 'Paper Lantern', 'Bloom & Co', 'Tessel', 'Atlas Outdoor', 'Kiln Studio', 'Miro Coffee', 'Paper Lantern', 'Bloom & Co'],
];
