import type { Match } from "@/entities/match";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveEventStage } from "@/features/events/lib/majorStage";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeScoreValue } from "@/features/matches/lib/matchScore";
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

  return {
    ...data,
    organization1: limitInputLength((data.organization1 ?? "").trim()),
    organization2: limitInputLength((data.organization2 ?? "").trim()),
    eventOrganization: limitInputLength((data.eventOrganization ?? "").trim()),
    eventName: limitInputLength(eventName.trim()),
    majorStage: majorStage ? limitInputLength(majorStage) : null,
    score1: normalizeScoreValue(data.score1),
    score2: normalizeScoreValue(data.score2),
    status: getMatchEffectiveStatus(data),
  };
}
