import { parseSnapshotDateFromFilename, parseStandingsMarkdown } from "./parseStandingsMd.mjs";
import { resolveCanonicalTeamName, getTeamMatchKey } from "../sportsru/teamNames.mjs";

const REPO = "ValveSoftware/counter-strike_regional_standings";
const USER_AGENT = "FreedomBets/1.0";

async function githubGet(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${path}`);
  }

  return response.json();
}

async function downloadText(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return response.text();
}

async function listGlobalStandingsFiles(year) {
  const contents = await githubGet(`/repos/${REPO}/contents/live/${year}`);
  if (!Array.isArray(contents)) return [];

  return contents
    .filter((item) => item.type === "file" && /^standings_global_\d{4}_\d{2}_\d{2}\.md$/.test(item.name))
    .sort((a, b) => b.name.localeCompare(a.name));
}

export async function fetchLatestValveBaseline() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];

  let latestFile = null;
  for (const year of years) {
    const files = await listGlobalStandingsFiles(year);
    if (files.length > 0) {
      latestFile = files[0];
      break;
    }
  }

  if (!latestFile?.download_url) {
    throw new Error("Valve global standings file not found");
  }

  const markdown = await downloadText(latestFile.download_url);
  const parsed = parseStandingsMarkdown(markdown);
  const snapshotDate = parseSnapshotDateFromFilename(latestFile.name);

  if (!snapshotDate || parsed.length === 0) {
    throw new Error("Failed to parse Valve standings");
  }

  const seen = new Set();
  const teams = [];

  for (const row of parsed) {
    const teamName = resolveCanonicalTeamName(row.teamName);
    const team = {
      teamKey: getTeamMatchKey(teamName),
      teamName,
      globalRank: row.globalRank,
      points: row.points,
      roster: row.roster,
    };
    const dedupeKey = `${team.globalRank}|${team.teamKey}|${team.teamName}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    teams.push(team);
  }

  return {
    snapshotDate,
    importedAt: new Date().toISOString(),
    source: "valve",
    sourceFile: latestFile.name,
    teams,
  };
}
