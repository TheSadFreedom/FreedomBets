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

interface LogoClickToastItemProps {
  toast: { key: number; message: string };
  onClose: () => void;
}

const LogoClickToastItem = ({ toast, onClose }: LogoClickToastItemProps) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setClosing(true);
      window.setTimeout(onClose, CLOSE_ANIMATION_MS);
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(hideTimer);
  }, [onClose]);

  const dismiss = () => {
    setClosing(true);
    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  return (
    <LogoToastLayer>
      <LogoToastCard role="alert" aria-live="assertive" $closing={closing}>
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

        <LogoToastProgress $durationMs={TOAST_DURATION_MS} aria-hidden />
      </LogoToastCard>
    </LogoToastLayer>
  );
};

interface LogoClickToastProps {
  toast: { key: number; message: string } | null;
  onClose: () => void;
}

const LogoClickToast = ({ toast, onClose }: LogoClickToastProps) => {
  if (!toast) return null;
  return <LogoClickToastItem key={toast.key} toast={toast} onClose={onClose} />;
};

export default LogoClickToast;
