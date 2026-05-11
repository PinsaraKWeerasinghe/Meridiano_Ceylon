import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
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
};

/**
 * Persist flash-deal confirmation under the campaign (`request.auth.uid == uid`).
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
    FLASH_DEALS_COLLECTION,
    campaignId,
    FLASH_DEAL_TRAVELLERS_SUBCOLLECTION,
    uid,
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
