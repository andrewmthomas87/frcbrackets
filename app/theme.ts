import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5c6bc0" },
    secondary: { main: "#455a64" },
    background: {
      default: "#040512",
      paper: "#040512",
    },
  },
  shadows: new Array(25).fill("none") as any,
});

export default theme;
