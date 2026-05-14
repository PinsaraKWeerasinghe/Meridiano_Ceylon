import type { BookingBillBreakdown } from "@/lib/package-booking-bill";
import type { PackageBookingPartner } from "@/utils/whatsapp";

/** sessionStorage key for handoff `/packages/book` → `/packages/book/checkout`. */
export const PACKAGE_BOOKING_DRAFT_STORAGE_KEY =
  "meridiano:packageBookingDraft";

export type PackageBookingDraftV1 = {
  v: 1;
  packageSlug: string;
  packageTitle: string;
  primaryName: string;
  primaryPassport: string;
  primaryGender: "male" | "female";
  partners: PackageBookingPartner[];
  phone: string;
  /** Selected add-on tour ids */
  addonIds: string[];
  addonTitles: string[];
  notes: string;
  billBreakdown: BookingBillBreakdown | null;
};

function isMaleFemale(g: unknown): g is "male" | "female" {
  return g === "male" || g === "female";
}

function isPartner(x: unknown): x is PackageBookingPartner {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    typeof o.passport === "string" &&
    isMaleFemale(o.gender)
  );
}

export function parsePackageBookingDraft(raw: unknown): PackageBookingDraftV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (typeof o.packageSlug !== "string" || typeof o.packageTitle !== "string")
    return null;
  if (typeof o.primaryName !== "string" || typeof o.primaryPassport !== "string")
    return null;
  if (!isMaleFemale(o.primaryGender)) return null;
  if (typeof o.phone !== "string" || typeof o.notes !== "string") return null;
  if (!Array.isArray(o.partners) || !o.partners.every(isPartner)) return null;
  if (!Array.isArray(o.addonIds) || !o.addonIds.every((id) => typeof id === "string"))
    return null;
  if (
    !Array.isArray(o.addonTitles) ||
    !o.addonTitles.every((t) => typeof t === "string")
  )
    return null;

  const billRaw = o.billBreakdown;
  let billBreakdown: BookingBillBreakdown | null = null;
  if (billRaw === null) {
    billBreakdown = null;
  } else if (billRaw && typeof billRaw === "object") {
    const b = billRaw as Record<string, unknown>;
    const travellerCount = b.travellerCount;
    const packageTitle = b.packageTitle;
    const packagePerPersonUsd = b.packagePerPersonUsd;
    const packageLineTotalUsd = b.packageLineTotalUsd;
    const totalUsd = b.totalUsd;
    const durationLabel =
      typeof b.durationLabel === "string" ? b.durationLabel : undefined;
    if (
      typeof travellerCount === "number" &&
      typeof packageTitle === "string" &&
      Array.isArray(b.addonRows)
    ) {
      const addonRows = b.addonRows.map((row) => {
        const r = row as Record<string, unknown>;
        return {
          label: typeof r.label === "string" ? r.label : "",
          amountUsd:
            typeof r.amountUsd === "number"
              ? r.amountUsd
              : r.amountUsd === null
                ? null
                : null,
        };
      });
      billBreakdown = {
        travellerCount: Math.max(1, Math.floor(travellerCount)),
        packageTitle,
        durationLabel,
        packagePerPersonUsd:
          typeof packagePerPersonUsd === "number"
            ? packagePerPersonUsd
            : packagePerPersonUsd === null
              ? null
              : null,
        packageLineTotalUsd:
          typeof packageLineTotalUsd === "number"
            ? packageLineTotalUsd
            : packageLineTotalUsd === null
              ? null
              : null,
        addonRows,
        totalUsd:
          typeof totalUsd === "number"
            ? totalUsd
            : totalUsd === null
              ? null
              : null,
      };
    }
  }

  return {
    v: 1,
    packageSlug: o.packageSlug,
    packageTitle: o.packageTitle,
    primaryName: o.primaryName,
    primaryPassport: o.primaryPassport,
    primaryGender: o.primaryGender,
    partners: o.partners,
    phone: o.phone,
    addonIds: o.addonIds,
    addonTitles: o.addonTitles,
    notes: o.notes,
    billBreakdown,
  };
}

export function safeReadDraftFromStorage(): PackageBookingDraftV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PACKAGE_BOOKING_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return parsePackageBookingDraft(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}
