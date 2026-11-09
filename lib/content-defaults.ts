
export type ContentMeta = {
  label: string;
  text: string;
  multiline?: boolean;
};

export const CONTENT_DEFAULTS: Record<string, ContentMeta> = {
  "hero.role": { label: "Hero: line above the name", text: "" },
  "hero.first": { label: "Hero: first name", text: "Akintola" },
  "hero.last": { label: "Hero: last name", text: "Samuel" },
  "hero.tagline": {
    label: "Hero: sentence under the name",
    text: "",
    multiline: true,
  },

  "about.heading": { label: "About: heading", text: "AKINTOLA SAMUEL" },
  "about.roles": { label: "About: roles (separate with commas)", text: "Founder of Gateway Nation |Pragmatic Teacher & Trainer | Marriage Mentor |  Life Management Consultant" },
  "about.bio": {
    label: "About: biography (leave a blank line between paragraphs)",
    text: [
     "Akintola Samuel is the founder and Senior Pastor of Gateway Nation, a church with locations in Lagos and Abuja, Nigeria, committed to raising fully devoted followers of Christ who become significant in life and in the marketplace.",
"A pragmatic teacher, marriage mentor, workplace psychologist, and life management consultant, he is passionate about helping people build purposeful lives, develop healthy relationships, and achieve meaningful success in their personal lives, careers, and the marketplace. His teachings focus on foundational life principles, intentional marriage design, personal development, and the practical application of biblical wisdom to everyday life." ,

"Beyond his pastoral responsibilities, Akintola serves as a lead strategist at GATES Academy and is the founder of Relearn. He also mentors couples and individuals through Love Lounge, Gateway Nation's relationship and marriage class, which provides guidance on building healthy, intentional, and lasting relationships.",

"Gateway Nation also offers a counselling environment where people can talk, receive guidance, and pray without fear of judgment.",

"He provides spiritual leadership alongside his wife, Oluremi Akintola Samuel, the First Lady of Gateway Nation, with whom he shares a commitment to faith, family, and helping people fulfil their potential.",
    ].join("\n\n"),
    multiline: true,
  },
  "about.fact.role": { label: "About fact: role", text: "Founder and Senior Pastor of Gateway Nation" },
  "about.fact.church": { label: "About fact: church", text: "Gateway Nation, Lagos and Abuja" },
  "about.fact.also": { label: "About fact: also", text: "Pragmatic Teacher & Trainer, Marriage Mentor,  Life Management Consultant" },
  "about.fact.married": { label: "About fact: married to", text: "Oluremi Akintola Samuel" },

  "books.heading": { label: "Books: heading", text: "Books by Akintola Samuel" },
  "books.body": {
    label: "Books: short text under the heading",
    text: "Practical reading on faith, marriage and purpose.",
    multiline: true,
  },

  // "watch.heading": { label: "Welcome Video: heading", text: "Welcome from Pastor Akin" },
  // "watch.body": {
  //   label: "Welcome Video: short text",
  //   // text: "A personal welcome from Pastor Akintola Samuel to everyone exploring purpose, faith, and leadership with us.",
  //   multiline: true,
  // },

  "gateway.heading": { label: "Gateway Nation band: heading", text: "This is home... Everything you need is here" },
  "gateway.body": {
    label: "Gateway Nation band: text",
    text: "Gateway Nation is a family of people becoming fully devoted followers of Christ. Come as you are, bring your questions, and find a place to belong and grow.",
    multiline: true,
  },

  "vision.statement": {
    label: "Vision: statement",
    text: "To raise fully devoted followers of Christ who become significant in life and in the marketplace.",
    multiline: true,
  },
  "vision.mission": {
    label: "Vision: mission",
    text: "Gateway Nation's mission is to develop committed followers of Christ who do well spiritually, personally and professionally, and who show Christ's love and purpose in every place they influence.",
    multiline: true,
  },

  "visit.heading": { label: "Join us: heading", text: "Come worship with us" },
  "visit.sunday": { label: "Service time: Sunday (both campuses)", text: "9:30am" },
  "visit.thursday": { label: "Service time: Thursday (both campuses)", text: "6:00pm" },
  "visit.address": {
    label: "Lagos campus: address",
    text: "Francis Aghedo Close, Beside Rain Oil, Off Isheri Road, By Ojodu Berger Bridge, Lagos, Nigeria",
    multiline: true,
  },
  "visit.abuja.address": {
    label: "Abuja campus: address",
    text: "Abedini Hotel, Aco Estate, Sabon Lugbe, Abuja, Federal Capital Territory, Nigeria",
    multiline: true,
  },

  "relearn.heading": { label: "Relearn: heading", text: "Transformative Teachings for Purpose & Leadership" },
  "relearn.body": {
    label: "Relearn: description",
    text: "Curated masterclasses and teachings by Akintola Samuel to help you unlearn limiting patterns, master timeless principles, and lead with clarity.",
    multiline: true,
  },
  "relearn.track.1.label": { label: "Relearn track 1: title", text: "Life & Purpose" },
  "relearn.track.1.desc":  { label: "Relearn track 1: description", text: "Foundational principles for personal clarity and direction" },
  "relearn.track.2.label": { label: "Relearn track 2: title", text: "Marriage & Relationships" },
  "relearn.track.2.desc":  { label: "Relearn track 2: description", text: "Intentional frameworks for healthy, lasting partnerships" },
  "relearn.track.3.label": { label: "Relearn track 3: title", text: "Leadership & Marketplace" },
  "relearn.track.3.desc":  { label: "Relearn track 3: description", text: "Workplace psychology and strategic execution" },

  "events.heading": { label: "Events: small heading", text: "" },

  "messages.heading": { label: "Messages page: heading", text: "Messages by Akintola Samuel" },
  "messages.body": {
    label: "Messages page: short text",
    text: "Biblical Wisdom for Faith, Family & the Marketplace.",
    multiline: true,
  },

  "contact.heading": { label: "Send a message: heading", text: "Contact Akintola Samuel" },
  "contact.body": {
    label: "Contact: short text",
    text: "Send a note or request an appointment.",
    multiline: true,
  },

  "newsletter.heading": { label: "Newsletter: heading", text: "Stay in touch" },
  "newsletter.body": {
    label: "Newsletter: short text",
    text: "New messages, books and events in your inbox. No spam, and you can leave any time.",
    multiline: true,
  },

  "social.instagram": { label: "Instagram link", text: "https://www.instagram.com/akintolasamuel/" },
  "social.facebook": { label: "Facebook link", text: "https://www.facebook.com/share/1BHhS1VmQN/?mibextid=wwXIfr" },
  "social.threads": { label: "Threads link", text: "https://www.threads.net/@akintolasamuel" },
  "social.youtube": { label: "YouTube channel link", text: "https://www.youtube.com/@akintolasamuel" },
  "hero.photo": { label: "Hero: background photo", text: "https://gatewaynation.org/wp-content/uploads/2024/12/love-is-1024x768.jpg" },
};

