import type { BetTeamSide } from "@/entities/bet";
import type { Match } from "@/entities/match";
import type { BetFormSeed } from "@/features/bets/components/BetFormDialog/BetFormDialog";

export function matchToBetSeed(match: Match, team: BetTeamSide): BetFormSeed {
  return {
    matchId: match.id,
    date: match.date,
    time: match.time,
    format: match.format,
    organization1: match.organization1,
    organization2: match.organization2,
    eventOrganization: match.eventOrganization,
    eventName: match.eventName,
    majorStage: match.majorStage,
    betMarket: "match",
    betTeam: team,
    mapNumber: null,
    pistolRound: null,
  };
}
