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

export interface DesktopAppApi {
  platform: string;
  isDesktop: boolean;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<{ ok: boolean; message?: string }>;
  installUpdate: () => Promise<void>;
  onUpdateStatus: (callback: (status: DesktopUpdateStatus) => void) => () => void;
}

export function getDesktopApp(): DesktopAppApi | undefined {
  return window.desktopApp;
}

export function isDesktopApp(): boolean {
  return Boolean(window.desktopApp?.isDesktop);
}
