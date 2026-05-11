import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";

const USERS = "users";

export type UserRole = "admin" | "traveler" | "driver";

export const DEFAULT_USER_ROLE: UserRole = "traveler";

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  traveler: "Traveller",
  driver: "Driver",
};

/** Dropdown order for admin role picker */
export const USER_ROLES_ORDER: readonly UserRole[] = [
  "traveler",
  "admin",
  "driver",
];

export function normalizeUserRole(value: unknown): UserRole {
  if (value === "admin" || value === "traveler" || value === "driver") {
    return value;
  }
  return DEFAULT_USER_ROLE;
}

/** Lead traveller gender — used for package / flash-deal bookings. */
export type TravellerGender = "male" | "female";

/** Saved from the profile form — `role` is changed by admins (Users page) or Firestore console. */
export type UserProfileFields = {
  firstName: string;
  lastName: string;
  age: number | null;
  passportId: string;
  gender: TravellerGender | "";
  /** Contact / WhatsApp — include country code */
  phone: string;
};

export type UserProfileDoc = UserProfileFields & {
  role: UserRole;
  /** Cached from Auth for admin listings */
  email?: string;
};

export type AdminUserRow = {
  uid: string;
  /** Cached on the user document from Auth at signup / sign-in */
  email: string;
  role: UserRole;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function coerceFirestoreDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

function coerceProfile(data: DocumentData | undefined): UserProfileDoc | null {
  if (!data) return null;
  const ageRaw = data.age;
  let age: number | null = null;
  if (typeof ageRaw === "number" && Number.isFinite(ageRaw)) age = ageRaw;
  else if (typeof ageRaw === "string" && ageRaw.trim() !== "") {
    const n = parseInt(ageRaw, 10);
    if (Number.isFinite(n)) age = n;
  }
  const genderRaw = data.gender;
  const gender: TravellerGender | "" =
    genderRaw === "male" || genderRaw === "female" ? genderRaw : "";
  return {
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    age,
    passportId: typeof data.passportId === "string" ? data.passportId : "",
    gender,
    phone: typeof data.phone === "string" ? data.phone : "",
    role: normalizeUserRole(data.role),
    email: typeof data.email === "string" ? data.email : undefined,
  };
}

export async function fetchUserProfile(
  uid: string,
): Promise<UserProfileDoc | null> {
  const ref = doc(getFirestoreDb(), USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return coerceProfile(snap.data());
}

export async function saveUserProfile(
  uid: string,
  profile: UserProfileFields,
  /** Keeps Firestore `email` in sync with Auth for admin listings */
  authEmail?: string | null,
): Promise<void> {
  const ref = doc(getFirestoreDb(), USERS, uid);
  const payload: Record<string, unknown> = {
    firstName: profile.firstName.trim(),
    lastName: profile.lastName.trim(),
    age: profile.age,
    passportId: profile.passportId.trim(),
    gender:
      profile.gender === "female"
        ? "female"
        : profile.gender === "male"
          ? "male"
          : "",
    phone: profile.phone.trim(),
    updatedAt: serverTimestamp(),
  };
  if (authEmail != null && authEmail.trim() !== "") {
    payload.email = authEmail.trim();
  }
  await setDoc(ref, payload, { merge: true });
}

/** After email/password registration — default role Traveler. */
export async function seedNewRegisteredUser(
  uid: string,
  email: string | null,
): Promise<void> {
  const ref = doc(getFirestoreDb(), USERS, uid);
  await setDoc(
    ref,
    {
      role: DEFAULT_USER_ROLE,
      email: email ?? "",
      firstName: "",
      lastName: "",
      age: null,
      passportId: "",
      gender: "",
      phone: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * After Google (or any) sign-in: create user doc or backfill missing `role` / `email`.
 * Promoting users to admin/driver should be done in Firestore (Authentication tab does not edit this field).
 */
export async function ensureUserTravelerDefaults(
  uid: string,
  email: string | null,
): Promise<void> {
  const ref = doc(getFirestoreDb(), USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      role: DEFAULT_USER_ROLE,
      email: email ?? "",
      firstName: "",
      lastName: "",
      age: null,
      passportId: "",
      gender: "",
      phone: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }
  const data = snap.data();
  const patch: Record<string, unknown> = {};
  if (!data.role) patch.role = DEFAULT_USER_ROLE;
  if (email && !data.email) patch.email = email;
  if (!data.createdAt) patch.createdAt = serverTimestamp();
  if (Object.keys(patch).length > 0) {
    patch.updatedAt = serverTimestamp();
    await updateDoc(ref, patch);
  }
}

export async function listAllUserProfilesForAdmin(): Promise<AdminUserRow[]> {
  const snap = await getDocs(collection(getFirestoreDb(), USERS));
  return snap.docs.map((d) => {
    const raw = d.data();
    const p = coerceProfile(raw);
    const email =
      typeof raw.email === "string" && raw.email.trim()
        ? raw.email.trim()
        : p?.email?.trim()
          ? p.email.trim()
          : "—";
    return {
      uid: d.id,
      email,
      role: p?.role ?? DEFAULT_USER_ROLE,
      createdAt: coerceFirestoreDate(raw.createdAt),
      updatedAt: coerceFirestoreDate(raw.updatedAt),
    };
  });
}

/** Admin-only (enforced by Firestore rules): set a user's `role`. */
export async function updateUserRoleAsAdmin(
  targetUid: string,
  role: UserRole,
): Promise<void> {
  const ref = doc(getFirestoreDb(), USERS, targetUid);
  await updateDoc(ref, {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProfileDoc(uid: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), USERS, uid));
}
