import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LightboxImage, LightboxShell } from "./PickemImageLightbox.styled";

interface PickemImageLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

const PickemImageLightbox = ({ open, src, alt, onClose }: PickemImageLightboxProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={false}
    slotProps={{
      backdrop: {
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(4px)",
        },
      },
      paper: {
        sx: {
          m: 1,
          p: 0,
          background: "transparent",
          boxShadow: "none",
          overflow: "visible",
          maxWidth: "none",
        },
      },
    }}
  >
    <LightboxShell>
      <IconButton
        onClick={onClose}
        aria-label="Закрыть"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.65)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <LightboxImage src={src} alt={alt} onClick={onClose} />
    </LightboxShell>
  </Dialog>
);

export default PickemImageLightbox;
