import {
  AppBar,
  Box,
  Button,
  Link,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link as RemixLink, Outlet } from "@remix-run/react";
import { getUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userID = await getUserId(request);
  if (userID) {
    return redirect("/dashboard");
  }

  return json({});
};

export default function SignedOutLayout(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: theme.palette.background.default }}
      >
        <Toolbar>
          <Link component={RemixLink} to="/" underline="hover">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              <span style={{ color: theme.palette.primary.light }}>frc</span>
              <span
                style={{
                  color: theme.palette.getContrastText(
                    theme.palette.background.default
                  ),
                }}
              >
                brackets
              </span>
            </Typography>
          </Link>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={2}>
            <Button
              color="secondary"
              variant="contained"
              component={RemixLink}
              to="/join"
            >
              Sign up
            </Button>
            <Button
              color="primary"
              variant="contained"
              component={RemixLink}
              to="/login"
            >
              Log in
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
