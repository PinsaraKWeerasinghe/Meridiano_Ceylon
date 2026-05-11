import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type DocumentSnapshot,
  type QuerySnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { colomboDayBoundsMs } from "@/lib/flash-deal-colombo";
import { getFirestoreDb } from "@/lib/firebase/db";

/** Campaign documents (admin CMS); matches Firestore rules `flashDeals/{docId}`. */
export const FLASH_DEALS_COLLECTION = "flashDeals";

/**
 * Legacy singleton doc id — used as banner/detail **fallback** when no deal has
 * `isFeatured: true`. Traveller confirmations still use each campaign’s real doc id.
 */
export const FLASH_DEAL_LEGACY_DOC_ID = "current";

/** @deprecated Use {@link FLASH_DEAL_LEGACY_DOC_ID} */
export const FLASH_DEAL_CAMPAIGN_DOC_ID = FLASH_DEAL_LEGACY_DOC_ID;

/** Public route for full flash-deal content */
export const FLASH_DEAL_DETAIL_PATH = "/flash-deal";

export type FlashDealItinerarySnap = {
  title: string;
  description: string;
};

export type FlashDealSettingsInput = {
  title: string;
  /** ISO `YYYY-MM-DD` */
  dealDate: string;
  disabled: boolean;
  /** Drives homepage banner + `/flash-deal` together with {@link disabled}. */
  isFeatured: boolean;
  description: string;
  /** ISO `YYYY-MM-DD` — fixed departure window start */
  fixedTourStartDate: string;
  /** ISO `YYYY-MM-DD` — fixed departure window end */
  fixedTourEndDate: string;
  perPersonCharge: string;
  groupSize: string;
  hotelLevel: string;
  transport: string;
  itinerarySnaps: FlashDealItinerarySnap[];
  registrationPrice: string;
};

export type FlashDealBarConfig = {
  title: string;
  dealDate: string;
  dealWindowStartMs: number;
  dealEndMs: number;
};

/** Full offer copy for the `/flash-deal` page (banner can still show when this parses). */
export type FlashDealDetailContent = Omit<
  FlashDealSettingsInput,
  "disabled"
>;

export const DEFAULT_ITINERARY_SNAP: FlashDealItinerarySnap = {
  title: "Itinerary highlight",
  description:
    "Describe this stage of the journey — route, experiences, or pacing.",
};

function normalizeItinerarySnaps(value: unknown): FlashDealItinerarySnap[] {
  if (!Array.isArray(value)) return [{ ...DEFAULT_ITINERARY_SNAP }];
  const out: FlashDealItinerarySnap[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const description =
      typeof o.description === "string" ? o.description.trim() : "";
    if (!title && !description) continue;
    out.push({
      title: title || "Itinerary highlight",
      description,
    });
  }
  return out.length > 0 ? out : [{ ...DEFAULT_ITINERARY_SNAP }];
}

export function sanitizeItinerarySnapsForSave(
  snaps: FlashDealItinerarySnap[],
): FlashDealItinerarySnap[] {
  const cleaned = snaps
    .map((s) => ({
      title: s.title.trim(),
      description: s.description.trim(),
    }))
    .filter((s) => s.title.length > 0 || s.description.length > 0);
  return cleaned.length > 0 ? cleaned : [{ ...DEFAULT_ITINERARY_SNAP }];
}

function strField(data: Record<string, unknown>, key: string): string {
  const v = data[key];
  return typeof v === "string" ? v.trim() : "";
}

function isoDateOrEmpty(data: Record<string, unknown>, key: string): string {
  const s = strField(data, key);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function asTimestamp(value: unknown): Timestamp | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return value as Timestamp;
  }
  return null;
}

