import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import type { PackageBookingPartner } from "@/utils/whatsapp";

/** Traveller confirmations: `users/{uid}/flashDeals/{flashDealDocId}` */
export const USER_FLASH_DEALS_CONFIRMATIONS_SUBCOLLECTION = "flashDeals";

export type SaveUserFlashDealConfirmationPayload = {
  /** Must match Firestore doc id and `flashDeals/{flashDealDocId}` campaign doc. */
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
};

/**
 * Persist flash-deal confirmation under the signed-in traveller (`request.auth.uid == userId`).
 * Requires `flashDeals/{flashDealDocId}` to exist (see Firestore rules).
 */
export async function saveUserFlashDealConfirmation(
  uid: string,
  payload: SaveUserFlashDealConfirmationPayload,
): Promise<void> {
  const db = getFirestoreDb();
  const campaignId = payload.flashDealDocId.trim();
  if (!campaignId) throw new Error("flashDealDocId is required.");

  const ref = doc(
    db,
    "users",
    uid,
    USER_FLASH_DEALS_CONFIRMATIONS_SUBCOLLECTION,
    campaignId,
  );

  const data = {
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

  await setDoc(ref, data, { merge: true });
}
