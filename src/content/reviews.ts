// Demo testimonials for the template. Swap in real words from real clients.
export type Review = {
  quote: string;
  brand: string;
  score: number;
  project: string;
};

export const reviews: Review[] = [
  {
    quote:
      'Rayan rebuilt our shop in three weeks and it has not gone down once. Orders are up, and for the first time I am not the one printing courier labels at midnight.',
    brand: 'Saffron & Salt',
    score: 5,
    project: 'Online shop',
  },
  {
    quote:
      'He listened more than he talked, then sent back exactly the site we had been failing to describe. Our collectors noticed on day one.',
    brand: 'Kiln Studio',
    score: 5,
    project: 'Portfolio',
  },
  {
    quote:
      'A quote used to take us a week of emails. Now customers price their own bike in four minutes and book a fitting before we have opened the shutters.',
    brand: 'Northwind Cycles',
    score: 5,
    project: 'Configurator',
  },
  {
    quote:
      'Fast, calm and honest about what was possible in our budget. The handover video alone saved us a month of questions.',
    brand: 'Paper Lantern',
    score: 5,
    project: 'Studio website',
  },
  {
    quote:
      'The landing page finally matches the product. Sign-ups stopped falling off on the first screen, which was the whole brief.',
    brand: 'Tessel',
    score: 5,
    project: 'Product website',
  },
  {
    quote:
      'Our bookings now arrive with the right details attached, and the reminders send themselves. Front desk calls dropped by half.',
    brand: 'Harbour Dental',
    score: 5,
    project: 'Booking system',
  },
  {
    quote:
      'Clear communication, tidy code and a real eye for detail. He caught problems in our brief before they became problems in the build.',
    brand: 'Miro Coffee',
    score: 5,
    project: 'Subscription shop',
  },
  {
    quote:
      'We asked for a website and got a colleague. Three months after launch he still answers within the hour.',
    brand: 'Atlas Outdoor',
    score: 5,
    project: 'Brand website',
  },
];
