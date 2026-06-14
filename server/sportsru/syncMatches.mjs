import { randomBytes } from "node:crypto";
import { fetchSportsRuMatches } from "./fetchMatches.mjs";
import { recalculateMatchBetsInDb } from "../bets/recalculateMatchBets.mjs";
import {
  alignTeamsToReference,
  applyCanonicalTeamNames,
  reloadTeamSynonyms,
  teamsMatch,
} from "./teamNames.mjs";
import {
  attachTeamFieldsToMatch,
  migrateTeamFieldsInDb,
} from "../teams/teamsStore.mjs";
import { dedupeTeamsInDb } from "../teams/dedupeTeamsInDb.mjs";

const TRACKED_FIELDS = [
  "date",
  "time",
  "format",
  "organization1",
  "organization2",
  "eventOrganization",
  "eventName",
  "maps",
  "status",
  "score1",
  "score2",
  "sportsRuSeriesId",
  "sportsRuUrl",
];

const MANUAL_PRESERVE_FIELDS = ["date", "time", "majorStage"];

function generateMatchId(existingIds) {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const id = randomBytes(2).toString("hex");
    if (!existingIds.has(id)) return id;
  }
  return randomBytes(4).toString("hex");
}

function eventMatches(left, right) {
  return (
    String(left.eventOrganization ?? "").trim() === String(right.eventOrganization ?? "").trim() &&
    String(left.eventName ?? "").trim() === String(right.eventName ?? "").trim()
  );
}

function isSameMatchIdentity(left, right) {
  const normalizedLeft = applyCanonicalTeamNames(left);
  const normalizedRight = applyCanonicalTeamNames(right);
  return (
    normalizedLeft.date === normalizedRight.date &&
    eventMatches(normalizedLeft, normalizedRight) &&
    teamsMatch(normalizedLeft, normalizedRight)
  );
}

function dtoToRecord(dto) {
  return attachTeamFieldsToMatch(
    applyCanonicalTeamNames({
      date: dto.date,
      time: dto.time,
      format: dto.format,
      organization1: dto.organization1,
      organization2: dto.organization2,
      eventOrganization: dto.eventOrganization,
      eventName: dto.eventName,
      maps: dto.maps ?? [],
      status: dto.status,
      score1: dto.score1 ?? null,
      score2: dto.score2 ?? null,
      sportsRuSeriesId: dto.sportsRuSeriesId,
      sportsRuUrl: dto.sportsRuUrl,
    }),
  );
}

function preserveManualFields(next, manual) {
  for (const field of MANUAL_PRESERVE_FIELDS) {
    if (manual[field] != null && manual[field] !== "") {
      next[field] = manual[field];
    }
  }
  return next;
}

function matchPreferenceScore(match, bets) {
  let score = 0;
  if (matchHasBets(bets, match.id)) score += 4;
  if (!match.sportsRuSeriesId) score += 2;
  return score;
}

function findExistingMatch(matches, dto, bets) {
  const record = dtoToRecord(dto);
  const identityMatches = matches.filter((match) => isSameMatchIdentity(match, record));

  if (identityMatches.length > 0) {
    return identityMatches.sort(
      (left, right) => matchPreferenceScore(right, bets) - matchPreferenceScore(left, bets),
    )[0];
  }

  return matches.find((match) => match.sportsRuSeriesId === dto.sportsRuSeriesId) ?? null;
}

function hasMatchChanges(previous, next) {
  return TRACKED_FIELDS.some((field) => {
    const left = previous[field] ?? null;
    const right = next[field] ?? null;
    return JSON.stringify(left) !== JSON.stringify(right);
  });
}

function matchHasBets(bets, matchId) {
  return bets.some((bet) => bet.matchId === matchId);
}

function removeDuplicateMatches(existing, keeper, bets) {
  let removed = 0;
  const next = existing.filter((match) => {
    if (match.id === keeper.id) return true;
    if (!isSameMatchIdentity(match, keeper)) return true;
    if (matchHasBets(bets, match.id)) return true;
    removed += 1;
    return false;
  });

  return { matches: next, removed };
}

export async function syncSportsRuMatchesToDb(db, { force = false, dates } = {}) {
  await db.read();
  reloadTeamSynonyms(db.data.teams ?? []);

  const events = Array.isArray(db.data.events) ? db.data.events : [];
  const { matches: parsed, meta } = await fetchSportsRuMatches({ force, events, dates });

  // Парсинг Sports.ru занимает время — перечитываем базу, чтобы не затереть ставки,
  // добавленные пользователем во время синхронизации.
  await db.read();
  reloadTeamSynonyms(db.data.teams ?? []);
  const bets = Array.isArray(db.data.bets) ? db.data.bets : [];
  let existing = Array.isArray(db.data.matches) ? [...db.data.matches] : [];
  const existingIds = new Set(existing.map((match) => match.id));

  let created = 0;
  let updated = 0;
  let removed = 0;

  for (const dto of parsed) {
    const record = dtoToRecord(dto);
    const found = findExistingMatch(existing, dto, bets);

    if (found) {
      const canonicalFound = applyCanonicalTeamNames(found);
      const aligned = alignTeamsToReference(record, canonicalFound);
      const withTeams = attachTeamFieldsToMatch({
        ...aligned,
        organization1: aligned.organization1 || canonicalFound.organization1,
        organization2: aligned.organization2 || canonicalFound.organization2,
      });
      let next = {
        ...found,
        ...withTeams,
        id: found.id,
      };
      next.majorStage = found.majorStage ?? null;
      if (!found.sportsRuSeriesId) {
        next = preserveManualFields(next, found);
      }

      if (hasMatchChanges(found, next)) {
        const index = existing.findIndex((match) => match.id === found.id);
        existing[index] = next;
        updated += 1;
      }

      const deduped = removeDuplicateMatches(existing, next, bets);
      existing = deduped.matches;
      removed += deduped.removed;

      continue;
    }

    const id = generateMatchId(existingIds);
    existingIds.add(id);
    existing.push({ id, majorStage: null, ...record });
    created += 1;
  }

  db.data.matches = existing;
  migrateTeamFieldsInDb(db);
  dedupeTeamsInDb(db);
  await db.write();

  const recalculated =
    updated > 0 || created > 0
      ? await recalculateMatchBetsInDb(db)
      : { updated: 0, profilesSynced: 0, changes: [] };

  return {
    created,
    updated,
    removed,
    total: parsed.length,
    betsRecalculated: recalculated.updated,
    meta: {
      ...meta,
      syncedAt: new Date().toISOString(),
    },
  };
}
