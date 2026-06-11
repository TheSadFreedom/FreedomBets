import { applySportsRuLocalTime, parseSportsRuSchedule } from "./schedule.mjs";
import {
  alignTeamsToReference,
  applyCanonicalTeamNames,
  teamNamesMatch,
} from "./teamNames.mjs";

const MAP_SLOTS = { BO1: 1, BO3: 3, BO5: 5 };

function mapStatus(status) {
  switch (status) {
    case "LIVE":
      return "live";
    case "ENDED":
      return "finished";
    default:
      return "scheduled";
  }
}

function normalizeFormat(type) {
  if (type === "BO1" || type === "BO3" || type === "BO5") return type;
  return "BO3";
}

function splitTournament(league) {
  const title = league?.title?.trim() ?? "";
  const shortTitle = league?.shortTitle?.trim() ?? "";
  if (shortTitle && title) {
    return {
      eventOrganization: shortTitle,
      eventName: title.replace(new RegExp(`^${shortTitle}\\s*`), "").trim() || title,
      tournament: title,
    };
  }
  if (!title) {
    return { eventOrganization: "Sports.ru", eventName: "", tournament: "" };
  }
  const parts = title.split(/\s+/);
  return {
    eventOrganization: parts[0],
    eventName: parts.slice(1).join(" "),
    tournament: title,
  };
}

function mapSlotWinnerToSeriesSide(item, seriesTeam1Name, seriesTeam2Name) {
  if (item.winner !== "TEAM1" && item.winner !== "TEAM2") return null;

  const slotTeam =
    item.winner === "TEAM1"
      ? item.team1?.team?.name?.trim()
      : item.team2?.team?.name?.trim();

  if (!slotTeam) return null;
  if (teamNamesMatch(slotTeam, seriesTeam1Name)) return 1;
  if (teamNamesMatch(slotTeam, seriesTeam2Name)) return 2;
  return null;
}

function buildSeriesScore(series, maps) {
  const teamScore1 = series.team1?.teamScore;
  const teamScore2 = series.team2?.teamScore;
  if (teamScore1 != null && teamScore2 != null && (teamScore1 > 0 || teamScore2 > 0)) {
    return { score1: teamScore1, score2: teamScore2 };
  }

  let fromRounds1 = 0;
  let fromRounds2 = 0;

  for (const map of maps) {
    if (map.score1 == null || map.score2 == null || map.score1 === map.score2) continue;
    if (map.score1 > map.score2) fromRounds1 += 1;
    else fromRounds2 += 1;
  }

  if (fromRounds1 > 0 || fromRounds2 > 0) {
    return { score1: fromRounds1, score2: fromRounds2 };
  }

  const seriesTeam1Name = series.team1?.team?.name?.trim() ?? "";
  const seriesTeam2Name = series.team2?.team?.name?.trim() ?? "";
  const apiMaps = series.summary?.maps ?? [];
  if (apiMaps.length > 0) {
    let score1 = 0;
    let score2 = 0;

    for (const item of apiMaps) {
      if (item.status && item.status !== "ENDED") continue;
      const side = mapSlotWinnerToSeriesSide(item, seriesTeam1Name, seriesTeam2Name);
      if (side === 1) score1 += 1;
      else if (side === 2) score2 += 1;
    }

    if (score1 > 0 || score2 > 0) {
      return { score1, score2 };
    }
  }

  return { score1: null, score2: null };
}

function mapSideScoreByTeamName(side, seriesTeam1Name, seriesTeam2Name) {
  const name = side?.team?.name?.trim() ?? "";
  const score = side?.score ?? null;
  if (!name || score == null) return null;

  if (teamNamesMatch(name, seriesTeam1Name)) {
    return { side: 1, score };
  }
  if (teamNamesMatch(name, seriesTeam2Name)) {
    return { side: 2, score };
  }
  return null;
}

/** На карте team1/team2 — не серия, а стороны; счёт привязываем к series.team1/team2 по имени. */
function resolveMapScoresForSeries(item, seriesTeam1Name, seriesTeam2Name) {
  let score1 = null;
  let score2 = null;

  for (const side of [item.team1, item.team2]) {
    const mapped = mapSideScoreByTeamName(side, seriesTeam1Name, seriesTeam2Name);
    if (!mapped) continue;
    if (mapped.side === 1) score1 = mapped.score;
    else score2 = mapped.score;
  }

  if (score1 == null && score2 == null) {
    return {
      score1: item.team1?.score ?? null,
      score2: item.team2?.score ?? null,
    };
  }

  if (score1 == null || score2 == null) {
    return {
      score1: item.team1?.score ?? null,
      score2: item.team2?.score ?? null,
    };
  }

  return { score1, score2 };
}

function buildMaps(series, format) {
  const slotCount = MAP_SLOTS[format] ?? 3;
  const apiMaps = series.summary?.maps ?? [];
  const seriesTeam1Name = series.team1?.team?.name?.trim() ?? "";
  const seriesTeam2Name = series.team2?.team?.name?.trim() ?? "";
  const maps = [];

  for (let index = 0; index < slotCount; index += 1) {
    const item = apiMaps[index];
    if (!item) {
      maps.push({ name: "", score1: null, score2: null });
      continue;
    }

    const { score1, score2 } = resolveMapScoresForSeries(
      item,
      seriesTeam1Name,
      seriesTeam2Name,
    );
    const isLive = item.status === "LIVE";
    const isEnded = item.status === "ENDED";
    const hasScore = score1 != null && score2 != null;
    const isScorelessEnd = isEnded && hasScore && score1 === score2;

    maps.push({
      name: item.map?.name?.trim() ?? "",
      score1: isScorelessEnd ? null : hasScore || isLive ? score1 : null,
      score2: isScorelessEnd ? null : hasScore || isLive ? score2 : null,
    });
  }

  return maps;
}

export function mapSeriesToDto(series, fallback = {}) {
  if (!series) return fallback;

  const format = normalizeFormat(series.type);
  const scheduled = series.scheduledAt
    ? parseSportsRuSchedule(series.scheduledAt)
    : applySportsRuLocalTime(fallback.date, fallback.time);
  const date = scheduled.date || fallback.date || "";
  const time = scheduled.time || fallback.time || "14:00";
  const tournament = splitTournament(series.league);
  const slug = series.hru ?? fallback.sportsRuId ?? series.id;
  const sportsRuUrl =
    fallback.sportsRuUrl ?? `https://cyber.sports.ru/cs/match/${slug}/`;
  const maps = buildMaps(series, format);
  const { score1, score2 } = buildSeriesScore(series, maps);

  const canonicalFallback = applyCanonicalTeamNames(fallback);
  const canonical = applyCanonicalTeamNames({
    sportsRuId: slug,
    sportsRuSeriesId: series.id,
    sportsRuUrl,
    date,
    time,
    format,
    organization1: series.team1?.team?.name?.trim() || fallback.organization1 || "",
    organization2: series.team2?.team?.name?.trim() || fallback.organization2 || "",
    eventOrganization: tournament.eventOrganization || fallback.eventOrganization || "",
    eventName: tournament.eventName || fallback.eventName || fallback.tournament || "",
    maps,
    status: mapStatus(series.status),
    tournament: tournament.tournament || fallback.tournament || "",
    score1: score1 ?? fallback.score1 ?? null,
    score2: score2 ?? fallback.score2 ?? null,
  });

  return alignTeamsToReference(canonical, canonicalFallback);
}
