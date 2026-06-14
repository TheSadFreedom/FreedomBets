import { useRef, useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { exportDatabase } from "@/shared/lib/db/exportDb";
import { importDatabase } from "@/shared/lib/db/importDb";
import { getDesktopApp, getDesktopBridgeState } from "@/shared/lib/desktop/desktopApp";
import {
  ActionGrid,
  ActionTile,
  ActionTileHint,
  ActionTileIcon,
  ActionTileLabel,
  SectionCard,
  SectionHead,
  SectionHeadText,
  SectionHint,
  SectionIcon,
  SectionTitle,
} from "./ProfileSettingsDialog.styled";

const ProfileDatabaseSection = () => {
  const bridgeState = getDesktopBridgeState();
  const desktopApp = getDesktopApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      await exportDatabase();
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Не удалось экспортировать базу");
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;

    const confirmed = window.confirm(
      "Импорт заменит текущую базу данных. Перед импортом создаётся резервная копия freedom.db.bak. Продолжить?"
    );
    if (!confirmed) return;

    setImporting(true);
    setError(null);
    try {
      await importDatabase(file);
      window.location.reload();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Не удалось импортировать базу");
      setImporting(false);
    }
  };

  return (
    <SectionCard>
      <SectionHead>
        <SectionIcon>
          <StorageOutlinedIcon />
        </SectionIcon>
        <SectionHeadText>
          <SectionTitle>База данных</SectionTitle>
        </SectionHeadText>
      </SectionHead>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleImportFile(file);
          event.target.value = "";
        }}
      />

      <ActionGrid>
        <ActionTile type="button" $tone="primary" onClick={() => void handleExport()} disabled={exporting || importing}>
          <ActionTileIcon $tone="primary">
            <FileDownloadOutlinedIcon />
          </ActionTileIcon>
          <ActionTileLabel>{exporting ? "Экспорт…" : "Экспорт JSON"}</ActionTileLabel>
          <ActionTileHint>Резервная копия</ActionTileHint>
        </ActionTile>

        <ActionTile type="button" onClick={handleImportClick} disabled={exporting || importing}>
          <ActionTileIcon>
            <FileUploadOutlinedIcon />
          </ActionTileIcon>
          <ActionTileLabel>{importing ? "Импорт…" : "Импорт JSON"}</ActionTileLabel>
          <ActionTileHint>Восстановление</ActionTileHint>
        </ActionTile>

        {bridgeState === "ready" && desktopApp ? (
          <ActionTile type="button" onClick={() => void desktopApp.openDataFolder()}>
            <ActionTileIcon>
              <FolderOpenOutlinedIcon />
            </ActionTileIcon>
            <ActionTileLabel>Открыть папку</ActionTileLabel>
            <ActionTileHint>AppData</ActionTileHint>
          </ActionTile>
        ) : null}
      </ActionGrid>

      {error ? <SectionHint>{error}</SectionHint> : null}
    </SectionCard>
  );
};

export default ProfileDatabaseSection;
