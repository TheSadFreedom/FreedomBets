import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import { useDesktopUpdates } from "@/shared/lib/desktop/useDesktopUpdates";
import { formatDesktopUpdateStatus } from "@/shared/lib/desktop/formatUpdateStatus";
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
} from "./ProfileSettingsDialog.styled";

const DesktopUpdateSection = () => {
  const {
    bridgeState,
    currentVersion,
    status,
    checking,
    canInstall,
    checkForUpdates,
    installUpdate,
  } = useDesktopUpdates();

  const hint =
    bridgeState === "ready"
      ? formatDesktopUpdateStatus(status, currentVersion)
      : bridgeState === "broken"
        ? "Не удалось подключить desktop API. Переустановите приложение."
        : "Доступно в установленном приложении FreedomBets";

  const isDisabled = bridgeState !== "ready" || checking;

  return (
    <SectionCard>
      <SectionHead>
        <SectionIcon $tone="primary">
          <SystemUpdateAltOutlinedIcon />
        </SectionIcon>
        <SectionHeadText>
          <SectionTitle>Обновления</SectionTitle>
          <SectionHint>{hint}</SectionHint>
        </SectionHeadText>
      </SectionHead>

      {bridgeState === "ready" && canInstall ? (
        <ActionTileWide type="button" $tone="primary" onClick={installUpdate}>
          <ActionTileIcon $tone="primary">
            <SystemUpdateAltOutlinedIcon />
          </ActionTileIcon>
          <ActionTileWideText>
            <ActionTileLabel>Перезапустить и обновить</ActionTileLabel>
            <ActionTileHint>Версия {status?.version}</ActionTileHint>
          </ActionTileWideText>
        </ActionTileWide>
      ) : (
        <ActionTileWide
          type="button"
          $tone={bridgeState === "ready" ? "primary" : undefined}
          onClick={() => void checkForUpdates()}
          disabled={isDisabled}
        >
          <ActionTileIcon $tone={bridgeState === "ready" ? "primary" : undefined}>
            <SystemUpdateAltOutlinedIcon />
          </ActionTileIcon>
          <ActionTileWideText>
            <ActionTileLabel>
              {checking ? "Проверка…" : "Проверить обновления"}
            </ActionTileLabel>
            <ActionTileHint>
              {bridgeState === "ready" ? "GitHub Releases" : "Только desktop-версия"}
            </ActionTileHint>
          </ActionTileWideText>
        </ActionTileWide>
      )}
    </SectionCard>
  );
};

export default DesktopUpdateSection;
