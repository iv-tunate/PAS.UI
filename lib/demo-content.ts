export const DEMO_PASTOR_PHOTO = "/demo/pastor-placeholder.svg";
export const DEMO_COURSE_THUMBNAIL = "/demo/course-placeholder.svg";
export const DEMO_BOOK_COVER = "/demo/book-placeholder.svg";

export const DEMO_HERO_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

/**
 * Sample content, shown wherever the database has nothing yet, so the
 * site can be reviewed looking fully populated. Turn it off for launch
 * with NEXT_PUBLIC_SHOW_DEMO_CONTENT=false in .env.local. The moment a
 * real item exists in a section, the real items replace that section's samples.
 * Ids start with "demo-", and the Get buttons refuse them.
 */
export const SHOW_DEMO_CONTENT = process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT !== "false";
export const isDemoId = (id: string) => id.startsWith("demo-");

const SAMPLE_DESCRIPTION =
  "A short description of the book appears here. It can run to a few lines and is trimmed after six, so a long description never breaks the layout. Edit it from Books in the admin dashboard.";

export type DemoBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image_url: string;
  is_free: boolean;
  price_kobo: number;
  price_usd_cents: number;
};

export const DEMO_BOOKS: DemoBook[] = [1, 2, 3, 4].map((n) => ({
  id: `demo-book-${n}`,
  title: ["Sample book title", "Another sample title", "A third sample title", "A free sample title"][n - 1],
  author: "Akintola Samuel",
  description: SAMPLE_DESCRIPTION,
  cover_image_url: `/demo/book-${n}.svg`,
  is_free: n === 4,
  price_kobo: [350000, 250000, 500000, 0][n - 1],
  price_usd_cents: [900, 700, 1200, 0][n - 1],
}));

const GN_UPLOADS = "https://gatewaynation.org/wp-content/uploads/2024/12";
const COURSE_PHOTOS = [
  `${GN_UPLOADS}/MIT-CLASS-1024x768.jpg`,
  `${GN_UPLOADS}/GNATIONHOME-1024x768.jpg`,
  `${GN_UPLOADS}/Green-hose-1-1024x768.jpg`,
];

export type DemoCourse = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail_url: string;
  media_kind: "video" | "audio" | "file";
  is_free: boolean;
  price_kobo: number;
  price_usd_cents: number;
  chapters: { title: string; position: number }[];
};

export const DEMO_COURSES: DemoCourse[] = [
  { n: 1, title: "Sample teaching one", kind: "video", price: 0, usd: 0, summary: "A short summary of the teaching appears here, in a sentence or two." },
  { n: 2, title: "Sample teaching two", kind: "audio", price: 500000, usd: 1200, summary: "A paid teaching. The price and the type (video, audio or file) show on the card." },
  { n: 3, title: "Sample teaching three", kind: "file", price: 1200000, usd: 2500, summary: "Buyers pay, then the download link is emailed to them." },
].map(({ n, title, kind, price, usd, summary }) => ({
  id: `demo-course-${n}`,
  title,
  slug: `demo-course-${n}`,
  summary,
  thumbnail_url: COURSE_PHOTOS[n - 1],
  media_kind: kind as DemoCourse["media_kind"],
  is_free: price === 0,
  price_kobo: price,
  price_usd_cents: usd,
  chapters: [],
}));

export type DemoMessage = {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  preached_on: string;
};

export type DemoEvent = {
  id: string;
  name: string;
  description: string;
  month: number;
  day_start: number;
  day_end: number;
  flyer_url: string;
  position: number;
};

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: "demo-event-1",
    name: "Upsurge",
    description: "An annual spiritual gathering empowering believers to walk in purposeful leadership and kingdom influence.",
    month: 8,
    day_start: 14,
    day_end: 18,
    flyer_url: "https://gatewaynation.org/wp-content/uploads/2024/12/love-is-1024x768.jpg",
    position: 1,
  },
  {
    id: "demo-event-2",
    name: "Love Lounge",
    description: "An intentional relationship clinic offering practical wisdom and spiritual guidance for couples and singles.",
    month: 11,
    day_start: 22,
    day_end: 24,
    flyer_url: "https://gatewaynation.org/wp-content/uploads/2024/12/cele.jpg",
    position: 2,
  },
  {
    id: "demo-event-3",
    name: "Code Red",
    description: "Intense prayer, revival, and divine alignment for spiritual and supernatural breakthroughs.",
    month: 12,
    day_start: 5,
    day_end: 7,
    flyer_url: "https://gatewaynation.org/wp-content/uploads/2026/09/NA8_8761-1024x819.jpg",
    position: 3,
  },
];

// Public videos from Gateway Nation's Upsurge 2026 page, used only as stand-ins.
export const DEMO_MESSAGES: DemoMessage[] = [
  { id: "demo-msg-1", title: "Sample message: Day 1", description: "", youtube_id: "aRnOuC8nSRc", preached_on: "" },
  { id: "demo-msg-2", title: "Sample message: Day 2", description: "", youtube_id: "HMuh2LBj9MY", preached_on: "" },
  { id: "demo-msg-3", title: "Sample message: Day 3", description: "", youtube_id: "klmFBPXquF0", preached_on: "" },
  { id: "demo-msg-4", title: "Sample exhortation: Day 1", description: "", youtube_id: "y9lHQQkoy24", preached_on: "" },
  { id: "demo-msg-5", title: "Sample exhortation: Day 2", description: "", youtube_id: "5zKNX6lE6H4", preached_on: "" },
  { id: "demo-msg-6", title: "Sample exhortation: Day 3", description: "", youtube_id: "ucRh5k7E3rc", preached_on: "" },
];
