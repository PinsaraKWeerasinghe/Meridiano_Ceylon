export type TourKind = "fixed" | "addon" | "specialty";

export interface TourItem {
  id: string;
  kind: TourKind;
  title: string;
  /** Shown as a chip on cards/panels; omit when not useful (e.g. add-ons). */
  duration?: string;
  description: string;
  highlights?: string[];
  note?: string;
  /** When set, fixed-package panels show a “More details” link to this path. */
  detailPath?: string;
}

export const fixedPackages: TourItem[] = [
  {
    id: "fixed-5-opt1",
    kind: "fixed",
    title: "Beach + Safari (Relaxing Tour)",
    duration: "5 days",
    description:
      '"No Hurry" – A peaceful journey through the southern coast.',
    detailPath: "/packages/beach-safari-relaxing",
  },
  {
    id: "fixed-5-opt2",
    kind: "fixed",
    title: "Hill Country + Beach (Express Tour)",
    duration: "5 days",
    description:
      "A fast-paced journey through culture, mountains, and sea.",
    detailPath: "/packages/hill-country-beach-express",
  },
  {
    id: "fixed-7-opt1",
    kind: "fixed",
    title: "Nature & Safari Adventure",
    duration: "7 days",
    description:
      "A journey through the mountains leading to the wild heart of Sri Lanka.",
    detailPath: "/packages/nature-safari-adventure",
  },
  {
    id: "fixed-7-opt2",
    kind: "fixed",
    title: "The Beach & Wildlife Dream",
    duration: "7 days",
    description:
      'A relaxing journey focused on the ocean, coastal culture, and the "Big Game" of the wild.',
    detailPath: "/packages/beach-wildlife-dream",
  },
  {
    id: "fixed-5-opt3",
    kind: "fixed",
    title: "The Cultural & Highland Express",
    duration: "7 days",
    description:
      "Village life, Ancient History, and the Beautiful Hill Country.",
    detailPath: "/packages/cultural-highland-express",
  },
  {
    id: "fixed-10-opt1",
    kind: "fixed",
    title: "The Ancient & Cultural Grand Tour",
    duration: "10 days",
    description:
      "Ancient Cities, UNESCO Heritage, and the Hill Country.",
    detailPath: "/packages/ancient-cultural-grand-tour",
  },
  {
    id: "fixed-7-opt3",
    kind: "fixed",
    title: "The Southern Beach & Wildlife Loop",
    duration: "10 days",
    description:
      "Coastal relaxation, Galle history, and Safari.",
    detailPath: "/packages/southern-beach-wildlife-loop",
  },
  {
    id: "fixed-10-opt2",
    kind: "fixed",
    title: "Wildlife & Wellness Safari",
    duration: "10 days",
    description:
      "A rhythmic journey through nature, ancient history, and spiritual healing.",
    detailPath: "/packages/wildlife-wellness-safari",
  },
  {
    id: "fixed-10-opt3",
    kind: "fixed",
    title: "Meridiano Ceylon Special (Hidden Gems)",
    duration: "10 days",
    description:
      "Tracking, Waterfalls, and the best of Wellawaya.",
    detailPath: "/packages/meridiano-hidden-gems",
  },
  {
    id: "fixed-16-opt1",
    kind: "fixed",
    title: "North to South Expedition",
    duration: "16 days",
    description:
      "A complete cross-country journey from the northernmost tip to the southern coast of Sri Lanka.",
    detailPath: "/packages/north-south-expedition",
  },
];

/** Layer onto any itinerary — nightlife, shopping, volunteering, photography, beach. */
export const addonTours: TourItem[] = [
  {
    id: "spec-nightlife",
    kind: "addon",
    title: "Nightlife",
    description:
      "Mirissa, Hikkaduwa, Ella, and Colombo after dark — curated for energy and atmosphere.",
    highlights: ["Coastal nights", "Hill town evenings", "Colombo scene"],
    note: "Best on Wednesday, Friday, and Saturday.",
  },
  {
    id: "spec-shopping",
    kind: "addon",
    title: "Shopping Tours",
    description:
      "Branded fashion, gems, handlooms, and Ayurvedic products with trusted partners.",
    note: "Can be added to any tour except the 5-day fixed package.",
  },
  {
    id: "spec-volunteer",
    kind: "addon",
    title: "Volunteer Tours",
    description:
      "Teaching, Ayurvedic programmes, Scouts, and other service-led experiences.",
  },
  {
    id: "spec-photo",
    kind: "addon",
    title: "Photography Tours",
    description:
      "Wildlife and hidden locations with guides who understand light and access.",
    note:
      "DWC permits & media visas: contact us at least 30 days ahead. Drones require prior government approval.",
  },
  {
    id: "spec-beach",
    kind: "addon",
    title: "Beach Lovers",
    description:
      "South Coast surfing, diving, and whale watching with qualified instructors.",
  },
];

export const specialtyTours: TourItem[] = [
  {
    id: "spec-longterm",
    kind: "specialty",
    title: "Long-Term Tours",
    description:
      "Quiet beaches or village calm for extended stays — ideal for rest or meditation.",
    highlights: ["Optional scooter or car add-on", "Cooking & laundry via hotel partners"],
  },
  {
    id: "spec-luxury",
    kind: "specialty",
    title: "Luxury Tours",
    description: "Premium vehicles, high-end hotels, and spa rituals — fully elevated.",
  },
  {
    id: "spec-drop-only",
    kind: "specialty",
    title: "Drop only tours",
    description:
      "Point-to-point transport: we pick you up and drop you at your destination — simple, reliable, and on your schedule.",
  },
];

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
