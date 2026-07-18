export type TourKind = "fixed" | "addon" | "specialty";

/** Titled bullet block (e.g. “Included with every long stay”) for rich package panels. */
export type TourHighlightSection = { title: string; items: string[] };

/** Detail-page pricing: tier labels (e.g. vehicle | stays) plus inclusion / exclusion copy. */
export type TourPriceIncludesBlock = {
  /** Optional pipe-separated row above `body` (omit when details are only in the paragraph). */
  tierLabels?: string[];
  body: string;
};

export interface TourItem {
  id: string;
  kind: TourKind;
  title: string;
  /** Shown as a chip on cards/panels; omit when not useful (e.g. add-ons). */
  duration?: string;
  /** Short blurb; on panels with `bodyParagraphs`, may be empty. */
  description: string;
  /** Subtitle under the title (specialty / long-form panels). */
  tagline?: string;
  /** Multiple body paragraphs; when set, package panels render these instead of `description`. */
  bodyParagraphs?: string[];
  highlights?: string[];
  highlightSections?: TourHighlightSection[];
  /** When true, titled sections render before the main bullet list (e.g. drop-only “how to book”). */
  highlightSectionsFirst?: boolean;
  /** When set, shown under the duration chip (e.g. fixed-package pricing). */
  startingPriceNote?: string;
  /** When set, tour detail page shows tier row + inclusion paragraph below the price note. */
  priceIncludesBlock?: TourPriceIncludesBlock;
  note?: string;
  /** When set, fixed-package panels show a “More details” link to this path. */
  detailPath?: string;
  /** USD base per person on the package booking summary (fixed packages). */
  bookingBasePriceUsd?: number;
  /** Flat USD for this add-on when selected (per booking, not × travellers). */
  bookingAddonPriceUsd?: number;
  /** Short label on the booking bill line (optional). */
  bookingBillLabel?: string;
}

export const fixedPackages: TourItem[] = [
  {
    id: "fixed-5-opt1",
    kind: "fixed",
    title: "Beach + Safari (Relaxing Tour)",
    duration: "5 days",
    startingPriceNote: "From $674 pp",
    bookingBasePriceUsd: 674,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 4 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      '"No Hurry" – A peaceful journey through the southern coast.',
    detailPath: "/packages/beach-safari-relaxing",
  },
  {
    id: "fixed-5-opt2",
    kind: "fixed",
    title: "Hill Country + Beach (Express Tour)",
    duration: "5 days",
    startingPriceNote: "From $674 pp",
    bookingBasePriceUsd: 674,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 4 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "A fast-paced journey through culture, mountains, and sea.",
    detailPath: "/packages/hill-country-beach-express",
  },
  {
    id: "fixed-5-opt3",
    kind: "fixed",
    title: "The Cultural & Highland Express",
    duration: "7 days",
    startingPriceNote: "From $1020 pp",
    bookingBasePriceUsd: 1020,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 6 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "Village life, Ancient History, and the Beautiful Hill Country.",
    detailPath: "/packages/cultural-highland-express",
  },
  {
    id: "fixed-7-opt1",
    kind: "fixed",
    title: "Nature & Safari Adventure",
    duration: "7 days",
    startingPriceNote: "From $1020 pp",
    bookingBasePriceUsd: 1020,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 6 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "A journey through the mountains leading to the wild heart of Sri Lanka.",
    detailPath: "/packages/nature-safari-adventure",
  },
  {
    id: "fixed-7-opt2",
    kind: "fixed",
    title: "The Beach & Wildlife Dream",
    duration: "7 days",
    startingPriceNote: "From $1020 pp",
    bookingBasePriceUsd: 1020,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 6 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      'A relaxing journey focused on the ocean, coastal culture, and the "Big Game" of the wild.',
    detailPath: "/packages/beach-wildlife-dream",
  },
  {
    id: "fixed-10-opt1",
    kind: "fixed",
    title: "The Ancient & Cultural Grand Tour",
    duration: "10 days",
    startingPriceNote: "From $1495 pp",
    bookingBasePriceUsd: 1495,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 9 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "Ancient Cities, UNESCO Heritage, and the Hill Country.",
    detailPath: "/packages/ancient-cultural-grand-tour",
  },
  {
    id: "fixed-7-opt3",
    kind: "fixed",
    title: "The Southern Beach & Wildlife Loop",
    duration: "10 days",
    startingPriceNote: "From $1495 pp",
    bookingBasePriceUsd: 1495,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 9 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "Coastal relaxation, Galle history, and Safari.",
    detailPath: "/packages/southern-beach-wildlife-loop",
  },
  {
    id: "fixed-10-opt2",
    kind: "fixed",
    title: "Wildlife & Wellness Safari",
    duration: "10 days",
    startingPriceNote: "From $1495 pp",
    bookingBasePriceUsd: 1495,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 9 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "A rhythmic journey through nature, ancient history, and spiritual healing.",
    detailPath: "/packages/wildlife-wellness-safari",
  },
  {
    id: "fixed-10-opt3",
    kind: "fixed",
    title: "Meridiano Ceylon Special (Hidden Gems)",
    duration: "10 days",
    startingPriceNote: "From $1495 pp",
    bookingBasePriceUsd: 1495,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 9 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "Tracking, Waterfalls, and the best of Wellawaya.",
    detailPath: "/packages/meridiano-hidden-gems",
  },
  {
    id: "fixed-16-opt1",
    kind: "fixed",
    title: "North to South Expedition",
    duration: "16 days",
    startingPriceNote: "From $2490 pp",
    bookingBasePriceUsd: 2490,
    priceIncludesBlock: {
      body:
        "This includes your transport in a standard AC vehicle and 3–4 star boutique stays for 15 nights with breakfast. Air tickets and entrance tickets are excluded.",
    },
    description:
      "A complete cross-country journey from the northernmost tip to the southern coast of Sri Lanka.",
    detailPath: "/packages/north-south-expedition",
  },
];

