import {
  attachTeamIds,
  betTeamOnMatchSide,
  inferBetTeamFromDescription,
  seriesScoreForBet,
  teamPairsMatch,
} from "../teams/resolveTeam.mjs";

const MAP_COUNTS = { BO1: 1, BO3: 3, BO5: 5 };

const LEGACY_STATUS = {
  ожидание: "WAIT",
  выигрыш: "WIN",
  проигрыш: "LOSE",
  WAIT: "WAIT",
  WIN: "WIN",
  LOSE: "LOSE",
};

export function normalizeBetStatus(status) {
  return LEGACY_STATUS[status] ?? "WAIT";
}

function norm(value) {
  return String(value ?? "").trim().toLowerCase();
}

function stagesEqual(a, b) {
  return (a ?? null) === (b ?? null);
}

function betTeamOnMatch(bet, match) {
  return betTeamOnMatchSide(bet, match);
}

export function isBetForMatch(bet, match) {
  return String(bet.matchId ?? "").trim() === String(match.id ?? "").trim();
}

export function findBetsForMatch(match, bets) {
  return bets.filter((bet) => isBetForMatch(bet, match));
}

function normalizeMapsForFormat(maps, format) {
  const count = MAP_COUNTS[format] ?? 3;
  const raw = Array.isArray(maps) ? maps : [];
  const normalized = raw.slice(0, count).map((map) => ({
    name: typeof map?.name === "string" ? map.name.trim() : "",
    score1: map?.score1 ?? null,
    score2: map?.score2 ?? null,
  }));
  while (normalized.length < count) {
    normalized.push({ name: "", score1: null, score2: null });
  }
  return normalized;
}

function getMapWinner(map) {
  if (map.score1 == null || map.score2 == null || map.score1 === map.score2) return null;
  return map.score1 > map.score2 ? 1 : 2;
}

function getSeriesScoreFromMaps(maps, format) {
  let score1 = 0;
  let score2 = 0;
  let hasAny = false;

  for (const map of normalizeMapsForFormat(maps, format)) {
    const winner = getMapWinner(map);
    if (winner === 1) {
      score1 += 1;
      hasAny = true;
    } else if (winner === 2) {
      score2 += 1;
      hasAny = true;
    }
  }

  return hasAny ? { score1, score2 } : null;
}

export function getMatchSeriesScore(match) {
  const fromMaps = getSeriesScoreFromMaps(match.maps, match.format ?? "BO3");
  if (fromMaps) return fromMaps;
  if (match.score1 != null && match.score2 != null) {
    return { score1: match.score1, score2: match.score2 };
  }
  return null;
}

function mapsNeededToWin(format) {
  const count = MAP_COUNTS[format] ?? 3;
  return Math.ceil(count / 2);
}

export function getMatchSeriesWinner(match) {
  const series = getMatchSeriesScore(match);
  if (!series || series.score1 === series.score2) return null;
  const needed = mapsNeededToWin(match.format ?? "BO3");
  if (series.score1 >= needed) return 1;
  if (series.score2 >= needed) return 2;
  return null;
}

function getMatchMapsPlayed(match) {
  const series = getMatchSeriesScore(match);
  return series ? series.score1 + series.score2 : null;
}

function hasMatchScore(match) {
  return getMatchSeriesScore(match) != null;
}

function resolveMapBetStatus(bet, match) {
  if (bet.betMarket !== "map" || bet.mapNumber == null) return null;
  const maps = normalizeMapsForFormat(match.maps, match.format ?? "BO3");
  const mapIndex = bet.mapNumber - 1;
  if (mapIndex < 0 || mapIndex >= maps.length) return null;
  const winner = getMapWinner(maps[mapIndex]);
  if (winner == null) return null;
  return betTeamOnMatch(bet, match) === winner ? "WIN" : "LOSE";
}

function resolveAtLeastOneMapBetStatus(bet, match) {
  if (bet.betMarket !== "atLeastOneMap") return null;
  if (match.format === "BO1" || !hasMatchScore(match)) return null;
  const series = getMatchSeriesScore(match);
  if (!series) return null;
  const teamOnMatch = betTeamOnMatch(bet, match);
  const mapsWon = teamOnMatch === 1 ? series.score1 : series.score2;
  const pickedYes = bet.yesNo === true;
  if (pickedYes && mapsWon >= 1) return "WIN";
  if (!pickedYes && mapsWon >= 1) return "LOSE";
  const winner = getMatchSeriesWinner(match);
  if (winner != null && mapsWon === 0) return pickedYes ? "LOSE" : "WIN";
  return null;
}

