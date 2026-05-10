"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  deleteUser,
  updateEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useAuthUser } from "@/components/auth/useAuthUser";
import { Card } from "@/components/ui/Card";
import { getFirebaseAuth, getFirebaseStorage, isFirebaseConfigured } from "@/lib/firebase";
import { formatAuthError } from "@/lib/firebase/auth-errors";
import {
  deleteUserProfileDoc,
  ensureUserTravelerDefaults,
  fetchUserProfile,
  saveUserProfile,
  type UserProfileFields,
} from "@/lib/user-profile";

function splitDisplayName(displayName: string | null): {
  firstName: string;
  lastName: string;
} {
  if (!displayName?.trim()) return { firstName: "", lastName: "" };
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

export function ProfileForm() {
  const router = useRouter();
  const { user, ready } = useAuthUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [passportId, setPassportId] = useState("");
  const [email, setEmail] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadFromUser = useCallback(async (u: User) => {
    setEmail(u.email ?? "");
    const fromName = splitDisplayName(u.displayName);
    let next: UserProfileFields = {
      firstName: fromName.firstName,
      lastName: fromName.lastName,
      age: null,
      passportId: "",
    };
    try {
      let stored = await fetchUserProfile(u.uid);
      if (!stored) {
        await ensureUserTravelerDefaults(u.uid, u.email ?? null);
        stored = await fetchUserProfile(u.uid);
      }
      if (stored) {
        next = {
          firstName: stored.firstName || fromName.firstName,
          lastName: stored.lastName || fromName.lastName,
          age: stored.age,
          passportId: stored.passportId,
        };
      }
    } catch {
      /* Firestore may be unavailable until rules/index are set */
    }
    setFirstName(next.firstName);
    setLastName(next.lastName);
    setAge(next.age != null ? String(next.age) : "");
    setPassportId(next.passportId);
    setPhotoFile(null);
    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void loadFromUser(user).finally(() => setLoading(false));
  }, [ready, user, loadFromUser]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

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

  if (!ready || loading) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-600">Loading profile…</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-lagoon/25 p-8 shadow-sm">
        <p className="text-sm text-stone-700">
          Please sign in to view your profile.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-semibold text-lagoon underline-offset-4 hover:underline"
        >
          Go to login
        </Link>
      </Card>
    );
  }

  const displayPhoto =
    photoPreviewUrl ?? user.photoURL ?? null;

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    if (!firstName.trim()) {
      setError("First name is required.");
      setSaving(false);
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      setSaving(false);
      return;
    }

    let ageNum: number | null = null;
    if (age.trim() !== "") {
      const n = parseInt(age, 10);
      if (!Number.isFinite(n) || n < 0 || n > 130) {
        setError("Please enter a valid age.");
        setSaving(false);
        return;
      }
      ageNum = n;
    }

    const profile: UserProfileFields = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: ageNum,
      passportId: passportId.trim(),
    };

    const displayName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    try {
      await saveUserProfile(u.uid, profile, trimmedEmail);

      if (photoFile) {
        const storageRef = ref(
          getFirebaseStorage(),
          `profilePhotos/${u.uid}/avatar`,
        );
        await uploadBytes(storageRef, photoFile, {
          contentType: photoFile.type || "image/jpeg",
        });
        const url = await getDownloadURL(storageRef);
        await updateProfile(u, {
          photoURL: url,
          displayName: displayName || u.displayName,
        });
      } else {
        await updateProfile(u, {
          displayName: displayName || u.displayName,
        });
      }

      if (trimmedEmail !== u.email) {
        try {
          await updateEmail(u, trimmedEmail);
        } catch (err: unknown) {
          const code =
            err && typeof err === "object" && "code" in err
              ? String((err as { code?: string }).code)
              : undefined;
          setError(
            `Profile saved. Email was not changed: ${formatAuthError(code)}. You may need to sign in again before changing email.`,
          );
          setSuccess("Profile saved.");
          await u.reload();
          router.refresh();
          setSaving(false);
          setPhotoFile(null);
          if (photoPreviewUrl) {
            URL.revokeObjectURL(photoPreviewUrl);
            setPhotoPreviewUrl(null);
          }
          return;
        }
      }

      await u.reload();
      setSuccess("Profile saved.");
      setPhotoFile(null);
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
        setPhotoPreviewUrl(null);
      }
      router.refresh();
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(formatAuthError(code));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "Delete your account permanently? Your saved profile data will be removed. This cannot be undone.",
      )
    ) {
      return;
    }
    if (!window.confirm("Are you sure? Your account will be deleted.")) {
      return;
    }

    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) {
      setError("Not signed in.");
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      try {
        await deleteUserProfileDoc(u.uid);
      } catch {
        /* Firestore doc missing or rules — continue */
      }
      try {
        await deleteObject(
          ref(getFirebaseStorage(), `profilePhotos/${u.uid}/avatar`),
        );
      } catch {
        /* No uploaded photo */
      }
      await deleteUser(u);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(formatAuthError(code));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="border-lagoon/25 p-6 shadow-sm shadow-lagoon/10 sm:p-8">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/30 bg-stone-100">
              {displayPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- OAuth URLs + blob previews
                <img
                  src={displayPhoto}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-stone-500">
                  No photo
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold text-lagoon underline-offset-2 hover:underline">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onPhotoChange}
              />
            </label>
          </div>
          <p className="max-w-md text-xs text-stone-500 sm:pt-2">
            JPG or PNG, shown after you save. Requires Firebase Storage rules for{" "}
            <code className="rounded bg-stone-100 px-1">profilePhotos/</code>.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-forest">
            First name{" "}
            <span className="text-red-600" aria-hidden>
              *
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              required
              aria-required={true}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-forest">
            Last name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-forest">
            Age
            <input
              type="number"
              min={0}
              max={130}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-forest">
            Passport ID
            <input
              type="text"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-forest">
          Email{" "}
          <span className="text-red-600" aria-hidden>
            *
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            aria-required={true}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-lagoon/25 focus:ring-2"
          />
          <span className="mt-1 block text-xs text-stone-500">
            Changing email may require a recent sign-in. If it fails, sign out
            and sign in again, then try again.
          </span>
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving || deleting}
          className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349] disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>

      <div className="mt-8 border-t border-stone-200 pt-6">
        <p className="text-sm text-stone-600">
          Want to leave Meridiano Ceylon? You can delete your account and
          profile data.
        </p>
        <button
          type="button"
          disabled={saving || deleting}
          onClick={() => void handleDeleteAccount()}
          className="mt-3 rounded-full border border-red-500/40 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete account"}
        </button>
      </div>
    </Card>
  );
}
