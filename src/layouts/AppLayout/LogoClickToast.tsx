import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import {
  LogoToastBody,
  LogoToastCard,
  LogoToastClose,
  LogoToastIconWrap,
  LogoToastLabel,
  LogoToastLayer,
  LogoToastMessage,
  LogoToastProgress,
} from "./LogoClickToast.styled";

const TOAST_DURATION_MS = 3200;
const CLOSE_ANIMATION_MS = 280;

interface LogoClickToastProps {
  toast: { key: number; message: string } | null;
  onClose: () => void;
}

const LogoClickToast = ({ toast, onClose }: LogoClickToastProps) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!toast) {
      setClosing(false);
      return;
    }

    setClosing(false);
    const hideTimer = window.setTimeout(() => {
      setClosing(true);
      window.setTimeout(onClose, CLOSE_ANIMATION_MS);
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(hideTimer);
  }, [toast, onClose]);

  if (!toast) return null;

  const dismiss = () => {
    setClosing(true);
    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  return (
    <LogoToastLayer>
      <LogoToastCard key={toast.key} role="alert" aria-live="assertive" $closing={closing}>
        <LogoToastIconWrap aria-hidden>
          <ReportGmailerrorredOutlinedIcon />
        </LogoToastIconWrap>

        <LogoToastBody>
          <LogoToastLabel>Ошибка</LogoToastLabel>
          <LogoToastMessage>{toast.message}</LogoToastMessage>
        </LogoToastBody>

        <LogoToastClose type="button" aria-label="Закрыть" onClick={dismiss}>
          <CloseIcon />
        </LogoToastClose>

        <LogoToastProgress key={toast.key} $durationMs={TOAST_DURATION_MS} aria-hidden />
      </LogoToastCard>
    </LogoToastLayer>
  );
};

export default LogoClickToast;
