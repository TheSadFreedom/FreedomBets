import type { MatchCreateInput } from "@/entities/match";
import { sanitizeMapsForSave } from "@/features/matches/lib/matchMaps";

export function prepareMatchPayload<T extends MatchCreateInput>(data: T): T {
  return {
    ...data,
    eventId: String(data.eventId ?? "").trim(),
    team1Id: String(data.team1Id ?? "").trim(),
    team2Id: String(data.team2Id ?? "").trim(),
    date: String(data.date ?? "").trim(),
    time: String(data.time ?? "").trim(),
    maps: sanitizeMapsForSave(data.maps, data.format),
  };
}
