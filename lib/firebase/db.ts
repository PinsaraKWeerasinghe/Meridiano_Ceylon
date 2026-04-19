import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./client";

let db: Firestore | undefined;

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
