import type { Bet, MatchFormat } from "@/entities/bet";
import {
  MATCH_FORMATS,
  normalizeBetStatus,
  formatBetDescription,
  inferMarketFromLegacy,
  inferTeamFromLegacy,
  isBetMarket,
  isBetTeamSide,
  normalizeBetTargets,
} from "@/entities/bet";
import { parseLegacyEvent } from "@/features/events/lib/eventDisplay";
import { resolveEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveMajorStage } from "@/features/events/lib/majorStage";

export type BetFromApi = Bet & { event?: string };

export function normalizeBet(data: BetFromApi): Bet {
  let eventOrganization = data.eventOrganization ?? "";
  let eventName = data.eventName ?? "";

  if (!eventOrganization && !eventName && data.event) {
    const parsed = parseLegacyEvent(data.event);
    eventOrganization = parsed.eventOrganization;
    eventName = parsed.eventName;
  }

  const format: MatchFormat = MATCH_FORMATS.includes(data.format as MatchFormat)
    ? (data.format as MatchFormat)
    : "BO3";

  const eventTier = resolveEventTier(data.eventTier, eventOrganization, eventName);
  if (eventTier === "Major") {
    const parsed = parseMajorFromEventName(eventName);
    if (!data.majorStage && parsed.stage) {
      eventName = parsed.baseName;
    }
  }
  const majorStage = resolveMajorStage(data.majorStage, eventTier, eventName);

  const betType = data.betType ?? "";
  const betMarket = isBetMarket(data.betMarket)
    ? data.betMarket
    : inferMarketFromLegacy(betType);
  const betTeam = isBetTeamSide(data.betTeam) ? data.betTeam : inferTeamFromLegacy(betType);

  const draft: Bet = {
    ...data,
    id: String(data.id),
    profileId: Number(data.profileId),
    eventOrganization,
    eventName,
    eventTier,
    majorStage,
    format,
    betMarket,
    betTeam,
    mapNumber: data.mapNumber ?? (betMarket !== "match" ? 1 : null),
    pistolRound:
      data.pistolRound ?? (betMarket === "pistol" ? 1 : null),
    betType,
    status: normalizeBetStatus(String(data.status ?? "WAIT")),
  };

  const targets = normalizeBetTargets(draft);

  const normalized: Bet = {
    ...draft,
    ...targets,
    betType: formatBetDescription({ ...draft, ...targets }),
  };

  return normalized;
}
