import type { Match } from "@/entities/match";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveEventStage } from "@/features/events/lib/majorStage";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeMapsForFormat } from "@/features/matches/lib/matchMaps";
import { limitInputLength } from "@/shared/lib/limits";

export function normalizeMatch(data: Match): Match {
  let eventName = data.eventName ?? "";
  const eventTier = inferEventTier(data.eventOrganization ?? "", eventName);
  if (eventTier === "Major") {
    const parsed = parseMajorFromEventName(eventName);
    if (!data.majorStage && parsed.stage) {
      eventName = parsed.baseName;
    }
  }
  const majorStage = resolveEventStage(data.majorStage, eventTier, eventName);
  const maps = normalizeMapsForFormat(data.maps, data.format ?? "BO3");

  return {
    ...data,
    organization1: limitInputLength((data.organization1 ?? "").trim()),
    organization2: limitInputLength((data.organization2 ?? "").trim()),
    eventOrganization: limitInputLength((data.eventOrganization ?? "").trim()),
    eventName: limitInputLength(eventName.trim()),
    majorStage: majorStage ? limitInputLength(majorStage) : null,
    maps,
    status: getMatchEffectiveStatus({ ...data, maps }),
  };
}
