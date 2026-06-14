import { useEffect, useState } from "react";
import { Dialog, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import type { Profile } from "@/entities/profile";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { clampBalance } from "@/shared/lib/limits";
import BalanceDialog from "../BalanceDialog/BalanceDialog";
import WithdrawConfirmDialog from "../WithdrawConfirmDialog/WithdrawConfirmDialog";
import {
  ActionGrid,
  ActionTile,
  ActionTileHint,
  ActionTileIcon,
  ActionTileLabel,
  ActionTileWide,
  ActionTileWideText,
  BalanceHero,
  BalanceHeroLabel,
  BalanceHeroValue,
  ConfirmActionRow,
  ConfirmButton,
  DeleteConfirmBox,
  DeleteConfirmText,
  DialogAvatar,
  DialogBody,
  DialogHeader,
  DialogHeaderMain,
  DialogHeaderRow,
  DialogHeroStats,
  DialogProfileHero,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  HeroMetaPill,
  NameRow,
  SaveNameButton,
  SectionCard,
  SectionHead,
  SectionHeadText,
  SectionHint,
  SectionIcon,
  SectionTitle,
  dialogBackdropSx,
  fieldSx,
} from "./ProfileSettingsDialog.styled";
import { dialogPaperSx } from "@/shared/styles/dialogSx";

interface ProfileSettingsDialogProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onSetBalance: (balance: number) => Promise<void>;
  onDeleteProfile: () => Promise<void>;
  onExitProfile: () => void;
}

const profileInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const ProfileSettingsDialog = ({
  open,
  profile,
  onClose,
  onUpdateName,
  onSetBalance,
  onDeleteProfile,
  onExitProfile,
}: ProfileSettingsDialogProps) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [savingName, setSavingName] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNameInput(profile.name);
    setDeleteConfirm(false);
  }, [open, profile.name]);

  const trimmedName = nameInput.trim();
  const nameChanged = trimmedName !== profile.name.trim();
  const nameValid = trimmedName.length > 0;
  const balancePositive = profile.balance >= 0;

  const handleSaveName = async () => {
    if (!nameValid || !nameChanged) return;
    setSavingName(true);
    try {
      await onUpdateName(trimmedName);
    } finally {
      setSavingName(false);
    }
  };

  const handleAdd = async (amount: number) => {
    await onSetBalance(profile.balance + amount);
  };

  const handleWithdraw = async (amount: number) => {
    await onSetBalance(clampBalance(profile.balance - amount));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteProfile();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
                  <DialogAvatar>{profileInitial(profile.name)}</DialogAvatar>
                  <div>
                    <DialogTitle>{profile.name}</DialogTitle>
                    <DialogSubtitle>Настройки и управление профилем</DialogSubtitle>
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

            <DialogHeroStats>
              <BalanceHero $positive={balancePositive}>
                <BalanceHeroLabel>Баланс</BalanceHeroLabel>
                <BalanceHeroValue $positive={balancePositive}>
                  {profile.balance.toLocaleString("ru-RU", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </BalanceHeroValue>
              </BalanceHero>
              <HeroMetaPill>{profile.totalBets} ставок</HeroMetaPill>
            </DialogHeroStats>
          </DialogHeader>

          <DialogBody>
            <SectionCard>
              <SectionHead>
                <SectionIcon>
                  <BadgeOutlinedIcon />
                </SectionIcon>
                <SectionHeadText>
                  <SectionTitle>Имя профиля</SectionTitle>
                  <SectionHint>Отображается в шапке и рейтинге</SectionHint>
                </SectionHeadText>
              </SectionHead>
              <NameRow>
                <TextField
                  label="Имя"
                  value={nameInput}
                  onChange={(e) => setNameInput(limitInputLength(e.target.value))}
                  fullWidth
                  sx={fieldSx}
                  slotProps={{ htmlInput: { maxLength: MAX_INPUT_LENGTH } }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSaveName();
                  }}
                />
                <SaveNameButton
                  type="button"
                  onClick={() => void handleSaveName()}
                  disabled={!nameValid || !nameChanged || savingName}
                >
                  {savingName ? "Сохранение…" : "Сохранить"}
                </SaveNameButton>
              </NameRow>
            </SectionCard>

            <SectionCard>
              <SectionHead>
                <SectionIcon $tone="primary">
                  <WalletOutlinedIcon />
                </SectionIcon>
                <SectionHeadText>
                  <SectionTitle>Баланс</SectionTitle>
                  <SectionHint>Пополнение и вывод средств</SectionHint>
                </SectionHeadText>
              </SectionHead>
              <ActionGrid>
                <ActionTile type="button" $tone="primary" onClick={() => setAddDialogOpen(true)}>
                  <ActionTileIcon $tone="primary">
                    <AddCircleOutlineIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Пополнить</ActionTileLabel>
                  <ActionTileHint>Добавить на баланс</ActionTileHint>
                </ActionTile>
                <ActionTile
                  type="button"
                  onClick={() => setWithdrawDialogOpen(true)}
                  disabled={profile.balance === 0}
                >
                  <ActionTileIcon>
                    <PaymentsOutlinedIcon />
                  </ActionTileIcon>
                  <ActionTileLabel>Вывести</ActionTileLabel>
                  <ActionTileHint>Указать сумму</ActionTileHint>
                </ActionTile>
              </ActionGrid>
            </SectionCard>

            <SectionCard>
              <ActionTileWide
                type="button"
                onClick={() => {
                  onExitProfile();
                  onClose();
                }}
              >
                <ActionTileIcon>
                  <LogoutOutlinedIcon />
                </ActionTileIcon>
                <ActionTileWideText>
                  <ActionTileLabel>Выйти из профиля</ActionTileLabel>
                  <ActionTileHint>Данные сохранятся на устройстве</ActionTileHint>
                </ActionTileWideText>
              </ActionTileWide>
            </SectionCard>

            <SectionCard $tone="danger" $compact>
              {!deleteConfirm ? (
                <ActionTileWide
                  type="button"
                  $tone="danger"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <ActionTileIcon $tone="danger">
                    <DeleteOutlineIcon />
                  </ActionTileIcon>
                  <ActionTileWideText>
                    <ActionTileLabel>Удалить профиль</ActionTileLabel>
                    <ActionTileHint>
                      {profile.totalBets} ставок · без восстановления
                    </ActionTileHint>
                  </ActionTileWideText>
                </ActionTileWide>
              ) : (
                <DeleteConfirmBox>
                  <DeleteConfirmText>
                    Удалить «{profile.name}» и {profile.totalBets} ставок?
                  </DeleteConfirmText>
                  <ConfirmActionRow>
                    <ConfirmButton
                      type="button"
                      $variant="danger"
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                    >
                      {deleting ? "Удаление…" : "Удалить"}
                    </ConfirmButton>
                    <ConfirmButton
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      disabled={deleting}
                    >
                      Отмена
                    </ConfirmButton>
                  </ConfirmActionRow>
                </DeleteConfirmBox>
              )}
            </SectionCard>
          </DialogBody>
        </DialogShell>
      </Dialog>

      <BalanceDialog
        open={addDialogOpen}
        currentBalance={profile.balance}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAdd}
      />

      <WithdrawConfirmDialog
        open={withdrawDialogOpen}
        balance={profile.balance}
        onClose={() => setWithdrawDialogOpen(false)}
        onConfirm={handleWithdraw}
      />
    </>
  );
};

export default ProfileSettingsDialog;
