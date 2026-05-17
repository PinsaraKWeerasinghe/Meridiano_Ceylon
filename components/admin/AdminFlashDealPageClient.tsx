"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { useUserRole } from "@/components/auth/useUserRole";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  createEmptyFlashDealDraft,
  deleteFlashDealForAdmin,
  EMPTY_ITINERARY_SNAP,
  FLASH_DEALS_COLLECTION,
  listFlashDealsForAdmin,
  loadFlashDealForAdminPage,
  normalizeMinSlotsProceedForSave,
  saveFlashDealSettings,
  type FlashDealAdminMeta,
  type FlashDealItinerarySnap,
  type FlashDealListRow,
  type FlashDealSettingsInput,
} from "@/lib/flash-deal-settings";
import { ROLE_LABEL, type UserRole } from "@/lib/user-profile";
import { FlashDealCampaignTravellers } from "@/components/admin/FlashDealCampaignTravellers";

function formatDateTime(value: Date): string {
  return value.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Skip I, L, O to keep the type-to-confirm string easy to read. */
const DELETE_TOKEN_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
const DELETE_TOKEN_LENGTH = 6;

function generateDeleteToken(): string {
  let out = "";
  for (let i = 0; i < DELETE_TOKEN_LENGTH; i++) {
    out += DELETE_TOKEN_ALPHABET.charAt(
      Math.floor(Math.random() * DELETE_TOKEN_ALPHABET.length),
    );
  }
  return out;
}

/**Digits and optional cents only; `$`/`commas stripped while typing. */
function filterUsdAmountInput(raw: string): string {
  let v = raw.replace(/,/g, "").replace(/\$/g, "").replace(/[^\d.]/g, "");
  const i = v.indexOf(".");
  if (i === -1) return v;
  const whole = v.slice(0, i).replace(/\./g, "");
  const rest = v.slice(i + 1).replace(/\./g, "").slice(0, 2);
  return rest.length > 0 ? `${whole}.${rest}` : `${whole}.`;
}

export function AdminFlashDealPageClient() {
  const { user, ready: authReady } = useAuthUser();
  const { role, roleReady } = useUserRole(user, authReady);
  /** Bumps when starting a new load or clearing to draft so stale async cannot repopulate the form. */
  const reloadTicketRef = useRef(0);
  const adminUid = user?.uid;

  const [title, setTitle] = useState("");
  const [dealDate, setDealDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [fixedTourStartDate, setFixedTourStartDate] = useState("");
  const [fixedTourEndDate, setFixedTourEndDate] = useState("");
  const [perPersonCharge, setPerPersonCharge] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [hotelLevel, setHotelLevel] = useState("");
  const [transport, setTransport] = useState("");
  const [registrationPrice, setRegistrationPrice] = useState("");
  const [maxSlots, setMaxSlots] = useState<number>(0);
  const [itinerarySnaps, setItinerarySnaps] = useState<
    FlashDealItinerarySnap[]
  >([{ ...EMPTY_ITINERARY_SNAP }]);

  const [meta, setMeta] = useState<FlashDealAdminMeta | null>(null);
  /** `null` = new unsaved draft (next save allocates a data source doc id). */
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [dealList, setDealList] = useState<FlashDealListRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const [deletePromptOpen, setDeletePromptOpen] = useState(false);
  const [deleteToken, setDeleteToken] = useState("");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const deleteDialogRef = useRef<HTMLDialogElement | null>(null);

  const applyValuesToForm = useCallback((values: FlashDealSettingsInput) => {
    setTitle(values.title);
    setDealDate(values.dealDate);
    setIsFeatured(values.isFeatured);
    setDescription(values.description);
    setFixedTourStartDate(values.fixedTourStartDate);
    setFixedTourEndDate(values.fixedTourEndDate);
    setPerPersonCharge(values.perPersonCharge);
    setGroupSize(values.groupSize);
    setHotelLevel(values.hotelLevel);
    setTransport(values.transport);
    setRegistrationPrice(values.registrationPrice);
    setMaxSlots(values.maxSlots);
    setItinerarySnaps(
      values.itinerarySnaps.length > 0
        ? values.itinerarySnaps.map((s) => ({ ...s }))
        : [{ ...EMPTY_ITINERARY_SNAP }],
    );
  }, []);

  const closeDeletePrompt = useCallback(() => {
    setDeletePromptOpen(false);
    setDeleteInput("");
    setDeleteToken("");
  }, []);

  const reloadDealFromDataSource = useCallback(async (dealId: string | null) => {
    reloadTicketRef.current += 1;
    const ticket = reloadTicketRef.current;
    setError(null);
    setSavedOk(false);
    setLoading(true);
    closeDeletePrompt();
    try {
      const result = await loadFlashDealForAdminPage(dealId);
      if (ticket !== reloadTicketRef.current) return;
      setEditingDealId(result.dealId);
      applyValuesToForm(result.values);
      setMeta(result.meta);
    } catch (err) {
      if (ticket !== reloadTicketRef.current) return;
      setError(
        err instanceof Error ? err.message : "Could not load flash deal.",
      );
    } finally {
      if (ticket === reloadTicketRef.current) {
        setLoading(false);
      }
    }
  }, [applyValuesToForm, closeDeletePrompt]);

  const startNewDraft = useCallback(() => {
    reloadTicketRef.current += 1;
    setError(null);
    setSavedOk(false);
    setLoading(false);
    applyValuesToForm(createEmptyFlashDealDraft());
    setEditingDealId(null);
    setMeta(null);
    closeDeletePrompt();
  }, [applyValuesToForm, closeDeletePrompt]);

  function openDeletePrompt() {
    setDeleteToken(generateDeleteToken());
    setDeleteInput("");
    setDeletePromptOpen(true);
    setError(null);
    setSavedOk(false);
  }

  useEffect(() => {
    const el = deleteDialogRef.current;
    if (!el) return;
    if (deletePromptOpen && editingDealId) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [deletePromptOpen, editingDealId]);

  async function handleConfirmDelete() {
    if (!editingDealId) return;
    if (deleteInput.trim() !== deleteToken) return;
    setDeleting(true);
    setError(null);
    setSavedOk(false);
    try {
      await deleteFlashDealForAdmin(editingDealId);
      try {
        setDealList(await listFlashDealsForAdmin());
      } catch {
        setDealList((prev) => prev.filter((row) => row.id !== editingDealId));
      }
      startNewDraft();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the flash deal.",
      );
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    if (!authReady || !roleReady) return;
    if (!adminUid || role !== "admin") {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const rows = await listFlashDealsForAdmin();
        if (cancelled) return;
        setDealList(rows);
        if (rows.length === 0) {
          await reloadDealFromDataSource(null);
        } else {
          const pick =
            rows.find((r) => r.isFeatured)?.id ?? rows[0]?.id ?? null;
          await reloadDealFromDataSource(pick);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load flash deals.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, roleReady, adminUid, role, reloadDealFromDataSource]);

  function updateSnap(index: number, patch: Partial<FlashDealItinerarySnap>) {
    setItinerarySnaps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function addSnap() {
    setItinerarySnaps((prev) => [...prev, { ...EMPTY_ITINERARY_SNAP }]);
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

    const minParsed = normalizeMinSlotsProceedForSave(groupSize);
    if (
      minParsed != null &&
      Number.isInteger(maxSlots) &&
      maxSlots >= 1 &&
      Number.parseInt(minParsed, 10) > maxSlots
    ) {
      setError(
        "Maximum bookings (sold-out cap) must be greater than or equal to minimum slots to proceed.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload: FlashDealSettingsInput = {
        title: title.trim(),
        dealDate: dealDate.trim(),
        disabled: false,
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
        maxSlots,
      };
      const { dealId } = await saveFlashDealSettings(
        user.uid,
        user.email ?? null,
        editingDealId,
        payload,
      );
      setSavedOk(true);
      setDealList(await listFlashDealsForAdmin());
      await reloadDealFromDataSource(dealId);
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

  const deleteConfirmDealTitle =
    title.trim() ||
    (editingDealId
      ? (dealList.find((r) => r.id === editingDealId)?.title ?? "").trim()
      : ""
    ).trim() ||
    "(Untitled)";

  return (
    <>
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      <p className="text-sm text-stone-600">
        Campaigns live in{" "}
        <code className="rounded bg-stone-100 px-1 text-xs">
          {FLASH_DEALS_COLLECTION}
        </code>
        . Fill the form and save.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-stone-500">Loading settings…</p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4">
            <label className="block min-w-[12rem] text-sm text-stone-600">
              Open deal
              <select
                value={editingDealId ?? "__new__"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__new__") startNewDraft();
                  else void reloadDealFromDataSource(v);
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
          </div>

          <label className="block text-sm text-stone-600">
            Title <span className="text-red-600">*</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required="true"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              placeholder="Campaign headline"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Deal Closing date <span className="text-red-600">*</span>
            <input
              type="date"
              value={dealDate}
              onChange={(e) => setDealDate(e.target.value)}
              required
              aria-required="true"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Maximum bookings (sold-out cap){" "}
            <span className="text-red-600">*</span>
            <input
              type="number"
              min={1}
              step={1}
              required
              aria-required="true"
              value={maxSlots > 0 ? maxSlots : ""}
              onChange={(e) => {
                const raw = e.target.value;
                setMaxSlots(raw === "" ? 0 : Math.max(0, Math.floor(Number(raw))));
              }}
              placeholder="e.g. 20"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
            <span className="mt-1 block text-xs text-stone-500">
              When this many bookings are taken, the deal shows as sold out.
              Must be greater than or equal to minimum slots to proceed.
            </span>
          </label>

          <label className="block text-sm text-stone-600">
            Minimum slots to proceed <span className="text-red-600">*</span>
            <input
              type="number"
              min={1}
              step={1}
              required
              aria-required="true"
              value={groupSize === "" ? "" : groupSize}
              onChange={(e) => {
                const raw = e.target.value;
                setGroupSize(
                  raw === ""
                    ? ""
                    : String(Math.max(1, Math.floor(Number(raw)))),
                );
              }}
              placeholder="e.g. 6"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2 tabular-nums"
            />
            <span className="mt-1 block text-xs text-stone-500">
              Number of bookings needed before this flash deal can go ahead. Must
              not exceed maximum bookings (sold-out cap).
            </span>
          </label>

          <label className="block text-sm text-stone-600">
            Description <span className="text-red-600">*</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              aria-required="true"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-stone-600">
              Fixed tour start date <span className="text-red-600">*</span>
              <input
                type="date"
                value={fixedTourStartDate}
                onChange={(e) => setFixedTourStartDate(e.target.value)}
                required
                aria-required="true"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
            <label className="block text-sm text-stone-600">
              Fixed tour end date <span className="text-red-600">*</span>
              <input
                type="date"
                value={fixedTourEndDate}
                onChange={(e) => setFixedTourEndDate(e.target.value)}
                required
                aria-required="true"
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-stone-600">
              Per person charge <span className="text-red-600">*</span>
              <div className="mt-1 flex items-stretch overflow-hidden rounded-xl border border-stone-200 bg-white outline-none ring-lagoon/25 focus-within:ring-2">
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-required="true"
                  placeholder="674"
                  value={perPersonCharge}
                  onChange={(e) =>
                    setPerPersonCharge(filterUsdAmountInput(e.target.value))
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-stone-900 outline-none tabular-nums placeholder:text-stone-400"
                />
                <span
                  className="flex shrink-0 items-center border-l border-stone-200 bg-stone-50 px-3 text-sm font-semibold tabular-nums text-stone-700"
                  aria-hidden
                >
                  $
                </span>
              </div>
            </label>

            <label className="block text-sm text-stone-600">
              Registration price <span className="text-red-600">*</span>
              <div className="mt-1 flex items-stretch overflow-hidden rounded-xl border border-stone-200 bg-white outline-none ring-lagoon/25 focus-within:ring-2">
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-required="true"
                  placeholder="150"
                  value={registrationPrice}
                  onChange={(e) =>
                    setRegistrationPrice(filterUsdAmountInput(e.target.value))
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-stone-900 outline-none tabular-nums placeholder:text-stone-400"
                />
                <span
                  className="flex shrink-0 items-center border-l border-stone-200 bg-stone-50 px-3 text-sm font-semibold tabular-nums text-stone-700"
                  aria-hidden
                >
                  $
                </span>
              </div>
            </label>
          </div>

          <label className="block text-sm text-stone-600">
            Hotel level <span className="text-red-600">*</span>
            <textarea
              value={hotelLevel}
              onChange={(e) => setHotelLevel(e.target.value)}
              rows={2}
              required
              aria-required="true"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <label className="block text-sm text-stone-600">
            Transport <span className="text-red-600">*</span>
            <textarea
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              rows={2}
              required
              aria-required="true"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>

          <fieldset className="rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4">
            <legend className="text-sm font-semibold text-forest">
              Itinerary snaps <span className="text-red-600">*</span>
            </legend>
            <p className="mt-1 text-xs text-stone-500">
              Each tile must have a title and description (required). Add more
              for extra itinerary highlights.
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
                    Tile title <span className="text-red-600">*</span>
                    <input
                      type="text"
                      value={snap.title}
                      onChange={(e) =>
                        updateSnap(index, { title: e.target.value })
                      }
                      required
                      aria-required="true"
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
                    />
                  </label>
                  <label className="mt-3 block text-sm text-stone-600">
                    Description <span className="text-red-600">*</span>
                    <textarea
                      value={snap.description}
                      onChange={(e) =>
                        updateSnap(index, { description: e.target.value })
                      }
                      rows={3}
                      required
                      aria-required="true"
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

          <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-forest">
                Featured on homepage &amp; /flash-deal
              </p>
              <p className="mt-1 text-xs text-stone-500">
                When on, this campaign appears on the homepage banner and{" "}
                <Link
                  href="/flash-deal"
                  className="font-semibold text-lagoon underline-offset-2 hover:underline"
                >
                  /flash-deal
                </Link>
                . When off, visitors see no flash deal there. Only one campaign can
                be featured — saving turns this on here and clears it on others.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              aria-label="Show this campaign on the homepage banner and flash-deal page"
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

          {error && !deletePromptOpen ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          {savedOk ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Saved. Banner and detail page update automatically.
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={saving || deleting}
              className={cn(
                "rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349] disabled:opacity-50",
              )}
            >
              {saving ? "Saving…" : "Save flash deal"}
            </button>

            {editingDealId ? (
              <button
                type="button"
                onClick={openDeletePrompt}
                disabled={saving || deleting || deletePromptOpen}
                className={cn(
                  "rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50",
                )}
              >
                Delete flash deal
              </button>
            ) : null}
          </div>
        </form>
      )}
    </Card>

    <dialog
      ref={deleteDialogRef}
      onClose={closeDeletePrompt}
      className={cn(
        "max-h-[min(calc(100dvh-2rem),42rem)] w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-950 shadow-xl",
        "[&::backdrop]:bg-black/45 [&::backdrop]:backdrop-blur-[1px]",
      )}
      aria-labelledby="flash-deal-delete-title"
    >
      {deletePromptOpen && editingDealId ? (
        <>
          <p
            id="flash-deal-delete-title"
            className="font-semibold text-lg text-red-800"
          >
            Confirm permanent deletion
          </p>
          <p className="mt-4 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-4 text-center text-xl font-bold leading-snug tracking-tight text-red-950 shadow-sm sm:text-2xl">
            {deleteConfirmDealTitle}
          </p>
          <p className="mt-4 text-red-900/90">
            This removes{" "}
            <code className="rounded bg-red-50 px-1 font-mono text-xs text-red-900">
              {FLASH_DEALS_COLLECTION}/{editingDealId}
            </code>{" "}
            from the data source. Traveller records under this campaign remain as an
            audit trail.
          </p>
          <p className="mt-3 text-red-900/90">
            Type the code below to confirm.
          </p>
          <p className="mt-3 select-all rounded-lg border border-red-300 bg-red-50/80 px-3 py-2.5 text-center font-mono text-lg tracking-[0.35em] text-red-800">
            {deleteToken}
          </p>
          {error && deletePromptOpen ? (
            <p
              className="mt-3 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-900"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-red-900">
            Type the code
            <input
              type="text"
              value={deleteInput}
              onChange={(e) =>
                setDeleteInput(e.target.value.toUpperCase())
              }
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              maxLength={DELETE_TOKEN_LENGTH}
              className="mt-1.5 w-full rounded-xl border border-red-300 bg-white px-3 py-2.5 font-mono text-base tracking-[0.4em] text-red-900 outline-none ring-red-300/40 focus:ring-2"
            />
          </label>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-red-100 pt-4">
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              disabled={
                deleting ||
                deleteInput.trim() !== deleteToken ||
                !editingDealId
              }
              className={cn(
                "rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {deleting ? "Deleting…" : "Yes, delete this deal"}
            </button>
            <button
              type="button"
              onClick={() => deleteDialogRef.current?.close()}
              disabled={deleting}
              className="rounded-full border border-red-300 bg-white px-6 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </>
      ) : null}
    </dialog>

    <FlashDealCampaignTravellers campaignId={editingDealId} />
    </>
  );
}