export function parseFlashDealForBar(
  data: Record<string, unknown>,
): FlashDealBarConfig | null {
  if (data.disabled === true) return null;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const dealDate =
    typeof data.dealDate === "string" ? data.dealDate.trim() : "";
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(dealDate)) return null;

  const bounds = colomboDayBoundsMs(dealDate);
  if (!bounds) return null;

  return {
    title,
    dealDate,
    dealWindowStartMs: bounds.startMs,
    dealEndMs: bounds.endMs,
  };
}

export function parseFlashDealForDetailPage(
  data: Record<string, unknown>,
): FlashDealDetailContent | null {
  if (data.disabled === true) return null;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const dealDate =
    typeof data.dealDate === "string" ? data.dealDate.trim() : "";
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(dealDate)) return null;

  return {
    title,
    dealDate,
    description: strField(data, "description"),
    fixedTourStartDate: isoDateOrEmpty(data, "fixedTourStartDate"),
    fixedTourEndDate: isoDateOrEmpty(data, "fixedTourEndDate"),
    perPersonCharge: strField(data, "perPersonCharge"),
    groupSize: strField(data, "groupSize"),
    hotelLevel: strField(data, "hotelLevel"),
    transport: strField(data, "transport"),
    itinerarySnaps: normalizeItinerarySnaps(data.itinerarySnaps),
    registrationPrice: strField(data, "registrationPrice"),
  };
}

export type FlashDealAdminMeta = {
  createdByUid: string;
  createdByEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedByUid: string;
  lastModifiedByEmail: string | null;
};

const DEFAULT_FLASH_DEAL_FORM: FlashDealSettingsInput = {
  title: "Exclusive Sri Lanka packages - limited slots",
  dealDate: "2026-06-06",
  disabled: false,
  isFeatured: false,
  description:
    "Limited slots on curated fixed-date departures. Transport, boutique stays, and breakfast included unless noted.",
  fixedTourStartDate: "2026-06-01",
  fixedTourEndDate: "2026-06-14",
  perPersonCharge: "From USD — see registration summary",
  groupSize: "Small groups; exact size confirmed at booking",
  hotelLevel: "3–4 star boutique stays",
  transport: "Standard AC vehicle with private driver",
  itinerarySnaps: [{ ...DEFAULT_ITINERARY_SNAP }],
  registrationPrice: "Registration fee confirmed on enquiry",
};

export type FlashDealListRow = {
  id: string;
  title: string;
  dealDate: string;
  disabled: boolean;
  isFeatured: boolean;
};

function timestampMs(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (value as Timestamp).toMillis === "function"
  ) {
    return (value as Timestamp).toMillis();
  }
  return 0;
}

function docSortMs(data: Record<string, unknown>): number {
  const u = timestampMs(data.updatedAt);
  if (u) return u;
  return timestampMs(data.createdAt);
}

export function createEmptyFlashDealDraft(): FlashDealSettingsInput {
  return { ...DEFAULT_FLASH_DEAL_FORM };
}

export async function listFlashDealsForAdmin(): Promise<FlashDealListRow[]> {
  const snap = await getDocs(collection(getFirestoreDb(), FLASH_DEALS_COLLECTION));
  const decorated = snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const title =
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : "(Untitled)";
    const dealDate =
      typeof data.dealDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.dealDate.trim())
        ? data.dealDate.trim()
        : "";
    const row: FlashDealListRow = {
      id: d.id,
      title,
      dealDate,
      disabled: data.disabled === true,
      isFeatured: data.isFeatured === true,
    };
    return { row, ms: docSortMs(data) };
  });
  decorated.sort((a, b) => b.ms - a.ms);
  return decorated.map((x) => x.row);
}

function pickBestFromFeaturedQuery<T>(
  snap: QuerySnapshot,
  parse: (data: Record<string, unknown>) => T | null,
): T | null {
  let best: { value: T; ms: number } | null = null;
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown>;
    const value = parse(data);
    if (value === null) continue;
    const ms = docSortMs(data);
    if (!best || ms >= best.ms) best = { value, ms };
  }
  return best?.value ?? null;
}