export const HERO_PHOTO_KEY = "hero.photo";
export const HERO_PHOTO_PLACEHOLDER = "https://gatewaynation.org/wp-content/uploads/2024/12/love-is-1024x768.jpg";
export const HERO_PHOTO_FALLBACK = "/demo/akin-1.svg";

export const ABOUT_PHOTO_COUNT = 3;
export const aboutPhotoKey = (n: number) => `about.photo.${n}`;
export const ABOUT_PHOTO_PLACEHOLDERS = [
  "https://gatewaynation.org/wp-content/uploads/2026/09/NA8_8761-1024x819.jpg",
  "https://gatewaynation.org/wp-content/uploads/2024/12/cele.jpg",
  "https://gatewaynation.org/wp-content/uploads/2024/12/COUNSELLING-GN-1024x768.jpg",
];
export const aboutPhotoPlaceholder = (n: number) => ABOUT_PHOTO_PLACEHOLDERS[n - 1] || ABOUT_PHOTO_PLACEHOLDERS[0];
export const aboutPhotoFallback = (n: number) => `/demo/akin-${((n - 1) % 6) + 1}.svg`;

export const STAGE_PHOTO_COUNT = 4;
export const stagePhotoKey = (n: number) => `photo.${n}`;
export const stagePhotoPlaceholder = (n: number) => PHOTO_PLACEHOLDERS[n - 1] || PHOTO_PLACEHOLDERS[0];
export const stagePhotoFallback = (n: number) => `/demo/akin-${n}.svg`;

export const PHOTO_COUNT = 4;
export const photoKey = (n: number) => `photo.${n}`;

/**
 * Stand-in photos until an admin uploads real ones. These are photos
 * already published on gatewaynation.org (the church's own site), linked
 * rather than copied, so they can disappear if that site changes them.
 * The bundled SVGs in /public/demo are the last-resort fallback.
 * Slot 1 is the first photo the hero shows.
 */
const GN = "https://gatewaynation.org/wp-content/uploads";
export const PHOTO_PLACEHOLDERS = [
  `${GN}/2024/12/love-is-1024x768.jpg`,
  `${GN}/2026/09/NA8_8761-1024x819.jpg`,
  `${GN}/2024/12/love-1024x768.jpg`,
  `${GN}/2024/12/cele.jpg`,
  `${GN}/2024/12/COUNSELLING-GN-1024x768.jpg`,
  `${GN}/2024/12/ns-1024x768.jpg`,
];
export const photoPlaceholder = (n: number) => PHOTO_PLACEHOLDERS[n - 1];
export const photoFallback = (n: number) => `/demo/akin-${n}.svg`;

export const CHURCH_PHOTO_COUNT = 4;
export const churchPhotoKey = (n: number) => `church.photo.${n}`;
export const CHURCH_PHOTO_PLACEHOLDERS = [
  `${GN}/2024/12/GNATIONHOME-1024x768.jpg`,
  `${GN}/2024/12/MIT-CLASS-1024x768.jpg`,
  `${GN}/2024/12/Green-hose-1-1024x768.jpg`,
  `${GN}/2025/01/Join-our-Commun.jpg`,
];
export const churchPhotoPlaceholder = (n: number) => CHURCH_PHOTO_PLACEHOLDERS[n - 1];
export const churchPhotoFallback = (n: number) => `/demo/akin-${n}.svg`;
