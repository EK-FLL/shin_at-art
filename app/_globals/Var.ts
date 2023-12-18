"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B3B98",
      contrastText: "#e2e8f0",
    },
    text: { primary: "#1f2a38" },
  },
});

export default theme;
