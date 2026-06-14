import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import type { AppCreateActions } from "@/layouts/ProfileHeader/types";
import { dialogPaperSx } from "@/shared/styles/dialogSx";
import DesktopUpdateSection from "../ProfileSettingsDialog/DesktopUpdateSection";
import ProfileDatabaseSection from "../ProfileSettingsDialog/ProfileDatabaseSection";
import SportsRuSyncSection from "../ProfileSettingsDialog/SportsRuSyncSection";
import {
  ActionGrid,
  ActionTile,
  ActionTileHint,
  ActionTileIcon,
  ActionTileLabel,
  DialogBody,
  DialogHeader,
  DialogHeaderMain,
  DialogHeaderRow,
  DialogProfileHero,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  SectionCard,
  SectionHead,
  SectionHeadText,
  SectionHint,
  SectionIcon,
  SectionTitle,
  dialogBackdropSx,
} from "../ProfileSettingsDialog/ProfileSettingsDialog.styled";

interface AppSettingsDialogProps {
  open: boolean;
  createActions?: AppCreateActions;
  onSyncSportsRu?: (options: { dates: string[] }) => Promise<void>;
  onClose: () => void;
}

const AppSettingsDialog = ({
  open,
  createActions,
  onSyncSportsRu,
  onClose,
}: AppSettingsDialogProps) => {
  const hasCreateActions = Boolean(
    createActions?.onNewTeam ||
      createActions?.onNewMatch ||
      createActions?.onNewBet ||
      createActions?.onNewEvent
  );

  const runCreateAction = (action?: () => void) => {
    if (!action) return;
    onClose();
    action();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: { sx: dialogPaperSx },
        backdrop: { sx: dialogBackdropSx },
      }}
    >
      <DialogShell>
        <DialogHeader>
          <DialogHeaderRow>
            <DialogHeaderMain>
              <DialogProfileHero>
                <SectionIcon $tone="primary" style={{ width: 48, height: 48, borderRadius: 14 }}>
                  <SettingsOutlinedIcon sx={{ fontSize: 24 }} />
                </SectionIcon>
                <div>
                  <DialogTitle>Настройки</DialogTitle>
                  <DialogSubtitle>Создание записей и данные приложения</DialogSubtitle>
                </div>
              </DialogProfileHero>
            </DialogHeaderMain>
            <IconButton
              onClick={onClose}
              aria-label="Закрыть"
              size="small"
              sx={{
                color: "rgba(255,255,255,0.5)",
                mt: -0.5,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogHeaderRow>
        </DialogHeader>

        <DialogBody>
          <DesktopUpdateSection />

          {onSyncSportsRu ? <SportsRuSyncSection onSync={onSyncSportsRu} /> : null}

          {hasCreateActions ? (
            <SectionCard>
              <SectionHead>
                <SectionIcon $tone="primary">
                  <AddCircleOutlineIcon />
                </SectionIcon>
                <SectionHeadText>
                  <SectionTitle>Создать</SectionTitle>
                  <SectionHint>Команда, матч, ставка или турнир</SectionHint>
                </SectionHeadText>
              </SectionHead>
              <ActionGrid>
                <ActionTile
                  type="button"
                  onClick={() => runCreateAction(createActions?.onNewTeam)}
                  disabled={!createActions?.onNewTeam}
                >
                  <ActionTileIcon>
                    <GroupsOutlinedIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Команда</ActionTileLabel>
                  <ActionTileHint>Новая команда</ActionTileHint>
                </ActionTile>
                <ActionTile
                  type="button"
                  onClick={() => runCreateAction(createActions?.onNewMatch)}
                  disabled={!createActions?.onNewMatch}
                >
                  <ActionTileIcon>
                    <SportsEsportsOutlinedIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Матч</ActionTileLabel>
                  <ActionTileHint>Новый матч</ActionTileHint>
                </ActionTile>
                <ActionTile
                  type="button"
                  onClick={() => runCreateAction(createActions?.onNewBet)}
                  disabled={!createActions?.onNewBet}
                >
                  <ActionTileIcon>
                    <PostAddOutlinedIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Ставка</ActionTileLabel>
                  <ActionTileHint>Новая ставка</ActionTileHint>
                </ActionTile>
                <ActionTile
                  type="button"
                  onClick={() => runCreateAction(createActions?.onNewEvent)}
                  disabled={!createActions?.onNewEvent}
                >
                  <ActionTileIcon>
                    <EmojiEventsOutlinedIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Турнир</ActionTileLabel>
                  <ActionTileHint>Новый турнир</ActionTileHint>
                </ActionTile>
              </ActionGrid>
            </SectionCard>
          ) : null}

          <ProfileDatabaseSection />
        </DialogBody>
      </DialogShell>
    </Dialog>
  );
};

export default AppSettingsDialog;
