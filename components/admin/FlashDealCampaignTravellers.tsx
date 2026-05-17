"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  subscribeFlashDealCampaignTravellers,
  type FlashDealCampaignTravellerRow,
} from "@/lib/flash-deal-admin-travellers";

function shortUid(uid: string): string {
  const u = uid.trim();
  if (u.length <= 14) return u;
  return `${u.slice(0, 8)}…${u.slice(-4)}`;
}

function formatSubmittedAt(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type FlashDealCampaignTravellersProps = {
  campaignId: string | null;
};

export function FlashDealCampaignTravellers({
  campaignId,
}: FlashDealCampaignTravellersProps) {
  const [rows, setRows] = useState<FlashDealCampaignTravellerRow[]>([]);
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
    const unsub = subscribeFlashDealCampaignTravellers(
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

  const emptyCampaign = !campaignId || campaignId.trim() === "";

  return (
    <Card className="mt-8 border-lagoon/25 overflow-hidden p-0 shadow-sm shadow-lagoon/10">
      <div className="border-b border-gold/15 bg-white px-4 py-4 sm:px-6">
        <h2 className="font-serif text-lg font-semibold text-forest">
          Travellers booked on this campaign
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Snapshot rows in{" "}
          <code className="rounded bg-stone-100 px-1">
            flashDeals/&#123;id&#125;/Travellers
          </code>{" "}
          (immutable confirmation submitted from the booking form).
        </p>
      </div>

      {emptyCampaign ? (
        <p className="px-4 py-6 text-sm text-stone-600 sm:px-6">
          Save the campaign or pick an existing deal to load travellers booked under
          its id.
        </p>
      ) : listenError ? (
        <div className="px-4 py-6 text-sm text-red-800 sm:px-6">
          <p>Could not load travellers: {listenError}</p>
          <p className="mt-2 text-xs text-stone-600">
            Confirm you are signed in as an admin and rules are deployed (
            <code className="rounded bg-stone-100 px-1">
              flashDeals/&#123;id&#125;/Travellers
            </code>{" "}
            allows admin reads).
          </p>
        </div>
      ) : loading ? (
        <p className="px-4 py-6 text-sm text-stone-500 sm:px-6">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-stone-600 sm:px-6">
          No travellers have booked this campaign yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gold/15 bg-lagoon/5 text-xs uppercase tracking-wide text-forest">
                <th className="px-4 py-3 font-semibold sm:px-6">Primary traveller</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Phone</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Partners</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Submitted email</th>
                <th className="px-4 py-3 font-semibold sm:px-6">Submitted</th>
                <th className="px-4 py-3 font-semibold sm:px-6">User id</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.uid}
                  className="border-b border-stone-100 text-stone-800 last:border-0"
                >
                  <td className="px-4 py-3 sm:px-6">
                    <div className="font-medium text-forest">
                      {r.primaryName || "—"}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-stone-600">
                      {r.primaryPassport || "no passport"}
                      {r.primaryGender ? ` · ${r.primaryGender}` : ""}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    {r.phone || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    {r.partnersCount === 0
                      ? "Solo"
                      : `${r.partnersCount} partner${r.partnersCount === 1 ? "" : "s"}`}
                  </td>
                  <td className="break-all px-4 py-3 sm:px-6">
                    {r.submitterEmail ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    {formatSubmittedAt(r.submittedAt)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs sm:px-6">
                    {shortUid(r.uid)}
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
