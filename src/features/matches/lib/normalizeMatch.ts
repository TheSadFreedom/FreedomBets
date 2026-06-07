import type { Match } from "@/entities/match";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveMajorStage } from "@/features/events/lib/majorStage";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { normalizeScoreValue } from "@/features/matches/lib/matchScore";

export function normalizeMatch(data: Match): Match {
  let eventName = data.eventName ?? "";
  const eventTier = inferEventTier(data.eventOrganization ?? "", eventName);
  if (eventTier === "Major") {
    const parsed = parseMajorFromEventName(eventName);
    if (!data.majorStage && parsed.stage) {
      eventName = parsed.baseName;
    }
  }
  const majorStage = resolveMajorStage(data.majorStage, eventTier, eventName);

  return {
    ...data,
    eventName,
    majorStage,
    score1: normalizeScoreValue(data.score1),
    score2: normalizeScoreValue(data.score2),
    status: getMatchEffectiveStatus(data),
  };
}
