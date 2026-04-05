export type TourKind = "fixed" | "specialty";

export interface TourItem {
  id: string;
  kind: TourKind;
  title: string;
  duration: string;
  description: string;
  highlights?: string[];
  note?: string;
}

export const fixedPackages: TourItem[] = [
  {
    id: "fixed-5-opt1",
    kind: "fixed",
    title: "Beach + Safari (Relaxing Tour)",
    duration: "5 days",
    description:
      '"No Hurry" – A peaceful journey through the southern coast.',
  },
  {
    id: "fixed-5-opt2",
    kind: "fixed",
    title: "Hill Country + Beach (Express Tour)",
    duration: "5 days",
    description:
      "A fast-paced journey through culture, mountains, and sea.",
  },
  {
    id: "fixed-5-opt3",
    kind: "fixed",
    title: "The Cultural & Highland Express",
    duration: "5 days",
    description:
      "Village life, Ancient History, and the Beautiful Hill Country.",
  },
  {
    id: "fixed-7-opt1",
    kind: "fixed",
    title: "Nature & Safari Adventure",
    duration: "7 days",
    description:
      "A journey through the mountains leading to the wild heart of Sri Lanka.",
  },
  {
    id: "fixed-7-opt2",
    kind: "fixed",
    title: "The Beach & Wildlife Dream",
    duration: "7 days",
    description:
      'A relaxing journey focused on the ocean, coastal culture, and the "Big Game" of the wild.',
  },
  {
    id: "fixed-10-opt1",
    kind: "fixed",
    title: "The Ancient & Cultural Grand Tour",
    duration: "10 days",
    description:
      "Ancient Cities, UNESCO Heritage, and the Hill Country.",
  },
  {
    id: "fixed-7-opt3",
    kind: "fixed",
    title: "The Southern Beach & Wildlife Loop",
    duration: "7 days",
    description:
      "Coastal relaxation, Galle history, and Safari.",
  },
  {
    id: "fixed-10-opt2",
    kind: "fixed",
    title: "Wildlife & Wellness Safari",
    duration: "10 days",
    description:
      "A rhythmic journey through nature, ancient history, and spiritual healing.",
  },
  {
    id: "fixed-10-opt3",
    kind: "fixed",
    title: "Meridiano Ceylon Special (Hidden Gems)",
    duration: "10 days",
    description:
      "Tracking, Waterfalls, and the best of Wellawaya.",
  },
  {
    id: "fixed-16-opt1",
    kind: "fixed",
    title: "North to South Expedition",
    duration: "16 days",
    description:
      "A complete cross-country journey from the northernmost tip to the southern coast of Sri Lanka.",
  },
];

export const specialtyTours: TourItem[] = [
  {
    id: "spec-nightlife",
    kind: "specialty",
    title: "Nightlife",
    duration: "5 days",
    description:
      "Mirissa, Hikkaduwa, Ella, and Colombo after dark — curated for energy and atmosphere.",
    highlights: ["Coastal nights", "Hill town evenings", "Colombo scene"],
    note: "Best on Wednesday, Friday, and Saturday.",
  },
  {
    id: "spec-longterm",
    kind: "specialty",
    title: "Long-Term Tours",
    duration: "1 month",
    description:
      "Quiet beaches or village calm for extended stays — ideal for rest or meditation.",
    highlights: ["Optional scooter or car add-on", "Cooking & laundry via hotel partners"],
  },
  {
    id: "spec-shopping",
    kind: "specialty",
    title: "Shopping Tours",
    duration: "Add-on",
    description:
      "Branded fashion, gems, handlooms, and Ayurvedic products with trusted partners.",
    note: "Can be added to any tour except the 5-day fixed package.",
  },
  {
    id: "spec-volunteer",
    kind: "specialty",
    title: "Volunteer Tours",
    duration: "Custom",
    description:
      "Teaching, Ayurvedic programmes, Scouts, and other service-led experiences.",
  },
  {
    id: "spec-photo",
    kind: "specialty",
    title: "Photography Tours",
    duration: "Custom",
    description:
      "Wildlife and hidden locations with guides who understand light and access.",
    note:
      "DWC permits & media visas: contact us at least 30 days ahead. Drones require prior government approval.",
  },
  {
    id: "spec-beach",
    kind: "specialty",
    title: "Beach Lovers",
    duration: "5 days",
    description:
      "South Coast surfing, diving, and whale watching with qualified instructors.",
  },
  {
    id: "spec-luxury",
    kind: "specialty",
    title: "Luxury Tours",
    duration: "Custom",
    description: "Premium vehicles, high-end hotels, and spa rituals — fully elevated.",
  },
  {
    id: "spec-group",
    kind: "specialty",
    title: "Group Tours",
    duration: "Custom",
    description: "Larger parties, coordinated logistics, and dedicated support.",
  },
];

export const allTours: TourItem[] = [...fixedPackages, ...specialtyTours];

/** Labels for review form + WhatsApp dropdown context */
export const reviewTourOptions: string[] = [
  ...fixedPackages.map((t) => `${t.duration}: ${t.title}`),
  ...specialtyTours.map((t) => `${t.title} (${t.duration})`),
  "Custom itinerary",
];
