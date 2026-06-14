import { ipcMain, shell } from "electron";
import { getAppPaths } from "./paths.mjs";

export function setupDesktopPathHandlers() {
  ipcMain.handle("desktop:get-data-paths", () => {
    const { userData, dbPath, isPackaged } = getAppPaths();
    return { userData, dbPath, isPackaged };
  });

  ipcMain.handle("desktop:open-data-folder", async () => {
    const { userData } = getAppPaths();
    await shell.openPath(userData);
  });
}
