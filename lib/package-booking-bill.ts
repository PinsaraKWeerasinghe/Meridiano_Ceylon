import type { TourItem } from "@/data/tours";

export type BookingBillAddonRow = {
  label: string;
  /** Flat fee for this add-on on the booking (not multiplied by traveller count). */
  amountUsd: number | null;
};

export type BookingBillBreakdown = {
  travellerCount: number;
  packageTitle: string;
  durationLabel?: string;
  packagePerPersonUsd: number | null;
  /** packagePerPersonUsd × travellerCount */
  packageLineTotalUsd: number | null;
  addonRows: BookingBillAddonRow[];
  totalUsd: number | null;
};

export function computeBookingBillBreakdown(
  packageTour: TourItem | undefined,
  selectedAddons: TourItem[],
  travellerCount: number,
): BookingBillBreakdown {
  const n = Math.max(1, Math.floor(travellerCount));

  const packagePerPersonUsd = packageTour?.bookingBasePriceUsd ?? null;
  const packageLineTotalUsd =
    packagePerPersonUsd != null ? packagePerPersonUsd * n : null;

  const addonRows: BookingBillAddonRow[] = selectedAddons.map((a) => ({
    label: a.bookingBillLabel ?? a.title,
    amountUsd: a.bookingAddonPriceUsd ?? null,
  }));

  let addonSum = 0;
  for (const row of addonRows) {
    if (row.amountUsd != null) addonSum += row.amountUsd;
  }

  let totalUsd: number | null = null;
  if (packageLineTotalUsd != null) {
    totalUsd = packageLineTotalUsd + addonSum;
  } else if (addonSum > 0) {
    totalUsd = addonSum;
  }

  return {
    travellerCount: n,
    packageTitle: packageTour?.title ?? "Package",
    durationLabel: packageTour?.duration,
    packagePerPersonUsd,
    packageLineTotalUsd,
    addonRows,
    totalUsd,
  };
}

export function formatBookingBillWhatsAppLines(
  bill: BookingBillBreakdown,
): string[] {
  const lines: string[] = [];

  lines.push(`Travellers (for estimate): ${bill.travellerCount}`);

  if (bill.packagePerPersonUsd != null && bill.packageLineTotalUsd != null) {
    lines.push(
      `Package (${bill.packageTitle}): $${bill.packagePerPersonUsd} × ${bill.travellerCount} = $${bill.packageLineTotalUsd} USD`,
    );
  } else {
    lines.push(`Package (${bill.packageTitle}): price on request`);
  }

  if (bill.addonRows.length === 0) {
    lines.push("Add-ons: — (none)");
  } else {
    lines.push("Add-ons (flat per booking):");
    bill.addonRows.forEach((row) => {
      if (row.amountUsd != null) {
        lines.push(`• ${row.label}: $${row.amountUsd}`);
      } else {
        lines.push(`• ${row.label}: price on request`);
      }
    });
  }

  if (bill.totalUsd != null) {
    const label =
      bill.packagePerPersonUsd != null
        ? "Estimated total"
        : "Add-ons subtotal (USD)";
    lines.push(`${label}: $${bill.totalUsd}`);
    if (bill.packagePerPersonUsd == null && bill.addonRows.length > 0) {
      lines.push("(Package price confirmed separately.)");
    }
  }

  return lines;
}
