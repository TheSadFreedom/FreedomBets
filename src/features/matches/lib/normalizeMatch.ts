import type { Match } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeMapsForFormat } from "@/features/matches/lib/matchMaps";

export function normalizeMatch(data: Match): Match {
  const format = data.format ?? "BO3";
  const maps = normalizeMapsForFormat(data.maps, format);

  return {
    id: String(data.id),
    eventId: String(data.eventId ?? "").trim(),
    team1Id: String(data.team1Id ?? "").trim(),
    team2Id: String(data.team2Id ?? "").trim(),
    date: String(data.date ?? "").trim(),
    time: String(data.time ?? "").trim(),
    format,
    maps,
    status: getMatchEffectiveStatus({ ...data, maps, format }),
    sportsRuSeriesId: data.sportsRuSeriesId ?? null,
    sportsRuUrl: data.sportsRuUrl ?? null,
    organization1: data.organization1,
    organization2: data.organization2,
    eventName: data.eventName,
    eventOrganization: data.eventOrganization,
  };
}
