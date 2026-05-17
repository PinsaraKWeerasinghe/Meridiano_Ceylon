import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  documentId,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { FLASH_DEALS_COLLECTION } from "@/lib/flash-deal-settings";
import { getFirestoreDb } from "@/lib/firebase/db";
import { assertValidTripSegmentKey, formatTripRefWithSequence } from "@/lib/trip-ref-format";

/** User flash confirmations + Trip ID refs: `users/{uid}/flashDeals/{campaignDocId}` (not Bookings). */
export const USER_PROFILE_FLASH_DEALS_SUBCOLLECTION = "flashDeals";

/** Ledger under `users/{uid}/Bookings/{autoId}` — package enquiries only for new writes. */
export const USER_BOOKINGS_SUBCOLLECTION = "Bookings";

/** Atomically allocates sequence numbers per SKU / flash prefix alongside ledger rows */
export const TRIP_REF_COUNTERS_COLLECTION = "tripRefCounters";

export type UserBookingKind = "flash-deal" | "package";

/** Values stored in Firestore booking docs under users/{uid}/Bookings */
export const USER_BOOKING_PAYMENT_STATUSES = [
  "pending-payment",
  "advance-paid",
  "payment-completed",
  "pending-refund",
  "refunded",
  /** User-initiated cancel while still unpaid — no settlement */
  "not-applicable",
  /** Paid row; user canceled; staff follow-up for refunds */
  "refund-request-initiated",
] as const;

export type UserBookingPaymentStatus =
  (typeof USER_BOOKING_PAYMENT_STATUSES)[number];

export const USER_BOOKING_TRIP_STATUSES = [
  "pending-payment",
  "booking-confirmed",
  "trip-started",
  "trip-completed",
  "canceled",
] as const;

export type UserBookingTripStatus = (typeof USER_BOOKING_TRIP_STATUSES)[number];

/** Package-only ledger (`users/{uid}/Bookings`). Flash deals use {@link USER_PROFILE_FLASH_DEALS_SUBCOLLECTION}. */
export type AppendUserBookingPackageInput = {
  kind: "package";
  /** Row label, e.g. `Package · …` */
  typeLabel: string;
  /** ISO `YYYY-MM-DD` deal/travel date; empty when not applicable */
  bookingDate: string;
  packageSlug: string;
  /** Usually empty string for packages */
  flashDealDocId: string;
  /** Counter key (without 5-digit suffix), e.g. `P05B`, `S00A` */
  tripSegmentKey: string;
};

export type AppendUserBookingInput = AppendUserBookingPackageInput;


export type UserBookingRow = {
  id: string;
  kind: UserBookingKind;
  typeLabel: string;
  bookingDate: string;
  packageSlug: string;
  flashDealDocId: string;
  /** Human-readable Trip ID; omitted on legacy ledger rows */
  tripRef?: string;
  paymentStatus: UserBookingPaymentStatus;
  tripStatus: UserBookingTripStatus;
  createdAt: Date | null;
  /** True when the parent `flashDeals/{flashDealDocId}` was deleted by an admin (flash rows only). */
  frozenByAdmin?: boolean;
};

function parsePaymentStatus(
  raw: unknown,
): UserBookingPaymentStatus {
  const s = typeof raw === "string" ? raw.trim() : "";
  return isPaymentStatus(s) ? s : "pending-payment";
}

function parseTripStatus(raw: unknown): UserBookingTripStatus {
  const s = typeof raw === "string" ? raw.trim() : "";
  return isTripStatus(s) ? s : "pending-payment";
}

function isPaymentStatus(s: string): s is UserBookingPaymentStatus {
  return (USER_BOOKING_PAYMENT_STATUSES as readonly string[]).includes(s);
}

function isTripStatus(s: string): s is UserBookingTripStatus {
  return (USER_BOOKING_TRIP_STATUSES as readonly string[]).includes(s);
}

/** Display copy for My Bookings and admin tooling */
export const USER_BOOKING_PAYMENT_STATUS_LABEL: Record<
  UserBookingPaymentStatus,
  string
> = {
  "pending-payment": "Pending payment",
  "advance-paid": "Advance paid",
  "payment-completed": "Payment completed",
  "pending-refund": "Pending refund",
  refunded: "Refunded",
  "not-applicable": "N/A",
  "refund-request-initiated": "Refund request initiated",
};

export const USER_BOOKING_TRIP_STATUS_LABEL: Record<
  UserBookingTripStatus,
  string
> = {
  "pending-payment": "Pending payment",
  "booking-confirmed": "Booking confirmed",
  "trip-started": "Trip started",
  "trip-completed": "Trip completed",
  canceled: "Canceled",
};

