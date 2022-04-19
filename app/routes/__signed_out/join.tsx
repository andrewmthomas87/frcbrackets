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
import { sendVerifyEmail } from "~/mail.server";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "~/models/user.server";
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
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
}

function errorResponse(
  errors: ActionData["errors"],
  status: number = 400
): Response {
  return json<ActionData>({ errors }, { status });
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }
  return code;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return errorResponse({ email: "Email is invalid " });
  }

  if (typeof username !== "string") {
    return errorResponse({ username: "Username is invalid" });
  }
  if (username.length < 4 || username.length > 16) {
    return errorResponse({ username: "Username must be 4-16 characters long" });
  }
  if (!/^[a-z0-9_]*$/i.test(username)) {
    return errorResponse({
      username: "Username must contain only letters, numbers, and underscores",
    });
  }
  if (username.startsWith("_")) {
    return errorResponse({
      username: "Username must start with a letter or number",
    });
  }

  if (typeof password !== "string") {
    return errorResponse({ password: "Password is required" });
  }
  if (password.length < 8 || password.length > 128) {
    return errorResponse({ password: "Password is too short" });
  }
  if (!/^[!-~]*$/.test(password)) {
    return errorResponse({ password: "Password contains invalid characters" });
  }

  if (typeof confirmPassword !== "string") {
    return errorResponse({ confirmPassword: "Confirm password is required" });
  }
  if (confirmPassword !== password) {
    return errorResponse({ confirmPassword: "Passwords don't match" });
  }

  let existingUser = await getUserByEmail(email);
  if (existingUser) {
    return errorResponse({ email: "A user already exists with this email" });
  }
  existingUser = await getUserByUsername(username);
  if (existingUser) {
    return errorResponse({
      username: "A user already exists with this username",
    });
  }

  const code = generateCode();
  await sendVerifyEmail(email, code);

  const user = await createUser(email, username, password, code);

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign up - frcbrackets",
  };
};

export default function JoinPage(): JSX.Element {
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
    } else if (actionData?.errors.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors.confirmPassword) {
      confirmPasswordRef.current?.focus();
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
            error={!!actionData?.errors.username}
            helperText={actionData?.errors.username}
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
            error={!!actionData?.errors.confirmPassword}
            helperText={actionData?.errors.confirmPassword}
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
