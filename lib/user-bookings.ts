import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";
import { assertValidTripSegmentKey, formatTripRefWithSequence } from "@/lib/trip-ref-format";

/** Ledger under `users/{uid}/Bookings/{autoId}` */
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

export type AppendUserBookingInput = {
  kind: UserBookingKind;
  /** Row label, e.g. `Flash deal · …` or `Package · …` */
  typeLabel: string;
  /** ISO `YYYY-MM-DD` deal/travel date; empty when not applicable */
  bookingDate: string;
  packageSlug: string;
  flashDealDocId: string;
  /** Counter key (without 5-digit suffix), e.g. `P05B`, `S00A`, `FSUM` */
  tripSegmentKey: string;
};

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

function parseBookingDoc(id: string, data: Record<string, unknown>): UserBookingRow | null {
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
  return {
    id,
    kind,
    typeLabel: typeLabel || (kind === "flash-deal" ? "Flash deal" : "Package"),
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
    transaction.set(bookingRef, {
      kind: input.kind,
      typeLabel: input.typeLabel.trim(),
      bookingDate: input.bookingDate.trim(),
      packageSlug: input.packageSlug.trim(),
      flashDealDocId: input.flashDealDocId.trim(),
      tripRef,
      paymentStatus: "pending-payment",
      tripStatus: "pending-payment",
      createdAt: serverTimestamp(),
    });

    return { tripRef };
  });
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
        const row = parseBookingDoc(d.id, d.data() as Record<string, unknown>);
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
