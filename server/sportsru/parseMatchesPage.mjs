import * as cheerio from "cheerio";
import { applySportsRuLocalTime } from "./schedule.mjs";
import { applyCanonicalTeamNames } from "./teamNames.mjs";

function decodeText(value) {
  return cheerio.load(`<div>${value ?? ""}</div>`)("div").text().trim();
}

function parseInfo(infoText, className) {
  const info = infoText.trim();
  if (className.includes("match-teaser--live") || /Идёт/i.test(info)) {
    return { status: "live", time: extractTime(info) };
  }
  if (/Завершен/i.test(info)) {
    return { status: "finished", time: extractTime(info) };
  }
  return { status: "scheduled", time: extractTime(info) };
}

function extractTime(info) {
  const match = info.match(/(\d{2}:\d{2})/);
  return match ? match[1] : "12:00";
}

function parseScore(raw) {
  const text = raw.trim();
  if (!text || text === "–" || text === "-") {
    return { score1: null, score2: null };
  }
  const match = text.match(/(\d+)\s*[\u2013\-–]\s*(\d+)/);
  if (!match) {
    return { score1: null, score2: null };
  }
  return { score1: Number(match[1]), score2: Number(match[2]) };
}

function parseDateFromUrl(url) {
  const match = url.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function resolveTournamentName($, listElement) {
  let node = $(listElement).prev();
  for (let depth = 0; depth < 4 && node.length; depth += 1) {
    const text = node.text().replace(/\s+/g, " ").trim();
    if (text && text.length < 120 && !/матч|LIVE|реклама/i.test(text)) {
      return text;
    }
    node = node.prev();
  }
  return "";
}

function extractSeriesId(root) {
  const analytics = root.find("[data-analytics-value^='match_']").first().attr("data-analytics-value");
  if (!analytics) return null;
  return analytics.replace(/^match_/, "");
}

function normalizeMatchUrl(href) {
  if (!href) return "";
  const absolute = href.startsWith("http")
    ? href
    : `https://cyber.sports.ru${href.startsWith("/") ? href : `/${href}`}`;
  return absolute.replace(/\/stat\/?$/, "/").replace(/\/?$/, "/");
}

function parseMatchTeaser($, element, tournamentName) {
  const root = $(element);
  const href = root.find("a.match-teaser__link").attr("href") ?? "";
  if (!href) return null;

  const sportsRuUrl = normalizeMatchUrl(href);
  const slugMatch = sportsRuUrl.match(/\/cs\/match\/([^/]+)/);
  const slug = slugMatch ? slugMatch[1] : sportsRuUrl;
  const seriesId = extractSeriesId(root);
  const infoText = root.find(".match-teaser__info").text().replace(/\s+/g, " ").trim();
  const { status, time } = parseInfo(infoText, root.attr("class") ?? "");
  const teamNames = root
    .find(".match-teaser__team-name")
    .map((_, node) => decodeText($(node).html()))
    .get()
    .filter(Boolean);

  if (teamNames.length < 2 || !seriesId) return null;

  const scoreText = root.find(".match-teaser__team-score").first().text().trim();
  const { score1, score2 } = parseScore(scoreText);
  const date = parseDateFromUrl(sportsRuUrl) ?? "";
  const localSchedule = applySportsRuLocalTime(date, time);

  return applyCanonicalTeamNames({
    sportsRuId: slug,
    sportsRuSeriesId: seriesId,
    sportsRuUrl,
    date: localSchedule.date !== "1970-01-01" ? localSchedule.date : date,
    time: localSchedule.time,
    format: "BO3",
    organization1: teamNames[0],
    organization2: teamNames[1],
    eventOrganization: "",
    eventName: tournamentName.trim(),
    maps: [],
    status,
    tournament: tournamentName.trim(),
    score1,
    score2,
  });
}

export function parseSportsRuMatchesPage(html) {
  const $ = cheerio.load(html);
  const matches = [];
  const seen = new Set();

  $(".delimited-match-list").each((_, listElement) => {
    const tournamentName = resolveTournamentName($, listElement);
    $(listElement)
      .find(".match-teaser")
      .each((__, teaser) => {
        const parsed = parseMatchTeaser($, teaser, tournamentName);
        if (!parsed || seen.has(parsed.sportsRuSeriesId)) return;
        seen.add(parsed.sportsRuSeriesId);
        matches.push(parsed);
      });
  });

  if (matches.length === 0) {
    $(".match-teaser").each((_, teaser) => {
      const parsed = parseMatchTeaser($, teaser, "");
      if (!parsed || seen.has(parsed.sportsRuSeriesId)) return;
      seen.add(parsed.sportsRuSeriesId);
      matches.push(parsed);
    });
  }

  return matches;
}
