import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isDataUrl,
  savePickemImageFromDataUrl,
} from "../server/pickemFiles.mjs";
import { createDatabase } from "../server/db/sqliteStore.mjs";

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_PATH = path.join(ROOT_DIR, "freedom.db");

async function migrate() {
  const db = createDatabase(DB_PATH);
  await db.read();
  const pickems = Array.isArray(db.data.pickems) ? db.data.pickems : [];
  let migratedCount = 0;

  for (const major of pickems) {
    if (typeof major.imageUrl === "string" && major.imageUrl.trim()) {
      delete major.stages;
      continue;
    }

    const stages = Array.isArray(major.stages) ? major.stages : [];
    let imageUrl = null;

    for (const stageData of stages) {
      const legacyData = stageData?.imageData;
      const existingUrl =
        typeof stageData?.imageUrl === "string" && stageData.imageUrl.trim()
          ? stageData.imageUrl.trim()
          : null;

      if (existingUrl) {
        imageUrl = existingUrl;
        break;
      }

      if (!isDataUrl(legacyData)) continue;

      const savedUrl = await savePickemImageFromDataUrl(major.id, legacyData);
      if (!savedUrl) {
        console.warn(`Skipped ${major.id}: invalid image data`);
        continue;
      }

      imageUrl = savedUrl;
      migratedCount += 1;
      console.log(`Migrated ${major.id} -> ${savedUrl}`);
      break;
    }

    major.imageUrl = imageUrl;
    delete major.stages;
  }

  db.data.pickems = pickems;
  await db.write();
  db.close();
  console.log(`Done. Migrated ${migratedCount} image(s).`);
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
