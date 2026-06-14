import { app, BrowserWindow, dialog, ipcMain } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

/** @type {BrowserWindow | null} */
let mainWindow = null;

export function setUpdateMainWindow(window) {
  mainWindow = window;
}

function sendStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("desktop:update-status", payload);
  }
}

async function promptInstall(version) {
  const { response } = await dialog.showMessageBox(mainWindow ?? undefined, {
    type: "info",
    title: "Обновление FreedomBets",
    message: `Доступна версия ${version}. Перезапустить и установить?`,
    buttons: ["Перезапустить", "Позже"],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) {
    autoUpdater.quitAndInstall(false, true);
  }
}

let ipcRegistered = false;

function registerDesktopIpc() {
  if (ipcRegistered) return;
  ipcRegistered = true;

  ipcMain.handle("desktop:get-version", () => app.getVersion());

  ipcMain.handle("desktop:check-updates", async () => {
    if (!app.isPackaged) {
      return {
        ok: false,
        message: "Автообновление работает в установленной версии приложения",
      };
    }

    try {
      await autoUpdater.checkForUpdates();
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось проверить обновления";
      sendStatus({ state: "error", message });
      return { ok: false, message };
    }
  });

  ipcMain.handle("desktop:install-update", () => {
    if (!app.isPackaged) return;
    autoUpdater.quitAndInstall(false, true);
  });
}

export function setupAutoUpdater() {
  registerDesktopIpc();

  if (!app.isPackaged) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    sendStatus({ state: "checking" });
  });

  autoUpdater.on("update-available", (info) => {
    sendStatus({ state: "available", version: info.version });
  });

  autoUpdater.on("update-not-available", (info) => {
    sendStatus({ state: "not-available", version: info.version });
  });

  autoUpdater.on("download-progress", (progress) => {
    sendStatus({
      state: "downloading",
      version: progress.version,
      percent: progress.percent,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    sendStatus({ state: "downloaded", version: info.version });
    void promptInstall(info.version);
  });

  autoUpdater.on("error", (error) => {
    const message = error instanceof Error ? error.message : String(error);
    sendStatus({ state: "error", message });
    console.error("Auto-update error:", message);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
      console.error(error);
    });
  }, 8000);
}
