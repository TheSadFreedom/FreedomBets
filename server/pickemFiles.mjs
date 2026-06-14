import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = process.env.FREEDOMBETS_ROOT ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ROOT = process.env.FREEDOMBETS_USER_PUBLIC ?? path.join(ROOT_DIR, "public");

export const PICKEM_UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads", "pickems");
export const PICKEM_UPLOAD_URL_PREFIX = "/uploads/pickems";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export function stageSlug(stage) {
  return String(stage).toLowerCase().replace(/\s+/g, "-");
}

export function pickemDir(pickemId) {
  return path.join(PICKEM_UPLOAD_DIR, String(pickemId));
}

export function buildImageUrl(pickemId, stage, ext) {
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  return `${PICKEM_UPLOAD_URL_PREFIX}/${pickemId}/${stageSlug(stage)}.${normalizedExt}`;
}

export function buildImagePath(pickemId, stage, ext) {
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  return path.join(pickemDir(pickemId), `${stageSlug(stage)}.${normalizedExt}`);
}

export function extensionFromMime(mime) {
  const map = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? null;
}

export async function ensurePickemDir(pickemId) {
  await mkdir(pickemDir(pickemId), { recursive: true });
}

export async function removeStageImages(pickemId, stage) {
  const dir = pickemDir(pickemId);
  if (!existsSync(dir)) return;

  const slug = stageSlug(stage);
  const files = await readdir(dir);
  await Promise.all(
    files
      .filter((file) => file.startsWith(`${slug}.`))
      .map((file) => rm(path.join(dir, file), { force: true }))
  );
}

export async function removePickemDirectory(pickemId) {
  await rm(pickemDir(pickemId), { recursive: true, force: true });
}

export async function savePickemImage(pickemId, stage, buffer, ext) {
  await ensurePickemDir(pickemId);
  await removeStageImages(pickemId, stage);

  const filePath = buildImagePath(pickemId, stage, ext);
  await writeFile(filePath, buffer);
  return buildImageUrl(pickemId, stage, ext);
}

export async function savePickemImageFromDataUrl(pickemId, stage, dataUrl) {
  const match = /^data:(image\/[\w+.-]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;

  const ext = extensionFromMime(match[1]);
  if (!ext) return null;

  const buffer = Buffer.from(match[2], "base64");
  return savePickemImage(pickemId, stage, buffer, ext);
}

export function isDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:image/");
}

export function isImageExtension(ext) {
  return IMAGE_EXTENSIONS.has(ext.toLowerCase());
}
