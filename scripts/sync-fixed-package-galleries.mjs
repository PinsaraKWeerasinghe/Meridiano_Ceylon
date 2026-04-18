/**
 * Scans `public/...` folders for fixed package tours and writes
 * `data/fixed-package-galleries.json` (all .jpg / .jpeg, sorted like
 * `sortPackageGalleryPaths` in `lib/package-gallery-images.ts`).
 *
 * Run: node scripts/sync-fixed-package-galleries.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const publicDir = path.join(repoRoot, "public");

/** Tour id → directory under `public/` (no leading slash). */
const FIXED_PACKAGE_FOLDERS = {
  "fixed-5-opt1": "images/fixed-tours/5-day-tours/option-01-beach-safari",
  "fixed-5-opt2": "images/fixed-tours/5-day-tours/option-02-hill-country-beach",
  "fixed-5-opt3":
    "images/fixed-tours/7-day-tours/option-01-cultural-highland",
  "fixed-7-opt1": "images/fixed-tours/7-day-tours/option-02-nature-safari",
  "fixed-7-opt2":
    "images/fixed-tours/7-day-tours/option-03-beach-wildlife",
  "fixed-10-opt1":
    "images/fixed-tours/10-day-tours/option-01-ancient-cultural",
  "fixed-7-opt3":
    "images/fixed-tours/10-day-tours/option-02-southern-beach-wildlife",
  "fixed-10-opt2":
    "images/fixed-tours/10-day-tours/option-03-wildlife-wellness",
  "fixed-10-opt3":
    "images/fixed-tours/10-day-tours/option-04-meridiano-ceylon-special",
  "fixed-16-opt1": "images/fixed-tours/north-to-south-tour",
  "spec-drop-only": "images/fixed-tours/packages/drop-only-tours",
};

function isJpegFile(name) {
  return /\.(jpe?g)$/i.test(name);
}

function filenameStem(file) {
  return file.replace(/\.(jpe?g)$/i, "");
}

function isNumericOnlyStem(stem) {
  return /^\d+$/.test(stem);
}

/** @param {string[]} urlPaths */
function sortPaths(urlPaths) {
  return [...urlPaths].sort((a, b) => {
    const noQa = a.split("?")[0];
    const noQb = b.split("?")[0];
    const stemA = filenameStem(path.posix.basename(noQa));
    const stemB = filenameStem(path.posix.basename(noQb));
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

/**
 * @param {string} relFolder posix-style path under public
 * @returns {string[]}
 */
function scanJpegFolder(relFolder) {
  const abs = path.join(publicDir, ...relFolder.split("/"));
  if (!fs.existsSync(abs)) {
    console.warn(`[sync-package-galleries] Missing folder: ${relFolder}`);
    return [];
  }
  const files = fs.readdirSync(abs).filter(isJpegFile);
  const urls = files.map(
    (f) => `/${relFolder.replace(/\/+$/, "")}/${f}`,
  );
  return sortPaths(urls);
}

const out = {};
for (const [id, folder] of Object.entries(FIXED_PACKAGE_FOLDERS)) {
  out[id] = scanJpegFolder(folder);
}

const outPath = path.join(repoRoot, "data/fixed-package-galleries.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`Wrote ${outPath} (${Object.keys(out).length} package keys).`);
