import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";

const USERS = "users";

export type UserProfileDoc = {
  firstName: string;
  lastName: string;
  age: number | null;
  passportId: string;
};

function coerceProfile(data: DocumentData | undefined): UserProfileDoc | null {
  if (!data) return null;
  const ageRaw = data.age;
  let age: number | null = null;
  if (typeof ageRaw === "number" && Number.isFinite(ageRaw)) age = ageRaw;
  else if (typeof ageRaw === "string" && ageRaw.trim() !== "") {
    const n = parseInt(ageRaw, 10);
    if (Number.isFinite(n)) age = n;
  }
  return {
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    age,
    passportId: typeof data.passportId === "string" ? data.passportId : "",
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
  profile: UserProfileDoc,
): Promise<void> {
  const ref = doc(getFirestoreDb(), USERS, uid);
  await setDoc(
    ref,
    {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      age: profile.age,
      passportId: profile.passportId.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteUserProfileDoc(uid: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), USERS, uid));
}
