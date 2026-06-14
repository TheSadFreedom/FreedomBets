import { useEffect, useState } from "react";
import {
  getDesktopApp,
  getDesktopBridgeState,
  type DesktopBridgeState,
  type DesktopUpdateStatus,
} from "@/shared/lib/desktop/desktopApp";

export function useDesktopUpdates() {
  const [desktopApp, setDesktopApp] = useState(getDesktopApp);
  const [bridgeState, setBridgeState] = useState<DesktopBridgeState>(getDesktopBridgeState);
  const [currentVersion, setCurrentVersion] = useState("…");
  const [status, setStatus] = useState<DesktopUpdateStatus | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const syncBridge = () => {
      setDesktopApp(getDesktopApp());
      setBridgeState(getDesktopBridgeState());
    };

    syncBridge();
    const intervalId = window.setInterval(syncBridge, 400);
    const stopId = window.setTimeout(() => window.clearInterval(intervalId), 2000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(stopId);
    };
  }, []);

  useEffect(() => {
    if (!desktopApp) return;

    void desktopApp.getVersion().then(setCurrentVersion);

    return desktopApp.onUpdateStatus((next) => {
      setStatus(next);
    });
  }, [desktopApp]);

  const checkForUpdates = async () => {
    const api = getDesktopApp();
    if (!api) return;

    setChecking(true);
    setStatus({ state: "checking" });
    try {
      const result = await api.checkForUpdates();
      if (!result.ok) {
        setStatus({
          state: "error",
          message: result.message ?? "Не удалось проверить обновления",
        });
      }
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Не удалось проверить обновления",
      });
    } finally {
      setChecking(false);
    }
  };

  const installUpdate = () => {
    void getDesktopApp()?.installUpdate();
  };

  return {
    desktopApp,
    bridgeState,
    isDesktopReady: bridgeState === "ready",
    currentVersion,
    status,
    checking,
    canInstall: status?.state === "downloaded",
    checkForUpdates,
    installUpdate,
  };
}
