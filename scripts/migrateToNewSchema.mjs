import { resolve } from "node:path";
import { createDatabase } from "../server/db/sqliteStore.mjs";
import { DEFAULT_TEAM_SYNONYM_GROUPS } from "../server/teams/defaultTeamSynonyms.mjs";

const dbPath = resolve(process.argv[2] ?? "freedom.db");

function normalizeKey(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function loadSynonymGroups() {
  return DEFAULT_TEAM_SYNONYM_GROUPS;
}

function buildSynonymMaps() {
  const aliasToKey = new Map();
  const keyToCanonical = new Map();
  const keyToSynonyms = new Map();

  for (const group of loadSynonymGroups()) {
    const canonical = String(group.canonical ?? "").trim();
    if (!canonical) continue;
    const key = normalizeKey(canonical);
    keyToCanonical.set(key, canonical);
    const names = [canonical, ...(Array.isArray(group.aliases) ? group.aliases : [])];
    const synonyms = [];
    for (const name of names) {
      const trimmed = String(name ?? "").trim();
      if (!trimmed) continue;
      aliasToKey.set(normalizeKey(trimmed), key);
      if (trimmed !== canonical) synonyms.push(trimmed);
    }
    keyToSynonyms.set(key, synonyms);
  }

  return { aliasToKey, keyToCanonical, keyToSynonyms };
}

function resolveTeamId(name, aliasToKey) {
  const key = aliasToKey.get(normalizeKey(name)) ?? normalizeKey(name);
  return key || "";
}

function inferEventSize(name, legacyTier) {
  if (legacyTier === "Major" || legacyTier === "Big" || legacyTier === "Small") {
    return legacyTier;
  }
  if (/major/i.test(name)) return "Major";
  if (/blast|katowice|cologne|masters|championship/i.test(name)) return "Big";
  return "Small";
}

function mergeEventTitle(org, name) {
  const organization = String(org ?? "").trim();
  const eventName = String(name ?? "").trim();
  if (!organization) return eventName;
  if (!eventName) return organization;
  if (eventName.toLowerCase().startsWith(organization.toLowerCase())) return eventName;
  return `${organization} ${eventName}`.trim();
}

function eventKey(org, name) {
  return `${String(org ?? "").trim()}\0${String(name ?? "").trim()}`;
}

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const { aliasToKey, keyToCanonical, keyToSynonyms } = buildSynonymMaps();
const vrsByKey = new Map();

const db = createDatabase(dbPath);
await db.read();
const data = db.data;

for (const row of data.rankings?.baseline?.teams ?? []) {
  const key = String(row.teamKey ?? "").trim();
  if (key) vrsByKey.set(key, Number(row.points) || 0);
}

const teamsMap = new Map();
function ensureTeam(name) {
  const id = resolveTeamId(name, aliasToKey);
  if (!id) return null;
  if (teamsMap.has(id)) return teamsMap.get(id);
  const canonical = keyToCanonical.get(id) ?? String(name).trim();
  const team = {
    id,
    name: canonical,
    synonyms: keyToSynonyms.get(id) ?? [],
    logoSlug: slugify(canonical),
    vrsPoints: vrsByKey.get(id) ?? 0,
  };
  teamsMap.set(id, team);
  return team;
}

for (const row of data.teams ?? []) {
  ensureTeam(row.name ?? row.id);
}
for (const match of data.matches ?? []) {
  ensureTeam(match.organization1);
  ensureTeam(match.organization2);
}
for (const bet of data.bets ?? []) {
  ensureTeam(bet.organization1);
  ensureTeam(bet.organization2);
}

const tournaments = [];
const tournamentIdByKey = new Map();

for (const event of data.events ?? []) {
  const name = mergeEventTitle(event.eventOrganization, event.eventName);
  const key = eventKey("", name);
  let winnerTeamId = null;
  if (event.winnerOrganization?.trim()) {
    winnerTeamId = resolveTeamId(event.winnerOrganization, aliasToKey) || null;
  }
  const tournament = {
    id: String(event.id),
    name,
    date: String(event.date ?? "").trim(),
    endDate: String(event.endDate ?? "").trim(),
    logoSlug: event.logoSlug?.trim() || null,
    size: inferEventSize(name, event.eventTier ?? event.size),
    winnerTeamId,
    prizePool: event.prizePool ?? null,
  };
  tournaments.push(tournament);
  tournamentIdByKey.set(key, tournament.id);
  tournamentIdByKey.set(name.trim().toLowerCase(), tournament.id);
}

function resolveEventId(org, name) {
  const fullName = mergeEventTitle(org, name);
  return (
    tournamentIdByKey.get(eventKey("", fullName)) ??
    tournamentIdByKey.get(fullName.trim().toLowerCase()) ??
    ""
  );
}

const matches = [];
for (const match of data.matches ?? []) {
  const team1 = ensureTeam(match.organization1);
  const team2 = ensureTeam(match.organization2);
  matches.push({
    id: String(match.id),
    eventId: resolveEventId(match.eventOrganization, match.eventName),
    team1Id: match.team1Id?.trim() || team1?.id || "",
    team2Id: match.team2Id?.trim() || team2?.id || "",
    date: match.date,
    time: match.time,
    format: match.format ?? "BO3",
    maps: Array.isArray(match.maps) ? match.maps : [],
    status: match.status ?? "scheduled",
    sportsRuSeriesId: match.sportsRuSeriesId ?? null,
    sportsRuUrl: match.sportsRuUrl ?? null,
  });
}

const matchesById = new Map(matches.map((item) => [item.id, item]));

const bets = [];
for (const bet of data.bets ?? []) {
  let matchId = bet.matchId?.trim() ?? "";
  if (!matchId) {
    const candidate = matches.find(
      (match) =>
        match.date === bet.date &&
        (match.team1Id === resolveTeamId(bet.organization1, aliasToKey) ||
          match.team2Id === resolveTeamId(bet.organization2, aliasToKey))
    );
    matchId = candidate?.id ?? "";
  }
  bets.push({
    id: String(bet.id),
    profileId: Number(bet.profileId),
    date: bet.date,
    time: bet.time,
    matchId,
    status: bet.status ?? "WAIT",
    amount: bet.amount,
    odds: bet.odds,
    betType: bet.betType ?? "",
  });
}

const medalsByProfile = new Map();
for (const medal of data.medals ?? []) {
  const profileId = Number(medal.profileId);
  if (!Number.isFinite(profileId)) continue;
  const list = medalsByProfile.get(profileId) ?? [];
  list.push({
    id: String(medal.id),
    imageUrl:
      typeof medal.imageUrl === "string" && medal.imageUrl.trim()
        ? medal.imageUrl.trim()
        : typeof medal.imageData === "string" && medal.imageData.trim()
          ? medal.imageData.trim()
          : "",
    createdAt: medal.createdAt,
  });
  medalsByProfile.set(profileId, list);
}

const profiles = (data.profiles ?? []).map((profile) => ({
  id: Number(profile.id),
  name: profile.name,
  balance: profile.balance ?? 0,
  totalDeposited: profile.totalDeposited ?? profile.balanceBase ?? 0,
  totalWithdrawn: profile.totalWithdrawn ?? 0,
  medals: medalsByProfile.get(Number(profile.id)) ?? [],
  role: profile.role,
}));

const pickems = (data.pickems ?? []).map((item) => ({
  id: String(item.id),
  profileId: Number(item.profileId),
  eventName: mergeEventTitle(item.eventOrganization, item.eventName),
  imageUrl: item.imageUrl ?? null,
}));

data.profiles = profiles;
data.teams = [...teamsMap.values()];
data.events = tournaments;
data.matches = matches;
data.bets = bets;
data.pickems = pickems;
delete data.medals;
data.rankings = { baseline: null };

await db.write();
db.close();

console.log(
  JSON.stringify(
    {
      profiles: profiles.length,
      teams: teamsMap.size,
      tournaments: tournaments.length,
      matches: matches.length,
      bets: bets.length,
      pickems: pickems.length,
      betsWithoutMatch: bets.filter((item) => !item.matchId).length,
    },
    null,
    2
  )
);
