import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

interface BalanceDialogProps {
  open: boolean;
  currentBalance: number;
  onClose: () => void;
  onAdd: (amount: number) => Promise<void>;
}

const BalanceDialog = ({ open, currentBalance, onClose, onAdd }: BalanceDialogProps) => {
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setAmountInput("");
  }, [open]);

  const amount = Number(amountInput);
  const valid = amount > 0 && Number.isFinite(amount);

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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Пополнение баланса</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Текущий баланс:{" "}
          <strong>
            {currentBalance.toLocaleString("ru-RU", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}{" "}
            ₽
          </strong>
        </Typography>
        <TextField
          label="Сумма пополнения, ₽"
          type="number"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          fullWidth
          autoFocus
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        {valid && (
          <Typography variant="body2" color="text.secondary">
            После пополнения:{" "}
            <strong style={{ color: "#81c784" }}>
              {(currentBalance + amount).toLocaleString("ru-RU", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              ₽
            </strong>
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleAdd} disabled={!valid || submitting}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BalanceDialog;
