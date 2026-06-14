import { DEFAULT_TEAM_SYNONYM_GROUPS } from "./defaultTeamSynonyms.mjs";
import { assetLogoSlug } from "./resolveTeam.mjs";

function normalizeKey(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSynonyms(canonical, aliases) {
  const canonicalKey = normalizeKey(canonical);
  return [
    ...new Set(
      (Array.isArray(aliases) ? aliases : [])
        .map((item) => String(item ?? "").trim())
        .filter((item) => item && normalizeKey(item) !== canonicalKey)
    ),
  ];
}

function mergeSynonyms(existing, defaults) {
  return [...new Set([...(Array.isArray(existing) ? existing : []), ...defaults])];
}

export function seedDefaultTeamsInDb(db) {
  if (!Array.isArray(db.data.teams)) {
    db.data.teams = [];
  }

  let changed = false;

  for (const group of DEFAULT_TEAM_SYNONYM_GROUPS) {
    const name = String(group.canonical ?? "").trim();
    if (!name) continue;

    const id = normalizeKey(name);
    const synonyms = normalizeSynonyms(name, group.aliases);
    const existing = db.data.teams.find((item) => String(item?.id ?? "").trim() === id);

    if (!existing) {
      db.data.teams.push({
        id,
        name,
        synonyms,
        logoSlug: assetLogoSlug(name),
        vrsPoints: 0,
      });
      changed = true;
      continue;
    }

    const mergedSynonyms = mergeSynonyms(existing.synonyms, synonyms);
    if (mergedSynonyms.length !== (existing.synonyms?.length ?? 0)) {
      existing.synonyms = mergedSynonyms;
      changed = true;
    }

    if (!existing.name?.trim()) {
      existing.name = name;
      changed = true;
    }

    if (!existing.logoSlug?.trim()) {
      existing.logoSlug = assetLogoSlug(name);
      changed = true;
    }
  }

  if (changed) {
    db.data.teams.sort((left, right) =>
      String(left.name ?? "").localeCompare(String(right.name ?? ""), "ru")
    );
  }

  return changed;
}
