import type { Team } from "@/entities/team";

const aliasToKey = new Map<string, string>();
const keyToCanonical = new Map<string, string>();
let synonymsReady = false;

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

function applyDbTeams(teams: Team[]): void {
  const sorted = [...teams].sort(
    (left, right) => (left.synonyms?.length ?? 0) - (right.synonyms?.length ?? 0)
  );

  for (const team of sorted) {
    const key = String(team.id ?? "").trim();
    const name = String(team.name ?? "").trim();
    if (!key || !name) continue;

    keyToCanonical.set(key, name);

    const normalizedName = normalizeKey(name);
    if (!aliasToKey.has(normalizedName)) {
      aliasToKey.set(normalizedName, key);
    }

    for (const synonym of team.synonyms ?? []) {
      const trimmed = String(synonym ?? "").trim();
      if (!trimmed) continue;
      aliasToKey.set(normalizeKey(trimmed), key);
    }
  }
}

function rebuildSynonymMaps(dbTeams: Team[] = []): void {
  aliasToKey.clear();
  keyToCanonical.clear();
  applyDbTeams(dbTeams);
  synonymsReady = true;
}

function ensureTeamSynonymsLoaded(): void {
  if (!synonymsReady) rebuildSynonymMaps();
}

export function applyDbTeamSynonyms(teams: Team[]): void {
  rebuildSynonymMaps(teams);
}

export function getTeamMatchKey(name: string): string {
  ensureTeamSynonymsLoaded();
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
  ensureTeamSynonymsLoaded();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return "";

  const key = getTeamMatchKey(trimmed);
  return keyToCanonical.get(key) ?? trimmed;
}

export function resolveTeamSynonyms(team: Pick<Team, "synonyms">): string[] {
  return Array.isArray(team.synonyms)
    ? [...new Set(team.synonyms.map((item) => String(item).trim()).filter(Boolean))]
    : [];
}

/** All normalized spellings for search, including aliases and canonical name. */
export function getTeamSearchTerms(name: string): string[] {
  ensureTeamSynonymsLoaded();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return [];

  const key = getTeamMatchKey(trimmed);
  const terms = new Set<string>([normalizeKey(trimmed)]);
  if (key) terms.add(key);

  const canonical = keyToCanonical.get(key);
  if (canonical) terms.add(normalizeKey(canonical));

  for (const [alias, aliasKey] of aliasToKey.entries()) {
    if (aliasKey === key) terms.add(alias);
  }

  return [...terms];
}
