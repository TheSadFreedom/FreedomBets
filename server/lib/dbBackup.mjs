import { copyFileSync } from "node:fs";

export function backupDbFile(dbPath) {
  if (!dbPath) return;
  try {
    copyFileSync(dbPath, `${dbPath}.bak`);
  } catch {
    // backup is best-effort
  }
}
