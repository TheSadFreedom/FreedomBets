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
import { attachTeamIds, resolveBetTeamId } from "@/entities/team";
import { clampBetAmount, limitInputLength } from "@/shared/lib/limits";
import { resolveCanonicalTeamName } from "@/shared/lib/teams/teamNames";
import { parseLegacyEvent } from "@/features/events/lib/eventDisplay";
import { resolveEventTier } from "@/features/events/lib/eventTier";
import { parseMajorFromEventName, resolveEventStage } from "@/features/events/lib/majorStage";

export type BetFromApi = Omit<Bet, "id"> & {
  id: string | number;
  event?: string;
  /** Устаревшее поле API — тир берётся из турнира */
  eventTier?: unknown;
};

export function normalizeBet(data: BetFromApi, previous?: Bet): Bet {
  const merged = previous ? { ...previous, ...data, id: previous.id } : data;
  let eventOrganization = merged.eventOrganization ?? "";
  let eventName = merged.eventName ?? "";

  if (!eventOrganization && !eventName && merged.event) {
    const parsed = parseLegacyEvent(merged.event);
    eventOrganization = parsed.eventOrganization;
    eventName = parsed.eventName;
  }

  const format: MatchFormat = MATCH_FORMATS.includes(merged.format as MatchFormat)
    ? (merged.format as MatchFormat)
    : "BO3";

  const tierForStage = resolveEventTier(merged.eventTier, eventOrganization, eventName);
  if (tierForStage === "Major") {
    const parsed = parseMajorFromEventName(eventName);
    if (!merged.majorStage && parsed.stage) {
      eventName = parsed.baseName;
    }
  }
  const majorStage = resolveEventStage(merged.majorStage, tierForStage, eventName);

  const betType = merged.betType ?? "";
  const betMarket = isBetMarket(merged.betMarket)
    ? merged.betMarket
    : inferMarketFromLegacy(betType);
  const betTeam = isBetTeamSide(merged.betTeam) ? merged.betTeam : inferTeamFromLegacy(betType);

  const draft: Bet = {
    id: String(merged.id),
    matchId:
      merged.matchId != null && String(merged.matchId).trim() !== ""
        ? String(merged.matchId).trim()
        : null,
    profileId: Number(merged.profileId),
    date: merged.date,
    time: merged.time,
    format,
    organization1: limitInputLength(resolveCanonicalTeamName(merged.organization1 ?? "")),
    organization2: limitInputLength(resolveCanonicalTeamName(merged.organization2 ?? "")),
    betMarket,
    betTeam,
    mapNumber:
      merged.mapNumber ??
      (betMarket === "map" || betMarket === "pistol" ? 1 : null),
    pistolRound: merged.pistolRound ?? (betMarket === "pistol" ? 1 : null),
    yesNo:
      merged.yesNo ??
      (betMarket === "atLeastOneMap" ? inferYesNoFromLegacy(betType) : null),
    exactScore1:
      merged.exactScore1 ??
      (betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score1 : null),
    exactScore2:
      merged.exactScore2 ??
      (betMarket === "exactScore" ? inferExactScoreFromLegacy(betType).score2 : null),
    betType,
    amount: clampBetAmount(merged.amount),
    odds: merged.odds,
    eventOrganization: limitInputLength(eventOrganization),
    eventName: limitInputLength(eventName),
    majorStage: majorStage ? limitInputLength(majorStage) : null,
    status: normalizeBetStatus(String(merged.status ?? "WAIT")),
  };

  const targets = normalizeBetTargets(draft);
  const withTargets = { ...draft, ...targets };
  const withTeams = attachTeamIds(withTargets);

  return {
    ...withTeams,
    betTeamId: resolveBetTeamId(withTeams),
    betType: formatBetDescription(withTargets),
  };
}
