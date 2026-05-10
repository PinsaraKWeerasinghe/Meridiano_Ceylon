/** Calendar bounds for an ISO date `YYYY-MM-DD` in Asia/Colombo (+05:30). */
export function colomboDayBoundsMs(
  isoDate: string,
): { startMs: number; endMs: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [y, mo, d] = isoDate.split("-").map(Number);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const startMs = Date.parse(`${y}-${pad(mo)}-${pad(d)}T00:00:00+05:30`);
  const endMs = Date.parse(`${y}-${pad(mo)}-${pad(d)}T23:59:59+05:30`);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return null;
  return { startMs, endMs };
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** e.g. `2026-06-06` → `6 June 2026` */
export function formatDealDateLabel(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const monthName = MONTHS[mo - 1];
  if (!monthName || mo < 1 || mo > 12) return isoDate;
  return `${d} ${monthName} ${y}`;
}

/** Compact label for narrow layouts (locale-aware). */
export function formatDealDateShort(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
