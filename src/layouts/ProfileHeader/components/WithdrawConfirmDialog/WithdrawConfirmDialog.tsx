import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

interface WithdrawConfirmDialogProps {
  open: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const WithdrawConfirmDialog = ({
  open,
  balance,
  onClose,
  onConfirm,
}: WithdrawConfirmDialogProps) => {
  const [submitting, setSubmitting] = useState(false);

  const formatted = balance.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Вывести весь баланс?</DialogTitle>
      <DialogContent>
        <DialogContentText component="div" sx={{ color: "text.secondary" }}>
          <Typography variant="body2" paragraph sx={{ mb: 1.5 }}>
            Баланс будет обнулён. Это действие нельзя отменить автоматически — при
            ошибке придётся пополнить счёт вручную.
          </Typography>
          <Typography variant="body1" fontWeight={700} sx={{ color: "#ef9a9a" }}>
            {formatted} ₽
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Отмена
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? "Вывод…" : "Вывести все"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawConfirmDialog;
