import type { MatchCreateInput } from "@/entities/match";
import { attachTeamIds } from "@/entities/team";
import { resolveCanonicalTeamName } from "@/shared/lib/teams/teamNames";

export function prepareMatchPayload<T extends MatchCreateInput>(data: T): T & {
  team1Id: string;
  team2Id: string;
} {
  return attachTeamIds({
    ...data,
    organization1: resolveCanonicalTeamName(data.organization1),
    organization2: resolveCanonicalTeamName(data.organization2),
  });
}
