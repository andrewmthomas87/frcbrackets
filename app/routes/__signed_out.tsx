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
import { getUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) {
    if (user.verified) {
      return redirect("/dashboard");
    } else {
      return redirect("/verify");
    }
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
            <Typography variant="h5" fontWeight={700}>
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
