import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, shell } from "electron";
import { ensureUserData } from "./firstRun.mjs";
import { startDesktopServer } from "./desktopServer.mjs";
import { waitForUrl } from "./waitForUrl.mjs";
import { getAppPaths } from "./paths.mjs";
import { setUpdateMainWindow, setupAutoUpdater } from "./autoUpdater.mjs";

const electronDir = path.dirname(fileURLToPath(import.meta.url));
const preloadPath = path.join(electronDir, "preload.mjs");

const API_PORT = 3001;
const UI_PORT = 4173;
const DEV_UI_URL = "http://127.0.0.1:5173";

/** @type {import("node:child_process").ChildProcess | null} */
let apiProcess = null;
/** @type {import("node:http").Server | null} */
let uiServer = null;

async function startApiServer(paths) {
  await ensureUserData(paths);

  const nodeBinary = process.execPath;
  const args = [paths.serverEntry, paths.dbPath, "--host", "127.0.0.1", "--port", String(API_PORT)];

  apiProcess = spawn(nodeBinary, args, {
    cwd: paths.bundledRoot,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: "production",
      FREEDOMBETS_ROOT: paths.bundledRoot,
      FREEDOMBETS_USER_PUBLIC: paths.userPublicDir,
    },
    stdio: "inherit",
  });

  apiProcess.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`API process exited with code ${code}`);
    }
  });

  await waitForUrl(`http://127.0.0.1:${API_PORT}/profiles`);
}

async function resolveUiUrl(paths) {
  if (paths.isDev) {
    return DEV_UI_URL;
  }

  uiServer = await startDesktopServer({
    distDir: paths.distDir,
    apiPort: API_PORT,
    port: UI_PORT,
  });

  const uiUrl = `http://127.0.0.1:${UI_PORT}`;
  await waitForUrl(uiUrl);
  return uiUrl;
}

function stopChildProcesses() {
  if (uiServer) {
    uiServer.close();
    uiServer = null;
  }

  if (apiProcess && !apiProcess.killed) {
    apiProcess.kill();
    apiProcess = null;
  }
}

async function createMainWindow() {
  const paths = getAppPaths();
  await startApiServer(paths);
  const uiUrl = await resolveUiUrl(paths);

  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    title: "FreedomBets",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadPath,
    },
  });

  window.once("ready-to-show", () => window.show());
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  await window.loadURL(uiUrl);
  setUpdateMainWindow(window);
  return window;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [existing] = BrowserWindow.getAllWindows();
    if (existing) {
      if (existing.isMinimized()) existing.restore();
      existing.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      setupAutoUpdater();
      await createMainWindow();
    } catch (error) {
      console.error(error);
      app.quit();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("before-quit", () => {
    stopChildProcesses();
  });

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
}