function subscribeFeaturedOrLegacyFlashDeal<T>(
  parse: (data: Record<string, unknown>) => T | null,
  onValue: (value: T | null) => void,
): Unsubscribe {
  const db = getFirestoreDb();
  let fromFeatured: T | null = null;
  let fromLegacy: T | null = null;

  const emit = () => onValue(fromFeatured ?? fromLegacy);

  const unsubFeatured = onSnapshot(
    query(
      collection(db, FLASH_DEALS_COLLECTION),
      where("isFeatured", "==", true),
      limit(25),
    ),
    (qSnap) => {
      fromFeatured = pickBestFromFeaturedQuery(qSnap, parse);
      emit();
    },
    () => {
      fromFeatured = null;
      emit();
    },
  );

  const unsubLegacy = onSnapshot(
    doc(db, FLASH_DEALS_COLLECTION, FLASH_DEAL_LEGACY_DOC_ID),
    (dSnap: DocumentSnapshot) => {
      if (!dSnap.exists()) fromLegacy = null;
      else fromLegacy = parse(dSnap.data() as Record<string, unknown>);
      emit();
    },
    () => {
      fromLegacy = null;
      emit();
    },
  );

  return () => {
    unsubFeatured();
    unsubLegacy();
  };
}

export async function loadFlashDealForAdminPage(
  dealId: string | null,
): Promise<{
  values: FlashDealSettingsInput;
  meta: FlashDealAdminMeta | null;
  dealId: string | null;
}> {
  if (!dealId || dealId.trim() === "") {
    return {
      values: { ...DEFAULT_FLASH_DEAL_FORM },
      meta: null,
      dealId: null,
    };
  }

  const trimmed = dealId.trim();
  const ref = doc(getFirestoreDb(), FLASH_DEALS_COLLECTION, trimmed);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error("That flash deal no longer exists.");
  }

  const d = snap.data() as Record<string, unknown>;
  const title =
    typeof d.title === "string" && d.title.trim()
      ? d.title.trim()
      : DEFAULT_FLASH_DEAL_FORM.title;
  const dealDate =
    typeof d.dealDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(d.dealDate.trim())
      ? d.dealDate.trim()
      : DEFAULT_FLASH_DEAL_FORM.dealDate;
  const disabled = d.disabled === true;
  const isFeatured = d.isFeatured === true;
  const cAt = asTimestamp(d.createdAt);
  const uAt = asTimestamp(d.updatedAt);
  const meta: FlashDealAdminMeta | null =
    cAt && uAt && typeof d.createdByUid === "string"
      ? {
          createdByUid: d.createdByUid,
          createdByEmail:
            typeof d.createdByEmail === "string" ? d.createdByEmail : null,
          createdAt: cAt.toDate(),
          updatedAt: uAt.toDate(),
          lastModifiedByUid:
            typeof d.lastModifiedByUid === "string"
              ? d.lastModifiedByUid
              : d.createdByUid,
          lastModifiedByEmail:
            typeof d.lastModifiedByEmail === "string"
              ? d.lastModifiedByEmail
              : null,
        }
      : null;

  const values: FlashDealSettingsInput = {
    title,
    dealDate,
    disabled,
    isFeatured,
    description:
      strField(d, "description") || DEFAULT_FLASH_DEAL_FORM.description,
    fixedTourStartDate:
      isoDateOrEmpty(d, "fixedTourStartDate") ||
      DEFAULT_FLASH_DEAL_FORM.fixedTourStartDate,
    fixedTourEndDate:
      isoDateOrEmpty(d, "fixedTourEndDate") ||
      DEFAULT_FLASH_DEAL_FORM.fixedTourEndDate,
    perPersonCharge:
      strField(d, "perPersonCharge") ||
      DEFAULT_FLASH_DEAL_FORM.perPersonCharge,
    groupSize:
      strField(d, "groupSize") || DEFAULT_FLASH_DEAL_FORM.groupSize,
    hotelLevel:
      strField(d, "hotelLevel") || DEFAULT_FLASH_DEAL_FORM.hotelLevel,
    transport:
      strField(d, "transport") || DEFAULT_FLASH_DEAL_FORM.transport,
    itinerarySnaps: normalizeItinerarySnaps(d.itinerarySnaps),
    registrationPrice:
      strField(d, "registrationPrice") ||
      DEFAULT_FLASH_DEAL_FORM.registrationPrice,
  };

  return { values, meta, dealId: trimmed };
}

