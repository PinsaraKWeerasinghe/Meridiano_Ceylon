import {
  collection,
  onSnapshot,
  query,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
import { FLASH_DEAL_TRAVELLERS_SUBCOLLECTION } from "@/lib/flash-deal-user-confirmation";
import { getFirestoreDb } from "@/lib/firebase/db";

export type FlashDealCampaignBookingRow = {
  userUid: string;
  primaryName: string;
  phone: string;
  submitterEmail: string | null;
  submittedAt: Date | null;
};

function asDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }
  return null;
}

function parseBookingDoc(
  docSnap: QueryDocumentSnapshot,
): FlashDealCampaignBookingRow {
  const d = docSnap.data() as Record<string, unknown>;
  const primaryName =
    typeof d.primaryName === "string" ? d.primaryName.trim() : "";
  const phone = typeof d.phone === "string" ? d.phone.trim() : "";
  const submitterEmail =
    typeof d.submitterEmail === "string" && d.submitterEmail.trim() !== ""
      ? d.submitterEmail.trim()
      : null;
  return {
    userUid: docSnap.id,
    primaryName,
    phone,
    submitterEmail,
    submittedAt: asDate(d.submittedAt),
  };
}

/**
 * Lists traveller confirmations for one campaign:
 * `flashDeals/{campaignId}/Travellers/*`
 */
export function subscribeFlashDealBookingsForCampaign(
  campaignId: string,
  onRows: (rows: FlashDealCampaignBookingRow[]) => void,
  onListenError?: (message: string | null) => void,
): Unsubscribe {
  const trimmed = campaignId.trim();
  const db = getFirestoreDb();
  const q = query(
    collection(
      db,
      FLASH_DEALS_COLLECTION,
      trimmed,
      FLASH_DEAL_TRAVELLERS_SUBCOLLECTION,
    ),
  );

  return onSnapshot(
    q,
    (snap) => {
      const rows: FlashDealCampaignBookingRow[] = [];
      snap.forEach((docSnap) => {
        rows.push(parseBookingDoc(docSnap));
      });
      rows.sort(
        (a, b) =>
          (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
      );
      onListenError?.(null);
      onRows(rows);
    },
    (err) => {
      onListenError?.(err.message);
      onRows([]);
    },
  );
}
