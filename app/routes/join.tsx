import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link as RemixLink,
  useActionData,
  useSearchParams,
} from "@remix-run/react";
import * as React from "react";
import Page from "~/components/Page";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign up - frcbrackets",
  };
};

export default function Join(): JSX.Element {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const actionData = useActionData<ActionData>();

  const emailRef = React.useRef<HTMLInputElement>();
  const usernameRef = React.useRef<HTMLInputElement>();
  const passwordRef = React.useRef<HTMLInputElement>();
  const confirmPasswordRef = React.useRef<HTMLInputElement>();

  React.useEffect(() => {
    if (actionData?.errors.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Page maxWidth="sm">
      <Typography variant="h3" component="h1" gutterBottom>
        Sign up
      </Typography>
      <Stack direction="column" spacing={1} sx={{ pb: 2 }}>
        <Typography variant="subtitle1">
          Fill out the form to create an account.
        </Typography>
        <Alert variant="outlined" severity="info">
          Your email address is used to verify your account and is never shared.
        </Alert>
      </Stack>
      <Form method="post" noValidate>
        <Stack direction="column" spacing={2}>
          <TextField
            label="Email address"
            inputRef={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            error={!!actionData?.errors.email}
            helperText={actionData?.errors.email}
          />
          <TextField
            label="Username"
            inputRef={usernameRef}
            id="username"
            name="username"
            required
            // error={!!actionData?.errors.email}
            // helperText={actionData?.errors.email}
          />
          <TextField
            label="Password"
            inputRef={passwordRef}
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            error={!!actionData?.errors.password}
            helperText={actionData?.errors.password}
          />
          <TextField
            label="Confirm password"
            inputRef={confirmPasswordRef}
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            // error={!!actionData?.errors.password}
            // helperText={actionData?.errors.password}
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" variant="contained">
            Create account
          </Button>
          <Box alignSelf="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component={RemixLink}
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Form>
    </Page>
  );
}
