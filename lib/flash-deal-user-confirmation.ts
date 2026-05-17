import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
import { appendUserBooking } from "@/lib/user-bookings";
import { buildFlashTripSegment } from "@/lib/trip-ref-format";
import type { PackageBookingPartner } from "@/utils/whatsapp";

/** Traveller confirmations: `flashDeals/{campaignId}/Travellers/{uid}` */
export const FLASH_DEAL_TRAVELLERS_SUBCOLLECTION = "Travellers";

export type SaveUserFlashDealConfirmationPayload = {
  /** Must match parent campaign doc id `flashDeals/{flashDealDocId}`. */
  flashDealDocId: string;
  packageSlug: string;
  packageTitle: string;
  primaryName: string;
  primaryPassport: string;
  primaryGender: "male" | "female";
  partners: PackageBookingPartner[];
  phone: string;
  addonTitles: string[];
  notes: string;
  estimatedBillLines: string[];
  submitterEmail: string | null;
  /** Campaign deal date ISO `YYYY-MM-DD` for My Bookings */
  dealDate: string;
};

function nonNegativeInt(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.trunc(value);
    return n >= 0 ? n : 0;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (/^\d+$/.test(s)) {
      const n = Number.parseInt(s, 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    }
  }
  return 0;
}

function positiveInt(value: unknown): number {
  const n = nonNegativeInt(value);
  return n >= 1 ? n : 0;
}

function slotsTakenFromDeal(data: Record<string, unknown>): number {
  return nonNegativeInt(data.slotsTaken);
}

function maxSlotsFromDeal(data: Record<string, unknown>): number {
  return positiveInt(data.maxSlots);
}

/**
 * Persist flash-deal confirmation under the campaign (`request.auth.uid == uid`).
 * Increments `flashDeals/{campaign}.slotsTaken` once per new traveller doc (same
 * transaction as the traveller write). Public availability reads `slotsTaken` from
 * the campaign document.
 */
export async function saveUserFlashDealConfirmation(
  uid: string,
  payload: SaveUserFlashDealConfirmationPayload,
): Promise<void> {
  const db = getFirestoreDb();
  const campaignId = payload.flashDealDocId.trim();
  if (!campaignId) throw new Error("flashDealDocId is required.");

  const dealRef = doc(db, FLASH_DEALS_COLLECTION, campaignId);
  const travellerRef = doc(
    db,
    FLASH_DEALS_COLLECTION,
    campaignId,
    FLASH_DEAL_TRAVELLERS_SUBCOLLECTION,
    uid,
  );

  const travellerPayload = {
    flashDealDocId: campaignId,
    packageSlug: payload.packageSlug,
    packageTitle: payload.packageTitle,
    primaryName: payload.primaryName,
    primaryPassport: payload.primaryPassport,
    primaryGender: payload.primaryGender,
    partners: payload.partners.map((p) => ({
      name: p.name,
      passport: p.passport,
      gender: p.gender,
    })),
    phone: payload.phone,
    addonTitles: payload.addonTitles,
    notes: payload.notes.trim(),
    estimatedBillLines: payload.estimatedBillLines,
    submitterEmail: payload.submitterEmail,
    submittedAt: serverTimestamp(),
  };

  let shouldAppendLedger = false;

  await runTransaction(db, async (transaction) => {
    const dealSnap = await transaction.get(dealRef);
    const travellerSnap = await transaction.get(travellerRef);
    if (!dealSnap.exists()) {
      throw new Error("This flash deal is no longer available.");
    }

    const dealData = dealSnap.data() as Record<string, unknown>;
    const maxSlots = maxSlotsFromDeal(dealData);
    const taken = slotsTakenFromDeal(dealData);
    const isNewBooking = !travellerSnap.exists();
    shouldAppendLedger = isNewBooking;

    if (isNewBooking) {
      if (maxSlots < 1) {
        throw new Error("This campaign is not open for booking yet.");
      }
      if (taken >= maxSlots) {
        throw new Error("All spots for this flash deal are filled.");
      }
    }

    transaction.set(travellerRef, travellerPayload, { merge: true });

    if (isNewBooking) {
      transaction.update(dealRef, { slotsTaken: taken + 1 });
    }
  });

  if (shouldAppendLedger) {
    const dealDateIso = /^\d{4}-\d{2}-\d{2}$/.test(payload.dealDate.trim())
      ? payload.dealDate.trim()
      : "";
    try {
      await appendUserBooking(uid, {
        kind: "flash-deal",
        typeLabel: `Flash deal · ${payload.packageTitle.trim()}`,
        bookingDate: dealDateIso,
        packageSlug: payload.packageSlug.trim(),
        flashDealDocId: campaignId,
        tripSegmentKey: buildFlashTripSegment(payload.packageTitle.trim()),
      });
    } catch {
      // Booking already persisted under campaign; ledger is best-effort.
    }
  }
}
