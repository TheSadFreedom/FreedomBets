import { useEffect, useState } from "react";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import {
  getDesktopApp,
  type DesktopUpdateStatus,
} from "@/shared/lib/desktop/desktopApp";
import {
  ActionTile,
  ActionTileHint,
  ActionTileIcon,
  ActionTileLabel,
  ActionTileWide,
  ActionTileWideText,
  SectionCard,
  SectionHead,
  SectionHeadText,
  SectionHint,
  SectionIcon,
  SectionTitle,
} from "./ProfileSettingsDialog.styled";

function formatStatus(status: DesktopUpdateStatus | null, currentVersion: string): string {
  if (!status) {
    return `Текущая версия ${currentVersion}`;
  }

  switch (status.state) {
    case "checking":
      return "Проверка обновлений…";
    case "available":
      return `Доступна версия ${status.version ?? "новее"}`;
    case "downloading":
      return `Загрузка ${Math.round(status.percent ?? 0)}%`;
    case "downloaded":
      return `Версия ${status.version ?? ""} готова к установке`;
    case "not-available":
      return "Установлена последняя версия";
    case "error":
      return status.message ?? "Ошибка проверки обновлений";
    default:
      return `Текущая версия ${currentVersion}`;
  }
}

const DesktopUpdateSection = () => {
  const desktopApp = getDesktopApp();
  const [currentVersion, setCurrentVersion] = useState("…");
  const [status, setStatus] = useState<DesktopUpdateStatus | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!desktopApp) return;

    void desktopApp.getVersion().then(setCurrentVersion);

    return desktopApp.onUpdateStatus((next) => {
      setStatus(next);
      if (next.state === "checking") {
        setChecking(true);
      } else if (
        next.state === "not-available" ||
        next.state === "error" ||
        next.state === "downloaded" ||
        next.state === "available"
      ) {
        setChecking(false);
      }
    });
  }, [desktopApp]);

  if (!desktopApp) {
    return null;
  }

  const handleCheck = async () => {
    setChecking(true);
    setStatus({ state: "checking" });
    const result = await desktopApp.checkForUpdates();
    if (!result.ok) {
      setChecking(false);
    }
  };

  const handleInstall = () => {
    void desktopApp.installUpdate();
  };

  const canInstall = status?.state === "downloaded";

  return (
    <SectionCard>
      <SectionHead>
        <SectionIcon $tone="primary">
          <SystemUpdateAltOutlinedIcon />
        </SectionIcon>
        <SectionHeadText>
          <SectionTitle>Обновления</SectionTitle>
          <SectionHint>{formatStatus(status, currentVersion)}</SectionHint>
        </SectionHeadText>
      </SectionHead>

      {canInstall ? (
        <ActionTileWide type="button" $tone="primary" onClick={handleInstall}>
          <ActionTileIcon $tone="primary">
            <SystemUpdateAltOutlinedIcon />
          </ActionTileIcon>
          <ActionTileWideText>
            <ActionTileLabel>Перезапустить и обновить</ActionTileLabel>
            <ActionTileHint>Версия {status?.version}</ActionTileHint>
          </ActionTileWideText>
        </ActionTileWide>
      ) : (
        <ActionTile type="button" $tone="primary" onClick={() => void handleCheck()} disabled={checking}>
          <ActionTileIcon $tone="primary">
            <SystemUpdateAltOutlinedIcon />
          </ActionTileIcon>
          <ActionTileLabel>{checking ? "Проверка…" : "Проверить обновления"}</ActionTileLabel>
          <ActionTileHint>GitHub Releases</ActionTileHint>
        </ActionTile>
      )}
    </SectionCard>
  );
};

export default DesktopUpdateSection;
