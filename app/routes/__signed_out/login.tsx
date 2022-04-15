import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
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
import { verifyLogin } from "~/models/user.server";
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

function errorResponse(
  errors: ActionData["errors"],
  status: number = 400
): Response {
  return json<ActionData>({ errors }, { status });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return errorResponse({ email: "Email is invalid" });
  }

  if (typeof password !== "string") {
    return errorResponse({ password: "Password is required" });
  }
  if (password.length < 8) {
    return errorResponse({ password: "Password is too short" });
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return errorResponse({ email: "Invalid email or password" });
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Log in - frcbrackets",
  };
};

export default function LoginPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const actionData = useActionData<ActionData>();

  const emailRef = React.useRef<HTMLInputElement>();
  const passwordRef = React.useRef<HTMLInputElement>();

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
        Log in
      </Typography>
      <Stack direction="column" spacing={1} sx={{ pb: 2 }}>
        <Typography variant="subtitle1">
          Enter your email and password to log in.
        </Typography>
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
            label="Password"
            inputRef={passwordRef}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            error={!!actionData?.errors.password}
            helperText={actionData?.errors.password}
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" variant="contained">
            Log in
          </Button>
          <Box alignSelf="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component={RemixLink}
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Form>
    </Page>
  );
}
