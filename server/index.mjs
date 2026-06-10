import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { parseArgs } from "node:util";
import { watch } from "chokidar";
import chalk from "chalk";
import JSON5 from "json5";
import { Low } from "lowdb";
import { DataFile, JSONFile } from "lowdb/node";
import multer from "multer";
import { App } from "@tinyhttp/app";
import { cors } from "@tinyhttp/cors";
import { createApp } from "json-server/lib/app.js";
import { Observer } from "json-server/lib/observer.js";
import { extensionFromMime, removePickemDirectory, savePickemImage } from "./pickemFiles.mjs";
import { syncSportsRuMatchesToDb } from "./sportsru/syncMatches.mjs";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

function help() {
  console.log(`Usage: node server/index.mjs [options] <db-file>

Options:
  -p, --port <port>  Port (default: 3001)
  -h, --host <host>  Host (default: localhost)
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

if (!existsSync(file)) {
  console.log(chalk.red(`File ${file} not found`));
  process.exit(1);
}

if (readFileSync(file, "utf-8").trim() === "") {
  writeFileSync(file, "{}");
}

const adapter =
  extname(file) === ".json5"
    ? new DataFile(file, { parse: JSON5.parse, stringify: JSON5.stringify })
    : new JSONFile(file);

const observer = new Observer(adapter);
const db = new Low(observer, {});
await db.read();

const jsonApp = createApp(db, { logger: false, static: ["public"] });
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
        ? stages.map((item, index) =>
            index === stageIndex
              ? { ...item, stage: stageName, imageUrl, result: null }
              : item
          )
        : [...stages, { stage: stageName, imageUrl, result: null }];

    const updated = { ...major, stages: nextStages };
    pickems[index] = updated;
    db.data.pickems = pickems;
    await db.write();

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload pickem image" });
  }
});

app.post("/sportsru/sync", async (req, res) => {
  try {
    const force = req.query?.refresh === "1" || req.query?.force === "1";
    const payload = await syncSportsRuMatchesToDb(db, { force });
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

app.delete("/uploads/pickems/:pickemId", async (req, res) => {
  try {
    await removePickemDirectory(req.params.pickemId ?? "");
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete pickem files" });
  }
});

app.use(jsonApp);

function logRoutes(data) {
  console.log(chalk.bold("Endpoints:"));
  console.log(
    Object.keys(data)
      .map((key) => `${chalk.gray(`http://${host}:${port}/`)}${chalk.blue(key)}`)
      .join("\n")
  );
  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("pickems/:id/stage-image"));
  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("uploads/pickems/:pickemId"));
  console.log(chalk.gray(`http://${host}:${port}/`) + chalk.blue("sportsru/sync"));
}

app.listen(port, () => {
  console.log(
    [
      chalk.bold(`FreedomBets API started on PORT :${port}`),
      chalk.gray("Press CTRL-C to stop"),
      chalk.gray(`Watching ${file}...`),
      "",
      chalk.bold("Pick'em uploads:"),
      chalk.gray(`public/uploads/pickems/`),
      "",
    ].join("\n")
  );
  logRoutes(db.data);
});

if (process.env.NODE_ENV !== "production") {
  let writing = false;
  observer.onWriteStart = () => {
    writing = true;
  };
  observer.onWriteEnd = () => {
    writing = false;
  };

  watch(file).on("change", () => {
    if (!writing) {
      db.read().catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(chalk.red(`Error parsing ${file}\n${error.message}`));
          return;
        }
        console.log(error);
      });
    }
  });
}
