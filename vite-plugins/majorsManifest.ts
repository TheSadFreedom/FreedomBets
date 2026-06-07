import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { generateMajorsManifest } from "../scripts/generateMajorsManifest";

export function majorsManifestPlugin(): Plugin {
  const rootDir = process.cwd();
  const majorsDir = path.join(rootDir, "public/majors");

  const run = () => {
    try {
      generateMajorsManifest(rootDir);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "EBUSY" || code === "EPERM") return;
      throw error;
    }
  };

  return {
    name: "majors-manifest",
    buildStart: run,
    configureServer() {
      run();
      if (!fs.existsSync(majorsDir)) return;

      let timer: ReturnType<typeof setTimeout> | undefined;
      fs.watch(majorsDir, () => {
        clearTimeout(timer);
        timer = setTimeout(run, 200);
      });
    },
  };
}
