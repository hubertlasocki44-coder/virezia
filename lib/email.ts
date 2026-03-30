import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "VIREZIA <onboarding@resend.dev>";
const NOTIFY_EMAIL = "hello@virezia.com";

export async function sendNotification(subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your-resend-api-key-here") {
    console.log("[Email] Skipped (no API key):", subject);
    return;
  }

  try {
    await resend.emails.send({
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
  await sendNotification(
    `New Application: ${name}`,
    `<h2>New ${type} application</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/applications">admin panel</a>.</p>`
  );
}

export async function notifyCircleRequest(email: string) {
  await sendNotification(
    `Circle Request: ${email}`,
    `<h2>New VIREZIA Circle Request</h2>
    <p><strong>Email:</strong> ${email}</p>`
  );
}

export async function notifyPartnerSubmission(name: string, company: string) {
  await sendNotification(
    `Partner Application: ${company}`,
    `<h2>New Partner Application</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/partners">admin panel</a>.</p>`
  );
}
