export type DesktopUpdateState =
  | "checking"
  | "available"
  | "downloading"
  | "downloaded"
  | "not-available"
  | "error";

export interface DesktopUpdateStatus {
  state: DesktopUpdateState;
  version?: string;
  percent?: number;
  message?: string;
}

export interface DesktopDataPaths {
  userData: string;
  dbPath: string;
  isPackaged: boolean;
}

export interface DesktopAppApi {
  platform: string;
  isDesktop: boolean;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<{ ok: boolean; message?: string }>;
  installUpdate: () => Promise<void>;
  getDataPaths: () => Promise<DesktopDataPaths>;
  openDataFolder: () => Promise<void>;
  onUpdateStatus: (callback: (status: DesktopUpdateStatus) => void) => () => void;
}

export function isElectronRuntime(): boolean {
  return typeof navigator !== "undefined" && /Electron/i.test(navigator.userAgent);
}

export function getDesktopApp(): DesktopAppApi | undefined {
  const api = window.desktopApp;
  return api?.isDesktop ? api : undefined;
}

export function isDesktopApp(): boolean {
  return Boolean(getDesktopApp());
}

export type DesktopBridgeState = "ready" | "browser" | "broken";

export function getDesktopBridgeState(): DesktopBridgeState {
  if (getDesktopApp()) return "ready";
  if (isElectronRuntime()) return "broken";
  return "browser";
}
