import { assetLogoSlug, LOGO_EXTENSIONS } from "./assetLogo";

/** Имя файла без расширения → slug в public/majors */
const MAJOR_LOGO_ALIASES: Record<string, string> = {
  "iem-major-rio-2022": "iem-rio-major-2022",
};

export function majorLogoSlug(name: string): string {
  const slug = assetLogoSlug(name);
  return MAJOR_LOGO_ALIASES[slug] ?? slug;
}

export function majorEventKeys(eventOrganization: string, eventName: string): string[] {
  const org = eventOrganization.trim();
  const name = eventName.trim();
  const keys: string[] = [];

  if (org && name) keys.push(`${org} ${name}`);
  if (name) keys.push(name);
  if (org && !name) keys.push(org);

  return keys;
}

/** Варианты путей /majors/{slug}.{ext} по названию турнира */
export function buildMajorLogoCandidates(eventOrganization: string, eventName: string): string[] {
  const slugs = [...new Set(majorEventKeys(eventOrganization, eventName).map(majorLogoSlug))];

  return slugs.flatMap((slug) =>
    LOGO_EXTENSIONS.map((ext) => `/majors/${slug}.${ext}`)
  );
}
