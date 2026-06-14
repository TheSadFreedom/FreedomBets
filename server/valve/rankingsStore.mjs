export function ensureRankingsState(db) {
  if (!db.data.rankings || typeof db.data.rankings !== "object") {
    db.data.rankings = { baseline: null };
  }
  if (!("baseline" in db.data.rankings)) {
    db.data.rankings.baseline = null;
  }
  return db.data.rankings;
}

export function getRankingBaseline(db) {
  return ensureRankingsState(db).baseline;
}

export async function setRankingBaseline(db, baseline) {
  const rankings = ensureRankingsState(db);
  rankings.baseline = baseline;
  await db.write();
  return baseline;
}
