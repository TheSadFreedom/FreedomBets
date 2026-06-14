import type { Bet } from "@/entities/bet";
import { attachTeamIds, resolveBetTeamId } from "@/entities/team";
import { resolveCanonicalTeamName } from "@/shared/lib/teams/teamNames";

/** Нормализует команды и team id перед записью в API. */
export function prepareBetPayload<T extends Omit<Bet, "id">>(data: T): T & {
  team1Id: string;
  team2Id: string;
  betTeamId: string;
} {
  const withNames = {
    ...data,
    organization1: resolveCanonicalTeamName(data.organization1),
    organization2: resolveCanonicalTeamName(data.organization2),
  };
  const withTeams = attachTeamIds(withNames);

  return {
    ...withTeams,
    betTeamId: resolveBetTeamId(withTeams),
  };
}
