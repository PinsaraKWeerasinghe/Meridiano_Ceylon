import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";

/** Ledger under `users/{uid}/Bookings/{autoId}` */
export const USER_BOOKINGS_SUBCOLLECTION = "Bookings";

export type UserBookingKind = "flash-deal" | "package";

export type AppendUserBookingInput = {
  kind: UserBookingKind;
  /** Row label, e.g. `Flash deal · …` or `Package · …` */
  typeLabel: string;
  /** ISO `YYYY-MM-DD` deal/travel date; empty when not applicable */
  bookingDate: string;
  packageSlug: string;
  flashDealDocId: string;
};

export type UserBookingRow = {
  id: string;
  kind: UserBookingKind;
  typeLabel: string;
  bookingDate: string;
  packageSlug: string;
  flashDealDocId: string;
  createdAt: Date | null;
};

function parseBookingDoc(id: string, data: Record<string, unknown>): UserBookingRow | null {
  const kind = data.kind;
  if (kind !== "flash-deal" && kind !== "package") return null;
  const typeLabel = typeof data.typeLabel === "string" ? data.typeLabel.trim() : "";
  const bookingDate = typeof data.bookingDate === "string" ? data.bookingDate.trim() : "";
  const packageSlug = typeof data.packageSlug === "string" ? data.packageSlug.trim() : "";
  const flashDealDocId =
    typeof data.flashDealDocId === "string" ? data.flashDealDocId.trim() : "";
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
    createdAt,
  };
}

export async function appendUserBooking(
  uid: string,
  input: AppendUserBookingInput,
): Promise<void> {
  const db = getFirestoreDb();
  const trimmedUid = uid.trim();
  if (!trimmedUid) throw new Error("User id is required.");
  await addDoc(collection(db, "users", trimmedUid, USER_BOOKINGS_SUBCOLLECTION), {
    kind: input.kind,
    typeLabel: input.typeLabel.trim(),
    bookingDate: input.bookingDate.trim(),
    packageSlug: input.packageSlug.trim(),
    flashDealDocId: input.flashDealDocId.trim(),
    createdAt: serverTimestamp(),
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
