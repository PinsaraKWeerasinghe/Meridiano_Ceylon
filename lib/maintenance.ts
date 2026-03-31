/**
 * Maintenance banner / mode (env: see `.env.local` / `.env.example`).
 * Restart dev or redeploy after changing `NEXT_PUBLIC_*` values.
 */
export function isMaintenanceMode(): boolean {
  const v = process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes";
}

const DEFAULT_MAINTENANCE_INFO_EMAIL = "info@meridianoceylon.com";
const DEFAULT_MAINTENANCE_BOOKINGS_EMAIL = "bookings@meridianoceylon.com";

export function getMaintenanceInfoEmail(): string {
  const v = process.env.NEXT_PUBLIC_MAINTENANCE_INFO_EMAIL?.trim();
  return v || DEFAULT_MAINTENANCE_INFO_EMAIL;
}

export function getMaintenanceBookingsEmail(): string {
  const v = process.env.NEXT_PUBLIC_MAINTENANCE_BOOKINGS_EMAIL?.trim();
  return v || DEFAULT_MAINTENANCE_BOOKINGS_EMAIL;
}
