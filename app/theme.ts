import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3f51b5" },
    secondary: { main: "#455a64" },
  },
  shadows: new Array(25).fill("none") as any,
});

export default theme;
