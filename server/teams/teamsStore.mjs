import { buildTeamFromName, attachTeamIds, resolveBetTeamId } from "./resolveTeam.mjs";
import {
  getTeamMatchKey,
  reloadTeamSynonyms,
  resolveCanonicalTeamName,
} from "../sportsru/teamNames.mjs";

function normalizeTeamKey(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSynonymList(canonicalName, synonyms) {
  const canonicalKey = normalizeTeamKey(canonicalName);
  return [
    ...new Set(
      (Array.isArray(synonyms) ? synonyms : [])
        .map((item) => String(item ?? "").trim())
        .filter(
          (item) =>
            item &&
            normalizeTeamKey(item) !== canonicalKey &&
            item !== canonicalName
        )
    ),
  ];
}

function upsertTeamRecord(teamMap, record) {
  const id = String(record?.id ?? "").trim();
  const name = String(record?.name ?? "").trim();
  if (!id || !name) return;

  const existing = teamMap.get(id);
  const synonyms = normalizeSynonymList(name, record.synonyms);

  if (!existing) {
    teamMap.set(id, {
      id,
      name,
      logoSlug: record.logoSlug ?? id,
      synonyms,
      vrsPoints: Number.isFinite(record.vrsPoints) ? record.vrsPoints : 0,
    });
    return;
  }

  existing.name = name;
  existing.logoSlug = record.logoSlug?.trim() || existing.logoSlug || id;
  existing.synonyms = normalizeSynonymList(name, [
    ...(existing.synonyms ?? []),
    ...synonyms,
  ]);
  existing.vrsPoints = Math.max(
    Number(existing.vrsPoints) || 0,
    Number.isFinite(record.vrsPoints) ? record.vrsPoints : 0
  );
}

function mergeAliasName(teamMap, rawName) {
  const trimmed = String(rawName ?? "").trim();
  if (!trimmed) return;

  const built = buildTeamFromName(trimmed);
  if (!built) return;

  const existing = teamMap.get(built.id);
  if (!existing) {
    teamMap.set(built.id, {
      id: built.id,
      name: built.name,
      logoSlug: built.logoSlug,
      synonyms: trimmed !== built.name ? [trimmed] : [],
      vrsPoints: 0,
    });
    return;
  }

  if (trimmed !== existing.name) {
    existing.synonyms = normalizeSynonymList(existing.name, [
      ...(existing.synonyms ?? []),
      trimmed,
    ]);
  }
}

function collectNamesFromDb(db) {
  const names = new Set();

  for (const match of db.data.matches ?? []) {
    if (match.organization1?.trim()) names.add(match.organization1.trim());
    if (match.organization2?.trim()) names.add(match.organization2.trim());
  }

  for (const bet of db.data.bets ?? []) {
    if (bet.organization1?.trim()) names.add(bet.organization1.trim());
    if (bet.organization2?.trim()) names.add(bet.organization2.trim());
  }

  return names;
}

function pruneSynonymDuplicateTeams(teamMap) {
  for (const team of [...teamMap.values()]) {
    const canonicalId = getTeamMatchKey(team.name);
    if (canonicalId && canonicalId !== team.id && teamMap.has(canonicalId)) {
      const canonical = teamMap.get(canonicalId);
      canonical.synonyms = normalizeSynonymList(canonical.name, [
        ...(canonical.synonyms ?? []),
        team.name,
        ...(team.synonyms ?? []),
      ]);
      teamMap.delete(team.id);
    }
  }

  for (const team of [...teamMap.values()]) {
    for (const other of teamMap.values()) {
      if (other.id === team.id) continue;

      const isAlias =
        (other.synonyms ?? []).includes(team.name) ||
        getTeamMatchKey(team.name) === other.id;

      if (!isAlias) continue;

      other.synonyms = normalizeSynonymList(other.name, [
        ...(other.synonyms ?? []),
        team.name,
        ...(team.synonyms ?? []),
      ]);
      teamMap.delete(team.id);
      break;
    }
  }

  return teamMap;
}

export function buildTeamsMap(db) {
  reloadTeamSynonyms(db.data.teams ?? []);

  const teamMap = new Map();

  for (const team of db.data.teams ?? []) {
    upsertTeamRecord(teamMap, team);
  }

  reloadTeamSynonyms([...teamMap.values()]);

  for (const name of collectNamesFromDb(db)) {
    mergeAliasName(teamMap, name);
  }

  return pruneSynonymDuplicateTeams(teamMap);
}

export function syncTeamsCollection(db) {
  const teamMap = buildTeamsMap(db);
  db.data.teams = [...teamMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "ru")
  );
  reloadTeamSynonyms(db.data.teams);
  return db.data.teams.length;
}

export function attachTeamFieldsToMatch(match) {
  return attachTeamIds(match);
}

export function attachTeamFieldsToBet(bet) {
  const withTeams = attachTeamIds(bet);
  return {
    ...withTeams,
    betTeamId: resolveBetTeamId(withTeams),
  };
}

function canonicalizeOrganizationFields(record) {
  const organization1 = record.organization1?.trim()
    ? resolveCanonicalTeamName(record.organization1)
    : record.organization1;
  const organization2 = record.organization2?.trim()
    ? resolveCanonicalTeamName(record.organization2)
    : record.organization2;

  return {
    ...record,
    organization1,
    organization2,
  };
}

export function migrateTeamFieldsInDb(db) {
  reloadTeamSynonyms(db.data.teams ?? []);

  let matchesUpdated = 0;
  let betsUpdated = 0;

  for (const match of db.data.matches ?? []) {
    const canonical = canonicalizeOrganizationFields(match);
    const next = attachTeamFieldsToMatch(canonical);
    if (
      match.team1Id !== next.team1Id ||
      match.team2Id !== next.team2Id ||
      match.organization1 !== next.organization1 ||
      match.organization2 !== next.organization2
    ) {
      match.team1Id = next.team1Id;
      match.team2Id = next.team2Id;
      match.organization1 = next.organization1;
      match.organization2 = next.organization2;
      matchesUpdated += 1;
    }
  }

  for (const bet of db.data.bets ?? []) {
    const canonical = canonicalizeOrganizationFields(bet);
    const next = attachTeamFieldsToBet(canonical);
    if (
      bet.team1Id !== next.team1Id ||
      bet.team2Id !== next.team2Id ||
      bet.betTeamId !== next.betTeamId ||
      bet.organization1 !== next.organization1 ||
      bet.organization2 !== next.organization2
    ) {
      bet.team1Id = next.team1Id;
      bet.team2Id = next.team2Id;
      bet.betTeamId = next.betTeamId;
      bet.organization1 = next.organization1;
      bet.organization2 = next.organization2;
      betsUpdated += 1;
    }
  }

  const teamsCount = syncTeamsCollection(db);

  return { teamsCount, matchesUpdated, betsUpdated };
}
