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
    id: "fixed-5",
    kind: "fixed",
    title: "Hill Country + Beach",
    duration: "5 days",
    description:
      "Misty mountains and the south coast in one refined loop — tea country charm paired with ocean calm.",
    highlights: ["Ella & tea country", "Coastal downtime", "Private driver"],
  },
  {
    id: "fixed-7",
    kind: "fixed",
    title: "Hill Country + Safari + Beach",
    duration: "7 days",
    description:
      "The classic triangle: cool highlands, wildlife, and Indian Ocean sunsets.",
    highlights: ["National park safari", "Hill stations", "Beach finale"],
  },
  {
    id: "fixed-10",
    kind: "fixed",
    title: "Village Culture + Hill Country + Safari + Beach",
    duration: "10 days",
    description:
      "Deeper immersion: authentic village life, landscapes, wildlife, and the coast.",
    highlights: ["Village encounters", "Safari", "Hills & beaches"],
  },
  {
    id: "fixed-14",
    kind: "fixed",
    title: "Village + Ancient/Ayurvedic + Hill + Safari + Beach",
    duration: "14 days",
    description:
      "Our flagship journey — heritage, wellness undertones, nature, and sea.",
    highlights: ["Cultural depth", "Ayurvedic options", "Full island story"],
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
