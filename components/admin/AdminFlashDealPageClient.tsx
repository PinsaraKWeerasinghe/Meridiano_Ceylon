"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { useUserRole } from "@/components/auth/useUserRole";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  createEmptyFlashDealDraft,
  DEFAULT_ITINERARY_SNAP,
  FLASH_DEALS_COLLECTION,
  listFlashDealsForAdmin,
  loadFlashDealForAdminPage,
  saveFlashDealSettings,
  type FlashDealAdminMeta,
  type FlashDealItinerarySnap,
  type FlashDealListRow,
  type FlashDealSettingsInput,
} from "@/lib/flash-deal-settings";
import { ROLE_LABEL, type UserRole } from "@/lib/user-profile";

function formatDateTime(value: Date): string {
  return value.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminFlashDealPageClient() {
  const { user, ready: authReady } = useAuthUser();
  const { role, roleReady } = useUserRole(user, authReady);

  const [title, setTitle] = useState("");
  const [dealDate, setDealDate] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [fixedTourStartDate, setFixedTourStartDate] = useState("");
  const [fixedTourEndDate, setFixedTourEndDate] = useState("");
  const [perPersonCharge, setPerPersonCharge] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [hotelLevel, setHotelLevel] = useState("");
  const [transport, setTransport] = useState("");
  const [registrationPrice, setRegistrationPrice] = useState("");
  const [itinerarySnaps, setItinerarySnaps] = useState<
    FlashDealItinerarySnap[]
  >([{ ...DEFAULT_ITINERARY_SNAP }]);

  const [meta, setMeta] = useState<FlashDealAdminMeta | null>(null);
  /** `null` = new unsaved draft (next save allocates a Firestore doc id). */
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [dealList, setDealList] = useState<FlashDealListRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const applyValuesToForm = useCallback((values: FlashDealSettingsInput) => {
    setTitle(values.title);
    setDealDate(values.dealDate);
    setDisabled(values.disabled);
    setIsFeatured(values.isFeatured);
    setDescription(values.description);
    setFixedTourStartDate(values.fixedTourStartDate);
    setFixedTourEndDate(values.fixedTourEndDate);
    setPerPersonCharge(values.perPersonCharge);
    setGroupSize(values.groupSize);
    setHotelLevel(values.hotelLevel);
    setTransport(values.transport);
    setRegistrationPrice(values.registrationPrice);
    setItinerarySnaps(
      values.itinerarySnaps.length > 0
        ? values.itinerarySnaps.map((s) => ({ ...s }))
        : [{ ...DEFAULT_ITINERARY_SNAP }],
    );
  }, []);

  const reloadDealFromFirestore = useCallback(async (dealId: string | null) => {
    setError(null);
    setSavedOk(false);
    setLoading(true);
    try {
      const result = await loadFlashDealForAdminPage(dealId);
      setEditingDealId(result.dealId);
      applyValuesToForm(result.values);
      setMeta(result.meta);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load flash deal.",
      );
    } finally {
      setLoading(false);
    }
  }, [applyValuesToForm]);

  const startNewDraft = useCallback(() => {
    setError(null);
    setSavedOk(false);
    applyValuesToForm(createEmptyFlashDealDraft());
    setEditingDealId(null);
    setMeta(null);
  }, [applyValuesToForm]);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    if (!authReady || !roleReady) return;
    if (!user || role !== "admin") {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const rows = await listFlashDealsForAdmin();
        setDealList(rows);
        if (rows.length === 0) {
          await reloadDealFromFirestore(null);
        } else {
          const pick =
            rows.find((r) => r.isFeatured)?.id ?? rows[0]?.id ?? null;
          await reloadDealFromFirestore(pick);
        }
      } catch {
        setError("Could not load flash deals.");
        setLoading(false);
      }
    })();
  }, [authReady, roleReady, user, role, reloadDealFromFirestore]);

  function updateSnap(index: number, patch: Partial<FlashDealItinerarySnap>) {
    setItinerarySnaps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function addSnap() {
    setItinerarySnaps((prev) => [...prev, { ...DEFAULT_ITINERARY_SNAP }]);
  }

  function removeSnap(index: number) {
    setItinerarySnaps((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.uid) return;
    setError(null);
    setSavedOk(false);
    setSaving(true);
    try {
      const payload: FlashDealSettingsInput = {
        title: title.trim(),
        dealDate: dealDate.trim(),
        disabled,
        isFeatured,
        description,
        fixedTourStartDate,
        fixedTourEndDate,
        perPersonCharge,
        groupSize,
        hotelLevel,
        transport,
        registrationPrice,
        itinerarySnaps,
      };
      const { dealId } = await saveFlashDealSettings(
        user.uid,
        user.email ?? null,
        editingDealId,
        payload,
      );
      setSavedOk(true);
      setDealList(await listFlashDealsForAdmin());
      await reloadDealFromFirestore(dealId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isFirebaseConfigured()) {
    return (
      <Card className="border-lagoon/25 p-6 shadow-sm">
        <p className="text-sm text-stone-700">
          Firebase is not configured. Add{" "}
          <code className="rounded bg-stone-100 px-1 text-xs">
            NEXT_PUBLIC_FIREBASE_*
          </code>{" "}
          to your environment.
        </p>
      </Card>
    );
  }

  if (!authReady || !roleReady) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-600">Loading…</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-700">Please sign in to continue.</p>
        <Link
          href="/login?next=/admin/flash-deal"
          className="mt-4 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Go to login
        </Link>
      </Card>
    );
  }

  if (role !== "admin") {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm font-semibold text-forest">Access denied</p>
        <p className="mt-2 text-sm text-stone-600">
          Only administrators can edit the flash deal. Your role is{" "}
          <span className="font-medium text-forest">
            {ROLE_LABEL[role as UserRole]}
          </span>
          .
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      <p className="text-sm text-stone-600">
        Campaigns live in{" "}
        <code className="rounded bg-stone-100 px-1 text-xs">
          {FLASH_DEALS_COLLECTION}
        </code>
        . Mark one deal as{" "}
        <strong className="text-forest">featured</strong> to drive the homepage
        banner and{" "}
        <Link
          href="/flash-deal"
          className="font-semibold text-lagoon underline-offset-2 hover:underline"
        >
          /flash-deal
        </Link>
        . Older data at doc{" "}
        <code className="rounded bg-stone-100 px-1 text-[11px]">current</code>{" "}
        still shows if nothing is featured yet.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-stone-500">Loading settings…</p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <label className="block min-w-[12rem] flex-1 text-sm text-stone-600">
              Open deal
              <select
                value={editingDealId ?? "__new__"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__new__") startNewDraft();
                  else void reloadDealFromFirestore(v);
                }}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              >
                <option value="__new__">New draft (unsaved)</option>
                {dealList.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.title.length > 48
                      ? `${row.title.slice(0, 48)}…`
                      : row.title}{" "}
                    {row.isFeatured ? "★" : ""}
                    {row.disabled ? " (off)" : ""} ({row.id.slice(0, 8)}…)
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={startNewDraft}
              className="rounded-full border border-lagoon/40 px-4 py-2.5 text-sm font-semibold text-lagoon hover:bg-lagoon/10"
            >
              Clear form (new draft)
            </button>
            <p className="w-full text-xs text-stone-500">
              Editing doc id:{" "}
              <code className="rounded bg-white px-1">
                {editingDealId ?? "(none yet — save to create)"}
              </code>
            </p>
          </div>

          <label className="block text-sm text-stone-600">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              placeholder="Exclusive Sri Lanka packages - limited slots"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Deal date
            <input
              type="date"
              value={dealDate}
              onChange={(e) => setDealDate(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-stone-600">
              Fixed tour start date
              <input
                type="date"
                value={fixedTourStartDate}
                onChange={(e) => setFixedTourStartDate(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
            <label className="block text-sm text-stone-600">
              Fixed tour end date
              <input
                type="date"
                value={fixedTourEndDate}
                onChange={(e) => setFixedTourEndDate(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
          </div>

          <label className="block text-sm text-stone-600">
            Per person charge
            <textarea
              value={perPersonCharge}
              onChange={(e) => setPerPersonCharge(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Group size
            <textarea
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Hotel level
            <textarea
              value={hotelLevel}
              onChange={(e) => setHotelLevel(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Transport
            <textarea
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <fieldset className="rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4">
            <legend className="text-sm font-semibold text-forest">
              Itinerary snaps
            </legend>
            <p className="mt-1 text-xs text-stone-500">
              Each tile has a title and description. Add more for extra
              itinerary highlights.
            </p>
            <div className="mt-4 space-y-6">
              {itinerarySnaps.map((snap, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-stone-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Snap {index + 1}
                    </span>
                    {itinerarySnaps.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeSnap(index)}
                        className="text-xs font-medium text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="mt-3 block text-sm text-stone-600">
                    Tile title
                    <input
                      type="text"
                      value={snap.title}
                      onChange={(e) =>
                        updateSnap(index, { title: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                  <label className="mt-3 block text-sm text-stone-600">
                    Description
                    <textarea
                      value={snap.description}
                      onChange={(e) =>
                        updateSnap(index, { description: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSnap}
              className="mt-4 text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
            >
              + Add itinerary snap
            </button>
          </fieldset>

          <label className="block text-sm text-stone-600">
            Registration price
            <textarea
              value={registrationPrice}
              onChange={(e) => setRegistrationPrice(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-forest">
                Featured on homepage &amp; /flash-deal
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Only one deal should be featured — saving turns this on here and
                clears it on other campaigns.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              aria-label="Featured flash deal for homepage and detail page"
              onClick={() => setIsFeatured((v) => !v)}
              className={cn(
                "relative inline-flex h-9 w-[3.25rem] shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                !isFeatured ? "bg-stone-400" : "bg-forest",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-8 w-8 translate-x-0 rounded-full bg-white shadow ring-0 transition",
                  !isFeatured ? "translate-x-[0.125rem]" : "translate-x-[1.35rem]",
                )}
              />
            </button>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-forest">
                Enable flash deal
              </p>
              <p className="mt-1 text-xs text-stone-500">
                When on, this campaign can appear publicly (if featured or via
                legacy <code className="rounded bg-white px-1">current</code>
                ). Turn off to hide it from visitors even when featured.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!disabled}
              aria-label="Enable flash deal content"
              onClick={() => setDisabled((v) => !v)}
              className={cn(
                "relative inline-flex h-9 w-[3.25rem] shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                disabled ? "bg-stone-400" : "bg-forest",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-8 w-8 translate-x-0 rounded-full bg-white shadow ring-0 transition",
                  disabled ? "translate-x-[0.125rem]" : "translate-x-[1.35rem]",
                )}
              />
            </button>
          </div>

          {meta ? (
            <dl className="grid gap-3 rounded-xl border border-gold/20 bg-lagoon/10 px-4 py-4 text-sm text-stone-700">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-medium text-forest">Created by</dt>
                <dd className="text-right">
                  {meta.createdByEmail ?? meta.createdByUid}
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-medium text-forest">Created</dt>
                <dd>{formatDateTime(meta.createdAt)}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-medium text-forest">Last modified</dt>
                <dd>{formatDateTime(meta.updatedAt)}</dd>
              </div>
              {meta.lastModifiedByUid !== meta.createdByUid ||
              meta.lastModifiedByEmail ? (
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="font-medium text-forest">Last edited by</dt>
                  <dd className="text-right">
                    {meta.lastModifiedByEmail ?? meta.lastModifiedByUid}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-xs text-stone-500">
              New draft — saving creates a new{" "}
              <code className="rounded bg-stone-100 px-1">
                {FLASH_DEALS_COLLECTION}/&#123;auto-id&#125;
              </code>{" "}
              document with created / modified metadata.
            </p>
          )}

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          {savedOk ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Saved. Banner and detail page update automatically.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className={cn(
              "rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349] disabled:opacity-50",
            )}
          >
            {saving ? "Saving…" : "Save flash deal"}
          </button>
        </form>
      )}
    </Card>
  );
}
