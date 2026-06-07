import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isDataUrl,
  savePickemImageFromDataUrl,
} from "../server/pickemFiles.mjs";

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_PATH = path.join(ROOT_DIR, "db.json");

const PICKEM_STAGES = ["Stage 1", "Stage 2", "Stage 3", "Playoff"];

async function migrate() {
  const raw = await readFile(DB_PATH, "utf-8");
  const db = JSON.parse(raw);
  const pickems = Array.isArray(db.pickems) ? db.pickems : [];
  let migratedCount = 0;

  for (const major of pickems) {
    const stages = Array.isArray(major.stages) ? major.stages : [];

    for (const stageData of stages) {
      const legacyData = stageData.imageData;
      const hasUrl = typeof stageData.imageUrl === "string" && stageData.imageUrl.trim();

      if (hasUrl) {
        delete stageData.imageData;
        continue;
      }

      if (!isDataUrl(legacyData)) {
        stageData.imageUrl = null;
        delete stageData.imageData;
        continue;
      }

      const imageUrl = await savePickemImageFromDataUrl(
        major.id,
        stageData.stage,
        legacyData
      );

      if (!imageUrl) {
        console.warn(`Skipped ${major.id} / ${stageData.stage}: invalid image data`);
        continue;
      }

      stageData.imageUrl = imageUrl;
      delete stageData.imageData;
      migratedCount += 1;
      console.log(`Migrated ${major.id} / ${stageData.stage} -> ${imageUrl}`);
    }

    major.stages = PICKEM_STAGES.map((stageName) => {
      const current = stages.find((item) => item?.stage === stageName);
      return (
        current ?? {
          stage: stageName,
          imageUrl: null,
          result: null,
        }
      );
    });
  }

  db.pickems = pickems;
  await writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf-8");
  console.log(`Done. Migrated ${migratedCount} image(s).`);
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
