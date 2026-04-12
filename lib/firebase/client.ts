import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/** Populated from NEXT_PUBLIC_FIREBASE_* — never hardcode keys in source. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

function getOrInitApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables to .env.local (see .env.example).",
    );
  }
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

/** Use in Client Components for sign-in, session, etc. */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getOrInitApp());
  }
  return auth;
}

export function getFirebaseApp(): FirebaseApp {
  return getOrInitApp();
}

/** Call once from the client (e.g. useEffect). Analytics is browser-only. */
export async function initFirebaseAnalytics(): Promise<void> {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return;
  getAnalytics(getOrInitApp());
}
