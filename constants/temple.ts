export const TEMPLE = {
  name: 'Shree Mandir',
  address: '123 Temple Road, City, State 12345',
  coordinates: {
    latitude: 28.6139,
    longitude: 77.209,
  },
  phone: '+1 (555) 123-4567',
  whatsapp: '+15551234567',
  email: 'info@shreemandir.org',
  workingHours: [
    { day: 'Monday – Friday', hours: '6:00 AM – 9:00 PM' },
    { day: 'Saturday – Sunday', hours: '5:30 AM – 10:00 PM' },
  ],
  aartiTimes: [
    { name: 'Mangala Aarti', time: '5:30 AM' },
    { name: 'Shringar Aarti', time: '7:00 AM' },
    { name: 'Rajbhog Aarti', time: '12:00 PM' },
    { name: 'Sandhya Aarti', time: '6:30 PM' },
    { name: 'Shayan Aarti', time: '9:00 PM' },
  ],
  committee: [
    { name: 'Pt. Ram Sharma', role: 'Head Priest' },
    { name: 'Mrs. Sunita Devi', role: 'Committee Chair' },
    { name: 'Mr. Anil Kumar', role: 'Treasurer' },
  ],
  creators: [
    { name: 'Temple Dev Team', role: 'App Development' },
  ],
};

export const EVENT_TYPES = [
  { id: 'puja', label: 'Puja Sponsorship', basePrice: 51 },
  { id: 'havan', label: 'Havan', basePrice: 101 },
  { id: 'anniversary', label: 'Anniversary / Birthday', basePrice: 31 },
  { id: 'festival', label: 'Festival Event', basePrice: 21 },
] as const;

export type EventTypeId = (typeof EVENT_TYPES)[number]['id'];

export const DAILY_QUOTES = [
  'Where there is dharma, there is victory.',
  'Serve others with devotion; the divine resides in every heart.',
  'Begin each day with gratitude and end it with peace.',
  'Faith illuminates the path when the mind is still.',
  'Selfless service is the highest form of worship.',
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