export function parseUserBookingLedgerDoc(
  id: string,
  data: Record<string, unknown>,
): UserBookingRow | null {
  const kind = data.kind;
  if (kind !== "flash-deal" && kind !== "package") return null;
  const typeLabel = typeof data.typeLabel === "string" ? data.typeLabel.trim() : "";
  const bookingDate = typeof data.bookingDate === "string" ? data.bookingDate.trim() : "";
  const packageSlug = typeof data.packageSlug === "string" ? data.packageSlug.trim() : "";
  const flashDealDocId =
    typeof data.flashDealDocId === "string" ? data.flashDealDocId.trim() : "";
  const tripRefRaw = data.tripRef;
  const tripRef =
    typeof tripRefRaw === "string" && tripRefRaw.trim() !== ""
      ? tripRefRaw.trim()
      : undefined;
  const createdRaw = data.createdAt;
  let createdAt: Date | null = null;
  if (
    createdRaw &&
    typeof createdRaw === "object" &&
    "toDate" in createdRaw &&
    typeof (createdRaw as Timestamp).toDate === "function"
  ) {
    createdAt = (createdRaw as Timestamp).toDate();
  }
  /** Slim flash docs omit labels; hydrate from {@link hydrateUserBookingFlashDealFields}. */
  const displayTypeLabel =
    typeLabel.trim() !== ""
      ? typeLabel
      : kind === "package"
        ? "Package"
        : "";
  return {
    id,
    kind,
    typeLabel: displayTypeLabel,
    bookingDate,
    packageSlug,
    flashDealDocId,
    tripRef,
    paymentStatus: parsePaymentStatus(data.paymentStatus),
    tripStatus: parseTripStatus(data.tripStatus),
    createdAt,
  };
}

/**
 * Rows under `users/{uid}/flashDeals/{campaignId}` (`kind`: flash ledger + traveller snapshot).
 */
export function parseUserFlashDealDoc(
  campaignDocId: string,
  data: Record<string, unknown>,
): UserBookingRow | null {
  const flashDealDocId =
    typeof data.flashDealDocId === "string" ? data.flashDealDocId.trim() : "";
  if (flashDealDocId === "") return null;
  if (flashDealDocId !== campaignDocId.trim()) return null;

  const kindRaw = data.kind;
  if (kindRaw !== undefined && kindRaw !== "" && kindRaw !== "flash-deal") return null;

  const packageTitle =
    typeof data.packageTitle === "string" ? data.packageTitle.trim() : "";
  const packageSlug =
    typeof data.packageSlug === "string" ? data.packageSlug.trim() : "";

  const tripRefRaw = data.tripRef;
  const tripRef =
    typeof tripRefRaw === "string" && tripRefRaw.trim() !== ""
      ? tripRefRaw.trim()
      : undefined;

  const createdRaw = data.createdAt;
  const submittedRaw = data.submittedAt;
  let createdAt: Date | null = null;
  if (
    createdRaw &&
    typeof createdRaw === "object" &&
    "toDate" in createdRaw &&
    typeof (createdRaw as Timestamp).toDate === "function"
  ) {
    createdAt = (createdRaw as Timestamp).toDate();
  } else if (
    submittedRaw &&
    typeof submittedRaw === "object" &&
    "toDate" in submittedRaw &&
    typeof (submittedRaw as Timestamp).toDate === "function"
  ) {
    createdAt = (submittedRaw as Timestamp).toDate();
  }

  /** Title hydrated from campaigns when empty (see hydrateUserBookingFlashDealFields). */
  const typePrefix = packageTitle ? `Flash deal · ${packageTitle}` : "";

  return {
    id: campaignDocId.trim(),
    kind: "flash-deal",
    typeLabel: typePrefix,
    bookingDate: "",
    packageSlug,
    flashDealDocId,
    tripRef,
    paymentStatus: parsePaymentStatus(data.paymentStatus),
    tripStatus: parseTripStatus(data.tripStatus),
    createdAt,
  };
}

/** Next ledger payment row after owner self-cancel in My Bookings. */
export function paymentStatusAfterSelfCancel(
  current: UserBookingPaymentStatus,
): UserBookingPaymentStatus {
  if (current === "pending-payment") return "not-applicable";
  if (current === "advance-paid" || current === "payment-completed") {
    return "refund-request-initiated";
  }
  return current;
}

export async function cancelUserBooking(uid: string, bookingId: string): Promise<void> {
  const db = getFirestoreDb();
  const trimmedUid = uid.trim();
  const id = bookingId.trim();
  if (!trimmedUid || !id) throw new Error("User id and booking id are required.");
  const ref = doc(db, "users", trimmedUid, USER_BOOKINGS_SUBCOLLECTION, id);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Booking not found.");
    const raw = snap.data() as Record<string, unknown>;
    const row = parseUserBookingLedgerDoc(id, raw);
    if (!row || row.kind !== "package") throw new Error("Booking not found.");
    if (row.tripStatus === "canceled") return;

    const nextPayment = paymentStatusAfterSelfCancel(row.paymentStatus);
    tx.update(ref, {
      tripStatus: "canceled",
      paymentStatus: nextPayment,
    });
  });
}

