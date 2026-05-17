import {
  collection,
  onSnapshot,
  query,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
import { FLASH_DEAL_TRAVELLERS_SUBCOLLECTION } from "@/lib/flash-deal-user-confirmation";

/** Snapshot of a traveller doc at `flashDeals/{campaignId}/Travellers/{uid}`. */
export type FlashDealCampaignTravellerRow = {
  uid: string;
  primaryName: string;
  primaryPassport: string;
  primaryGender: "male" | "female" | "";
  phone: string;
  partnersCount: number;
  packageTitle: string;
  packageSlug: string;
  addonTitles: string[];
  notes: string;
  submitterEmail: string | null;
  submittedAt: Date | null;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readGender(value: unknown): "male" | "female" | "" {
  const s = readString(value).toLowerCase();
  return s === "male" || s === "female" ? s : "";
}

function parseTravellerDoc(
  docSnap: QueryDocumentSnapshot,
): FlashDealCampaignTravellerRow {
  const data = docSnap.data() as Record<string, unknown>;
  const partners = Array.isArray(data.partners) ? data.partners : [];
  const addonTitlesRaw = Array.isArray(data.addonTitles) ? data.addonTitles : [];
  const addonTitles = addonTitlesRaw
    .map((v) => readString(v))
    .filter((v) => v !== "");

  let submittedAt: Date | null = null;
  const submittedRaw = data.submittedAt;
  if (
    submittedRaw &&
    typeof submittedRaw === "object" &&
    "toDate" in submittedRaw &&
    typeof (submittedRaw as Timestamp).toDate === "function"
  ) {
    submittedAt = (submittedRaw as Timestamp).toDate();
  }

  const submitterEmailRaw = data.submitterEmail;
  const submitterEmail =
    typeof submitterEmailRaw === "string" && submitterEmailRaw.trim() !== ""
      ? submitterEmailRaw.trim()
      : null;

  return {
    uid: docSnap.id.trim(),
    primaryName: readString(data.primaryName),
    primaryPassport: readString(data.primaryPassport),
    primaryGender: readGender(data.primaryGender),
    phone: readString(data.phone),
    partnersCount: partners.length,
    packageTitle: readString(data.packageTitle),
    packageSlug: readString(data.packageSlug),
    addonTitles,
    notes: readString(data.notes),
    submitterEmail,
    submittedAt,
  };
}

/**
 * Live admin list of travellers under `flashDeals/{campaignId}/Travellers`.
 * Admin reads the parent campaign's Travellers subcollection directly (rules allow `isAdmin()`).
 * Sorted by `submittedAt` desc with tie-break on uid for stable order.
 */
export function subscribeFlashDealCampaignTravellers(
  campaignId: string,
  onRows: (rows: FlashDealCampaignTravellerRow[]) => void,
  onListenError?: (message: string | null) => void,
): Unsubscribe {
  const trimmed = campaignId.trim();
  if (trimmed === "") {
    onListenError?.(null);
    onRows([]);
    return () => {};
  }

  const db = getFirestoreDb();
  const travellersRef = collection(
    db,
    FLASH_DEALS_COLLECTION,
    trimmed,
    FLASH_DEAL_TRAVELLERS_SUBCOLLECTION,
  );

  return onSnapshot(
    query(travellersRef),
    (snap) => {
      const rows: FlashDealCampaignTravellerRow[] = [];
      snap.forEach((docSnap) => rows.push(parseTravellerDoc(docSnap)));
      rows.sort((a, b) => {
        const ta = a.submittedAt?.getTime() ?? 0;
        const tb = b.submittedAt?.getTime() ?? 0;
        if (tb !== ta) return tb - ta;
        return a.uid.localeCompare(b.uid);
      });
      onListenError?.(null);
      onRows(rows);
    },
    (err) => {
      onListenError?.(err.message);
      onRows([]);
    },
  );
}
