"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { addonTours, allTours } from "@/data/tours";
import { getTourDetailBySlug } from "@/data/tour-detail-content";
import { cn } from "@/lib/utils";
import {
  buildPackageBookingWhatsAppMessage,
  getWhatsAppNumber,
  openWhatsAppWithText,
  type PackageBookingPartner,
} from "@/utils/whatsapp";

function slugFromDetailPath(path: string): string {
  return path.replace(/^\/packages\//, "");
}

const packageChoices = allTours
  .filter((t) => t.detailPath)
  .map((t) => ({
    slug: slugFromDetailPath(t.detailPath!),
    label: t.title,
  }));

export function PackageBookingForm() {
  const searchParams = useSearchParams();

  const [packageSlug, setPackageSlug] = useState(
    () => packageChoices[0]?.slug ?? "",
  );

  useEffect(() => {
    const q = searchParams.get("package");
    if (q && getTourDetailBySlug(q)) setPackageSlug(q);
  }, [searchParams]);
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

  const selectedTitle =
    packageChoices.find((p) => p.slug === packageSlug)?.label ?? "";

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

  function handleSubmit(e: React.FormEvent) {
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

    if (!getWhatsAppNumber()) {
      setError(
        "WhatsApp number is not configured. Add NEXT_PUBLIC_WHATSAPP_NUMBER to your environment.",
      );
      return;
    }

    const addonTitles = addonTours
      .filter((a) => addonIds.has(a.id))
      .map((a) => a.title);

    const text = buildPackageBookingWhatsAppMessage({
      primaryName: primaryName.trim(),
      primaryPassport: primaryPassport.trim(),
      primaryGender,
      partners: filledPartners,
      packageTitle: selectedTitle,
      phone: phone.trim(),
      selectedAddonTitles: addonTitles,
      notes,
    });
    openWhatsAppWithText(text);
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
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

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className={cn(
            "w-full rounded-full bg-gold py-4 text-sm font-semibold text-cream transition hover:bg-[#1d5349]",
          )}
        >
          Confirm &amp; send to WhatsApp
        </button>
      </form>
    </Card>
  );
}
