import { fetchLatestValveBaseline } from "./fetchBaseline.mjs";
import { getTeamMatchKey } from "../sportsru/teamNames.mjs";
import { getRankingBaseline, setRankingBaseline } from "./rankingsStore.mjs";

function parseRankingPoints(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim().replace(/\s/g, "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
export async function importValveRankingBaseline(db, { force = false } = {}) {
  await db.read();
  const existing = getRankingBaseline(db);

  if (existing && !force) {
    return { imported: false, baseline: existing };
  }

  const baseline = await fetchLatestValveBaseline();
  await setRankingBaseline(db, baseline);

  const pointsByKey = new Map(
    (baseline.teams ?? []).map((team) => [
      String(team.teamKey ?? "").trim(),
      parseRankingPoints(team.points),
    ])
  );
  if (Array.isArray(db.data.teams)) {
    db.data.teams = db.data.teams.map((team) => {
      const key =
        getTeamMatchKey(team.name) ||
        String(team.teamKey ?? team.id ?? "").trim();
      const vrsPoints = pointsByKey.get(key);
      return {
        ...team,
        vrsPoints: Number.isFinite(vrsPoints) ? vrsPoints : team.vrsPoints ?? null,
      };
    });    await db.write();
  }

  return {
    imported: true,
    baseline,
    teamCount: baseline.teams.length,
  };
}
