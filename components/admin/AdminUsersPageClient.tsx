"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { useUserRole } from "@/components/auth/useUserRole";
import { Card } from "@/components/ui/Card";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  listAllUserProfilesForAdmin,
  normalizeUserRole,
  ROLE_LABEL,
  updateUserRoleAsAdmin,
  USER_ROLES_ORDER,
  type AdminUserRow,
  type UserRole,
} from "@/lib/user-profile";

function formatDateTime(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminUsersPageClient() {
  const { user, ready: authReady } = useAuthUser();
  const { role, roleReady } = useUserRole(user, authReady);
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUid, setSavingUid] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const list = await listAllUserProfilesForAdmin();
      list.sort((a, b) =>
        a.email.localeCompare(b.email, undefined, {
          sensitivity: "base",
        }),
      );
      setRows(list);
    } catch {
      setError(
        "Could not load users. Check Firestore rules and your connection.",
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
    void load();
  }, [authReady, roleReady, user, role, load]);

  const handleRoleChange = useCallback(
    async (targetUid: string, nextRole: UserRole) => {
      setError(null);
      setSavingUid(targetUid);
      try {
        await updateUserRoleAsAdmin(targetUid, nextRole);
        setRows((prev) =>
          prev.map((row) =>
            row.uid === targetUid
              ? {
                  ...row,
                  role: nextRole,
                  updatedAt: new Date(),
                }
              : row,
          ),
        );
        if (user?.uid === targetUid) {
          window.location.reload();
          return;
        }
      } catch {
        setError("Could not update role. Check Firestore rules and try again.");
      } finally {
        setSavingUid(null);
      }
    },
    [user?.uid],
  );

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
          href="/login?next=/admin/users"
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
          Only administrators can view this page. Your role is{" "}
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
    <Card className="border-lagoon/25 overflow-hidden p-0 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 bg-white px-4 py-3 sm:px-6">
        <p className="text-sm text-stone-600">
          Choose a role for each user below. Values are stored in Firestore on{" "}
          <code className="rounded bg-stone-100 px-1 text-xs">users</code>{" "}
          as{" "}
          <code className="text-xs">traveler</code>,{" "}
          <code className="text-xs">admin</code>, or{" "}
          <code className="text-xs">driver</code>.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="shrink-0 rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-gold/10 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="px-4 py-3 text-sm text-red-800 sm:px-6">{error}</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/15 bg-lagoon/10 text-xs font-semibold uppercase tracking-wide text-forest">
              <th className="px-4 py-3 sm:px-6">Email</th>
              <th className="px-4 py-3 sm:px-6">Role</th>
              <th className="whitespace-nowrap px-4 py-3 sm:px-6">
                Created
              </th>
              <th className="whitespace-nowrap px-4 py-3 sm:px-6">
                Modified
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-stone-500 sm:px-6"
                >
                  Loading users…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-stone-500 sm:px-6"
                >
                  No user profiles found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.uid}
                  className="border-b border-stone-100 bg-white last:border-0"
                >
                  <td className="max-w-[min(100vw-12rem,28rem)] truncate px-4 py-3 font-medium text-stone-900 sm:px-6">
                    {r.email === "—" ? (
                      r.email
                    ) : (
                      <a
                        href={`mailto:${r.email}`}
                        className="text-lagoon underline-offset-2 hover:underline"
                      >
                        {r.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-700 sm:px-6">
                    <label className="sr-only" htmlFor={`role-${r.uid}`}>
                      Role for {r.email}
                    </label>
                    <select
                      id={`role-${r.uid}`}
                      value={r.role}
                      disabled={savingUid === r.uid}
                      onChange={(e) =>
                        void handleRoleChange(
                          r.uid,
                          normalizeUserRole(e.target.value),
                        )
                      }
                      className="min-w-[9.5rem] rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm font-medium text-forest outline-none ring-lagoon/25 focus:ring-2 disabled:opacity-60"
                    >
                      {USER_ROLES_ORDER.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {ROLE_LABEL[roleOption]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600 sm:px-6">
                    <time
                      dateTime={
                        r.createdAt ? r.createdAt.toISOString() : undefined
                      }
                    >
                      {formatDateTime(r.createdAt)}
                    </time>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600 sm:px-6">
                    <time
                      dateTime={
                        r.updatedAt ? r.updatedAt.toISOString() : undefined
                      }
                    >
                      {formatDateTime(r.updatedAt)}
                    </time>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
