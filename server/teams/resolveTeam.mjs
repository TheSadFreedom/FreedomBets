import {
  getTeamMatchKey,
  resolveCanonicalTeamName,
  teamNamesMatch,
} from "../sportsru/teamNames.mjs";

const LOGO_FILE_ALIASES = {
  "thunder-downnunder": "thunder-downunder",
};

function assetLogoSlug(name) {
  const slug = String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё.-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^[-.]|[-.]$/g, "");

  return LOGO_FILE_ALIASES[slug] ?? slug;
}

export function resolveTeamIdFromName(name) {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return "";
  return getTeamMatchKey(canonical);
}

export function buildTeamFromName(name) {
  const canonical = resolveCanonicalTeamName(name);
  if (!canonical) return null;

  const teamKey = getTeamMatchKey(canonical);
  if (!teamKey) return null;

  return {
    id: teamKey,
    teamKey,
    name: canonical,
    logoSlug: assetLogoSlug(canonical),
  };
}

export function attachTeamIds(record) {
  return {
    ...record,
    team1Id: resolveTeamIdFromName(record.organization1),
    team2Id: resolveTeamIdFromName(record.organization2),
  };
}

export function resolveBetTeamId(bet) {
  const explicit = String(bet.betTeamId ?? "").trim();
  if (explicit) return explicit;

  if (bet.betTeam === 2) {
    return String(bet.team2Id ?? "").trim() || resolveTeamIdFromName(bet.organization2);
  }

  return String(bet.team1Id ?? "").trim() || resolveTeamIdFromName(bet.organization1);
}

function teamIdsMatch(left, right) {
  const a = String(left ?? "").trim();
  const b = String(right ?? "").trim();
  return Boolean(a && b && a === b);
}

function hasTeamIds(record) {
  return Boolean(String(record.team1Id ?? "").trim() && String(record.team2Id ?? "").trim());
}

export function teamPairsMatch(left, right) {
  if (hasTeamIds(left) && hasTeamIds(right)) {
    return (
      (teamIdsMatch(left.team1Id, right.team1Id) &&
        teamIdsMatch(left.team2Id, right.team2Id)) ||
      (teamIdsMatch(left.team1Id, right.team2Id) &&
        teamIdsMatch(left.team2Id, right.team1Id))
    );
  }

  return (
    (teamNamesMatch(left.organization1, right.organization1) &&
      teamNamesMatch(left.organization2, right.organization2)) ||
    (teamNamesMatch(left.organization1, right.organization2) &&
      teamNamesMatch(left.organization2, right.organization1))
  );
}

export function teamsSameOrder(left, right) {
  if (hasTeamIds(left) && hasTeamIds(right)) {
    return (
      teamIdsMatch(left.team1Id, right.team1Id) &&
      teamIdsMatch(left.team2Id, right.team2Id)
    );
  }

  return (
    teamNamesMatch(left.organization1, right.organization1) &&
    teamNamesMatch(left.organization2, right.organization2)
  );
}

export function betTeamOnMatchSide(bet, match) {
  if (bet.betTeam !== 1 && bet.betTeam !== 2) return bet.betTeam;

  const betTeamId = resolveBetTeamId(bet);
  if (betTeamId && hasTeamIds(match)) {
    if (teamIdsMatch(betTeamId, match.team1Id)) return 1;
    if (teamIdsMatch(betTeamId, match.team2Id)) return 2;
  }

  if (teamsSameOrder(bet, match)) return bet.betTeam;
  return bet.betTeam === 1 ? 2 : 1;
}

export function seriesScoreForBet(bet, match, series) {
  if (teamsSameOrder(bet, match)) return series;
  return { score1: series.score2, score2: series.score1 };
}
