import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B3B98",
      contrastText: "#e2e8f0",
    },
    background: {
      default: "#bdbdbd",
    },
    text: { primary: "#ff9800" },
  },
});

export default theme;