export async function cancelUserFlashDealBooking(
  uid: string,
  campaignDocId: string,
): Promise<void> {
  const db = getFirestoreDb();
  const trimmedUid = uid.trim();
  const cid = campaignDocId.trim();
  if (!trimmedUid || !cid) throw new Error("User id and campaign id are required.");
  const ref = doc(
    db,
    "users",
    trimmedUid,
    USER_PROFILE_FLASH_DEALS_SUBCOLLECTION,
    cid,
  );

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Flash deal booking not found.");
    const row = parseUserFlashDealDoc(cid, snap.data() as Record<string, unknown>);
    if (!row) throw new Error("Invalid flash deal booking.");
    if (row.tripStatus === "canceled") return;

    const nextPayment = paymentStatusAfterSelfCancel(row.paymentStatus);
    tx.update(ref, {
      tripStatus: "canceled",
      paymentStatus: nextPayment,
    });
  });
}

/**
 * Destination for unpaid rows: packages need the booking form again (checkout uses the
 * in-browser draft captured there before Billing & payment). Flash deals use the hub page.
 */
export function bookingPaymentHref(row: Pick<
  UserBookingRow,
  "kind" | "paymentStatus" | "packageSlug"
>): string | null {
  if (row.paymentStatus !== "pending-payment") return null;
  if (row.kind === "package" && row.packageSlug.trim() !== "") {
    return `/packages/book?package=${encodeURIComponent(row.packageSlug.trim())}`;
  }
  if (row.kind === "flash-deal") return "/flash-deal";
  return "/packages/book";
}

export async function appendUserBooking(
  uid: string,
  input: AppendUserBookingInput,
): Promise<{ tripRef: string }> {
  const db = getFirestoreDb();
  const trimmedUid = uid.trim();
  if (!trimmedUid) throw new Error("User id is required.");
  const segmentKey = input.tripSegmentKey.trim().toUpperCase();
  assertValidTripSegmentKey(segmentKey);

  const bookingRef = doc(
    collection(db, "users", trimmedUid, USER_BOOKINGS_SUBCOLLECTION),
  );
  const counterRef = doc(db, TRIP_REF_COUNTERS_COLLECTION, segmentKey);

  return runTransaction(db, async (transaction) => {
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

    const baseLedger = {
      tripRef,
      paymentStatus: "pending-payment",
      tripStatus: "pending-payment",
      createdAt: serverTimestamp(),
    } as const;

    transaction.set(bookingRef, {
      ...baseLedger,
      kind: "package",
      typeLabel: input.typeLabel.trim(),
      bookingDate: input.bookingDate.trim(),
      packageSlug: input.packageSlug.trim(),
      flashDealDocId: input.flashDealDocId.trim(),
    });

    return { tripRef };
  });
}


async function flashDealCampaignDisplayMetaBatch(
  campaignIds: string[],
): Promise<Map<string, { title: string; dealDate: string }>> {
  const out = new Map<string, { title: string; dealDate: string }>();
  const unique = Array.from(
    new Set(campaignIds.map((id) => id.trim()).filter(Boolean)),
  );
  if (unique.length === 0) return out;

  const db = getFirestoreDb();
  const batchSize = 10;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const q = query(
      collection(db, FLASH_DEALS_COLLECTION),
      where(documentId(), "in", batch),
    );
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data() as Record<string, unknown>;
      const title = typeof data.title === "string" ? data.title.trim() : "";
      const rawDate =
        typeof data.dealDate === "string" ? data.dealDate.trim() : "";
      const dealDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : "";
      out.set(d.id, { title, dealDate });
    });
  }
  return out;
}

/** Fills display fields from `flashDeals/{flashDealDocId}` when ledger rows omit them (slim flash). */
export async function hydrateUserBookingFlashDealFields(
  rows: UserBookingRow[],
): Promise<UserBookingRow[]> {
  const ids = Array.from(
    new Set(
      rows
        .filter((r) => r.kind === "flash-deal" && r.flashDealDocId.trim() !== "")
        .map((r) => r.flashDealDocId.trim()),
    ),
  );
  const metaById =
    ids.length === 0
      ? new Map<string, { title: string; dealDate: string }>()
      : await flashDealCampaignDisplayMetaBatch(ids);

  return rows.map((row) => {
    if (row.kind !== "flash-deal" || row.flashDealDocId.trim() === "") return row;
    const cid = row.flashDealDocId.trim();
    const meta = metaById.get(cid);
    const frozenByAdmin = !meta;

    let typeLabel = row.typeLabel.trim();
    if (typeLabel === "") {
      typeLabel = meta?.title ? `Flash deal · ${meta.title}` : `Flash deal (${cid})`;
    }

    let bookingDate = row.bookingDate;
    if (bookingDate.trim() === "" && meta?.dealDate) bookingDate = meta.dealDate;

    if (
      typeLabel === row.typeLabel &&
      bookingDate === row.bookingDate &&
      Boolean(row.frozenByAdmin) === frozenByAdmin
    ) {
      return row;
    }
    return { ...row, typeLabel, bookingDate, frozenByAdmin };
  });
}

