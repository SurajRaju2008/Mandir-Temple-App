export const TEMPLE = {
  name: "Shri Shirdi Sai Mandir",
  address: "5999 New Wilke Rd Building 3, Suite 309, Rolling Meadows, IL 60008",
  coordinates: {
    latitude: 42.0531,
    longitude: 88.0034,
  },
  phone: "+1 (630) 216-9724",
  email: "mailbox@shrishirdisaimandir.com",
  workingHours: [
    {
      day: "Monday – Sunday",
      hours: "8:30 AM – 9:30 AM",
    },
    {
      day: "        ",
      hours: "11:00 AM - 1:00 PM",
    },
    {
      day: "       ",
      hours: "6:00 PM - 8:30 PM",
    },
  ],
  aartiTimes: [
    { name: "Mangala Aarti", time: "5:30 AM" },
    { name: "Shringar Aarti", time: "7:00 AM" },
    { name: "Rajbhog Aarti", time: "12:00 PM" },
    { name: "Sandhya Aarti", time: "6:30 PM" },
    { name: "Shayan Aarti", time: "9:00 PM" },
  ],
  committee: [
    { name: "Mr. Hari Prasad", role: "Chairman" },
    { name: "Mr. Agali Prasad ", role: "Head Priest" },
  ],
  creators: [
    { name: "Suraj Raju", role: "App Developers, Volunteers" },
    { name: "Shaurya Rai", role: "App Developers, Volunteers" },
  ],
};

export const EVENT_TYPES = [
  { id: "puja", label: "Puja Sponsorship", basePrice: 51 },
  { id: "havan", label: "Havan", basePrice: 101 },
  { id: "anniversary", label: "Anniversary / Birthday", basePrice: 31 },
  { id: "festival", label: "Festival Event", basePrice: 21 },
] as const;

export type EventTypeId = (typeof EVENT_TYPES)[number]["id"];

export const DAILY_QUOTES = [
  "Where there is dharma, there is victory.",
  "Serve others with devotion; the divine resides in every heart.",
  "Begin each day with gratitude and end it with peace.",
  "Faith illuminates the path when the mind is still.",
  "Selfless service is the highest form of worship.",
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
