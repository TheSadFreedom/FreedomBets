import type { StaticMajor } from "@/shared/lib/majors/staticMajors";

const LOGO_EXTENSIONS = ["svg", "webp", "png", "jpg", "jpeg"] as const;

export function normalizeMajorKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ");
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

export function buildMajorLogoCandidates(eventOrganization: string, eventName: string): string[] {
  const keys = majorEventKeys(eventOrganization, eventName);
  const unique = [...new Set(keys)];

  return unique.flatMap((key) =>
    LOGO_EXTENSIONS.map((ext) => `/majors/${encodeURIComponent(key)}.${ext}`)
  );
}

export function findMajorLogoSrc(
  manifest: StaticMajor[],
  eventOrganization: string,
  eventName: string
): string | null {
  const candidates = majorEventKeys(eventOrganization, eventName).map(normalizeMajorKey);
  const byId = new Map(manifest.map((item) => [normalizeMajorKey(item.id), item.src]));

  for (const key of candidates) {
    const src = byId.get(key);
    if (src) return src;
  }

  const org = normalizeMajorKey(eventOrganization);
  const name = normalizeMajorKey(eventName);
  if (!name) return null;

  const fuzzy = manifest.find((item) => {
    const id = normalizeMajorKey(item.id);
    return id.includes(name) && (!org || id.includes(org));
  });

  return fuzzy?.src ?? null;
}
