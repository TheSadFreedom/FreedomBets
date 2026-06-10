import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { useState } from "react";
import {
  ActionButton,
  ActionButtonLabel,
  ActionsRoot,
  SyncActionButton,
} from "./HomeQuickActions.styled";

interface HomeQuickActionsProps {
  onNewMatch: () => void;
  onSyncSportsRu?: (force?: boolean) => Promise<void>;
  onNewEvent: () => void;
}

const HomeQuickActions = ({ onNewMatch, onSyncSportsRu, onNewEvent }: HomeQuickActionsProps) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!onSyncSportsRu || syncing) return;
    setSyncing(true);
    try {
      await onSyncSportsRu(true);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ActionsRoot>
      <ActionButton
        type="button"
        $primary
        onClick={onNewMatch}
        aria-label="Добавить новый матч"
      >
        <SportsEsportsOutlinedIcon />
        <ActionButtonLabel>Новый матч</ActionButtonLabel>
      </ActionButton>

      {onSyncSportsRu ? (
        <SyncActionButton
          type="button"
          $syncing={syncing}
          disabled={syncing}
          onClick={() => void handleSync()}
          aria-label="Обновить с Sports.ru"
          title="Обновить с Sports.ru"
        >
          <RefreshOutlinedIcon />
        </SyncActionButton>
      ) : null}

      <ActionButton type="button" onClick={onNewEvent} aria-label="Добавить новый турнир">
        <EmojiEventsOutlinedIcon />
        <ActionButtonLabel>Новый турнир</ActionButtonLabel>
      </ActionButton>
    </ActionsRoot>
  );
};

export default HomeQuickActions;
