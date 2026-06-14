import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const releaseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "release");

for (const name of ["win-unpacked", "win-unpacked.tmp"]) {
  const target = path.join(releaseDir, name);
  if (!existsSync(target)) continue;

  try {
    rmSync(target, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  } catch (error) {
    console.error(
      `Could not remove ${target}. Close FreedomBets and any Explorer windows in release/, then retry.`,
    );
    throw error;
  }
}
