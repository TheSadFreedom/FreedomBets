import type { SxProps, Theme } from "@mui/material/styles";

export const logoAvatarSx = (size: number, showFallback: boolean): SxProps<Theme> => ({
  width: size,
  height: size,
  borderRadius: 0,
  flexShrink: 0,
  fontSize: size * 0.36,
  boxShadow: "none",
  bgcolor: showFallback ? "rgba(255, 255, 255, 0.08)" : "transparent",
  color: showFallback ? "rgba(255, 255, 255, 0.55)" : "transparent",
  border: showFallback ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
  fontWeight: 600,
  "& img": { objectFit: "contain", background: "transparent" },
});
