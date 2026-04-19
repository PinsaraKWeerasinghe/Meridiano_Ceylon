import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "./client";

let storage: FirebaseStorage | undefined;

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}
