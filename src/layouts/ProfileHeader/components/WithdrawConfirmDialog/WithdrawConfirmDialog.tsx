import { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Dialog, IconButton, TextField } from "@mui/material";
import { clampBalance } from "@/shared/lib/limits";
import { dialogBackdropSx, dialogPaperSx } from "@/shared/styles/dialogSx";
import {
  BalanceCardLabel,
  DialogBody,
  DialogFooter,
  DialogHeaderRow,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  HeaderText,
  HintText,
  PresetChip,
  PresetGrid,
  PreviewLabel,
  WithdrawBalanceCard,
  WithdrawBalanceValue,
  WithdrawDialogHeader,
  WithdrawFooterButton,
  WithdrawHeaderIcon,
  WithdrawPreviewCard,
  WithdrawPreviewValue,
  fieldSx,
} from "./WithdrawConfirmDialog.styled";

const WITHDRAW_PRESETS = [500, 1000, 3000, 5000, 10000, 25000] as const;

interface WithdrawConfirmDialogProps {
  open: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
}

const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const WithdrawConfirmDialog = ({
  open,
  balance,
  onClose,
  onConfirm,
}: WithdrawConfirmDialogProps) => {
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setAmountInput("");
  }, [open]);

  const amount = Number(amountInput);
  const exceedsBalance = Number.isFinite(amount) && amount > balance;
  const valid = amount > 0 && Number.isFinite(amount) && !exceedsBalance;
  const nextBalance = valid ? clampBalance(balance - amount) : null;

  const availablePresets = useMemo(
    () => WITHDRAW_PRESETS.filter((preset) => preset <= balance),
    [balance],
  );

  const handleConfirm = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      await onConfirm(amount);
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
        <WithdrawDialogHeader>
          <DialogHeaderRow>
            <WithdrawHeaderIcon aria-hidden>
              <PaymentsOutlinedIcon />
            </WithdrawHeaderIcon>
            <HeaderText>
              <DialogTitle>Вывод средств</DialogTitle>
              <DialogSubtitle>Укажите сумму для вывода с баланса</DialogSubtitle>
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

          <WithdrawBalanceCard>
            <BalanceCardLabel>Доступно</BalanceCardLabel>
            <WithdrawBalanceValue>{formatMoney(balance)} ₽</WithdrawBalanceValue>
          </WithdrawBalanceCard>
        </WithdrawDialogHeader>

        <DialogBody>
          {balance <= 0 ? (
            <HintText>На балансе нет средств для вывода</HintText>
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
                      {formatMoney(preset)} ₽
                    </PresetChip>
                  ))}
                </PresetGrid>
              ) : null}

              <TextField
                label="Сумма вывода, ₽"
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                fullWidth
                autoFocus
                error={exceedsBalance}
                helperText={
                  exceedsBalance ? `Максимум: ${formatMoney(balance)} ₽` : undefined
                }
                sx={{
                  ...fieldSx,
                  "& .MuiInputLabel-root.Mui-focused": { color: "#ef9a9a" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(239, 83, 80, 0.55)",
                  },
                }}
                slotProps={{ htmlInput: { min: 1, max: balance, step: 1 } }}
              />

              {nextBalance != null ? (
                <WithdrawPreviewCard>
                  <PreviewLabel>Останется на балансе</PreviewLabel>
                  <WithdrawPreviewValue>{formatMoney(nextBalance)} ₽</WithdrawPreviewValue>
                </WithdrawPreviewCard>
              ) : null}
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <WithdrawFooterButton type="button" onClick={onClose} disabled={submitting}>
            Отмена
          </WithdrawFooterButton>
          <WithdrawFooterButton
            type="button"
            $primary
            onClick={() => void handleConfirm()}
            disabled={!valid || submitting || balance <= 0}
          >
            {submitting ? "Вывод…" : "Вывести"}
          </WithdrawFooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default WithdrawConfirmDialog;
