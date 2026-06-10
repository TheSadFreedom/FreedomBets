import teamSynonyms from "../../../../config/teamSynonyms.json";

type SynonymGroup = {
  canonical?: string;
  aliases?: string[];
};

const aliasToKey = new Map<string, string>();
const keyToCanonical = new Map<string, string>();

function normalizeKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function loadTeamSynonyms(): void {
  if (aliasToKey.size > 0) return;

  for (const group of (teamSynonyms.groups ?? []) as SynonymGroup[]) {
    const canonical = String(group.canonical ?? "").trim();
    if (!canonical) continue;

    const key = normalizeKey(canonical);
    keyToCanonical.set(key, canonical);

    const names = [canonical, ...(Array.isArray(group.aliases) ? group.aliases : [])];
    for (const name of names) {
      const trimmed = String(name ?? "").trim();
      if (!trimmed) continue;
      aliasToKey.set(normalizeKey(trimmed), key);
    }
  }
}

export function getTeamMatchKey(name: string): string {
  loadTeamSynonyms();
  const normalized = normalizeKey(name);
  if (!normalized) return "";
  return aliasToKey.get(normalized) ?? normalized;
}

export function teamNamesMatch(left: string, right: string): boolean {
  const leftKey = getTeamMatchKey(left);
  const rightKey = getTeamMatchKey(right);
  if (!leftKey || !rightKey) return false;
  return leftKey === rightKey;
}

export function resolveCanonicalTeamName(name: string): string {
  loadTeamSynonyms();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return "";

  const key = getTeamMatchKey(trimmed);
  return keyToCanonical.get(key) ?? trimmed;
}
