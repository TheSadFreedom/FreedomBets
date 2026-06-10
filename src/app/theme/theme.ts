import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 1280,
      lg: 1440,
      xl: 1536,
    },
  },
  palette: {
    mode: "dark",
    primary: { main: "#4caf50" },
    secondary: { main: "#90caf9" },
    background: {
      default: "#1f1f1f",
      paper: "#2a2a2a",
    },
    success: { main: "#66bb6a" },
    error: { main: "#ef5350" },
    warning: { main: "#ffa726" },
  },
  typography: {
    fontFamily: '"Play", sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "rgba(255,255, 255, 0.85)",
        },
      },
    },
  },
});