function mergeMyBookingsLists(
  bookingLedgerRows: UserBookingRow[],
  userFlashDealRows: UserBookingRow[],
): UserBookingRow[] {
  const profileFlashIds = new Set(
    userFlashDealRows
      .filter((r) => r.kind === "flash-deal")
      .map((r) => r.flashDealDocId.trim())
      .filter(Boolean),
  );

  const fromBookingsLedger = bookingLedgerRows.filter((r) => {
    if (r.kind === "package") return true;
    if (r.kind !== "flash-deal") return false;
    const fid = r.flashDealDocId.trim();
    return fid !== "" && !profileFlashIds.has(fid);
  });

  const merged = [...userFlashDealRows, ...fromBookingsLedger];
  merged.sort((a, b) => {
    const ta = a.createdAt?.getTime() ?? 0;
    const tb = b.createdAt?.getTime() ?? 0;
    return tb - ta;
  });
  return merged;
}

export function subscribeUserBookings(
  uid: string,
  onRows: (rows: UserBookingRow[]) => void,
  onError?: (message: string | null) => void,
): Unsubscribe {
  const db = getFirestoreDb();
  const trimmed = uid.trim();
  const q = query(
    collection(db, "users", trimmed, USER_BOOKINGS_SUBCOLLECTION),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    q,
    (snap) => {
      const rows: UserBookingRow[] = [];
      snap.forEach((d) => {
        const row = parseUserBookingLedgerDoc(
          d.id,
          d.data() as Record<string, unknown>,
        );
        if (row) rows.push(row);
      });
      onError?.(null);
      onRows(rows);
    },
    (err) => {
      onError?.(err.message);
      onRows([]);
    },
  );
}

export function subscribeUserBookingsHydrated(
  uid: string,
  onRows: (rows: UserBookingRow[]) => void,
  onError?: (message: string | null) => void,
): Unsubscribe {
  let hydrationGen = 0;
  let bookingLedgerRows: UserBookingRow[] = [];
  let userFlashDealRows: UserBookingRow[] = [];

  const db = getFirestoreDb();
  const trimmed = uid.trim();

  const runHydratedEmit = () => {
    const merged = mergeMyBookingsLists(bookingLedgerRows, userFlashDealRows);
    const myGen = ++hydrationGen;
    void hydrateUserBookingFlashDealFields(merged)
      .then((hydrated) => {
        if (myGen !== hydrationGen) return;
        hydrated.sort((a, b) => {
          const ta = a.createdAt?.getTime() ?? 0;
          const tb = b.createdAt?.getTime() ?? 0;
          return tb - ta;
        });
        onError?.(null);
        onRows(hydrated);
      })
      .catch(() => {
        if (myGen !== hydrationGen) return;
        onError?.(
          "Bookings loaded but flash deal titles could not be refreshed. Try reloading.",
        );
        onRows(merged);
      });
  };

  const bookingsQuery = query(
    collection(db, "users", trimmed, USER_BOOKINGS_SUBCOLLECTION),
    orderBy("createdAt", "desc"),
  );

  const unsubBookings = onSnapshot(
    bookingsQuery,
    (snap) => {
      bookingLedgerRows = [];
      snap.forEach((d) => {
        const row = parseUserBookingLedgerDoc(
          d.id,
          d.data() as Record<string, unknown>,
        );
        if (row) bookingLedgerRows.push(row);
      });
      runHydratedEmit();
    },
    (err) => {
      onError?.(err.message);
      bookingLedgerRows = [];
      runHydratedEmit();
    },
  );

  const unsubFlashProfile = onSnapshot(
    collection(db, "users", trimmed, USER_PROFILE_FLASH_DEALS_SUBCOLLECTION),
    (snap) => {
      userFlashDealRows = [];
      snap.forEach((d) => {
        const row = parseUserFlashDealDoc(
          d.id,
          d.data() as Record<string, unknown>,
        );
        if (row) userFlashDealRows.push(row);
      });
      runHydratedEmit();
    },
    (err) => {
      onError?.(err.message);
      userFlashDealRows = [];
      runHydratedEmit();
    },
  );

  return () => {
    hydrationGen += 1;
    unsubBookings();
    unsubFlashProfile();
  };
}
