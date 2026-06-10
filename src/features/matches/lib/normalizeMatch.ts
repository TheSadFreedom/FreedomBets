import type { Match } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeMapsForFormat } from "@/features/matches/lib/matchMaps";
import { limitInputLength } from "@/shared/lib/limits";

export function normalizeMatch(data: Match): Match {
  const maps = normalizeMapsForFormat(data.maps, data.format ?? "BO3");
  const majorStage =
    typeof data.majorStage === "string" && data.majorStage.trim()
      ? limitInputLength(data.majorStage.trim())
      : null;

  return {
    ...data,
    organization1: limitInputLength((data.organization1 ?? "").trim()),
    organization2: limitInputLength((data.organization2 ?? "").trim()),
    eventOrganization: limitInputLength((data.eventOrganization ?? "").trim()),
    eventName: limitInputLength((data.eventName ?? "").trim()),
    majorStage,
    maps,
    status: getMatchEffectiveStatus({ ...data, maps }),
  };
}
