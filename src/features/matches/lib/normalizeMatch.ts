import type { Match } from "@/entities/match";
import { attachTeamIds } from "@/entities/team";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeMapsForFormat } from "@/features/matches/lib/matchMaps";
import { limitInputLength } from "@/shared/lib/limits";
import { resolveCanonicalTeamName } from "@/shared/lib/teams/teamNames";

export function normalizeMatch(data: Match): Match {
  const maps = normalizeMapsForFormat(data.maps, data.format ?? "BO3");
  const majorStage =
    typeof data.majorStage === "string" && data.majorStage.trim()
      ? limitInputLength(data.majorStage.trim())
      : null;

  const withNames = {
    ...data,
    organization1: limitInputLength(resolveCanonicalTeamName(data.organization1 ?? "")),
    organization2: limitInputLength(resolveCanonicalTeamName(data.organization2 ?? "")),
    eventOrganization: limitInputLength((data.eventOrganization ?? "").trim()),
    eventName: limitInputLength((data.eventName ?? "").trim()),
    majorStage,
    maps,
    status: getMatchEffectiveStatus({ ...data, maps }),
  };

  return attachTeamIds(withNames);
}
