"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  subscribeFlashDealBookingsForCampaign,
  type FlashDealCampaignBookingRow,
} from "@/lib/flash-deal-admin-bookings";

function formatWhen(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function shortUid(uid: string): string {
  const u = uid.trim();
  if (u.length <= 14) return u;
  return `${u.slice(0, 8)}…${u.slice(-4)}`;
}

type FlashDealCampaignBookingsProps = {
  campaignId: string | null;
};

export function FlashDealCampaignBookings({
  campaignId,
}: FlashDealCampaignBookingsProps) {
  const [rows, setRows] = useState<FlashDealCampaignBookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [listenError, setListenError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    if (!campaignId || campaignId.trim() === "") {
      setRows([]);
      setListenError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setListenError(null);
    const unsub = subscribeFlashDealBookingsForCampaign(
      campaignId,
      (next) => {
        setRows(next);
        setLoading(false);
      },
      (msg) => setListenError(msg),
    );
    return () => unsub();
  }, [campaignId]);

  if (!isFirebaseConfigured()) return null;

  return (
    <Card className="mt-8 border-lagoon/25 overflow-hidden p-0 shadow-sm shadow-lagoon/10">
      <div className="border-b border-gold/15 bg-white px-4 py-4 sm:px-6">
        <h2 className="font-serif text-lg font-semibold text-forest">
          Travellers who booked this flash deal
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Documents under{" "}
          <code className="rounded bg-stone-100 px-1 text-[11px]">
            flashDeals/&#123;campaign id&#125;/Travellers/&#123;uid&#125;
          </code>
          .
        </p>
      </div>

      {!campaignId || campaignId.trim() === "" ? (
        <p className="px-4 py-6 text-sm text-stone-600 sm:px-6">
          Save the campaign or choose an existing deal to see bookings for that
          campaign id.
        </p>
      ) : listenError ? (
        <p className="px-4 py-6 text-sm text-red-800 sm:px-6">
          Could not load bookings: {listenError}
          <span className="mt-2 block text-xs text-stone-600">
            Check Firestore rules allow admin read on{" "}
            <code className="rounded bg-stone-100 px-1">
              flashDeals/&#123;deal&#125;/Travellers
            </code>
            .
          </span>
        </p>
      ) : loading ? (
        <p className="px-4 py-6 text-sm text-stone-500 sm:px-6">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-stone-600 sm:px-6">
          No bookings yet for this campaign.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gold/15 bg-lagoon/5 text-xs uppercase tracking-wide text-forest">
                <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Phone</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Email</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Submitted</th>
                <th className="px-4 py-3 font-semibold sm:px-6">User id</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.userUid}
                  className="border-b border-stone-100 text-stone-800 last:border-0"
                >
                  <td className="px-4 py-3 sm:px-6">{r.primaryName || "—"}</td>
                  <td className="px-4 py-3 sm:px-6">{r.phone || "—"}</td>
                  <td className="break-all px-4 py-3 sm:px-6">
                    {r.submitterEmail ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    {formatWhen(r.submittedAt)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs sm:px-6">
                    {shortUid(r.userUid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
