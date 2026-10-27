import { Resend } from "resend";
import { OTP_TTL_SECONDS } from "../config/auth.config.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_MINUTES = Math.round(OTP_TTL_SECONDS / 60);

type OtpEmailOptions = {
  subject: string;
  heading: string;
  message: string;
  code: string;
  accentColor: string;
  backgroundColor: string;
  notice: string;
};

async function sendOtpEmail(to: string, options: OtpEmailOptions) {
  const fromEmail = process.env.EMAIL_FROM as string;
  const appName = process.env.APP_NAME || "Auth App";

  const { data, error } = await resend.emails.send({
    from: `${appName} <${fromEmail}>`,
    to,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333;">${options.heading}</h2>
          <p>${options.message}</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: ${options.accentColor}; background: ${options.backgroundColor}; padding: 10px 20px; display: inline-block; border-radius: 6px;">
            ${options.code}
          </h1>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            ${options.notice}
          </p>
        </div>
      </div>
    `,
    text: `${options.message} ${options.code}. ${options.notice}`,
    replyTo: fromEmail,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

export async function sendVerificationEmail(to: string, code: string) {
  return sendOtpEmail(to, {
    subject: "Verify your email address",
    heading: "Email Verification",
    message: "Your verification code is:",
    code,
    accentColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
    notice: `This code will expire in ${OTP_MINUTES} minutes.`,
  });
}

export async function sendPasswordResetEmail(to: string, code: string) {
  return sendOtpEmail(to, {
    subject: "Password Reset Request",
    heading: "Password Reset",
    message: "We received a request to reset your password. Your reset code is:",
    code,
    accentColor: "#DC2626",
    backgroundColor: "#FEF2F2",
    notice: `This code will expire in ${OTP_MINUTES} minutes. If you did not request this, you can ignore this email.`,
  });
}
