import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { colomboDayBoundsMs } from "@/lib/flash-deal-colombo";
import { getFirestoreDb } from "@/lib/firebase/db";

/** Campaign documents (admin CMS); matches security rules for `flashDeals/{docId}`. */
export const FLASH_DEALS_COLLECTION = "flashDeals";

/**
 * Historical singleton doc id (`flashDeals/current`). Public banner and `/flash-deal`
 * only use campaigns with `isFeatured: true`. Traveller confirmations use each
 * campaign’s stored doc id.
 */
export const FLASH_DEAL_LEGACY_DOC_ID = "current";

/** @deprecated Use {@link FLASH_DEAL_LEGACY_DOC_ID} */
export const FLASH_DEAL_CAMPAIGN_DOC_ID = FLASH_DEAL_LEGACY_DOC_ID;

/** Public booking slug stored on confirmation docs (`packageSlug`). */
export const FLASH_DEAL_BOOKING_PACKAGE_SLUG = "flash-deal";

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
  /** Positive USD amount as digits only (optional cents), e.g. "674" or "674.50" — no `$`. */
  perPersonCharge: string;
  /**
   * Minimum number of traveller bookings (slots) required before the flash deal
   * may proceed. Stored as digits only in the data source under the field name `groupSize`.
   */
  groupSize: string;
  hotelLevel: string;
  transport: string;
  itinerarySnaps: FlashDealItinerarySnap[];
  /** Positive USD amount as digits only (optional cents) — no `$`. */
  registrationPrice: string;
  /** Maximum bookings for this campaign; when reached, the deal is sold out. */
  maxSlots: number;
};

export type FlashDealBarConfig = {
  dealDocId: string;
  title: string;
  dealDate: string;
  dealWindowStartMs: number;
  dealEndMs: number;
  /** Upper limit on traveller bookings; homepage and detail page show sold out at this cap. */
  maxSlots: number;
  slotsTaken: number;
};

/** Full offer copy for the `/flash-deal` page (banner can still show when this parses). */
export type FlashDealDetailContent = Omit<
  FlashDealSettingsInput,
  "disabled" | "isFeatured"
> & {
  slotsTaken: number;
};

/** Featured or legacy-resolved campaign shown on `/flash-deal`. */
export type FlashDealPublicResolved = {
  dealDocId: string;
  detail: FlashDealDetailContent;
};

export const DEFAULT_ITINERARY_SNAP: FlashDealItinerarySnap = {
  title: "Itinerary highlight",
  description:
    "Describe this stage of the journey — route, experiences, or pacing.",
};

/** Blank tile for new admin drafts and “+ Add itinerary snap”. */
export const EMPTY_ITINERARY_SNAP: FlashDealItinerarySnap = {
  title: "",
  description: "",
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
  return snaps.map((s) => ({
    title: s.title.trim(),
    description: s.description.trim(),
  }));
}

function strField(data: Record<string, unknown>, key: string): string {
  const v = data[key];
  return typeof v === "string" ? v.trim() : "";
}

function isoDateOrEmpty(data: Record<string, unknown>, key: string): string {
  const s = strField(data, key);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function parseFirestoreNonNegativeInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.trunc(value);
    return n >= 0 ? n : null;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s || !/^\d+$/.test(s)) return null;
    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  return null;
}

function parseFirestorePositiveInt(value: unknown): number | null {
  const n = parseFirestoreNonNegativeInt(value);
  return n !== null && n >= 1 ? n : null;
}

function maxSlotsFromData(data: Record<string, unknown>): number {
  const n = parseFirestorePositiveInt(data.maxSlots);
  return n ?? 0;
}

function slotsTakenFromData(data: Record<string, unknown>): number {
  const n = parseFirestoreNonNegativeInt(data.slotsTaken);
  return n ?? 0;
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
  docSnap: QueryDocumentSnapshot,
): FlashDealBarConfig | null {
  const data = docSnap.data() as Record<string, unknown>;
  if (data.disabled === true) return null;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const dealDate =
    typeof data.dealDate === "string" ? data.dealDate.trim() : "";
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(dealDate)) return null;

  const bounds = colomboDayBoundsMs(dealDate);
  if (!bounds) return null;

  return {
    dealDocId: docSnap.id,
    title,
    dealDate,
    dealWindowStartMs: bounds.startMs,
    dealEndMs: bounds.endMs,
    maxSlots: maxSlotsFromData(data),
    slotsTaken: slotsTakenFromData(data),
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
    maxSlots: maxSlotsFromData(data),
    slotsTaken: slotsTakenFromData(data),
  };
}

function normalizeItinerarySnapsForPublicDetailView(
  value: unknown,
): FlashDealItinerarySnap[] {
  if (!Array.isArray(value)) return [];
  const out: FlashDealItinerarySnap[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const description =
      typeof o.description === "string" ? o.description.trim() : "";
    if (!title && !description) continue;
    out.push({ title, description });
  }
  return out;
}

/**
 * Full `/flash-deal` body: includes drafts (empty title/date allowed). Disabled
 * docs are hidden. Banner still uses {@link parseFlashDealForBar} (requires
 * title + valid deal date).
 */
