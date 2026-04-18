/**
 * Package / tour gallery URLs under `public/images/**` should only use JPEG
 * file extensions for predictable `next/image` behaviour.
 */
const JPEG_EXT = /\.(jpg|jpeg)$/i;

export function isPackageGalleryJpegPath(path: string): boolean {
  const p = path.trim();
  const q = p.indexOf("?");
  return JPEG_EXT.test(q === -1 ? p : p.slice(0, q));
}

export function packageGalleryJpegOnly(paths: readonly string[]): string[] {
  return paths.filter(isPackageGalleryJpegPath);
}

/** Filename without extension from a public URL path (e.g. `/images/foo/10.jpg` → `10`). */
export function packageGalleryFilenameStem(path: string): string {
  const noQuery = path.split("?")[0];
  const seg = noQuery.split("/").pop() ?? "";
  return seg.replace(/\.(jpg|jpeg)$/i, "");
}

function isNumericOnlyStem(stem: string): boolean {
  return /^\d+$/.test(stem);
}

/**
 * Sort gallery paths: purely numeric stems first (numeric order), then
 * everything else alphabetically by stem (case-insensitive, numeric-aware).
 */
export function sortPackageGalleryPaths(paths: readonly string[]): string[] {
  return [...paths].sort((a, b) => {
    const stemA = packageGalleryFilenameStem(a);
    const stemB = packageGalleryFilenameStem(b);
    const numA = isNumericOnlyStem(stemA) ? parseInt(stemA, 10) : null;
    const numB = isNumericOnlyStem(stemB) ? parseInt(stemB, 10) : null;
    if (numA !== null && numB !== null) return numA - numB;
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return stemA.localeCompare(stemB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

/** JPEG-only paths, ordered for display (slideshow + detail gallery). */
export function normalizePackageGalleryPaths(
  paths: readonly string[],
): string[] {
  return sortPackageGalleryPaths(packageGalleryJpegOnly(paths));
}
