import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { sendVerifyEmail } from "~/mail.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user.verified) {
    throw new Error("User already verified");
  }

  await sendVerifyEmail(user.email, user.verificationCode!);
  return redirect("./verify");
};
