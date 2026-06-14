import { existsSync } from "node:fs";

import { dirname, join } from "node:path";

import { fileURLToPath } from "node:url";

import { parseArgs } from "node:util";

import chalk from "chalk";

import multer from "multer";

import { App } from "@tinyhttp/app";

import { cors } from "@tinyhttp/cors";

import { json } from "milliparsec";

import { createApp } from "json-server/lib/app.js";

import { extensionFromMime, removePickemDirectory, savePickemImage } from "./pickemFiles.mjs";

import { recalculateMatchBetsInDb } from "./bets/recalculateMatchBets.mjs";

import { syncSportsRuMatchesToDb } from "./sportsru/syncMatches.mjs";

import { normalizeSportsRuDateInput } from "./sportsru/matchDates.mjs";

import { importValveRankingBaseline } from "./valve/importBaseline.mjs";

import { getRankingBaseline } from "./valve/rankingsStore.mjs";

import { backupDbFile, startDailyBackupScheduler } from "./lib/dbBackup.mjs";

import { createDatabase } from "./db/sqliteStore.mjs";

import { importDatabaseIntoDb } from "./db/importDatabase.mjs";

import { patchTeamInDb } from "./teams/patchTeam.mjs";

import { seedDefaultTeamsInDb } from "./teams/seedTeamsInDb.mjs";

import { dedupeTeamsInDb } from "./teams/dedupeTeamsInDb.mjs";

import { reloadTeamSynonyms } from "./sportsru/teamNames.mjs";

import { migrateTeamFieldsInDb } from "./teams/teamsStore.mjs";

import { cleanupInvalidBets, registerBetsRoutes } from "./bets/betsApi.mjs";



const upload = multer({

  storage: multer.memoryStorage(),

  limits: { fileSize: 20 * 1024 * 1024 },

});



function help() {

  console.log(`Usage: node server/index.mjs [options] <db-file>



Options:

  -p, --port <port>  Port (default: 3001)

  -h, --host <host>  Host (default: localhost)



Database:

  SQLite file: freedom.db

  Legacy db.json in the same folder is migrated once on first run.

`);

}



function args() {

  const { values, positionals } = parseArgs({

    options: {

      port: { type: "string", short: "p", default: process.env.PORT ?? "3001" },

      host: { type: "string", short: "h", default: process.env.HOST ?? "localhost" },

      help: { type: "boolean" },

    },

    allowPositionals: true,

  });



  if (values.help || positionals.length === 0) {

    help();

    process.exit();

  }



  return {

    file: positionals[0] ?? "",

    port: parseInt(values.port, 10),

    host: values.host,

  };

}



const { file, port, host } = args();



if (!file.toLowerCase().endsWith(".db")) {

  console.log(chalk.red(`Expected SQLite database path (*.db), got: ${file}`));

  process.exit(1);

}



const db = createDatabase(file, {

  jsonPath: join(dirname(file), "db.json"),

});

await db.read();



const removedInvalidBets = cleanupInvalidBets(db);

if (!Array.isArray(db.data.teams)) {

  db.data.teams = [];

}



const teamsSeeded = seedDefaultTeamsInDb(db);

reloadTeamSynonyms(db.data.teams);

const deduped = dedupeTeamsInDb(db);

const migrated = migrateTeamFieldsInDb(db);

if (
  removedInvalidBets > 0 ||
  teamsSeeded ||
  deduped.teamsChanged ||
  deduped.matchesUpdated > 0 ||
  deduped.betsUpdated > 0 ||
  migrated.matchesUpdated > 0 ||
  migrated.betsUpdated > 0
) {
  await db.write();
}



const serverDir = dirname(fileURLToPath(import.meta.url));

const appRoot = process.env.FREEDOMBETS_ROOT ?? join(serverDir, "..");

const userPublicDir = process.env.FREEDOMBETS_USER_PUBLIC;

const staticDirs = [join(appRoot, "public")];

if (userPublicDir) {

  staticDirs.push(userPublicDir);

}



const jsonApp = createApp(db, { logger: false, static: staticDirs });

const app = new App();



app

  .use((req, res, next) => {

    return cors({

      allowedHeaders: req.headers["access-control-request-headers"]

        ?.split(",")

        .map((h) => h.trim()),

    })(req, res, next);

  })

  .options("*", cors());



app.post("/pickems/:id/stage-image", upload.single("file"), async (req, res) => {
  try {
    const pickemId = req.params.id ?? "";
    const stageName = typeof req.body?.stage === "string" ? req.body.stage.trim() : "";
    const uploaded = req.file;

    if (!pickemId || !stageName) {
      res.status(400).json({ error: "Invalid pickem id or stage" });
      return;
    }

    if (!uploaded || !uploaded.mimetype.startsWith("image/")) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    const ext = extensionFromMime(uploaded.mimetype);
    if (!ext) {
      res.status(400).json({ error: "Unsupported image type" });
      return;
    }

    await db.read();
    const pickems = Array.isArray(db.data.pickems) ? db.data.pickems : [];
    const index = pickems.findIndex((item) => String(item.id) === String(pickemId));

    if (index === -1) {
      res.status(404).json({ error: "Pickem not found" });
      return;
    }

    const imageUrl = await savePickemImage(pickemId, stageName, uploaded.buffer, ext);
    const major = pickems[index];
    const stages = Array.isArray(major.stages) ? major.stages : [];
    const stageIndex = stages.findIndex(
      (item) => String(item?.stage ?? "").trim() === stageName
    );

    const nextStages =
      stageIndex >= 0
        ? stages.map((item, idx) =>
            idx === stageIndex ? { ...item, stage: stageName, imageUrl, result: null } : item
          )
        : [...stages, { stage: stageName, imageUrl, result: null }];

    const updated = { ...major, stages: nextStages, imageUrl: null };
    pickems[index] = updated;
    db.data.pickems = pickems;
    await db.write();

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload pickem stage image" });
  }
});



