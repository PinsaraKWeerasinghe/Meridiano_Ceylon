import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
import {
  TRIP_REF_COUNTERS_COLLECTION,
  USER_PROFILE_FLASH_DEALS_SUBCOLLECTION,
} from "@/lib/user-bookings";
import {
  assertValidTripSegmentKey,
  buildFlashTripSegment,
  formatTripRefWithSequence,
} from "@/lib/trip-ref-format";
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
  /** Campaign deal date (UI); My Bookings uses `dealDate` on `flashDeals/{id}` when ledger is slim. */
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
 * First-time bookings: writes `flashDeals/{campaign}/Travellers/{uid}`,
 * allocates Trip ID (`users/{uid}/flashDeals/{campaign}`), increments `tripRefCounters`, and increments
 * `slotsTaken` on the campaign — atomically.
 * Re-submits are ignored — edits use support flow or a future profile path.
 */
export async function saveUserFlashDealConfirmation(
  uid: string,
  payload: SaveUserFlashDealConfirmationPayload,
): Promise<void> {
  const db = getFirestoreDb();
  const trimmedUid = uid.trim();
  if (!trimmedUid) throw new Error("User id is required.");

  const campaignId = payload.flashDealDocId.trim();
  if (!campaignId) throw new Error("flashDealDocId is required.");

  const dealRef = doc(db, FLASH_DEALS_COLLECTION, campaignId);
  const travellerRef = doc(
    db,
    FLASH_DEALS_COLLECTION,
    campaignId,
    FLASH_DEAL_TRAVELLERS_SUBCOLLECTION,
    trimmedUid,
  );

  const userFlashDocRef = doc(
    db,
    "users",
    trimmedUid,
    USER_PROFILE_FLASH_DEALS_SUBCOLLECTION,
    campaignId,
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

  await runTransaction(db, async (transaction) => {
    const dealSnap = await transaction.get(dealRef);
    const travellerSnap = await transaction.get(travellerRef);
    if (!dealSnap.exists()) {
      throw new Error("This flash deal is no longer available.");
    }

    const isRepeat = travellerSnap.exists();
    if (isRepeat) {
      return;
    }

    const userFlashSnap = await transaction.get(userFlashDocRef);
    if (userFlashSnap.exists()) {
      throw new Error(
        "Flash deal enrollment is already recorded for this campaign.",
      );
    }

    const dealData = dealSnap.data() as Record<string, unknown>;
    const maxSlots = maxSlotsFromDeal(dealData);
    const taken = slotsTakenFromDeal(dealData);

    if (maxSlots < 1) {
      throw new Error("This campaign is not open for booking yet.");
    }
    if (taken >= maxSlots) {
      throw new Error("All spots for this flash deal are filled.");
    }

    const segmentKey = buildFlashTripSegment(
      payload.packageTitle.trim(),
    ).toUpperCase();
    assertValidTripSegmentKey(segmentKey);
    const counterRef = doc(db, TRIP_REF_COUNTERS_COLLECTION, segmentKey);
    const ctrSnap = await transaction.get(counterRef);

    let lastAllocated = 0;
    if (ctrSnap.exists()) {
      const n = (ctrSnap.data() as { next?: unknown }).next;
      if (typeof n === "number" && Number.isFinite(n)) {
        lastAllocated = Math.trunc(n);
      }
    }
    const newSeq = lastAllocated + 1;
    const tripRef = formatTripRefWithSequence(segmentKey, newSeq);

    transaction.set(
      counterRef,
      { next: newSeq },
      { merge: true },
    );

    transaction.set(travellerRef, travellerPayload);

    transaction.set(userFlashDocRef, {
      ...travellerPayload,
      kind: "flash-deal",
      tripRef,
      paymentStatus: "pending-payment",
      tripStatus: "pending-payment",
      createdAt: serverTimestamp(),
    });

    transaction.update(dealRef, { slotsTaken: taken + 1 });
  });
}
