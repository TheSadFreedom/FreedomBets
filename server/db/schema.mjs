export const COLLECTIONS = [
  "profiles",
  "bets",
  "matches",
  "events",
  "pickems",
  "teams",
];

export const EMPTY_DATA = {
  profiles: [],
  bets: [],
  matches: [],
  events: [],
  pickems: [],
  teams: [],
  rankings: { baseline: null },
};

export function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL
    );
  `);

  for (const table of COLLECTIONS) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
    `);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_bets_profile_id
    ON bets(json_extract(payload, '$.profileId'));
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pickems_profile_id
    ON pickems(json_extract(payload, '$.profileId'));
  `);
}