app.post("/bets/recalculate", async (_req, res) => {

  try {

    const payload = await recalculateMatchBetsInDb(db);

    res.status(200).json(payload);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      updated: 0,

      profilesSynced: 0,

      error: error instanceof Error ? error.message : "Failed to recalculate bets",

    });

  }

});



app.get("/rankings/baseline", async (_req, res) => {

  try {

    await db.read();

    res.status(200).json({ baseline: getRankingBaseline(db) });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      baseline: null,

      error: error instanceof Error ? error.message : "Failed to load ranking baseline",

    });

  }

});



app.post("/rankings/import-baseline", async (req, res) => {

  try {

    const force = req.query?.force === "1";

    const payload = await importValveRankingBaseline(db, { force });

    res.status(200).json(payload);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      imported: false,

      baseline: null,

      error: error instanceof Error ? error.message : "Failed to import Valve rankings",

    });

  }

});



app.post("/sportsru/sync", async (req, res) => {

  try {

    const force = req.query?.refresh === "1" || req.query?.force === "1";

    const rawDate = req.query?.date ?? req.query?.dates;

    const dates = String(rawDate ?? "")

      .split(",")

      .map((item) => normalizeSportsRuDateInput(item))

      .filter(Boolean);

    backupDbFile(file);

    const payload = await syncSportsRuMatchesToDb(db, {

      force,

      dates: dates.length > 0 ? dates : undefined,

    });

    res.status(200).json(payload);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      created: 0,

      updated: 0,

      total: 0,

      error: error instanceof Error ? error.message : "Failed to sync Sports.ru matches",

    });

  }

});



app.patch("/teams/:id", json(), async (req, res) => {

  try {

    await db.read();

    const team = patchTeamInDb(db, req.params.id, req.body);

    await db.write();

    res.status(200).json(team);

  } catch (error) {

    console.error(error);

    const message = error instanceof Error ? error.message : "Failed to update team";

    const status = message.includes("required") ? 400 : 500;

    res.status(status).json({ error: message });

  }

});



app.delete("/uploads/pickems/:pickemId", async (req, res) => {

  try {

    await removePickemDirectory(req.params.pickemId ?? "");

    res.status(204).end();

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Failed to delete pickem files" });

  }

});



app.get("/export/db", async (_req, res) => {

  try {

    await db.read();

    const now = new Date();

    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const filename = `freedombets-db-${dateKey}.json`;

    const body = `${JSON.stringify(db.data, null, 2)}\n`;



    res.setHeader("Content-Type", "application/json; charset=utf-8");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.status(200).send(body);

  } catch (error) {

    console.error(error);

    if (!res.headersSent) {

      res.status(500).json({ error: "Failed to export database" });

    }

  }

});



app.post("/import/db", json(), async (req, res) => {

  try {

    backupDbFile(file);

    await importDatabaseIntoDb(db, req.body);

    reloadTeamSynonyms(db.data.teams ?? []);

    res.status(200).json({ ok: true });

  } catch (error) {

    console.error(error);

    const message = error instanceof Error ? error.message : "Failed to import database";

    const status = message.includes("Invalid") ? 400 : 500;

    res.status(status).json({ error: message });

  }

});



registerBetsRoutes(app, db, json);



app.use(jsonApp);



function logRoutes(data) {

  console.log(chalk.bold("Endpoints:"));

  console.log(

    Object.keys(data)

      .filter((key) => Array.isArray(data[key]))

      .map((key) => `${chalk.gray(`http://${host}:${port}/`)}${chalk.blue(key)}`)

      .join("\n")

  );

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("pickems/:id/stage-image"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("uploads/pickems/:pickemId"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("sportsru/sync"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("rankings/baseline"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("rankings/import-baseline"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("export/db"));

  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("import/db"));

}



app.listen(port, () => {

  console.log(

    [

      chalk.bold(`FreedomBets API started on PORT :${port}`),

      chalk.gray("Press CTRL-C to stop"),

      chalk.gray(`SQLite database: ${file}`),

      "",

      chalk.bold("Pick'em uploads:"),

      chalk.gray(`public/uploads/pickems/`),

      "",

    ].join("\n")

  );

  logRoutes(db.data);

  startDailyBackupScheduler(file);

});



process.on("SIGINT", () => {

  db.close();

  process.exit(0);

});



process.on("SIGTERM", () => {

  db.close();

  process.exit(0);

});


