import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";

const DEFAULT_RETENTION_DAYS = 5;
const DATE_KEY_RE = /^db-(\d{4}-\d{2}-\d{2})\.(json|db)$/;

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function msUntilNextLocalMidnight() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next.getTime() - Date.now();
}

export function getDailyBackupDir(dbPath) {
  return join(dirname(dbPath), "backups");
}

export function getDailyBackupPath(dbPath, dateKey = formatDateKey()) {
  const ext = dbPath.toLowerCase().endsWith(".db") ? "db" : "json";
  return join(getDailyBackupDir(dbPath), `db-${dateKey}.${ext}`);
}

export function backupDbFile(dbPath) {
  if (!dbPath) return;
  try {
    copyFileSync(dbPath, `${dbPath}.bak`);
  } catch {
    // backup is best-effort
  }
}

function pruneOldBackups(dbPath, retentionDays) {
  const dir = getDailyBackupDir(dbPath);
  if (!existsSync(dir) || retentionDays <= 0) return;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const cutoffKey = formatDateKey(cutoff);

  for (const name of readdirSync(dir)) {
    const match = DATE_KEY_RE.exec(name);
    if (match && match[1] < cutoffKey) {
      try {
        unlinkSync(join(dir, name));
      } catch {
        // best-effort cleanup
      }
    }
  }
}

/**
 * Creates one dated backup per calendar day (local time).
 * @returns {{ created: boolean, path: string | null, skipped?: boolean }}
 */
export function createDailyBackup(dbPath, { retentionDays = DEFAULT_RETENTION_DAYS } = {}) {
  if (!dbPath || !existsSync(dbPath)) {
    return { created: false, path: null };
  }

  const backupPath = getDailyBackupPath(dbPath);

  try {
    mkdirSync(getDailyBackupDir(dbPath), { recursive: true });

    if (existsSync(backupPath)) {
      return { created: false, path: backupPath, skipped: true };
    }

    copyFileSync(dbPath, backupPath);
    pruneOldBackups(dbPath, retentionDays);
    return { created: true, path: backupPath };
  } catch (error) {
    console.error("Daily DB backup failed:", error);
    return { created: false, path: null };
  }
}

/** Runs on startup and again at each local midnight while the server is alive. */
export function startDailyBackupScheduler(dbPath, options = {}) {
  const envRetention = Number.parseInt(process.env.FREEDOMBETS_BACKUP_RETENTION_DAYS ?? "", 10);
  const retentionDays = Number.isFinite(envRetention)
    ? envRetention
    : (options.retentionDays ?? DEFAULT_RETENTION_DAYS);

  const run = () => {
    const result = createDailyBackup(dbPath, { retentionDays });
    if (result.created) {
      console.log(`Daily DB backup created: ${result.path}`);
    }
    return result;
  };

  run();

  const scheduleNext = () => {
    setTimeout(() => {
      run();
      scheduleNext();
    }, msUntilNextLocalMidnight());
  };

  scheduleNext();
}
