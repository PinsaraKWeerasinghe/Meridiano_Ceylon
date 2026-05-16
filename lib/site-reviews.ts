import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/db";

export const SITE_REVIEWS_COLLECTION = "siteReviews";

export const SITE_REVIEW_STORY_MAX = 4000;

export type SiteReviewStatus = "published";

export type SiteReviewInput = {
  authorUid: string;
  authorName: string;
  authorPhotoUrl: string | null;
  tourType: string;
  story: string;
  ratingOverall: number;
  ratingDriver: number;
  ratingVehicle: number;
  ratingSafety: number;
};

export type SiteReviewDoc = {
  authorUid: string;
  authorName: string;
  authorPhotoUrl: string | null;
  tourType: string;
  story: string;
  ratingOverall: number;
  ratingDriver: number;
  ratingVehicle: number;
  ratingSafety: number;
  status: SiteReviewStatus;
  createdAt: Timestamp | null;
};

export type SiteReviewWithId = SiteReviewDoc & { id: string };

function coerceReview(data: Record<string, unknown>): SiteReviewDoc {
  const toNum = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt : null;
  const photoRaw = data.authorPhotoUrl;
  const authorPhotoUrl =
    typeof photoRaw === "string" && photoRaw.trim() !== ""
      ? photoRaw.trim()
      : null;
  return {
    authorUid: typeof data.authorUid === "string" ? data.authorUid : "",
    authorName: typeof data.authorName === "string" ? data.authorName : "",
    authorPhotoUrl,
    tourType: typeof data.tourType === "string" ? data.tourType : "",
    story: typeof data.story === "string" ? data.story : "",
    ratingOverall: toNum(data.ratingOverall),
    ratingDriver: toNum(data.ratingDriver),
    ratingVehicle: toNum(data.ratingVehicle),
    ratingSafety: toNum(data.ratingSafety),
    status: "published",
    createdAt,
  };
}

export async function submitSiteReview(input: SiteReviewInput): Promise<void> {
  const story = input.story.trim();
  if (story.length > SITE_REVIEW_STORY_MAX) {
    throw new Error(`Review text must be ${SITE_REVIEW_STORY_MAX} characters or less.`);
  }
  const db = getFirestoreDb();
  await addDoc(collection(db, SITE_REVIEWS_COLLECTION), {
    authorUid: input.authorUid,
    authorName: input.authorName.trim(),
    authorPhotoUrl: input.authorPhotoUrl ?? null,
    tourType: input.tourType.trim(),
    story,
    ratingOverall: input.ratingOverall,
    ratingDriver: input.ratingDriver,
    ratingVehicle: input.ratingVehicle,
    ratingSafety: input.ratingSafety,
    status: "published" as const,
    createdAt: serverTimestamp(),
  });
}

const PUBLISHED = "published" as const;

export async function listPublishedSiteReviews(
  maxReviews: number,
): Promise<SiteReviewWithId[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, SITE_REVIEWS_COLLECTION),
    where("status", "==", PUBLISHED),
    orderBy("createdAt", "desc"),
    limit(Math.min(Math.max(maxReviews, 1), 40)),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...coerceReview(d.data() as Record<string, unknown>),
  }));
}
