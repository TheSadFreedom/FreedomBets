import {
  getTeamMatchKey,
  reloadTeamSynonyms,
  resolveCanonicalTeamName,
} from "../sportsru/teamNames.mjs";

function normalizeSynonyms(name, synonyms) {
  const canonicalKey = String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");

  return [
    ...new Set(
      (Array.isArray(synonyms) ? synonyms : [])
        .map((item) => String(item ?? "").trim())
        .filter((item) => {
          const key = item
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/&/g, "and")
            .replace(/[^a-z0-9а-яё]+/gi, " ")
            .trim()
            .replace(/\s+/g, " ");
          return item && key !== canonicalKey;
        })
    ),
  ];
}

function canonicalTeamId(name, fallbackId = "") {
  const fromName = resolveCanonicalTeamName(name);
  if (!fromName) return String(fallbackId ?? "").trim();
  return getTeamMatchKey(fromName) || String(fallbackId ?? "").trim();
}

function pickPreferredTeam(left, right) {
  const leftSynonyms = left.synonyms?.length ?? 0;
  const rightSynonyms = right.synonyms?.length ?? 0;
  if (leftSynonyms !== rightSynonyms) {
    return leftSynonyms > rightSynonyms ? left : right;
  }

  const leftCanonical = resolveCanonicalTeamName(left.name) === left.name;
  const rightCanonical = resolveCanonicalTeamName(right.name) === right.name;
  if (leftCanonical !== rightCanonical) {
    return leftCanonical ? left : right;
  }

  return left.name.length <= right.name.length ? left : right;
}

function remapTeamId(teamId) {
  const trimmed = String(teamId ?? "").trim();
  if (!trimmed) return "";
  return getTeamMatchKey(trimmed) || trimmed;
}

export function dedupeTeamsInDb(db) {
  if (!Array.isArray(db.data.teams)) {
    db.data.teams = [];
  }

  reloadTeamSynonyms(db.data.teams);

  const merged = new Map();
  let teamsChanged = false;

  for (const team of db.data.teams) {
    const name = String(team?.name ?? "").trim();
    const id = canonicalTeamId(name, team?.id);
    if (!id || !name) continue;

    const next = {
      ...team,
      id,
      name: resolveCanonicalTeamName(name) || name,
      synonyms: normalizeSynonyms(
        resolveCanonicalTeamName(name) || name,
        team.synonyms
      ),
      logoSlug: team.logoSlug?.trim() || team.id,
    };

    const existing = merged.get(id);
    if (!existing) {
      merged.set(id, next);
      if (team.id !== next.id || team.name !== next.name) teamsChanged = true;
      continue;
    }

    const preferred = pickPreferredTeam(existing, next);
    const synonyms = normalizeSynonyms(
      preferred.name,
      [...(existing.synonyms ?? []), ...(next.synonyms ?? []), existing.name, next.name]
    );

    merged.set(id, {
      ...preferred,
      id,
      synonyms,
      vrsPoints: Math.max(Number(existing.vrsPoints) || 0, Number(next.vrsPoints) || 0),
    });
    teamsChanged = true;
  }

  const duplicateIds = new Set(
    db.data.teams
      .map((team) => String(team?.id ?? "").trim())
      .filter((id) => id && !merged.has(id))
  );

  if (duplicateIds.size > 0) teamsChanged = true;

  db.data.teams = [...merged.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "ru")
  );

  reloadTeamSynonyms(db.data.teams);

  let matchesUpdated = 0;
  let betsUpdated = 0;

  for (const match of db.data.matches ?? []) {
    const team1Id = remapTeamId(match.team1Id);
    const team2Id = remapTeamId(match.team2Id);
    const organization1 = match.organization1?.trim()
      ? resolveCanonicalTeamName(match.organization1)
      : match.organization1;
    const organization2 = match.organization2?.trim()
      ? resolveCanonicalTeamName(match.organization2)
      : match.organization2;

    if (
      match.team1Id !== team1Id ||
      match.team2Id !== team2Id ||
      match.organization1 !== organization1 ||
      match.organization2 !== organization2
    ) {
      match.team1Id = team1Id;
      match.team2Id = team2Id;
      match.organization1 = organization1;
      match.organization2 = organization2;
      matchesUpdated += 1;
    }
  }

  for (const bet of db.data.bets ?? []) {
    const team1Id = remapTeamId(bet.team1Id);
    const team2Id = remapTeamId(bet.team2Id);
    const betTeamId = remapTeamId(bet.betTeamId);
    const organization1 = bet.organization1?.trim()
      ? resolveCanonicalTeamName(bet.organization1)
      : bet.organization1;
    const organization2 = bet.organization2?.trim()
      ? resolveCanonicalTeamName(bet.organization2)
      : bet.organization2;

    if (
      bet.team1Id !== team1Id ||
      bet.team2Id !== team2Id ||
      bet.betTeamId !== betTeamId ||
      bet.organization1 !== organization1 ||
      bet.organization2 !== organization2
    ) {
      bet.team1Id = team1Id;
      bet.team2Id = team2Id;
      bet.betTeamId = betTeamId;
      bet.organization1 = organization1;
      bet.organization2 = organization2;
      betsUpdated += 1;
    }
  }

  return { teamsChanged, matchesUpdated, betsUpdated, teamsCount: db.data.teams.length };
}
