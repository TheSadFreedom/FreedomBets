import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { logoAvatarSx } from "@/shared/ui/TeamLogo/TeamLogo.styled";

interface LogoAvatarProps {
  size: number;
  src?: string;
  alt: string;
  failed?: boolean;
  onError?: () => void;
  children?: ReactNode;
}

const LogoAvatar = ({
  size,
  src,
  alt,
  failed = false,
  onError,
  children,
}: LogoAvatarProps) => {
  const [loaded, setLoaded] = useState(false);
  const onErrorRef = useRef(onError);

  onErrorRef.current = onError;

  const showImage = Boolean(src && !failed);
  const showLoading = showImage && !loaded;
  const showFallback = failed || !showImage;

  useEffect(() => {
    if (!showImage || !src) {
      setLoaded(false);
      return;
    }

    setLoaded(false);
    let cancelled = false;
    const img = new Image();

    const finish = () => {
      if (!cancelled) setLoaded(true);
    };

    const fail = () => {
      if (cancelled) return;
      setLoaded(false);
      onErrorRef.current?.();
    };

    img.onload = finish;
    img.onerror = fail;
    img.src = src;

    if (img.complete) {
      if (img.naturalWidth > 0) finish();
      else fail();
    }

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, showImage]);

  return (
    <Box position="relative" flexShrink={0} sx={{ width: size, height: size }}>
      {showLoading ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <CircularProgress
            size={Math.max(12, Math.round(size * 0.42))}
            thickness={5}
            sx={{ color: "rgba(255, 255, 255, 0.35)" }}
          />
        </Box>
      ) : null}
      <Avatar
        src={showImage && loaded ? src : undefined}
        alt={alt}
        sx={logoAvatarSx(size, showFallback)}
      >
        {showLoading ? null : children}
      </Avatar>
    </Box>
  );
};

export default LogoAvatar;
