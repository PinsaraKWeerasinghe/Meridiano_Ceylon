export type TourMode = "private" | "group";

export type TransportMode = "driver" | "selfDrive" | "scooter";

export type BudgetTier = "budget" | "standard" | "luxury";

export type InsuranceChoice = "meridiano" | "own" | "none";

export const VIBE_IDS = [
  "beach",
  "safari",
  "cultural",
  "nightlife",
  "hillCountry",
  "adventure",
  "shopping",
  "ayurvedic",
  "village",
  "food",
  "city",
  "camping",
  "volunteer",
  "photography",
] as const;

export type VibeId = (typeof VIBE_IDS)[number];

export const VIBE_LABELS: Record<VibeId, string> = {
  beach: "Beach",
  safari: "Safari",
  cultural: "Cultural",
  nightlife: "Nightlife",
  hillCountry: "Hill Country",
  adventure: "Adventure",
  shopping: "Shopping",
  ayurvedic: "Ayurvedic / Meditation",
  village: "Village Life",
  food: "Local Foods",
  city: "City Tours",
  camping: "Camping",
  volunteer: "Volunteer",
  photography: "Photography",
};

export interface JourneyFormPayload {
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelingWithPets: boolean;
  tourMode: TourMode;
  vibes: VibeId[];
  transport: TransportMode;
  budget: BudgetTier;
  insurance: InsuranceChoice;
  insurancePolicyNumber: string;
}

const transportLabel: Record<TransportMode, string> = {
  driver: "Car with professional driver",
  selfDrive: "Self-drive (rental)",
  scooter: "Scooter rental",
};

const budgetLabel: Record<BudgetTier, string> = {
  budget: "Budget vehicle",
  standard: "Standard vehicle",
  luxury: "Luxury vehicle",
};

const insuranceLabel: Record<InsuranceChoice, string> = {
  meridiano: "Meridiano 24/7 Safety & Medical Support Cover",
  own: "Own insurance (policy number provided)",
  none: "Not selected yet",
};

export function buildJourneyWhatsAppMessage(data: JourneyFormPayload): string {
  const lines: string[] = [
    "Meridiano Ceylon — Build Your Journey",
    "",
    `Dates: ${data.startDate || "(not set)"} → ${data.endDate || "(not set)"}`,
    `Adults: ${data.adults} · Children: ${data.children}`,
    `Traveling with pets: ${data.travelingWithPets ? "Yes — please advise pet-friendly vehicle/hotels" : "No"}`,
    `Tour: ${data.tourMode === "private" ? "Private" : "Group"}`,
    `Transport: ${transportLabel[data.transport]}`,
    `Vehicle tier: ${budgetLabel[data.budget]}`,
    "",
    "Vibes:",
  ];

  if (data.vibes.length === 0) {
    lines.push("— (none selected)");
  } else {
    data.vibes.forEach((v) => lines.push(`• ${VIBE_LABELS[v]}`));
  }

  lines.push("", "Insurance / safety add-on:");
  lines.push(`• ${insuranceLabel[data.insurance]}`);
  if (data.insurance === "own" && data.insurancePolicyNumber.trim()) {
    lines.push(`  Policy #: ${data.insurancePolicyNumber.trim()}`);
  }

  lines.push(
    "",
    "Please confirm availability and share places + pricing. Thank you!",
  );

  return lines.join("\n");
}

export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return raw.replace(/\D/g, "");
}

export function openWhatsAppWithText(text: string): void {
  const num = getWhatsAppNumber();
  if (!num || typeof window === "undefined") return;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export type PackageBookingPartner = {
  name: string;
  passport: string;
  gender: "male" | "female";
};

export type PackageBookingPayload = {
  primaryName: string;
  primaryPassport: string;
  primaryGender: "male" | "female";
  partners: PackageBookingPartner[];
  packageTitle: string;
  phone: string;
  selectedAddonTitles: string[];
  notes: string;
};

export function buildPackageBookingWhatsAppMessage(
  data: PackageBookingPayload,
): string {
  const lines: string[] = [
    "Meridiano Ceylon — Package booking request",
    "",
    `Package: ${data.packageTitle}`,
    `Phone: ${data.phone}`,
    "",
    "Lead traveller:",
    `• Name: ${data.primaryName}`,
    `• Passport: ${data.primaryPassport}`,
    `• Gender: ${data.primaryGender === "male" ? "Male" : "Female"}`,
  ];

  if (data.partners.length > 0) {
    lines.push("", "Travel partners:");
    data.partners.forEach((p, i) => {
      lines.push(
        `${i + 1}. ${p.name} — Passport: ${p.passport} — ${p.gender === "male" ? "Male" : "Female"}`,
      );
    });
  }

  lines.push("", "Selected add-ons:");
  if (data.selectedAddonTitles.length === 0) {
    lines.push("— (none)");
  } else {
    data.selectedAddonTitles.forEach((t) => lines.push(`• ${t}`));
  }

  lines.push("", "Special notes:");
  lines.push(data.notes.trim() || "—");

  lines.push(
    "",
    "Please confirm availability and next steps. Thank you!",
  );

  return lines.join("\n");
}
