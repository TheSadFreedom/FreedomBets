import { applySportsRuLocalTime, parseSportsRuSchedule } from "./schedule.mjs";
import { applyCanonicalTeamNames } from "./teamNames.mjs";

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

function buildSeriesScore(series, maps) {
  const apiMaps = series.summary?.maps ?? [];
  if (apiMaps.length > 0) {
    let score1 = 0;
    let score2 = 0;

    for (const item of apiMaps) {
      if (item.winner === "TEAM1") score1 += 1;
      else if (item.winner === "TEAM2") score2 += 1;
    }

    if (score1 > 0 || score2 > 0) {
      return { score1, score2 };
    }
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

  const teamScore1 = series.team1?.teamScore;
  const teamScore2 = series.team2?.teamScore;
  if (teamScore1 != null && teamScore2 != null) {
    return { score1: teamScore1, score2: teamScore2 };
  }

  return { score1: null, score2: null };
}

function buildMaps(series, format) {
  const slotCount = MAP_SLOTS[format] ?? 3;
  const apiMaps = series.summary?.maps ?? [];
  const maps = [];

  for (let index = 0; index < slotCount; index += 1) {
    const item = apiMaps[index];
    if (!item) {
      maps.push({ name: "", score1: null, score2: null });
      continue;
    }

    const score1 = item.team1?.score ?? null;
    const score2 = item.team2?.score ?? null;
    const hasScore = score1 != null && score2 != null;
    const isLive = item.status === "LIVE";

    maps.push({
      name: item.map?.name?.trim() ?? "",
      score1: hasScore || isLive ? score1 : null,
      score2: hasScore || isLive ? score2 : null,
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

  return applyCanonicalTeamNames({
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
}
