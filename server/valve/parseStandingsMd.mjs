/**
 * Парсит standings_global_*.md из репозитория Valve.
 */
export function parseSnapshotDateFromFilename(filename) {
  const match = String(filename).match(/standings_global_(\d{4})_(\d{2})_(\d{2})\.md$/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function parseStandingsMarkdown(content) {
  const teams = [];

  for (const line of String(content).split("\n")) {
    const row = line.match(/^\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (!row) continue;

    const globalRank = Number(row[1]);
    const points = Number(row[2]);
    const teamName = row[3].trim();
    const roster = row[4].trim();

    if (!teamName || !Number.isFinite(globalRank) || !Number.isFinite(points)) continue;

    teams.push({ globalRank, points, teamName, roster });
  }

  return teams;
}