function resolveExactScoreBetStatus(bet, match) {
  if (bet.betMarket !== "exactScore") return null;
  if (match.format !== "BO3" || getMatchSeriesWinner(match) == null) return null;
  if (!hasMatchScore(match)) return null;
  if (bet.exactScore1 == null || bet.exactScore2 == null) return null;
  const series = getMatchSeriesScore(match);
  if (!series) return null;
  const aligned = seriesScoreForBet(bet, match, series);
  const matchesScore =
    aligned.score1 === bet.exactScore1 && aligned.score2 === bet.exactScore2;
  return matchesScore ? "WIN" : "LOSE";
}

function resolveMapsTotalBetStatus(bet, match) {
  if (bet.betMarket !== "mapsTotal" || match.format !== "BO3") return null;
  const mapsPlayed = getMatchMapsPlayed(match);
  if (mapsPlayed == null) return null;
  const pickedUnder = bet.betTeam === 1;
  const seriesOver = getMatchSeriesWinner(match) != null;
  if (!pickedUnder && mapsPlayed >= 3) return "WIN";
  if (pickedUnder && mapsPlayed >= 3) return "LOSE";
  if (pickedUnder && mapsPlayed === 2 && seriesOver) return "WIN";
  if (!pickedUnder && mapsPlayed === 2 && seriesOver) return "LOSE";
  return null;
}

function expandStoredBetForSettlement(bet) {
  if (bet.betMarket) return bet;
  const text = String(bet.betType ?? "").toLowerCase();
  const mapNumber = Number(text.match(/карта\s+(\d+)/i)?.[1] ?? "") || null;
  const exact = text.match(/(\d)\s*[:\-]\s*(\d)/);
  return {
    ...bet,
    betMarket: text.includes("точный счет")
      ? "exactScore"
      : text.includes("хотя бы одну")
        ? "atLeastOneMap"
        : text.includes("пистолет")
          ? "pistol"
          : text.includes("карта")
            ? "map"
            : text.includes("тотал") || text.includes("2.5")
              ? "mapsTotal"
              : "match",
    betTeam: bet.betTeam ?? 1,
    yesNo: text.includes("нет") ? false : text.includes("да") ? true : null,
    exactScore1: exact ? Number(exact[1]) : null,
    exactScore2: exact ? Number(exact[2]) : null,
    mapNumber,
  };
}

function enrichBetForSettlement(bet, match) {
  const expanded = expandStoredBetForSettlement(bet);
  const organization1 = String(match.organization1 ?? "").trim();
  const organization2 = String(match.organization2 ?? "").trim();
  const betTeam = inferBetTeamFromDescription(
    expanded.betType ?? bet.betType ?? "",
    organization1,
    organization2,
  );

  return attachTeamIds({
    ...expanded,
    organization1,
    organization2,
    team1Id: match.team1Id,
    team2Id: match.team2Id,
    betTeam,
  });
}

export function resolveExpectedBetStatus(bet, match) {
  const enrichedBet = enrichBetForSettlement(bet, match);
  if (enrichedBet.betMarket === "pistol") return null;
  if (enrichedBet.betMarket === "map") return resolveMapBetStatus(enrichedBet, match);
  if (enrichedBet.betMarket === "mapsTotal") return resolveMapsTotalBetStatus(enrichedBet, match);
  if (enrichedBet.betMarket === "atLeastOneMap") return resolveAtLeastOneMapBetStatus(enrichedBet, match);
  if (enrichedBet.betMarket === "exactScore") return resolveExactScoreBetStatus(enrichedBet, match);
  if (enrichedBet.betMarket !== "match") return null;
  const winner = getMatchSeriesWinner(match);
  if (winner == null) return null;
  return betTeamOnMatch(enrichedBet, match) === winner ? "WIN" : "LOSE";
}

export function planMatchBetRecalculations(match, bets) {
  return findBetsForMatch(match, bets).flatMap((bet) => {
    const current = normalizeBetStatus(bet.status);
    const nextStatus = resolveExpectedBetStatus({ ...bet, status: current }, match);
    if (!nextStatus || current === nextStatus) return [];
    return [{ bet, nextStatus }];
  });
}
