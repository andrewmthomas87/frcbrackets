import {
  AppBar,
  Box,
  Button,
  Link,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { json } from "@remix-run/node";
import { Form, Link as RemixLink, Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

export default function SignedInLayout(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Link component={RemixLink} to="/dashboard" underline="hover">
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
          <Form action="/logout" method="post">
            <Button type="submit" color="secondary" variant="contained">
              Log out
            </Button>
          </Form>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