export const fixedPackages5Day = fixedPackages.filter(
  (t) => t.duration === "5 days",
);
export const fixedPackages7Day = fixedPackages.filter(
  (t) => t.duration === "7 days",
);
export const fixedPackages10Day = fixedPackages.filter(
  (t) => t.duration === "10 days",
);
export const fixedPackages16Day = fixedPackages.filter(
  (t) => t.duration === "16 days",
);

/** Layer onto any itinerary — village kitchen, nightlife, wellness, shopping. */
export const addonTours: TourItem[] = [
  {
    id: "spec-village-kitchen",
    kind: "addon",
    title: 'The "Village Kitchen" Experience',
    bookingAddonPriceUsd: 10,
    bookingBillLabel: "The Village Kitchen",
    description:
      "Spend half a day in a traditional village home. Pick fresh ingredients from the garden and learn to cook authentic Sri Lankan curries over a wood-fire stove.",
    detailPath: "/packages/village-kitchen-experience",
  },
  {
    id: "spec-nightlife",
    kind: "addon",
    title: "Nightlife & City Lights",
    bookingAddonPriceUsd: 20,
    description:
      'Add a guided evening in Colombo or a coastal beach party hub. We handle the transport and the "know-how" so you can enjoy the atmosphere safely.',
    detailPath: "/packages/nightlife-city-lights",
  },
  {
    id: "spec-wellness-top-up",
    kind: "addon",
    title: 'Wellness "Top-Up"',
    bookingAddonPriceUsd: 10,
    description:
      "Enhance any tour with a 2-hour professional Ayurvedic massage or a private guided meditation session at a scenic viewpoint.",
    detailPath: "/packages/wellness-top-up",
  },
  {
    id: "spec-shopping",
    kind: "addon",
    title: "Shopping Tours",
    bookingAddonPriceUsd: 15,
    bookingBillLabel: "Shopping Concierge",
    description:
      "A dedicated 4-hour stop at trusted partners for genuine gems, handloom fabrics, or high-end tea—guaranteeing quality and fair pricing.",
    detailPath: "/packages/curated-shopping-tours",
  },
];

export const specialtyTours: TourItem[] = [
  {
    id: "spec-wildlife-photography",
    kind: "specialty",
    title: "Wildlife Photography Tours",
    description:
      "Designed for photographers and media crews who need DWC permits, media visas, drone clearances, and production support across Sri Lanka.",
    detailPath: "/packages/wildlife-photography-tours",
  },
  {
    id: "spec-longterm",
    kind: "specialty",
    title: "Long-Term Tours (Long-Stay Holidays)",
    description:
      "Long stays (one month or more) with the right home base — coast, hills, village, or Colombo — plus Wi-Fi, logistics, and 24/7 support.",
    detailPath: "/packages/long-stay-holidays",
  },
  {
    id: "spec-volunteer-program",
    kind: "specialty",
    title: "Volunteer Program Tours",
    description:
      "Ethical volunteer placements with teaching, Ayurvedic programmes, and local partners — we handle transport, stays, and round-the-clock help.",
    detailPath: "/packages/volunteer-program-tours",
  },
  {
    id: "spec-drop-only",
    kind: "specialty",
    title: "Drops & Pickups",
    description:
      "Start your Sri Lankan adventure with total peace of mind. We provide reliable, private transfers to any corner of the island with professional drivers.",
    detailPath: "/packages/drop-only-tours",
  },
  {
    id: "spec-adventure-adrenaline",
    kind: "specialty",
    title: "Adventure & Adrenaline Tour",
    description:
      "Build your own adventure — rafting, flying, canyoning, ziplines, and ballooning — with intensity and pace set by you.",
    detailPath: "/packages/adventure-adrenaline-tour",
  },
];

/** Home page specialty section: Wildlife Photography tour only. */
export const homeSpecialtyTours = specialtyTours.filter(
  (t) => t.id === "spec-wildlife-photography",
);

export const allTours: TourItem[] = [
  ...fixedPackages,
  ...addonTours,
  ...specialtyTours,
];

/** First tour per unique `duration` — order follows the source array. */
function firstPerDuration(tours: TourItem[]): TourItem[] {
  const seen = new Set<string>();
  return tours.filter((t) => {
    const d = t.duration;
    if (!d || seen.has(d)) return false;
    seen.add(d);
    return true;
  });
}

/** Home preview: one fixed package per duration (e.g. first 5-day, first 7-day). */
export const fixedPackagesFirstPerDuration = firstPerDuration(fixedPackages);

/** Labels for review form + WhatsApp dropdown context */
function tourLabel(t: TourItem): string {
  if (t.kind === "fixed" && t.duration) return `${t.duration}: ${t.title}`;
  if (t.duration) return `${t.title} (${t.duration})`;
  return t.title;
}

export const reviewTourOptions: string[] = [
  ...fixedPackages.map(tourLabel),
  ...addonTours.map(tourLabel),
  ...specialtyTours.map(tourLabel),
  "Custom itinerary",
];
