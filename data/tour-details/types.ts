export type TourDetailDay = {
  title: string;
  bullets: string[];
};

export type TourDetailPhase = {
  title: string;
  days: TourDetailDay[];
};

export type TourDetailContent = {
  tourId: string;
  slug: string;
  pageTitle: string;
  /** e.g. "Option 01:" prefix on the page */
  optionLabel?: string;
  metaDescription: string;
  durationLabel: string;
  /** Lead copy under the title */
  intro: string[];
  theme?: string;
  /** Shown when not using theme (e.g. Focus for some 10-day tours) */
  focus?: string;
  /** Standard day-by-day layout */
  days?: TourDetailDay[];
  /** Alternative layout (e.g. 16-day phased itinerary) */
  phases?: TourDetailPhase[];
  tips?: string[];
  notes?: { title: string; body: string }[];
  closingLine?: string;
  /** Shared “Quick summary for your clients” block for 10-day options */
  tenDayClientSummary?: boolean;
  /** Extra bullets after the itinerary (e.g. North–South highlights) */
  highlightBullets?: string[];
};
