import type { Bet, MatchFormat } from "@/entities/bet";
import {
  MATCH_FORMATS,
  normalizeBetStatus,
  formatBetDescription,
  inferMarketFromLegacy,
  inferTeamFromLegacy,
  inferYesNoFromLegacy,
  inferExactScoreFromLegacy,
  isBetMarket,
  isBetTeamSide,
  normalizeBetTargets,
} from "@/entities/bet";
import { clampBetAmount, limitInputLength } from "@/shared/lib/limits";
import { parseLegacyEvent } from "@/features/events/lib/eventDisplay";
import { resolveEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveEventStage } from "@/features/events/lib/majorStage";

export type BetFromApi = Omit<Bet, "id"> & {
  id: string | number;
  event?: string;
  /** Устаревшее поле API — тир берётся из турнира */
  eventTier?: unknown;
};

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

  const tierForStage = resolveEventTier(data.eventTier, eventOrganization, eventName);
  if (tierForStage === "Major") {
    const parsed = parseMajorFromEventName(eventName);
    if (!data.majorStage && parsed.stage) {
      eventName = parsed.baseName;
    }
  }
  const majorStage = resolveEventStage(data.majorStage, tierForStage, eventName);

  const betType = data.betType ?? "";
  const betMarket = isBetMarket(data.betMarket)
    ? data.betMarket
    : inferMarketFromLegacy(betType);
  const betTeam = isBetTeamSide(data.betTeam) ? data.betTeam : inferTeamFromLegacy(betType);

  const draft: Bet = {
    id: String(data.id),
    matchId:
      data.matchId != null && String(data.matchId).trim() !== ""
        ? String(data.matchId).trim()
        : null,
    profileId: Number(data.profileId),
    date: data.date,
    time: data.time,
    format,
    organization1: limitInputLength((data.organization1 ?? "").trim()),
    organization2: limitInputLength((data.organization2 ?? "").trim()),
    betMarket,
    betTeam,
    mapNumber:
      data.mapNumber ??
      (betMarket === "map" || betMarket === "pistol" ? 1 : null),
    pistolRound: data.pistolRound ?? (betMarket === "pistol" ? 1 : null),
    yesNo:
      data.yesNo ??
      (betMarket === "atLeastOneMap" ? inferYesNoFromLegacy(betType) : null),
    exactScore1:
      data.exactScore1 ??
      (betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score1 : null),
    exactScore2:
      data.exactScore2 ??
      (betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score2 : null),
    betType,
    amount: clampBetAmount(data.amount),
    odds: data.odds,
    eventOrganization: limitInputLength(eventOrganization),
    eventName: limitInputLength(eventName),
    majorStage: majorStage ? limitInputLength(majorStage) : null,
    status: normalizeBetStatus(String(data.status ?? "WAIT")),
  };

  const targets = normalizeBetTargets(draft);

  return {
    ...draft,
    ...targets,
    betType: formatBetDescription({ ...draft, ...targets }),
  };
}