export function parseFlashDealForPublicDetailView(
  data: Record<string, unknown>,
): FlashDealDetailContent | null {
  if (data.disabled === true) return null;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const dealDateRaw =
    typeof data.dealDate === "string" ? data.dealDate.trim() : "";
  const dealDate = /^\d{4}-\d{2}-\d{2}$/.test(dealDateRaw) ? dealDateRaw : "";

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
    itinerarySnaps: normalizeItinerarySnapsForPublicDetailView(
      data.itinerarySnaps,
    ),
    registrationPrice: strField(data, "registrationPrice"),
    maxSlots: maxSlotsFromData(data),
    slotsTaken: slotsTakenFromData(data),
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
  perPersonCharge: "674",
  groupSize: "6",
  hotelLevel: "3–4 star boutique stays",
  transport: "Standard AC vehicle with private driver",
  itinerarySnaps: [{ ...DEFAULT_ITINERARY_SNAP }],
  registrationPrice: "150",
  maxSlots: 20,
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

/**
 * Normalizes admin / legacy USD amounts: strips `$` and commas, validates a
 * positive amount, returns a canonical digit string for the data source (no `$`).
 * Used for per-person charge and registration price.
 */
export function normalizeUsdAmountDigitsForSave(raw: string): string | null {
  const t = raw.trim().replace(/^\$/, "").replace(/,/g, "").trim();
  if (!t) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Number.isInteger(n) ? String(Math.trunc(n)) : String(n);
}

/**
 * Minimum slots (bookings) before the deal may proceed. Stored in `groupSize`
 * in the data source (digit string only).
 */
export function normalizeMinSlotsProceedForSave(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (!/^[1-9]\d*$/.test(t)) return null;
  const n = Number.parseInt(t, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return String(n);
}

export function createEmptyFlashDealDraft(): FlashDealSettingsInput {
  return {
    title: "",
    dealDate: "",
    disabled: false,
    isFeatured: false,
    description: "",
    fixedTourStartDate: "",
    fixedTourEndDate: "",
    perPersonCharge: "",
    groupSize: "",
    hotelLevel: "",
    transport: "",
    itinerarySnaps: [{ ...EMPTY_ITINERARY_SNAP }],
    registrationPrice: "",
    maxSlots: 0,
  };
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
  parse: (docSnap: QueryDocumentSnapshot) => T | null,
): T | null {
  let best: { value: T; ms: number } | null = null;
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown>;
    const value = parse(d);
    if (value === null) continue;
    const ms = docSortMs(data);
    if (!best || ms >= best.ms) best = { value, ms };
  }
  return best?.value ?? null;
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
      values: createEmptyFlashDealDraft(),
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
  const loadedMaxSlots = maxSlotsFromData(d);
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
    perPersonCharge: (() => {
      const ppcRaw = strField(d, "perPersonCharge");
      const parsed = normalizeUsdAmountDigitsForSave(ppcRaw);
      if (parsed) return parsed;
      if (!ppcRaw) return DEFAULT_FLASH_DEAL_FORM.perPersonCharge;
      return "";
    })(),
    groupSize: (() => {
      const raw = strField(d, "groupSize");
      const parsed = normalizeMinSlotsProceedForSave(raw);
      if (parsed) return parsed;
      if (!raw) return DEFAULT_FLASH_DEAL_FORM.groupSize;
      return "";
    })(),
    hotelLevel:
      strField(d, "hotelLevel") || DEFAULT_FLASH_DEAL_FORM.hotelLevel,
    transport:
      strField(d, "transport") || DEFAULT_FLASH_DEAL_FORM.transport,
    itinerarySnaps: normalizeItinerarySnaps(d.itinerarySnaps),
    registrationPrice: (() => {
      const regRaw = strField(d, "registrationPrice");
      const parsed = normalizeUsdAmountDigitsForSave(regRaw);
      if (parsed) return parsed;
      if (!regRaw) return DEFAULT_FLASH_DEAL_FORM.registrationPrice;
      return "";
    })(),
    maxSlots:
      loadedMaxSlots > 0 ? loadedMaxSlots : DEFAULT_FLASH_DEAL_FORM.maxSlots,
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
    throw new Error("Deal Closing date must be YYYY-MM-DD.");
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

  if (!input.description.trim()) {
    throw new Error("Description is required.");
  }
  const perPersonChargeNorm = normalizeUsdAmountDigitsForSave(
    input.perPersonCharge,
  );
  if (perPersonChargeNorm == null) {
    throw new Error(
      "Per person charge must be a positive number (e.g. 674 or 674.50), without $.",
    );
  }
  const minSlotsProceedNorm = normalizeMinSlotsProceedForSave(
    input.groupSize,
  );
  if (minSlotsProceedNorm == null) {
    throw new Error(
      "Minimum slots to proceed must be a whole number of at least 1.",
    );
  }
  if (!input.hotelLevel.trim()) {
    throw new Error("Hotel level is required.");
  }
  if (!input.transport.trim()) {
    throw new Error("Transport is required.");
  }

  const registrationPriceNorm = normalizeUsdAmountDigitsForSave(
    input.registrationPrice,
  );
  if (registrationPriceNorm == null) {
    throw new Error(
      "Registration price must be a positive number (e.g. 150 or 150.50), without $.",
    );
  }

  if (
    !Number.isFinite(input.maxSlots) ||
    !Number.isInteger(input.maxSlots) ||
    input.maxSlots < 1
  ) {
    throw new Error(
      "Maximum bookings (sold-out cap) must be a whole number of at least 1.",
    );
  }

  if (Number.parseInt(minSlotsProceedNorm, 10) > input.maxSlots) {
    throw new Error(
      "Maximum bookings (sold-out cap) must be greater than or equal to minimum slots to proceed.",
    );
  }

  const snapsRaw = sanitizeItinerarySnapsForSave(input.itinerarySnaps);
  const snaps = snapsRaw.filter(
    (s) => s.title.length > 0 || s.description.length > 0,
  );
  if (snaps.length === 0) {
    throw new Error(
      "Add at least one itinerary snap with a title and description.",
    );
  }
  for (const s of snaps) {
    if (!s.title.length || !s.description.length) {
      throw new Error(
        "Each itinerary snap must have both a title and a description.",
      );
    }
  }

  const detailPayload = {
    title,
    dealDate,
    disabled: input.disabled,
    isFeatured: input.isFeatured,
    description: input.description.trim(),
    fixedTourStartDate: tourStart,
    fixedTourEndDate: tourEnd,
    perPersonCharge: perPersonChargeNorm,
    groupSize: minSlotsProceedNorm,
    hotelLevel: input.hotelLevel.trim(),
    transport: input.transport.trim(),
    itinerarySnaps: snaps,
    registrationPrice: registrationPriceNorm,
    maxSlots: input.maxSlots,
  };

  const db = getFirestoreDb();
  const dealRef =
    editingDealId && editingDealId.trim() !== ""
      ? doc(db, FLASH_DEALS_COLLECTION, editingDealId.trim())
      : doc(collection(db, FLASH_DEALS_COLLECTION));
  const dealId = dealRef.id;

  const snap = await getDoc(dealRef);
  if (snap.exists()) {
    const taken = slotsTakenFromData(snap.data() as Record<string, unknown>);
    if (input.maxSlots < taken) {
      throw new Error(
        `Maximum slots cannot be less than current bookings (${taken}).`,
      );
    }
  }

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
      slotsTaken: 0,
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

/**
 * Hard-delete a campaign document. The `Travellers` subcollection is intentionally
 * left in place — the data source client SDK does not cascade, and rules block clients
 * from deleting historic booking records.
 */
export async function deleteFlashDealForAdmin(dealId: string): Promise<void> {
  const trimmed = dealId.trim();
  if (!trimmed) {
    throw new Error("Deal id is required to delete a flash deal.");
  }
  const ref = doc(getFirestoreDb(), FLASH_DEALS_COLLECTION, trimmed);
  await deleteDoc(ref);
}

function pickBestFeaturedDealDetail(
  snap: QuerySnapshot,
): FlashDealPublicResolved | null {
  let best: { dealDocId: string; detail: FlashDealDetailContent; ms: number } | null =
    null;
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown>;
    const detail = parseFlashDealForPublicDetailView(data);
    if (!detail) continue;
    const ms = docSortMs(data);
    if (!best || ms >= best.ms)
      best = { dealDocId: d.id, detail, ms };
  }
  return best ? { dealDocId: best.dealDocId, detail: best.detail } : null;
}

/**
 * Resolved featured campaign + parsed detail for `/flash-deal`.
 * Only deals with `isFeatured == true` are considered; otherwise `null`.
 */
export function subscribeFlashDealPublic(
  onValue: (value: FlashDealPublicResolved | null) => void,
): Unsubscribe {
  const db = getFirestoreDb();

  return onSnapshot(
    query(
      collection(db, FLASH_DEALS_COLLECTION),
      where("isFeatured", "==", true),
      limit(25),
    ),
    (qSnap) => {
      const resolved = pickBestFeaturedDealDetail(qSnap);
      onValue(resolved);
    },
    () => onValue(null),
  );
}

export function subscribeFlashDealSettingsForBar(
  onConfig: (config: FlashDealBarConfig | null) => void,
): Unsubscribe {
  const db = getFirestoreDb();

  return onSnapshot(
    query(
      collection(db, FLASH_DEALS_COLLECTION),
      where("isFeatured", "==", true),
      limit(25),
    ),
    (qSnap) => {
      const parsed = pickBestFromFeaturedQuery(qSnap, parseFlashDealForBar);
      onConfig(parsed);
    },
    () => onConfig(null),
  );
}

export function subscribeFlashDealDetailPage(
  onDetail: (detail: FlashDealDetailContent | null) => void,
): Unsubscribe {
  return subscribeFlashDealPublic((v) => onDetail(v?.detail ?? null));
}
