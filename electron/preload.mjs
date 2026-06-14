import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApp", {
  platform: process.platform,
  isDesktop: true,
  getVersion: () => ipcRenderer.invoke("desktop:get-version"),
  checkForUpdates: () => ipcRenderer.invoke("desktop:check-updates"),
  installUpdate: () => ipcRenderer.invoke("desktop:install-update"),
  onUpdateStatus: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("desktop:update-status", listener);
    return () => ipcRenderer.removeListener("desktop:update-status", listener);
  },
});
