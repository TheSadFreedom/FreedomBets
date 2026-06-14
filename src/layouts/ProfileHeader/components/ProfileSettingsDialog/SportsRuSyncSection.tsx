import { useState } from "react";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { buildSportsRuSyncRequest } from "@/features/sportsru/lib/sportsRuSyncOptions";
import {
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
} from "../ProfileSettingsDialog/ProfileSettingsDialog.styled";

interface SportsRuSyncSectionProps {
  onSync: (options: { dates: string[] }) => Promise<void>;
}

const SportsRuSyncSection = ({ onSync }: SportsRuSyncSectionProps) => {
  const [syncing, setSyncing] = useState(false);
  const [statusHint, setStatusHint] = useState("Завтра, сегодня и последние 30 дней");

  const runSync = async () => {
    if (syncing) return;

    setSyncing(true);
    setStatusHint("Загрузка матчей…");

    try {
      await onSync(buildSportsRuSyncRequest("settingsImport"));
      setStatusHint("Импорт завершён");
    } catch {
      setStatusHint("Ошибка загрузки");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <SectionCard>
      <SectionHead>
        <SectionIcon $tone="primary">
          <CloudDownloadOutlinedIcon />
        </SectionIcon>
        <SectionHeadText>
          <SectionTitle>Sports.ru</SectionTitle>
          <SectionHint>{statusHint}</SectionHint>
        </SectionHeadText>
      </SectionHead>

      <ActionTileWide
        type="button"
        $tone="primary"
        onClick={() => void runSync()}
        disabled={syncing}
      >
        <ActionTileIcon $tone="primary">
          <CloudDownloadOutlinedIcon />
        </ActionTileIcon>
        <ActionTileWideText>
          <ActionTileLabel>{syncing ? "Загрузка…" : "Импортировать матчи"}</ActionTileLabel>
          <ActionTileHint>Завтра, сегодня и 30 дней</ActionTileHint>
        </ActionTileWideText>
      </ActionTileWide>
    </SectionCard>
  );
};

export default SportsRuSyncSection;
