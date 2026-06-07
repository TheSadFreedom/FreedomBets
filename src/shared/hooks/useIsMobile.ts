import { useMediaQuery, useTheme } from "@mui/material";

/** Согласовано с `shared/styles/breakpoints` (sm = 640px) */
export function useIsMobile(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}
