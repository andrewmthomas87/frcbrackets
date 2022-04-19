import { createTransport } from "nodemailer";

const transport = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_GMAIL_USER!,
    pass: process.env.MAIL_GMAIL_PASS!,
  },
});

export async function sendVerifyEmail(
  email: string,
  code: string
): Promise<void> {
  const message = `Your verification code is ${code}. Log in to https://frcbrackets.com/ and enter this code to verify your account.`;

  await transport.sendMail({
    from: process.env.MAIL_GMAIL_USER!,
    to: email,
    subject: "Verify your frcbrackets.com account",
    text: message,
  });
}
