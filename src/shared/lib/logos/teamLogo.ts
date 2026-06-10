import { LOGO_EXTENSIONS, assetLogoSrc } from "./assetLogo";

export { assetLogoSlug as teamLogoSlug, nextLogoExtensionIndex } from "./assetLogo";

export const TEAM_LOGOS_MANIFEST_URL = "/teams/manifest.json";

export interface TeamLogoManifestItem {
  id: string;
  src: string;
}

export function buildTeamLogoCandidates(slug: string): string[] {
  const trimmed = slug.trim();
  if (!trimmed) return [];
  return LOGO_EXTENSIONS.map((ext) => `/teams/${trimmed}.${ext}`);
}

export function formatTeamLogoLabel(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function teamLogoSrc(name: string, extensionIndex = 0): string {
  return assetLogoSrc("teams", name, extensionIndex);
}
