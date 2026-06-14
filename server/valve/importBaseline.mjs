import { fetchLatestValveBaseline } from "./fetchBaseline.mjs";
import { getRankingBaseline, setRankingBaseline } from "./rankingsStore.mjs";

export async function importValveRankingBaseline(db, { force = false } = {}) {
  await db.read();
  const existing = getRankingBaseline(db);

  if (existing && !force) {
    return { imported: false, baseline: existing };
  }

  const baseline = await fetchLatestValveBaseline();
  await setRankingBaseline(db, baseline);

  return {
    imported: true,
    baseline,
    teamCount: baseline.teams.length,
  };
}
