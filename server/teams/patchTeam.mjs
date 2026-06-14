import { reloadTeamSynonyms } from "../sportsru/teamNames.mjs";
import { assetLogoSlug } from "./resolveTeam.mjs";
import { dedupeTeamsInDb } from "./dedupeTeamsInDb.mjs";

function normalizeSynonyms(value) {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(value.map((item) => String(item ?? "").trim()).filter(Boolean)),
  ];
}

export function patchTeamInDb(db, teamId, payload) {
  const id = String(teamId ?? "").trim();
  const name = String(payload?.name ?? "").trim();
  const synonyms = normalizeSynonyms(payload?.synonyms);

  if (!id) {
    throw new Error("Team id is required");
  }

  if (!name) {
    throw new Error("Team name is required");
  }

  if (!Array.isArray(db.data.teams)) {
    db.data.teams = [];
  }

  let team = db.data.teams.find((item) => String(item?.id ?? "").trim() === id);

  if (!team) {
    team = {
      id,
      name,
      synonyms,
      logoSlug: assetLogoSlug(name),
      vrsPoints: 0,
    };
    db.data.teams.push(team);
  } else {
    team.name = name;
    team.synonyms = synonyms;
    team.logoSlug = team.logoSlug?.trim() || assetLogoSlug(name);
  }

  reloadTeamSynonyms(db.data.teams);
  dedupeTeamsInDb(db);

  const saved =
    db.data.teams.find((item) => String(item?.id ?? "").trim() === id) ??
    db.data.teams.find((item) => String(item?.name ?? "").trim() === name);

  return saved ?? team;
}
