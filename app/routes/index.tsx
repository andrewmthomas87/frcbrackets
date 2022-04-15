import { Button, Stack, Typography } from "@mui/material";
import { Form, Link } from "@remix-run/react";
import Page from "~/components/Page";
import { useOptionalUser } from "~/utils";

export default function IndexPage(): JSX.Element {
  const user = useOptionalUser();

  return (
    <Page>
      <Typography variant="h1" gutterBottom>
        FRC Brackets
      </Typography>
      {user ? (
        <>
          <Typography variant="body1" gutterBottom>
            Hello, {user.email}
          </Typography>
          <Form action="/logout" method="post">
            <Button type="submit" variant="contained">
              Log out
            </Button>
          </Form>
        </>
      ) : (
        <Stack direction="row" spacing={1}>
          <Button
            color="secondary"
            variant="contained"
            component={Link}
            to="/join"
          >
            Sign up
          </Button>
          <Button variant="contained" component={Link} to="/login">
            Log in
          </Button>
        </Stack>
      )}
    </Page>
  );
}
