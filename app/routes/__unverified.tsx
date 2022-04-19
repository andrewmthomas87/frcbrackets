import {
  AppBar,
  Box,
  Button,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link as RemixLink, Outlet } from "@remix-run/react";
import { requireUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user.verified) {
    return redirect("/dashboard");
  }

  return json({});
};

export default function UnverifiedLayout(): JSX.Element {
  const theme = useTheme();
  const isAtLeastMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: theme.palette.background.default, overflow: "auto" }}
      >
        <Toolbar variant={isAtLeastMd ? "regular" : "dense"}>
          <Link component={RemixLink} to="/dashboard" underline="hover">
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
          <Form action="/logout" method="post">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ whiteSpace: "nowrap" }}
            >
              Log out
            </Button>
          </Form>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
