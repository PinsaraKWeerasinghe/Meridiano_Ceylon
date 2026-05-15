"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import {
  safeReadDraftFromStorage,
  type PackageBookingDraftV1,
} from "@/lib/package-booking-draft";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import { cn } from "@/lib/utils";

import { PolicyMarkdown } from "@/components/legal/PolicyMarkdown";
import {
  legalPolicyHref,
  type LegalPolicySlug,
} from "@/lib/legal-documents";

const POLICY_DOCS: ReadonlyArray<{
  id: LegalPolicySlug;
  label: string;
  href: string;
}> = [
  {
    id: "terms",
    label: "Terms and Conditions",
    href: legalPolicyHref("terms"),
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    href: legalPolicyHref("privacy"),
  },
  {
    id: "refund",
    label: "Refund Policy",
    href: legalPolicyHref("refund"),
  },
];

const POLICY_DOC_BUTTON_CLASS =
  "font-semibold text-lagoon underline-offset-2 hover:underline";

export function PackageBookingCheckout() {
  const router = useRouter();
  const { user, ready: authReady } = useAuthUser();
  const [draft, setDraft] = useState<PackageBookingDraftV1 | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [billingEmail, setBillingEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingCountry, setBillingCountry] = useState("Sri Lanka");
  const [billingZip, setBillingZip] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const [openDocId, setOpenDocId] = useState<LegalPolicySlug | null>(null);
  const [docContents, setDocContents] = useState<
    Partial<Record<LegalPolicySlug, string>>
  >({});
  const [docLoadingId, setDocLoadingId] = useState<LegalPolicySlug | null>(
    null,
  );
  const [docError, setDocError] = useState<string | null>(null);

  async function togglePolicyDoc(id: LegalPolicySlug) {
    if (openDocId === id) {
      setOpenDocId(null);
      return;
    }
    setDocError(null);
    setOpenDocId(id);
    if (docContents[id] != null) return;
    const doc = POLICY_DOCS.find((d) => d.id === id);
    if (!doc) return;
    setDocLoadingId(id);
    try {
      const res = await fetch(doc.href, { cache: "force-cache" });
      if (!res.ok) {
        throw new Error(`Could not load ${doc.label} (${res.status}).`);
      }
      const text = await res.text();
      setDocContents((prev) => ({ ...prev, [id]: text }));
    } catch (err) {
      setDocError(
        err instanceof Error
          ? err.message
          : "Could not load this document. Try again.",
      );
    } finally {
      setDocLoadingId((prev) => (prev === id ? null : prev));
    }
  }

  useEffect(() => {
    const d = safeReadDraftFromStorage();
    if (!d) {
      setLoadError("missing");
      router.replace("/packages/book?checkout=missing");
      return;
    }
    setDraft(d);
    setLoadError(null);
  }, [router]);

  useEffect(() => {
    if (!authReady) return;
    const e = user?.email?.trim() ?? "";
    setBillingEmail((prev) => (prev.trim() === "" ? e : prev));
  }, [authReady, user?.email]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPayError(null);
    if (!draft) return;
    if (!termsAccepted) {
      setPayError(
        "Please confirm you agree to the Terms and Conditions, Privacy Policy, and Refund Policy.",
      );
      return;
    }
    if (!billingEmail.trim()) {
      setPayError("Please enter your billing email.");
      return;
    }
    if (!billingAddress.trim()) {
      setPayError("Please enter your billing address.");
      return;
    }
    if (!billingCity.trim()) {
      setPayError("Please enter your city.");
      return;
    }
    if (!billingCountry.trim()) {
      setPayError("Please enter your country.");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/payhere/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          billing: {
            email: billingEmail.trim(),
            address: billingAddress.trim(),
            city: billingCity.trim(),
            country: billingCountry.trim(),
            zip: billingZip.trim(),
          },
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        configured?: boolean;
        checkoutUrl?: string;
        message?: string;
      };

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      const msg =
        data.message ??
        (data.configured === false
          ? "PayHere is not configured for this environment yet."
          : "Unable to start payment. Try again later.");
      setPayError(msg);
    } catch {
      setPayError("Network error starting payment.");
    } finally {
      setPaying(false);
    }
  }

  if (loadError === "missing" || !draft) {
    return (
      <Card className="border-lagoon/25 px-6 py-12 text-center text-sm text-stone-600">
        <p>Redirecting you back to booking…</p>
      </Card>
    );
  }

  const bill = draft.billBreakdown;

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      <form onSubmit={(ev) => void handlePay(ev)} className="space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-forest">
            Booking summary
          </legend>
          <div
            className={cn(
              "mt-3 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 text-sm text-stone-800",
            )}
          >
            <p className="font-medium text-forest">{draft.packageTitle}</p>
            <p className="mt-3 text-xs text-stone-600">
              Lead traveller: <span className="text-stone-800">{draft.primaryName}</span>
            </p>
            <p className="mt-1 text-xs text-stone-600">
              Passport:{" "}
              <span className="font-mono text-stone-800">{draft.primaryPassport}</span>
            </p>
            <p className="mt-1 text-xs text-stone-600">
              Gender:{" "}
              <span className="text-stone-800 capitalize">{draft.primaryGender}</span>
            </p>
            <p className="mt-1 text-xs text-stone-600">
              Phone: <span className="text-stone-800">{draft.phone}</span>
            </p>
            {draft.partners.length > 0 ? (
              <div className="mt-3 border-t border-stone-200 pt-3 text-xs text-stone-600">
                <p className="font-semibold text-stone-700">Partners</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  {draft.partners.map((p, idx) => (
                    <li key={`${idx}-${p.passport}-${p.name}`}>
                      {p.name} — {p.passport} ({p.gender})
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {draft.addonTitles.length > 0 ? (
              <div className="mt-3 border-t border-stone-200 pt-3 text-xs text-stone-600">
                <p className="font-semibold text-stone-700">Add-ons</p>
                <ul className="mt-1 list-inside list-disc">
                  {draft.addonTitles.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {draft.notes.trim() ? (
              <div className="mt-3 border-t border-stone-200 pt-3 text-xs text-stone-600">
                <p className="font-semibold text-stone-700">Notes</p>
                <p className="mt-1 whitespace-pre-line text-stone-800">{draft.notes}</p>
              </div>
            ) : null}
          </div>
        </fieldset>

        {bill ? (
          <fieldset>
            <legend className="text-sm font-semibold text-forest">Estimate</legend>
            <div
              className={cn(
                "mt-3 rounded-xl border border-stone-200 px-4 py-4 text-sm text-stone-800",
                packagesGreenCard,
              )}
            >
              <p className="text-xs text-stone-600">
                Travellers:{" "}
                <span className="tabular-nums font-medium text-forest">
                  {bill.travellerCount}
                </span>
              </p>
              {bill.packagePerPersonUsd != null && bill.packageLineTotalUsd != null ? (
                <p className="mt-2 font-semibold text-forest">
                  Package:{" "}
                  <span className="tabular-nums">${bill.packageLineTotalUsd}</span>
                  <span className="ml-2 text-xs font-normal text-stone-600">
                    (${bill.packagePerPersonUsd} × {bill.travellerCount})
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-stone-600">Package price — on request</p>
              )}
              {bill.addonRows.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs">
                  {bill.addonRows.map((row) => (
                    <li key={row.label} className="flex justify-between gap-4">
                      <span>{row.label}</span>
                      <span className="tabular-nums font-medium">
                        {row.amountUsd != null ? `$${row.amountUsd}` : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {bill.totalUsd != null ? (
                <p className="mt-3 border-t border-stone-200 pt-3 font-semibold text-forest">
                  Estimated total:{" "}
                  <span className="tabular-nums">${bill.totalUsd}</span> USD
                </p>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        <fieldset>
          <legend className="text-sm font-semibold text-forest">
            Billing details
          </legend>
          <p className="mt-1 text-xs text-stone-500">
            Used for PayHere checkout. You can edit before paying.
          </p>
          <div className="mt-3 space-y-4">
            <label className="block text-sm text-stone-600">
              Email
              <input
                type="email"
                value={billingEmail}
                onChange={(ev) => setBillingEmail(ev.target.value)}
                autoComplete="email"
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
            <label className="block text-sm text-stone-600">
              Address line
              <input
                type="text"
                value={billingAddress}
                onChange={(ev) => setBillingAddress(ev.target.value)}
                autoComplete="street-address"
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-stone-600">
                City
                <input
                  type="text"
                  value={billingCity}
                  onChange={(ev) => setBillingCity(ev.target.value)}
                  autoComplete="address-level2"
                  required
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-stone-600">
                ZIP / Postal code{" "}
                <span className="font-normal text-stone-400">(optional)</span>
                <input
                  type="text"
                  value={billingZip}
                  onChange={(ev) => setBillingZip(ev.target.value)}
                  autoComplete="postal-code"
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                />
              </label>
            </div>
            <label className="block text-sm text-stone-600">
              Country
              <input
                type="text"
                value={billingCountry}
                onChange={(ev) => setBillingCountry(ev.target.value)}
                autoComplete="country-name"
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-forest">Policies</legend>
          <p className="mt-1 text-xs text-stone-600">
            Please review before you pay. Click a document to read it inline.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs text-stone-600">
            {POLICY_DOCS.map((doc) => {
              const isOpen = openDocId === doc.id;
              const isLoading = docLoadingId === doc.id;
              const md = docContents[doc.id];
              return (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => void togglePolicyDoc(doc.id)}
                    aria-expanded={isOpen}
                    aria-controls={`policy-doc-${doc.id}`}
                    className={POLICY_DOC_BUTTON_CLASS}
                  >
                    {doc.label}
                  </button>
                  {isLoading ? (
                    <span className="ml-2 text-[11px] text-stone-500">
                      Loading…
                    </span>
                  ) : null}
                  {isOpen ? (
                    <div
                      id={`policy-doc-${doc.id}`}
                      className="mt-2 max-h-[22rem] overflow-y-auto rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 sm:max-h-[28rem]"
                    >
                      {docError && md == null ? (
                        <p className="text-red-700">{docError}</p>
                      ) : md != null ? (
                        <div className="space-y-2">
                          <PolicyMarkdown content={md} variant="inline" />
                          <p className="border-t border-stone-200 pt-2 text-[11px] text-stone-500">
                            Prefer a full-page view?{" "}
                            <a
                              href={`/legal/${doc.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-lagoon underline-offset-2 hover:underline"
                            >
                              Open “{doc.label}” on its own page
                            </a>
                            .
                          </p>
                        </div>
                      ) : (
                        <p className="text-stone-500">Loading {doc.label}…</p>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-stone-800">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(ev) => setTermsAccepted(ev.target.checked)}
              className="mt-1 rounded border-stone-300 text-forest"
            />
            <span>
              I have read and agree to the Terms and Conditions, Privacy
              Policy, and Refund Policy.
            </span>
          </label>
        </fieldset>

        {payError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {payError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={paying}
          className={cn(
            "w-full rounded-full bg-gold py-4 text-sm font-semibold text-cream transition hover:bg-[#1d5349]",
            paying && "opacity-60",
          )}
        >
          {paying ? "Starting payment…" : "Pay"}
        </button>
      </form>
    </Card>
  );
}
