import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const FROM_EMAIL = "VIREZIA <onboarding@resend.dev>";
const NOTIFY_EMAIL = "hello@virezia.com";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "your-resend-api-key-here") {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

export async function sendNotification(subject: string, html: string) {
  try {
    const client = getResendClient();
    if (!client) {
      console.log("[Email] Skipped (no API key):", subject);
      return;
    }

    await client.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error("[Email] Failed to send:", error);
  }
}

export async function notifyNewApplication(name: string, email: string, type: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(type);
  await sendNotification(
    `New Application: ${safeName}`,
    `<h2>New ${safeType} application</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Type:</strong> ${safeType}</p>
    <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/applications">admin panel</a>.</p>`
  );
}

export async function notifyCircleRequest(email: string) {
  const safeEmail = escapeHtml(email);
  await sendNotification(
    `Circle Request: ${safeEmail}`,
    `<h2>New VIREZIA Circle Request</h2>
    <p><strong>Email:</strong> ${safeEmail}</p>`
  );
}

export async function notifyPartnerSubmission(name: string, company: string) {
  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company);
  await sendNotification(
    `Partner Application: ${safeCompany}`,
    `<h2>New Partner Application</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Company:</strong> ${safeCompany}</p>
    <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/partners">admin panel</a>.</p>`
  );
}
