export type { Team, TeamEditInput } from "./types";
export type { TeamSides } from "./resolveTeam";
export {
  attachTeamIds,
  betTeamOnMatchSide,
  buildTeamFromName,
  inferBetTeamFromDescription,
  resolveBetTeamId,
  resolveTeamIdFromName,
  teamIdsMatch,
  teamPairsMatch,
  teamsSameOrder,
} from "./resolveTeam";
