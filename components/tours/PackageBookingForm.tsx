"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { addonTours, allTours } from "@/data/tours";
import { getTourDetailBySlug } from "@/data/tour-detail-content";
import {
  PACKAGE_BOOKING_DRAFT_STORAGE_KEY,
  type PackageBookingDraftV1,
} from "@/lib/package-booking-draft";
import { computeBookingBillBreakdown } from "@/lib/package-booking-bill";
import { appendUserBooking } from "@/lib/user-bookings";
import { fetchUserProfile } from "@/lib/user-profile";
import { cn } from "@/lib/utils";
import { type PackageBookingPartner } from "@/utils/whatsapp";

function slugFromDetailPath(path: string): string {
  return path.replace(/^\/packages\//, "");
}

const packageChoices = allTours
  .filter((t) => t.detailPath)
  .map((t) => ({
    slug: slugFromDetailPath(t.detailPath!),
    label: t.title,
  }));

function tourForPackageSlug(slug: string) {
  return allTours.find(
    (t) => t.detailPath && slugFromDetailPath(t.detailPath) === slug,
  );
}

/** Mirrors profile form: split Auth displayName when Firestore names are empty. */
function splitDisplayName(displayName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!displayName?.trim()) return { firstName: "", lastName: "" };
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

export function PackageBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready: authReady } = useAuthUser();

  const [packageSlug, setPackageSlug] = useState(
    () => packageChoices[0]?.slug ?? "",
  );

  useEffect(() => {
    const q = searchParams.get("package");
    if (q && getTourDetailBySlug(q)) setPackageSlug(q);
  }, [searchParams]);

  const checkoutSessionMissing =
    searchParams.get("checkout") === "missing";

  const [primaryName, setPrimaryName] = useState("");
  const [primaryPassport, setPrimaryPassport] = useState("");
  const [primaryGender, setPrimaryGender] = useState<"male" | "female" | "">(
    "",
  );
  const [partners, setPartners] = useState<PackageBookingPartner[]>([]);
  const [phone, setPhone] = useState("");
  const [addonIds, setAddonIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authReady || !user?.uid) return;

    const uid = user.uid;
    let cancelled = false;

    void (async () => {
      try {
        const doc = await fetchUserProfile(uid);
        if (cancelled) return;

        const authParts = splitDisplayName(user.displayName);
        const docFirst = doc?.firstName?.trim() ?? "";
        const docLast = doc?.lastName?.trim() ?? "";
        const firstName = docFirst || authParts.firstName;
        const lastName = docLast || authParts.lastName;
        const fullName = [firstName, lastName].filter(Boolean).join(" ");

        const passport = doc?.passportId?.trim() ?? "";
        const contact =
          doc?.phone?.trim() ||
          (user.phoneNumber ? user.phoneNumber.trim() : "") ||
          "";
        const gender =
          doc?.gender === "male" || doc?.gender === "female"
            ? doc.gender
            : "";

        setPrimaryName((prev) => (prev.trim() === "" ? fullName : prev));
        setPrimaryPassport((prev) => (prev.trim() === "" ? passport : prev));
        setPhone((prev) => (prev.trim() === "" ? contact : prev));
        setPrimaryGender((prev) => {
          if (prev !== "") return prev;
          return gender;
        });
      } catch {
        if (cancelled) return;
        const authParts = splitDisplayName(user.displayName);
        const fullName = [authParts.firstName, authParts.lastName]
          .filter(Boolean)
          .join(" ");
        setPrimaryName((prev) => (prev.trim() === "" ? fullName : prev));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authReady,
    user?.uid,
    user?.displayName,
    user?.phoneNumber,
  ]);

  useEffect(() => {
    if (tourForPackageSlug(packageSlug)?.kind === "specialty") {
      setAddonIds(new Set());
    }
  }, [packageSlug]);

  const selectedTitle =
    packageChoices.find((p) => p.slug === packageSlug)?.label ?? "";

  const selectedPackageTour = tourForPackageSlug(packageSlug);

  const showOptionalAddons = selectedPackageTour?.kind !== "specialty";

  const selectedAddonsForBill = addonTours.filter((a) => addonIds.has(a.id));
  const travellerCountForBill =
    1 +
    partners.filter((p) => p.name.trim() && p.passport.trim()).length;

  const billBreakdown = showOptionalAddons
    ? computeBookingBillBreakdown(
        selectedPackageTour,
        selectedAddonsForBill,
        travellerCountForBill,
      )
    : null;

  function toggleAddon(id: string) {
    setAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addPartner() {
    setPartners((p) => [...p, { name: "", passport: "", gender: "male" }]);
  }

  function updatePartner(
    index: number,
    field: keyof PackageBookingPartner,
    value: string,
  ) {
    setPartners((prev) => {
      const next = [...prev];
      const row = { ...next[index] };
      if (field === "gender") {
        row.gender = value === "female" ? "female" : "male";
      } else {
        (row as Record<string, string>)[field] = value;
      }
      next[index] = row;
      return next;
    });
  }

  function removePartner(index: number) {
    setPartners((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!primaryName.trim()) {
      setError("Please enter the lead traveller’s full name.");
      return;
    }
    if (!primaryPassport.trim()) {
      setError("Please enter the lead traveller’s passport number.");
      return;
    }
    if (primaryGender !== "male" && primaryGender !== "female") {
      setError("Please select male or female for the lead traveller.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a phone number (with country code).");
      return;
    }
    if (!packageSlug || !selectedTitle) {
      setError("Please select a package.");
      return;
    }

    const filledPartners: PackageBookingPartner[] = [];
    for (const p of partners) {
      const n = p.name.trim();
      const pass = p.passport.trim();
      if (!n && !pass) continue;
      if (n && !pass) {
        setError(
          `Please enter a passport number for partner “${n}”, or clear their name.`,
        );
        return;
      }
      if (!n && pass) {
        setError("Please enter a name for each partner with a passport number.");
        return;
      }
      filledPartners.push({
        name: n,
        passport: pass,
        gender: p.gender,
      });
    }

    const selectedTour = selectedPackageTour;
    const addonTitles =
      selectedTour?.kind === "specialty"
        ? []
        : addonTours.filter((a) => addonIds.has(a.id)).map((a) => a.title);

    const draft: PackageBookingDraftV1 = {
      v: 1,
      packageSlug,
      packageTitle: selectedTitle,
      primaryName: primaryName.trim(),
      primaryPassport: primaryPassport.trim(),
      primaryGender,
      partners: filledPartners,
      phone: phone.trim(),
      addonIds: Array.from(addonIds),
      addonTitles,
      notes,
      billBreakdown: billBreakdown,
    };

    setSubmitting(true);
    try {
      const uid = user?.uid?.trim();
      if (uid) {
        await appendUserBooking(uid, {
          kind: "package",
          typeLabel: `Package · ${selectedTitle}`,
          bookingDate: "",
          packageSlug,
          flashDealDocId: "",
        });
      }
      sessionStorage.setItem(
        PACKAGE_BOOKING_DRAFT_STORAGE_KEY,
        JSON.stringify(draft),
      );
      router.push("/packages/book/checkout");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save this booking to your account.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      {checkoutSessionMissing ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          Your checkout session expired or was cleared. Confirm your booking
          again to continue.
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-forest">Package</legend>
          <label className="mt-3 block text-sm text-stone-600">
            Selected tour / package
            <select
              value={packageSlug}
              onChange={(e) => setPackageSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              required
            >
              {packageChoices.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-forest">
            Lead traveller
          </legend>
          <div className="mt-3 space-y-4">
            <label className="block text-sm text-stone-600">
              Full name
              <input
                type="text"
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                autoComplete="name"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                required
              />
            </label>
            <label className="block text-sm text-stone-600">
              Passport number
              <input
                type="text"
                value={primaryPassport}
                onChange={(e) => setPrimaryPassport(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                required
              />
            </label>
            <div>
              <span className="text-sm text-stone-600">Gender</span>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-800">
                  <input
                    type="radio"
                    name="primaryGender"
                    checked={primaryGender === "male"}
                    onChange={() => setPrimaryGender("male")}
                    className="text-forest"
                  />
                  Male
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-800">
                  <input
                    type="radio"
                    name="primaryGender"
                    checked={primaryGender === "female"}
                    onChange={() => setPrimaryGender("female")}
                    className="text-forest"
                  />
                  Female
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <legend className="text-sm font-semibold text-forest">
              Travel partners
            </legend>
            <button
              type="button"
              onClick={addPartner}
              className="text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
            >
              + Add partner
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Add each companion with passport number and gender (optional if
            travelling alone).
          </p>
          <div className="mt-4 space-y-6">
            {partners.map((p, index) => (
              <div
                key={index}
                className="rounded-xl border border-stone-200 bg-stone-50/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Partner {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePartner(index)}
                    className="text-xs font-medium text-stone-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <label className="block text-sm text-stone-600">
                    Full name
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) =>
                        updatePartner(index, "name", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                  <label className="block text-sm text-stone-600">
                    Passport number
                    <input
                      type="text"
                      value={p.passport}
                      onChange={(e) =>
                        updatePartner(index, "passport", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                  <div>
                    <span className="text-sm text-stone-600">Gender</span>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-800">
                        <input
                          type="radio"
                          name={`partnerGender-${index}`}
                          checked={p.gender === "male"}
                          onChange={() =>
                            updatePartner(index, "gender", "male")
                          }
                          className="text-forest"
                        />
                        Male
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-800">
                        <input
                          type="radio"
                          name={`partnerGender-${index}`}
                          checked={p.gender === "female"}
                          onChange={() =>
                            updatePartner(index, "gender", "female")
                          }
                          className="text-forest"
                        />
                        Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-forest">
            Contact
          </legend>
          <label className="mt-3 block text-sm text-stone-600">
            Phone (include country code)
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              inputMode="tel"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              required
            />
          </label>
        </fieldset>

        {showOptionalAddons ? (
          <fieldset>
            <legend className="text-sm font-semibold text-forest">
              Optional add-ons
            </legend>
            <p className="mt-1 text-xs text-stone-500">
              Tick any you want layered onto this booking. Open a page to read
              details first.
            </p>
            <ul className="mt-4 space-y-3">
              {addonTours.map((a) => (
                <li key={a.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm transition hover:border-lagoon/30">
                    <input
                      type="checkbox"
                      checked={addonIds.has(a.id)}
                      onChange={() => toggleAddon(a.id)}
                      className="mt-1 rounded border-stone-300 text-forest"
                    />
                    <span className="text-stone-800">
                      <span className="font-medium text-forest">{a.title}</span>
                      {a.detailPath ? (
                        <>
                          {" "}
                          <Link
                            href={a.detailPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-lagoon underline-offset-2 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View page
                          </Link>
                        </>
                      ) : null}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ) : null}

        <fieldset>
          <legend className="text-sm font-semibold text-forest">
            Special notes
          </legend>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Dietary needs, mobility, preferred dates, children, etc."
            className="mt-3 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
          />
        </fieldset>

        {billBreakdown ? (
          <fieldset>
            <legend className="text-sm font-semibold text-forest">
              Booking summary
            </legend>
            <p className="mt-1 text-xs text-stone-500">
              Package price is per person and scales with travellers (lead plus
              partners with completed details). Add-ons are a flat fee per
              selection for this booking. Meridiano confirms the final amount
              before payment.
            </p>
            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 text-sm text-stone-800">
              <div className="space-y-3">
                <p className="text-xs font-medium text-stone-600">
                  Travellers in this estimate:{" "}
                  <span className="tabular-nums text-forest">
                    {billBreakdown.travellerCount}
                  </span>
                </p>

                <div className="flex justify-between gap-4 border-b border-stone-200 pb-3">
                  <div className="min-w-0">
                    <p className="font-medium text-forest">
                      {billBreakdown.packageTitle}
                    </p>
                    {billBreakdown.durationLabel ? (
                      <p className="mt-0.5 text-xs text-stone-500">
                        {billBreakdown.durationLabel}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    {billBreakdown.packagePerPersonUsd != null &&
                    billBreakdown.packageLineTotalUsd != null ? (
                      <>
                        <p className="font-semibold tabular-nums text-forest">
                          ${billBreakdown.packageLineTotalUsd}
                        </p>
                        <p className="text-xs text-stone-500">
                          ${billBreakdown.packagePerPersonUsd} ×{" "}
                          {billBreakdown.travellerCount}{" "}
                          {billBreakdown.travellerCount === 1
                            ? "person"
                            : "people"}
                        </p>
                      </>
                    ) : (
                      <p className="text-stone-600">On request</p>
                    )}
                  </div>
                </div>

                {billBreakdown.addonRows.length > 0 ? (
                  <ul className="space-y-2">
                    {billBreakdown.addonRows.map((row) => (
                      <li
                        key={row.label}
                        className="flex justify-between gap-4 border-stone-100"
                      >
                        <span className="text-stone-700">
                          • {row.label}
                        </span>
                        <span className="shrink-0 text-right tabular-nums font-medium text-stone-900">
                          {row.amountUsd != null ? (
                            <span className="block">${row.amountUsd}</span>
                          ) : (
                            "—"
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500">No add-ons selected.</p>
                )}

                {billBreakdown.totalUsd != null ? (
                  <div className="space-y-1 border-t border-stone-200 pt-3">
                    <div className="flex justify-between gap-4 font-semibold text-forest">
                      <span>
                        {billBreakdown.packagePerPersonUsd != null
                          ? "Estimated total"
                          : "Add-ons subtotal"}
                      </span>
                      <span className="tabular-nums">
                        ${billBreakdown.totalUsd}
                      </span>
                    </div>
                    {billBreakdown.packagePerPersonUsd == null &&
                    billBreakdown.addonRows.length > 0 ? (
                      <p className="text-xs font-normal text-stone-500">
                        Package price quoted separately.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </fieldset>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {authReady && !user ? (
          <p className="text-xs text-stone-500">
            <Link
              href="/login?next=/packages/book"
              className="font-semibold text-lagoon underline-offset-2 hover:underline"
            >
              Sign in
            </Link>{" "}
            to keep a copy of each submission under{" "}
            <Link
              href="/my-bookings"
              className="font-semibold text-lagoon underline-offset-2 hover:underline"
            >
              My Bookings
            </Link>
            .
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full rounded-full bg-gold py-4 text-sm font-semibold text-cream transition hover:bg-[#1d5349]",
            submitting && "opacity-60",
          )}
        >
          {submitting ? "Saving…" : "Confirm Booking"}
        </button>
      </form>
    </Card>
  );
}
