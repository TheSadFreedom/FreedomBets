import type { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { GlobalStyles } from "@/app/styles/global.styled";
import { appTheme } from "@/app/theme/theme";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <GlobalStyles />
    {children}
  </ThemeProvider>
);

export default AppProviders;
