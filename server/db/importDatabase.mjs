import { COLLECTIONS, EMPTY_DATA } from "./schema.mjs";

export function normalizeImportedDatabase(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid database JSON");
  }

  const data = {
    ...EMPTY_DATA,
    ...payload,
    rankings:
      payload.rankings && typeof payload.rankings === "object"
        ? payload.rankings
        : { baseline: null },
  };

  for (const table of COLLECTIONS) {
    if (!Array.isArray(data[table])) {
      data[table] = [];
    }
  }

  if (!data.rankings || typeof data.rankings !== "object") {
    data.rankings = { baseline: null };
  }
  if (!("baseline" in data.rankings)) {
    data.rankings.baseline = null;
  }

  return data;
}

export async function importDatabaseIntoDb(db, payload) {
  const data = normalizeImportedDatabase(payload);
  db.data = data;
  await db.write();
  return data;
}
