let aliasToKey = new Map();
let keyToCanonical = new Map();

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

export function reloadTeamSynonyms(teams = []) {
  aliasToKey = new Map();
  keyToCanonical = new Map();

  const sorted = [...teams].sort(
    (left, right) => (left.synonyms?.length ?? 0) - (right.synonyms?.length ?? 0)
  );

  for (const team of sorted) {
    const id = String(team?.id ?? "").trim();
    const name = String(team?.name ?? "").trim();
    if (!id || !name) continue;

    keyToCanonical.set(id, name);

    const normalizedName = normalizeKey(name);
    if (!aliasToKey.has(normalizedName)) {
      aliasToKey.set(normalizedName, id);
    }

    for (const synonym of Array.isArray(team.synonyms) ? team.synonyms : []) {
      const trimmed = String(synonym ?? "").trim();
      if (!trimmed) continue;
      aliasToKey.set(normalizeKey(trimmed), id);
    }
  }
}

function ensureTeamSynonymsLoaded() {
  // Maps are populated via reloadTeamSynonyms(db.data.teams) on server startup.
}

export function getTeamMatchKey(name) {
  ensureTeamSynonymsLoaded();
  const normalized = normalizeKey(name);
  if (!normalized) return "";
  return aliasToKey.get(normalized) ?? normalized;
}

export function resolveCanonicalTeamName(name) {
  ensureTeamSynonymsLoaded();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return "";

  const key = getTeamMatchKey(trimmed);
  return keyToCanonical.get(key) ?? trimmed;
}

export function teamNamesMatch(left, right) {
  const leftKey = getTeamMatchKey(left);
  const rightKey = getTeamMatchKey(right);
  if (!leftKey || !rightKey) return false;
  return leftKey === rightKey;
}

export function teamsMatch(left, right) {
  const pairs = [
    [left.organization1, right.organization1, left.organization2, right.organization2],
    [left.organization1, right.organization2, left.organization2, right.organization1],
  ];

  return pairs.some(([a1, b1, a2, b2]) => teamNamesMatch(a1, b1) && teamNamesMatch(a2, b2));
}

function teamsInSameOrder(reference, record) {
  return (
    teamNamesMatch(reference.organization1, record.organization1) &&
    teamNamesMatch(reference.organization2, record.organization2)
  );
}

function teamsInSwappedOrder(reference, record) {
  return (
    teamNamesMatch(reference.organization1, record.organization2) &&
    teamNamesMatch(reference.organization2, record.organization1)
  );
}

/** Меняет местами счёт серии и раунды на картах. */
export function swapTeamSides(record) {
  return {
    ...record,
    organization1: record.organization2,
    organization2: record.organization1,
    score1: record.score2 ?? null,
    score2: record.score1 ?? null,
    maps: (record.maps ?? []).map((map) => ({
      ...map,
      score1: map.score2 ?? null,
      score2: map.score1 ?? null,
    })),
  };
}

/**
 * Приводит счёт и порядок команд к эталону (матч в базе или HTML-заглушка).
 * Нужно, когда Sports.ru отдаёт team1/team2 в другом порядке, чем в приложении.
 */
export function alignTeamsToReference(record, reference) {
  const ref1 = String(reference?.organization1 ?? "").trim();
  const ref2 = String(reference?.organization2 ?? "").trim();
  if (!ref1 || !ref2) return record;

  const rec1 = String(record?.organization1 ?? "").trim();
  const rec2 = String(record?.organization2 ?? "").trim();
  if (!rec1 || !rec2) return record;

  if (teamsInSameOrder(reference, record)) {
    return {
      ...record,
      organization1: ref1,
      organization2: ref2,
    };
  }

  if (!teamsInSwappedOrder(reference, record)) {
    return record;
  }

  const swapped = swapTeamSides(record);
  return {
    ...swapped,
    organization1: ref1,
    organization2: ref2,
  };
}

export function applyCanonicalTeamNames(record) {
  return {
    ...record,
    organization1: resolveCanonicalTeamName(record.organization1),
    organization2: resolveCanonicalTeamName(record.organization2),
  };
}