export async function saveFlashDealSettings(
  adminUid: string,
  adminEmail: string | null,
  editingDealId: string | null,
  input: FlashDealSettingsInput,
): Promise<{ dealId: string }> {
  const title = input.title.trim();
  const dealDate = input.dealDate.trim();
  if (!title) throw new Error("Title is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dealDate)) {
    throw new Error("Deal date must be YYYY-MM-DD.");
  }

  const tourStart = input.fixedTourStartDate.trim();
  const tourEnd = input.fixedTourEndDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tourStart)) {
    throw new Error("Fixed tour start date must be YYYY-MM-DD.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tourEnd)) {
    throw new Error("Fixed tour end date must be YYYY-MM-DD.");
  }
  if (tourStart > tourEnd) {
    throw new Error("Fixed tour start date must be on or before the end date.");
  }

  const snaps = sanitizeItinerarySnapsForSave(input.itinerarySnaps);

  const detailPayload = {
    title,
    dealDate,
    disabled: input.disabled,
    isFeatured: input.isFeatured,
    description: input.description.trim(),
    fixedTourStartDate: tourStart,
    fixedTourEndDate: tourEnd,
    perPersonCharge: input.perPersonCharge.trim(),
    groupSize: input.groupSize.trim(),
    hotelLevel: input.hotelLevel.trim(),
    transport: input.transport.trim(),
    itinerarySnaps: snaps,
    registrationPrice: input.registrationPrice.trim(),
  };

  const db = getFirestoreDb();
  const dealRef =
    editingDealId && editingDealId.trim() !== ""
      ? doc(db, FLASH_DEALS_COLLECTION, editingDealId.trim())
      : doc(collection(db, FLASH_DEALS_COLLECTION));
  const dealId = dealRef.id;

  const snap = await getDoc(dealRef);
  const now = serverTimestamp();
  const batch = writeBatch(db);

  if (input.isFeatured) {
    const featured = await getDocs(
      query(
        collection(db, FLASH_DEALS_COLLECTION),
        where("isFeatured", "==", true),
      ),
    );
    featured.forEach((s) => {
      if (s.id !== dealId) {
        batch.update(s.ref, { isFeatured: false });
      }
    });
  }

  if (!snap.exists()) {
    batch.set(dealRef, {
      ...detailPayload,
      createdByUid: adminUid,
      createdByEmail: adminEmail,
      createdAt: now,
      updatedAt: now,
      lastModifiedByUid: adminUid,
      lastModifiedByEmail: adminEmail,
    });
  } else {
    batch.set(
      dealRef,
      {
        ...detailPayload,
        updatedAt: now,
        lastModifiedByUid: adminUid,
        lastModifiedByEmail: adminEmail,
      },
      { merge: true },
    );
  }

  await batch.commit();
  return { dealId };
}

export function subscribeFlashDealSettingsForBar(
  onConfig: (config: FlashDealBarConfig | null) => void,
): Unsubscribe {
  return subscribeFeaturedOrLegacyFlashDeal(parseFlashDealForBar, onConfig);
}

export function subscribeFlashDealDetailPage(
  onDetail: (detail: FlashDealDetailContent | null) => void,
): Unsubscribe {
  return subscribeFeaturedOrLegacyFlashDeal(parseFlashDealForDetailPage, onDetail);
}
