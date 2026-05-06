"use server";

import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const FROM_EMAIL = "VIREZIA <hello@circle.virezia.com>";
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

/* ─── Internal notifications (to team) ─────────────────────── */

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

/* ─── Emails to leads ──────────────────────────────────────── */

const EMAIL_STYLES = `
  body { background-color: #080808; color: #f0ece4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
  .logo { font-family: Georgia, 'Times New Roman', serif; font-size: 18px; letter-spacing: 0.15em; color: #c9a96e; margin-bottom: 48px; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 300; line-height: 1.3; color: #f0ece4; margin: 0 0 24px 0; }
  p { font-size: 15px; line-height: 1.7; color: #9a9690; margin: 0 0 16px 0; }
  .gold { color: #c9a96e; }
  .muted { color: #5a5650; font-size: 12px; }
  .separator { border: none; border-top: 1px solid #222222; margin: 32px 0; }
  .btn { display: inline-block; border: 1px solid #c9a96e; color: #c9a96e; padding: 14px 32px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; margin-top: 8px; }
  a { color: #c9a96e; }
`;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head>
<body><div class="container">
<div class="logo">VIREZIA</div>
${content}
<hr class="separator">
<p class="muted">VIREZIA &middot; Curated Selections in Mexico and Latin America</p>
<p class="muted">You received this email because you joined the VIREZIA Circle.<br>
<a href="mailto:hello@virezia.com" style="color: #5a5650;">hello@virezia.com</a></p>
</div></body></html>`;
}

export async function sendCircleWelcome(email: string, firstName: string) {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped Circle welcome (no API key):", email);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to VIREZIA Circle",
      html: emailWrapper(`
        <h1>Welcome to the Circle.</h1>
        <p>Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
        <p>You are now part of VIREZIA Circle &mdash; a private network for those with active acquisition intent in markets we cover.</p>
        <p>Over the next two weeks, we will share more about how VIREZIA works, the properties we are currently featuring, and how Selections are made.</p>
        <p>If you have questions at any point, reply to this email. Every message is read personally.</p>
        <hr class="separator">
        <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">
          &mdash; VIREZIA
        </p>
      `),
    });
  } catch (err) {
    console.error("[Email] Circle welcome failed:", err);
  }
}

export async function sendFoundingMemberWelcome(
  email: string,
  firstName: string,
  matched: boolean
) {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped Founding Member welcome (no API key):", email);
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virezia.vercel.app";

  const matchedContent = `
    <h1>Your interest has been recorded.</h1>
    <p>Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
    <p>Thank you for expressing interest as a Las Orcas founding member. We will be in touch within 24 hours to arrange a personal introduction.</p>
    <p>In the meantime, here is the full conversation with Robert Couturier on Las Orcas &mdash; the architect in his own words:</p>
    <p><a href="${siteUrl}/circle/confirmed" class="btn">Watch the Full Conversation</a></p>
    <hr class="separator">
    <p>Over the next two weeks, we will also share the editorial dossier on Las Orcas and more about how VIREZIA Selections works.</p>
    <p>If you have questions, reply to this email.</p>
    <hr class="separator">
    <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">
      &mdash; VIREZIA
    </p>
  `;

  const unmatchedContent = `
    <h1>Welcome to VIREZIA Circle.</h1>
    <p>Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
    <p>Thank you for your interest. You are now part of VIREZIA Circle.</p>
    <p>We curate a small number of opportunities each quarter &mdash; selected for architectural significance, location, and story. Over the next two weeks, we will share more about Robert Couturier, Las Orcas, and how VIREZIA Selections works.</p>
    <p>Expect to hear from us when something aligns with your profile.</p>
    <hr class="separator">
    <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">
      &mdash; VIREZIA
    </p>
  `;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: matched
        ? "Las Orcas — Your Interest Has Been Recorded"
        : "Welcome to VIREZIA Circle",
      html: emailWrapper(matched ? matchedContent : unmatchedContent),
    });
  } catch (err) {
    console.error("[Email] Founding Member welcome failed:", err);
  }
}

/* ─── Resend Contacts (for audience/broadcast sequences) ───── */

export async function addToResendContacts(
  email: string,
  firstName: string,
  lastName: string,
  properties: Record<string, string | boolean>
) {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped contact create (no API key):", email);
    return;
  }

  try {
    await client.contacts.create({
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      unsubscribed: false,
    });
  } catch (err) {
    console.error("[Email] Contact create failed:", err);
  }
}
