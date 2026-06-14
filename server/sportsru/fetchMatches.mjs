import { getCached, setCached } from "./cache.mjs";
import { fetchSportsRuSeries } from "./graphql.mjs";
import { fetchSportsRuPage } from "./fetchPage.mjs";
import { applyMatchedEvent, dedupeEvents, findMatchingEvent } from "./matchEvent.mjs";
import { getSportsRuMatchPageUrls } from "./matchDates.mjs";
import { mapSeriesToDto } from "./mapSeriesToDto.mjs";
import { parseSportsRuMatchesPage } from "./parseMatchesPage.mjs";

const CACHE_KEY = "sportsru:matches:raw";
const ENRICH_CONCURRENCY = 5;

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function stripImportedStage(match) {
  if (!match || typeof match !== "object") return match;
  const { majorStage: _ignored, ...rest } = match;
  return rest;
}

async function enrichMatch(stub) {
  try {
    const series = await fetchSportsRuSeries(stub.sportsRuSeriesId);
    return stripImportedStage(mapSeriesToDto(series, stub));
  } catch (error) {
    console.warn(`Sports.ru series ${stub.sportsRuSeriesId}:`, error.message);
    return stripImportedStage(stub);
  }
}

async function parseAllMatchStubs(dates) {
  const pages = await Promise.all(getSportsRuMatchPageUrls(dates).map((url) => fetchSportsRuPage(url)));
  const stubs = [];
  const seen = new Set();

  for (const html of pages) {
    for (const stub of parseSportsRuMatchesPage(html)) {
      if (seen.has(stub.sportsRuSeriesId)) continue;
      seen.add(stub.sportsRuSeriesId);
      stubs.push(stub);
    }
  }

  return stubs;
}

async function loadAllMatches({ force = false, dates } = {}) {
  if (!force) {
    const cached = getCached(CACHE_KEY);
    if (cached && !dates?.length) return cached;
  }

  const stubs = await parseAllMatchStubs(dates);
  const matches = await mapWithConcurrency(stubs, ENRICH_CONCURRENCY, enrichMatch);

  const payload = {
    matches,
    meta: {
      fetchedAt: new Date().toISOString(),
      source: "sportsru",
      blocked: false,
    },
  };

  setCached(CACHE_KEY, payload);
  return payload;
}

function filterByKnownEvents(matches, knownEvents) {
  return matches
    .filter((match) => findMatchingEvent(match, knownEvents))
    .map((match) => applyMatchedEvent(match, findMatchingEvent(match, knownEvents)));
}

export async function fetchSportsRuMatches({ force = false, events = [], dates } = {}) {
  const knownEvents = dedupeEvents(events);
  const fetchedAt = new Date().toISOString();

  if (knownEvents.length === 0) {
    return {
      matches: [],
      meta: {
        fetchedAt,
        source: "sportsru",
        blocked: false,
        knownEventCount: 0,
        filteredByEvents: true,
      },
    };
  }

  try {
    const { matches: allMatches, meta } = await loadAllMatches({ force, dates });

    return {
      matches: filterByKnownEvents(allMatches, knownEvents),
      meta: {
        ...meta,
        fetchedAt: meta.fetchedAt ?? fetchedAt,
        knownEventCount: knownEvents.length,
        filteredByEvents: true,
      },
    };
  } catch (error) {
    if (error?.code === "BLOCKED") {
      return {
        matches: [],
        meta: {
          fetchedAt,
          source: "sportsru",
          blocked: true,
          error: error.message,
          knownEventCount: knownEvents.length,
          filteredByEvents: true,
        },
      };
    }

    throw error;
  }
}
