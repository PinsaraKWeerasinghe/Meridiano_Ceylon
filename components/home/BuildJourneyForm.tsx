"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Binoculars,
  Building2,
  Camera,
  Compass,
  HeartHandshake,
  Landmark,
  Leaf,
  Mountain,
  ShoppingBag,
  Sparkles,
  Tent,
  UtensilsCrossed,
  Home,
  Waves,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  type BudgetTier,
  type InsuranceChoice,
  type JourneyFormPayload,
  type TourMode,
  type TransportMode,
  type VibeId,
  VIBE_IDS,
  VIBE_LABELS,
  buildJourneyWhatsAppMessage,
  getWhatsAppNumber,
  openWhatsAppWithText,
} from "@/utils/whatsapp";

const vibeIcons: Record<VibeId, LucideIcon> = {
  beach: Waves,
  safari: Binoculars,
  cultural: Landmark,
  nightlife: Sparkles,
  hillCountry: Mountain,
  adventure: Compass,
  shopping: ShoppingBag,
  ayurvedic: Leaf,
  village: Home,
  food: UtensilsCrossed,
  city: Building2,
  camping: Tent,
  volunteer: HeartHandshake,
  photography: Camera,
};

function toggleVibe(list: VibeId[], id: VibeId): VibeId[] {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

type TravellerCount = number | "";

export function BuildJourneyForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState<TravellerCount>(1);
  const [children, setChildren] = useState<TravellerCount>(0);
  const [travelingWithPets, setTravelingWithPets] = useState(false);
  const [tourMode, setTourMode] = useState<TourMode>("private");
  const [vibes, setVibes] = useState<VibeId[]>([]);
  const [transport, setTransport] = useState<TransportMode>("driver");
  const [budget, setBudget] = useState<BudgetTier>("standard");
  const [insurance, setInsurance] = useState<InsuranceChoice>("none");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const payload: JourneyFormPayload = useMemo(
    () => ({
      startDate,
      endDate,
      adults: adults === "" ? 0 : adults,
      children: children === "" ? 0 : children,
      travelingWithPets,
      tourMode,
      vibes,
      transport,
      budget,
      insurance,
      insurancePolicyNumber,
    }),
    [
      startDate,
      endDate,
      adults,
      children,
      travelingWithPets,
      tourMode,
      vibes,
      transport,
      budget,
      insurance,
      insurancePolicyNumber,
    ],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate) {
      setError("Please choose start and end dates.");
      return;
    }
    if (!getWhatsAppNumber()) {
      setError(
        "WhatsApp number is not configured. Add NEXT_PUBLIC_WHATSAPP_NUMBER to your environment.",
      );
      return;
    }
    if (insurance === "own" && !insurancePolicyNumber.trim()) {
      setError("Please enter your insurance policy number, or choose another option.");
      return;
    }
    const text = buildJourneyWhatsAppMessage(payload);
    openWhatsAppWithText(text);
  }

  return (
    <section
      id="build-your-journey"
      className="scroll-mt-24 bg-lagoon/10 px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Build your journey
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-stone-600">
          Tell us your dates, pace, and vibe. We review every request personally
          and reply on WhatsApp with places and pricing.
        </p>

        <Card className="mt-10 border-lagoon/25 shadow-sm shadow-lagoon/10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Dates
              </legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-stone-600">
                  Start
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                  />
                </label>
                <label className="block text-sm text-stone-600">
                  End
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Travellers
              </legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <label className="block text-sm text-stone-600">
                  Adults
                  <input
                    type="number"
                    min={0}
                    value={adults === "" ? "" : adults}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") {
                        setAdults("");
                        return;
                      }
                      const n = Number(v);
                      if (Number.isNaN(n)) return;
                      setAdults(Math.max(0, Math.floor(n)));
                    }}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                  />
                </label>
                <label className="block text-sm text-stone-600">
                  Children
                  <input
                    type="number"
                    min={0}
                    value={children === "" ? "" : children}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") {
                        setChildren("");
                        return;
                      }
                      const n = Number(v);
                      if (Number.isNaN(n)) return;
                      setChildren(Math.max(0, Math.floor(n)));
                    }}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                  />
                </label>
                <div className="flex flex-col justify-end">
                  <span className="text-sm text-stone-600">Pets</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={travelingWithPets}
                    onClick={() => setTravelingWithPets((v) => !v)}
                    className={cn(
                      "mt-1 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-medium transition",
                      travelingWithPets
                        ? "border-lagoon/50 bg-lagoon text-cream shadow-sm shadow-lagoon/20"
                        : "border-stone-200 bg-white text-stone-700 hover:border-lagoon/25",
                    )}
                  >
                    {travelingWithPets ? "Traveling with pets" : "No pets"}
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Tour type
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-lagoon/10 p-1 ring-1 ring-lagoon/15">
                {(
                  [
                    { id: "private" as const, label: "Private tour" },
                    { id: "group" as const, label: "Group tour" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTourMode(opt.id)}
                    className={cn(
                      "rounded-lg py-2.5 text-sm font-medium transition",
                      tourMode === opt.id
                        ? "bg-white text-forest shadow-sm ring-1 ring-lagoon/25"
                        : "text-stone-600 hover:text-forest",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Vibe — select all that fit
              </legend>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {VIBE_IDS.map((id) => {
                  const Icon = vibeIcons[id];
                  const on = vibes.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVibes((v) => toggleVibe(v, id))}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center text-xs font-medium transition sm:text-sm",
                        on
                          ? "border-lagoon/40 bg-lagoon/10 text-forest shadow-sm shadow-lagoon/10"
                          : "border-stone-200 bg-white text-stone-600 hover:border-lagoon/25",
                      )}
                    >
                      <Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} />
                      <span className="leading-tight">{VIBE_LABELS[id]}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Transport
              </legend>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {(
                  [
                    { id: "driver" as const, label: "Car + driver" },
                    { id: "selfDrive" as const, label: "Self-drive rental" },
                    { id: "scooter" as const, label: "Scooter rental" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTransport(opt.id)}
                    className={cn(
                      "flex-1 rounded-xl border py-3 text-sm font-medium transition",
                      transport === opt.id
                        ? "border-lagoon/40 bg-lagoon/10 text-forest shadow-sm shadow-lagoon/10"
                        : "border-stone-200 bg-white text-stone-700 hover:border-lagoon/25",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Vehicle tier
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "budget" as const, label: "Budget" },
                    { id: "standard" as const, label: "Standard" },
                    { id: "luxury" as const, label: "Luxury" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBudget(opt.id)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-medium transition",
                      budget === opt.id
                        ? "border-lagoon/40 bg-lagoon/10 text-forest shadow-sm shadow-lagoon/10"
                        : "border-stone-200 bg-white text-stone-700 hover:border-lagoon/25",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-forest">
                Insurance &amp; safety
              </legend>
              <p className="mt-1 text-xs text-stone-500">
                Not a substitute for travel insurance — our team can advise on
                the Meridiano safety add-on.
              </p>
              <div className="mt-3 space-y-3">
                {(
                  [
                    {
                      id: "meridiano" as const,
                      label: "Meridiano 24/7 Safety & Medical Support Cover",
                    },
                    { id: "own" as const, label: "I will use my own insurance" },
                    { id: "none" as const, label: "Not sure yet / discuss on WhatsApp" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition",
                      insurance === opt.id
                        ? "border-lagoon/35 bg-lagoon/5 shadow-sm shadow-lagoon/10"
                        : "border-stone-200 bg-stone-50/50 hover:border-lagoon/20",
                    )}
                  >
                    <input
                      type="radio"
                      name="insurance"
                      checked={insurance === opt.id}
                      onChange={() => setInsurance(opt.id)}
                      className="mt-1 text-forest"
                    />
                    <span className="text-stone-700">{opt.label}</span>
                  </label>
                ))}
                {insurance === "own" ? (
                  <label className="block text-sm text-stone-600">
                    Policy number
                    <input
                      type="text"
                      value={insurancePolicyNumber}
                      onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                      placeholder="Required if using your own insurance"
                      className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                ) : null}
              </div>
            </fieldset>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-gold py-4 text-sm font-semibold text-cream transition hover:bg-[#1d5349]"
            >
              Send to WhatsApp
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
}
