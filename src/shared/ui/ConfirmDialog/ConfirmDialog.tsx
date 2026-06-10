import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  confirming = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={confirming ? undefined : onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: "text.secondary" }}>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={confirming}>
        {cancelLabel}
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => void onConfirm()}
        disabled={confirming}
      >
        {confirming ? "Удаление…" : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
