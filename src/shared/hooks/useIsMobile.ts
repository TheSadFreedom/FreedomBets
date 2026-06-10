import { useMediaQuery, useTheme } from "@mui/material";

/** Компактная вёрстка: нижняя навигация, карточки вместо таблиц (`md` = 1280px) */
export function useIsMobile(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}
