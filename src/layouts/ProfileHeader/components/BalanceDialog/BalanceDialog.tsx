import { useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, TextField } from "@mui/material";
import { clampBalance, MAX_BALANCE } from "@/shared/lib/limits";
import { dialogBackdropSx, dialogPaperSx } from "@/shared/styles/dialogSx";
import {
  BalanceCard,
  BalanceCardLabel,
  BalanceCardValue,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeaderRow,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  fieldSx,
  FooterButton,
  HeaderIcon,
  HeaderText,
  HintText,
  PresetChip,
  PresetGrid,
  PreviewCard,
  PreviewLabel,
  PreviewValue,
} from "./BalanceDialog.styled";

const DEPOSIT_PRESETS = [500, 1000, 3000, 5000, 10000, 25000] as const;

interface BalanceDialogProps {
  open: boolean;
  currentBalance: number;
  onClose: () => void;
  onAdd: (amount: number) => Promise<void>;
}

const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const BalanceDialog = ({ open, currentBalance, onClose, onAdd }: BalanceDialogProps) => {
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setAmountInput("");
  }, [open]);

  const maxDeposit = Math.max(0, MAX_BALANCE - currentBalance);
  const amount = Number(amountInput);
  const exceedsMaxBalance = Number.isFinite(amount) && amount > maxDeposit;
  const valid = amount > 0 && Number.isFinite(amount) && !exceedsMaxBalance;
  const nextBalance = valid ? clampBalance(currentBalance + amount) : null;

  const availablePresets = useMemo(
    () => DEPOSIT_PRESETS.filter((preset) => preset <= maxDeposit),
    [maxDeposit],
  );

  const handleAdd = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      await onAdd(amount);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
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
            <HeaderIcon aria-hidden>
              <AddCircleOutlineIcon />
            </HeaderIcon>
            <HeaderText>
              <DialogTitle>Пополнение баланса</DialogTitle>
              <DialogSubtitle>Добавьте средства на счёт профиля</DialogSubtitle>
            </HeaderText>
            <IconButton
              onClick={onClose}
              disabled={submitting}
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

          <BalanceCard>
            <BalanceCardLabel>Текущий баланс</BalanceCardLabel>
            <BalanceCardValue>{formatMoney(currentBalance)} ₽</BalanceCardValue>
          </BalanceCard>
        </DialogHeader>

        <DialogBody>
          {maxDeposit <= 0 ? (
            <HintText>
              Достигнут максимальный баланс {formatMoney(MAX_BALANCE)} ₽
            </HintText>
          ) : (
            <>
              {availablePresets.length > 0 ? (
                <PresetGrid>
                  {availablePresets.map((preset) => (
                    <PresetChip
                      key={preset}
                      type="button"
                      $active={amountInput === String(preset)}
                      onClick={() => setAmountInput(String(preset))}
                    >
                      +{formatMoney(preset)} ₽
                    </PresetChip>
                  ))}
                </PresetGrid>
              ) : null}

              <TextField
                label="Сумма пополнения, ₽"
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                fullWidth
                autoFocus
                error={exceedsMaxBalance}
                helperText={
                  exceedsMaxBalance
                    ? `Максимум пополнения: ${formatMoney(maxDeposit)} ₽`
                    : undefined
                }
                sx={fieldSx}
                slotProps={{ htmlInput: { min: 1, max: maxDeposit, step: 1 } }}
              />

              {nextBalance != null ? (
                <PreviewCard>
                  <PreviewLabel>После пополнения</PreviewLabel>
                  <PreviewValue>{formatMoney(nextBalance)} ₽</PreviewValue>
                </PreviewCard>
              ) : null}

              <HintText>Лимит баланса: {formatMoney(MAX_BALANCE)} ₽</HintText>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <FooterButton type="button" onClick={onClose} disabled={submitting}>
            Отмена
          </FooterButton>
          <FooterButton
            type="button"
            $primary
            onClick={() => void handleAdd()}
            disabled={!valid || submitting || maxDeposit <= 0}
          >
            {submitting ? "Пополнение…" : "Пополнить"}
          </FooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default BalanceDialog;
