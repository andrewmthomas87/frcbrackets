import { Button, Stack, TextField, Typography } from "@mui/material";
import type { User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Page from "~/components/Page";
import { prisma } from "~/db.server";
import { requireUser, requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = requireUser(request);

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const verificationCode = formData.get("verification-code");

  if (
    !(
      verificationCode &&
      typeof verificationCode === "string" &&
      verificationCode.length === 4 &&
      /^[A-Z0-9]+$/.test(verificationCode)
    )
  ) {
    return json({ error: "Invalid code" }, { status: 400 });
  }

  const userID = await requireUserId(request);
  const user = await prisma.user.findFirst({
    where: {
      id: userID,
      verified: false,
      verificationCode,
    },
  });
  if (!user) {
    return json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      verificationCode: null,
      verified: true,
    },
  });

  return redirect("/dashboard");
};

export const meta: MetaFunction = () => {
  return {
    title: "Verify account - frcbrackets",
  };
};

export default function VerifyPage(): JSX.Element {
  const user = useLoaderData<User>();
  const actionData = useActionData<{ error?: string }>();

  const [verificationCode, setVerificationCode] = useState("");

  const verificationCodeRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (actionData?.error) {
      verificationCodeRef.current?.focus();
    }
  }, [actionData]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setVerificationCode(event.currentTarget.value.toUpperCase()),
    [setVerificationCode]
  );

  return (
    <Page maxWidth="sm">
      <Typography variant="h3" component="h1" gutterBottom>
        Verify account
      </Typography>
      <Stack direction="column" spacing={1} sx={{ pb: 2 }}>
        <Typography variant="subtitle1">
          An email with an access code has been sent to <b>{user.email}</b>. To
          verify your account, retrieve the access code and input it below.
        </Typography>
      </Stack>
      <Form method="post" noValidate>
        <Stack direction="column" spacing={2}>
          <TextField
            label="Verification code"
            inputRef={verificationCodeRef}
            name="verification-code"
            value={verificationCode}
            required
            autoFocus
            error={!!actionData?.error}
            helperText={actionData?.error}
            onChange={onChange}
          />
          <Button type="submit" variant="contained">
            Verify
          </Button>
        </Stack>
      </Form>
    </Page>
  );
}
