import type { TourItem } from "@/data/tours";

const FIXED_ITINERARY_RE = /^fixed-(\d+)-opt(\d+)$/;

/** Matches "5 days", "14 day", etc. — case insensitive. */
const DURATION_DAYS_RE = /(\d+)\s*days?/i;

const SEGMENT_KEY_RE = /^(?:P\d{2}[A-Z]|S\d{2}[A-Z]|F[A-Z]{3})$/;

/**
 * Specialty / addon / non-fixed packages: **`S`** + two-digit duration from `duration`,
 * else **`00`**, + option letter **`A`**. Distinguished from fixed SKUs (**`P`…`).
 */
export function buildTripSegmentForPackageTour(tour: TourItem): string {
  const m = FIXED_ITINERARY_RE.exec(tour.id.trim());
  if (m) {
    const rawDays = Number.parseInt(m[1], 10);
    const rawOpt = Number.parseInt(m[2], 10);
    const days = clampInt(rawDays, 0, 99);
    const optLetter = optIndexToLetter(rawOpt);
    return `P${padDays(days)}${optLetter}`;
  }
  const dur = durationToTwoDigitsOrNull(tour.duration);
  const dd = dur ?? "00";
  return `S${dd}A`;
}

/**
 * **`F`** + first three ASCII letters from title (uppercased), padded with **`X`**
 * when fewer than three letters remain after stripping non-letters.
 *
 * Collision caveat: unrelated campaigns sharing the same 3-letter slug share one counter —
 * documented in booking plan; mitigation would be folding in part of **`campaignId`**.
 */
export function buildFlashTripSegment(packageTitle: string): string {
  return `F${takeThreeLettersFromTitle(packageTitle)}`;
}

/** Full Trip ID string: **`segmentKey`** + 5-digit zero-padded **`sequence`** (≥ 1). */
export function formatTripRefWithSequence(segmentKey: string, sequence: number): string {
  const seq = Math.max(1, Math.trunc(sequence));
  return `${segmentKey}${String(seq).padStart(5, "0")}`;
}

/**
 * Validates Firestore **`tripRefCounters/{segmentKey}`** document ids.
 * Must stay aligned with **`firestore.rules`** for **`tripRefCounters`**.
 */
export function assertValidTripSegmentKey(segmentKey: string): void {
  const k = segmentKey.trim().toUpperCase();
  if (!SEGMENT_KEY_RE.test(k)) throw new Error("Invalid Trip ID segment.");
}

function clampInt(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(Math.max(Math.trunc(n), lo), hi);
}

/** `opt` 1→A … 26→Z; values above 26 map to **`Z`** (data currently uses low indices). */
function optIndexToLetter(opt: number): string {
  const o = clampInt(opt, 1, 26);
  return String.fromCharCode(64 + o);
}

function padDays(days: number): string {
  return String(clampInt(days, 0, 99)).padStart(2, "0");
}

function durationToTwoDigitsOrNull(duration?: string): string | null {
  const s = duration?.trim() ?? "";
  if (!s) return null;
  const m = DURATION_DAYS_RE.exec(s);
  if (!m) return null;
  const days = Number.parseInt(m[1], 10);
  if (!Number.isFinite(days)) return null;
  return padDays(days);
}

/** Uppercase ASCII A–Z only; first three chars, pad right with **`X`**. */
function takeThreeLettersFromTitle(title: string): string {
  let out = "";
  for (const ch of title) {
    const u = ch.toUpperCase();
    if (u >= "A" && u <= "Z") {
      out += u;
      if (out.length >= 3) return out.slice(0, 3);
    }
  }
  return out.padEnd(3, "X").slice(0, 3);
}
