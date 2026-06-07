import { useEffect, useState } from "react";
import { Dialog, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import type { Profile } from "@/entities/profile";
import BalanceDialog from "../BalanceDialog/BalanceDialog";
import WithdrawConfirmDialog from "../WithdrawConfirmDialog/WithdrawConfirmDialog";
import {
  ActionButton,
  ActionRow,
  BalanceValue,
  CloseButton,
  DeleteConfirmBox,
  DeleteHint,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  NameRow,
  Section,
  SectionTitle,
  dialogBackdropSx,
  fieldSx,
} from "./ProfileSettingsDialog.styled";
import { resolveDialogPaperSx } from "@/shared/styles/dialogSx";

interface ProfileSettingsDialogProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onUpdateName: (name: string) => Promise<void>;
  onSetBalance: (balance: number) => Promise<void>;
  onDeleteProfile: () => Promise<void>;
  onExitProfile: () => void;
}

const ProfileSettingsDialog = ({
  open,
  profile,
  onClose,
  onUpdateName,
  onSetBalance,
  onDeleteProfile,
  onExitProfile,
}: ProfileSettingsDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const handleWithdrawAll = async () => {
    await onSetBalance(0);
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
        fullScreen={isMobile}
        slotProps={{
          paper: { sx: resolveDialogPaperSx(isMobile) },
          backdrop: { sx: dialogBackdropSx },
        }}
      >
        <DialogShell>
          <DialogHeader>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <DialogTitle>Профиль</DialogTitle>
                <DialogSubtitle>Имя, баланс и управление аккаунтом</DialogSubtitle>
              </div>
              <IconButton
                onClick={onClose}
                aria-label="Закрыть"
                size="small"
                sx={{ color: "rgba(255,255,255,0.5)", mt: -0.5 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </DialogHeader>

          <DialogBody>
            <Section>
              <SectionTitle>Имя</SectionTitle>
              <NameRow>
                <TextField
                  label="Имя профиля"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  fullWidth
                  sx={fieldSx}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSaveName();
                  }}
                />
                <ActionButton
                  type="button"
                  $variant="primary"
                  onClick={() => void handleSaveName()}
                  disabled={!nameValid || !nameChanged || savingName}
                >
                  {savingName ? "Сохранение…" : "Сохранить имя"}
                </ActionButton>
              </NameRow>
            </Section>

            <Section>
              <SectionTitle>Баланс</SectionTitle>
              <BalanceValue $positive={profile.balance >= 0}>
                {profile.balance.toLocaleString("ru-RU", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{" "}
                ₽
              </BalanceValue>
              <ActionRow>
                <ActionButton type="button" $variant="primary" onClick={() => setAddDialogOpen(true)}>
                  <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                  Пополнить
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => setWithdrawDialogOpen(true)}
                  disabled={profile.balance === 0}
                >
                  <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />
                  Вывести все
                </ActionButton>
              </ActionRow>
            </Section>

            <Section>
              <SectionTitle>Сессия</SectionTitle>
              <DeleteHint>Выйти из профиля на этом устройстве — данные сохранятся.</DeleteHint>
              <ActionButton
                type="button"
                onClick={() => {
                  onExitProfile();
                  onClose();
                }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                Выйти из профиля
              </ActionButton>
            </Section>

            <Section>
              <SectionTitle>Удаление</SectionTitle>
              {!deleteConfirm ? (
                <>
                  <DeleteHint>
                    Профиль и все связанные ставки будут удалены без возможности восстановления.
                  </DeleteHint>
                  <ActionButton type="button" $variant="danger" onClick={() => setDeleteConfirm(true)}>
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    Удалить профиль
                  </ActionButton>
                </>
              ) : (
                <DeleteConfirmBox>
                  <DeleteHint style={{ margin: 0, color: "rgba(255, 205, 210, 0.9)" }}>
                    Удалить профиль «{profile.name}» и все ставки ({profile.totalBets})?
                  </DeleteHint>
                  <ActionRow>
                    <ActionButton
                      type="button"
                      $variant="danger"
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                    >
                      {deleting ? "Удаление…" : "Да, удалить"}
                    </ActionButton>
                    <ActionButton
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      disabled={deleting}
                    >
                      Отмена
                    </ActionButton>
                  </ActionRow>
                </DeleteConfirmBox>
              )}
            </Section>
          </DialogBody>

          <DialogFooter>
            <CloseButton type="button" onClick={onClose}>
              Закрыть
            </CloseButton>
          </DialogFooter>
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
        onConfirm={handleWithdrawAll}
      />
    </>
  );
};

export default ProfileSettingsDialog;
