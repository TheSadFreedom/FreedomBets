import { buildTeamFromName, attachTeamIds, resolveBetTeamId } from "./resolveTeam.mjs";

function ensureTeam(teamMap, name) {
  const team = buildTeamFromName(name);
  if (!team) return null;

  const existing = teamMap.get(team.id);
  if (!existing) {
    teamMap.set(team.id, team);
    return team;
  }

  if (team.name.length > existing.name.length) {
    teamMap.set(team.id, { ...existing, name: team.name });
  }

  return teamMap.get(team.id);
}

function collectNamesFromDb(db) {
  const names = new Set();

  for (const match of db.data.matches ?? []) {
    if (match.organization1?.trim()) names.add(match.organization1.trim());
    if (match.organization2?.trim()) names.add(match.organization2.trim());
  }

  for (const bet of db.data.bets ?? []) {
    if (bet.organization1?.trim()) names.add(bet.organization1.trim());
    if (bet.organization2?.trim()) names.add(bet.organization2.trim());
  }

  for (const team of db.data.rankings?.baseline?.teams ?? []) {
    if (team.teamName?.trim()) names.add(team.teamName.trim());
  }

  return names;
}

export function buildTeamsMap(db) {
  const teamMap = new Map();

  for (const name of collectNamesFromDb(db)) {
    ensureTeam(teamMap, name);
  }

  for (const team of db.data.teams ?? []) {
    if (team?.id && team?.name) {
      teamMap.set(team.id, {
        id: team.id,
        teamKey: team.teamKey ?? team.id,
        name: team.name,
        logoSlug: team.logoSlug ?? team.id,
      });
    }
  }

  return teamMap;
}

export function syncTeamsCollection(db) {
  const teamMap = buildTeamsMap(db);
  db.data.teams = [...teamMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "ru"),
  );
  return db.data.teams.length;
}

export function attachTeamFieldsToMatch(match) {
  return attachTeamIds(match);
}

export function attachTeamFieldsToBet(bet) {
  const withTeams = attachTeamIds(bet);
  return {
    ...withTeams,
    betTeamId: resolveBetTeamId(withTeams),
  };
}

export function migrateTeamFieldsInDb(db) {
  let matchesUpdated = 0;
  let betsUpdated = 0;

  for (const match of db.data.matches ?? []) {
    const next = attachTeamFieldsToMatch(match);
    if (match.team1Id !== next.team1Id || match.team2Id !== next.team2Id) {
      match.team1Id = next.team1Id;
      match.team2Id = next.team2Id;
      matchesUpdated += 1;
    }
  }

  for (const bet of db.data.bets ?? []) {
    const next = attachTeamFieldsToBet(bet);
    if (
      bet.team1Id !== next.team1Id ||
      bet.team2Id !== next.team2Id ||
      bet.betTeamId !== next.betTeamId
    ) {
      bet.team1Id = next.team1Id;
      bet.team2Id = next.team2Id;
      bet.betTeamId = next.betTeamId;
      betsUpdated += 1;
    }
  }

  const teamsCount = syncTeamsCollection(db);

  return { teamsCount, matchesUpdated, betsUpdated };
}
