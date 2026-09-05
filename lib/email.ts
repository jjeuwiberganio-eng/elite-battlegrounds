import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD must be set in .env to send emails.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getTransporter();

  await client.sendMail({
    from: `"Elite Battlegrounds Series" <${process.env.GMAIL_USER}>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
}

/*
|--------------------------------------------------------------------------
| Email Templates
|--------------------------------------------------------------------------
| Kept intentionally plain (inline styles, no external assets) since
| this only needs to render reliably in Gmail/Outlook, not match the
| site's design system.
*/

export function otpEmailHtml(code: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0f172a;">Your Elite Battlegrounds Series login code</h2>
      <p style="color: #475569; font-size: 14px;">
        Enter this code to finish signing in. It expires in 10 minutes.
      </p>
      <div style="background: #0f172a; color: #fbbf24; font-size: 32px; font-weight: 900; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 12px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #94a3b8; font-size: 12px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

export function newDeviceAlertHtml(data: {
  ipAddress: string;
  userAgent: string;
  time: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #b91c1c;">New sign-in to your admin account</h2>
      <p style="color: #475569; font-size: 14px;">
        Your Elite Battlegrounds Series admin account was just accessed from a device/location we haven't seen before.
      </p>
      <table style="width: 100%; font-size: 13px; color: #334155; margin: 16px 0;">
        <tr><td style="padding: 4px 0; font-weight: bold;">Time</td><td>${data.time}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">IP Address</td><td>${data.ipAddress}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Device</td><td>${data.userAgent}</td></tr>
      </table>
      <p style="color: #94a3b8; font-size: 12px;">
        If this was you, no action is needed. If you don't recognize this, change your password immediately.
      </p>
    </div>
  `;
}
