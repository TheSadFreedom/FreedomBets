import { mergeEventTitle, normalizeStoredEvent } from "./eventTitle.mjs";

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[''`]/g, "")
    .replace(/\beu\b/g, "europe")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeOrg(value) {
  return normalizeText(value).replace(/\s+/g, "");
}

function tokenize(value) {
  const text = normalizeText(value);
  if (!text) return new Set();
  return new Set(text.split(" ").filter(Boolean));
}

function orgAcronym(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .map((token) => token[0])
    .join("");
}

function orgMatches(eventOrg, sportsOrg) {
  const expected = normalizeOrg(eventOrg);
  const actual = normalizeOrg(sportsOrg);
  if (!expected) return true;
  if (!actual) return true;
  if (actual === expected || actual.includes(expected) || expected.includes(actual)) {
    return true;
  }

  const expectedAcronym = orgAcronym(eventOrg);
  const actualAcronym = orgAcronym(sportsOrg);
  if (expectedAcronym && actualAcronym && expectedAcronym === actualAcronym) {
    return true;
  }
  if (expectedAcronym && actual === expectedAcronym) return true;
  if (actualAcronym && expected === actualAcronym) return true;

  return false;
}

function orgSourcesForMatch(match, label) {
  return [match.eventOrganization, match.tournament, label].filter((value) => String(value ?? "").trim());
}

function sportsRuLabels(match) {
  return [
    match.tournament,
    `${match.eventOrganization ?? ""} ${match.eventName ?? ""}`.trim(),
  ].filter((label) => label.trim());
}

function storedEventTitle(event) {
  return mergeEventTitle(event?.eventOrganization, event?.eventName);
}

export function dedupeEvents(events) {
  const seen = new Set();
  const result = [];

  for (const event of events ?? []) {
    const normalized = normalizeStoredEvent(event);
    if (!normalized) continue;

    const key = normalized.eventName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function findMatchingEvent(match, events) {
  const labels = sportsRuLabels(match);
  if (labels.length === 0) return null;

  const eventTokens = (event) => tokenize(storedEventTitle(event));

  for (const event of events) {
    const expectedTokens = eventTokens(event);
    if (expectedTokens.size === 0) continue;

    const matched = labels.some((label) => {
      const sources = orgSourcesForMatch(match, label);
      if (
        event.eventOrganization &&
        sources.length > 0 &&
        !sources.some((source) => orgMatches(event.eventOrganization, source))
      ) {
        return false;
      }

      const labelTokens = tokenize(label);
      for (const token of expectedTokens) {
        if (!labelTokens.has(token)) return false;
      }

      return true;
    });

    if (matched) return event;
  }

  return null;
}

export function applyMatchedEvent(match, event) {
  if (!event) return match;
  const eventName = storedEventTitle(event);
  return {
    ...match,
    eventOrganization: "",
    eventName,
  };
}
