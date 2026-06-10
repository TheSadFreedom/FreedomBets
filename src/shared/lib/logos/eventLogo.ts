import { LOGO_EXTENSIONS } from "./assetLogo";

export interface EventLogoManifestItem {
  id: string;
  src: string;
}

export const EVENT_LOGOS_MANIFEST_URL = "/events/manifest.json";

export function buildEventLogoCandidates(slug: string): string[] {
  const trimmed = slug.trim();
  if (!trimmed) return [];
  return LOGO_EXTENSIONS.map((ext) => `/events/${trimmed}.${ext}`);
}

export function formatEventLogoLabel(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
