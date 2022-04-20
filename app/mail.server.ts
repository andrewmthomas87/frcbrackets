import { createTransport } from "nodemailer";

const transport = createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
  },
});

export async function sendVerifyEmail(
  email: string,
  code: string
): Promise<void> {
  const message = `Your verification code is ${code}. Log in to https://frcbrackets.com/ and enter this code to verify your account.`;

  await transport.sendMail({
    from: process.env.MAIL_FROM!,
    to: email,
    subject: "Verify your frcbrackets.com account",
    text: message,
  });
}
