import {
  getTeamMatchKey,
  resolveCanonicalTeamName,
  teamNamesMatch,
} from "../sportsru/teamNames.mjs";

const LOGO_FILE_ALIASES = {
  "thunder-downnunder": "thunder-downunder",
};

export function assetLogoSlug(name) {
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
  const team1FromName = resolveTeamIdFromName(record.organization1);
  const team2FromName = resolveTeamIdFromName(record.organization2);
  const existingTeam1Id = String(record.team1Id ?? "").trim();
  const existingTeam2Id = String(record.team2Id ?? "").trim();

  const team1Id = team1FromName || (existingTeam1Id ? getTeamMatchKey(existingTeam1Id) : "");
  const team2Id = team2FromName || (existingTeam2Id ? getTeamMatchKey(existingTeam2Id) : "");

  return {
    ...record,
    team1Id,
    team2Id,
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

function matchTeamNameInSides(name, organization1, organization2) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return null;
  if (organization1 && teamNamesMatch(trimmed, organization1)) return 1;
  if (organization2 && teamNamesMatch(trimmed, organization2)) return 2;
  return null;
}

export function inferBetTeamFromDescription(betType, organization1 = "", organization2 = "") {
  const text = String(betType ?? "").trim();
  if (!text) return 1;

  if (/больше/i.test(text)) return 2;
  if (/меньше/i.test(text)) return 1;
  if (/^W2$/i.test(text) || /команда\s*2|^к2$/i.test(text)) return 2;
  if (/^W1$/i.test(text) || /команда\s*1|^к1$/i.test(text)) return 1;

  const parts = text.split(/\s*[—–-]\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2 && (organization1 || organization2)) {
    const last = parts[parts.length - 1] ?? "";
    if (/^(да|нет)$/i.test(last) && parts.length >= 3) {
      const fromName = matchTeamNameInSides(parts[parts.length - 2] ?? "", organization1, organization2);
      if (fromName) return fromName;
    }

    const fromName = matchTeamNameInSides(last, organization1, organization2);
    if (fromName) return fromName;
  }

  if (/\b(2|втор)/i.test(text) && !/\b1\b/.test(text)) return 2;
  return 1;
}

export function seriesScoreForBet(bet, match, series) {
  if (teamsSameOrder(bet, match)) return series;
  return { score1: series.score2, score2: series.score1 };
}
