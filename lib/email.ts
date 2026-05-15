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
const REPLY_TO = "hello@virezia.com";
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
    <p>Review in the <a href="https://virezia.com/admin/applications">admin panel</a>.</p>`
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
    <p>Review in the <a href="https://virezia.com/admin/partners">admin panel</a>.</p>`
  );
}

/* ─── Partner lead notification ─────────────────────────────── */

export async function sendPartnerLeadNotification(partnerEmail: string, subject: string, html: string) {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped partner notification (no API key):", partnerEmail);
    return;
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: partnerEmail,
      subject,
      html: emailWrapper(html),
    });
  } catch (err) {
    console.error("[Email] Partner notification failed:", err);
  }
}

/* ─── Confirmation email for public forms ──────────────────── */

export async function sendApplicationConfirmation(email: string, firstName: string, type: "apply" | "for-owners" | "circle") {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped confirmation (no API key):", email);
    return;
  }

  const subjects: Record<string, string> = {
    apply: "Your Application Has Been Received",
    "for-owners": "Your Property Submission Has Been Received",
    circle: "Your Request Has Been Noted",
  };

  const bodies: Record<string, string> = {
    apply: `We review every application individually and will be in touch within 48 hours.`,
    "for-owners": `We review every submission against our current featuring criteria. If there is a fit, we will reach out within 5 business days.`,
    circle: `If there is a fit, someone will reach out directly.`,
  };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: subjects[type],
      html: emailWrapper(`
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Thank you${firstName ? `, ${escapeHtml(firstName)}` : ""}.</h1>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">${bodies[type]}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
      `),
    });
  } catch (err) {
    console.error("[Email] Confirmation failed:", err);
  }
}

/* ─── Emails to leads (table-based, inline styles, Gmail-safe) ── */

function emailWrapper(content: string): string {
  const siteUrl = "https://virezia.com";
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>VIREZIA</title>
<!--[if mso]><style>table,td{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;">
<tr><td align="center" style="padding:40px 16px;">

<!-- Main container -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border:1px solid #e8e4de;">

<!-- Logo -->
<tr><td style="padding:40px 40px 32px 40px;border-bottom:1px solid #e8e4de;">
  <a href="${siteUrl}" style="text-decoration:none;">
    <img src="${siteUrl}/logo.png" alt="VIREZIA" width="120" height="auto" style="display:block;height:auto;max-width:120px;border:0;" />
  </a>
</td></tr>

<!-- Content -->
<tr><td style="padding:40px 40px 32px 40px;">
${content}
</td></tr>

<!-- Footer separator -->
<tr><td style="padding:0 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px 40px 40px;">
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#999999;margin:0 0 8px 0;">
    VIREZIA &middot; Curated Selections in Mexico and Latin America
  </p>
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#999999;margin:0 0 8px 0;">
    KONAMIYA LLC &middot; 30 N Gould St, STE R, Sheridan, WY 82801, USA
  </p>
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#999999;margin:0 0 8px 0;">
    You received this email because you joined the VIREZIA Circle.
  </p>
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;margin:0;">
    <a href="mailto:hello@virezia.com" style="color:#999999;">hello@virezia.com</a>
    &nbsp;&middot;&nbsp;
    <a href="${siteUrl}/privacy" style="color:#999999;">Privacy Policy</a>
    &nbsp;&middot;&nbsp;
    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#999999;">Unsubscribe</a>
  </p>
</td></tr>

</table>
<!-- End container -->

</td></tr>
</table>
</body>
</html>`;
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
      replyTo: REPLY_TO,
      to: email,
      subject: "We've received your interest",
      html: emailWrapper(`
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Thank you for your interest.</h1>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">We have received your inquiry. Someone from our team will reach out to you within 24 hours.</p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">If you have any questions in the meantime, reply to this email or write to us at hello@virezia.com.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">VIREZIA</p>
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

  const siteUrl = "https://virezia.com";

  const matchedContent = `
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Your interest has been recorded.</h1>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Thank you for expressing interest as a Las Orcas founding member. We will be in touch within 24 hours to arrange a personal introduction.</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">In the meantime, here is the full conversation with Robert Couturier on Las Orcas:</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;"><a href="${siteUrl}/circle/confirmed" style="display:inline-block;border:1px solid #1a1a1a;color:#1a1a1a;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;margin-top:8px;">Watch the Full Conversation</a></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Over the next two weeks, we will also share the editorial dossier on Las Orcas and more about how VIREZIA Selections works.</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">If you have questions, reply to this email.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
  `;

  const unmatchedContent = `
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Welcome to VIREZIA Circle.</h1>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${escapeHtml(firstName)}` : ""},</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Thank you for your interest. You are now part of VIREZIA Circle.</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">We curate a small number of opportunities each quarter. Over the next two weeks, we will share more about Robert Couturier, Las Orcas, and how VIREZIA Selections works.</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Expect to hear from us when something aligns with your profile.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
  `;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
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

// Audience IDs
const AUDIENCE_CIRCLE = "4351a5d2-f99a-40ec-95bc-46f7195b9a5f";
const AUDIENCE_LAS_ORCAS = "fc49c1de-f734-4ffc-872a-f5ac7883e4bc";

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

  // Add to VIREZIA Circle audience
  try {
    await client.contacts.create({
      audienceId: AUDIENCE_CIRCLE,
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      unsubscribed: false,
    });
  } catch (err) {
    console.error("[Email] Circle contact failed:", err);
  }

  // Add to Las Orcas audience if from that campaign
  if (properties.source === "las_orcas_campaign") {
    try {
      await client.contacts.create({
        audienceId: AUDIENCE_LAS_ORCAS,
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        unsubscribed: false,
      });
    } catch (err) {
      console.error("[Email] Las Orcas contact failed:", err);
    }
  }
}

/* ─── Las Orcas Drip Sequence (5 emails / 14 days) ─────────── */

function scheduleDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

const SEQUENCE_EMAILS = {
  day2: {
    subject: "Robert Couturier — A Brief Biography",
    content: (firstName: string) => `
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Robert Couturier</h1>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${firstName}` : ""},</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">In 1987, Sir James Goldsmith entrusted a thirty-two-year-old French architect with the single greatest private commission of modern times: a 20,000-acre estate on Mexico's Pacific Coast.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">The result was Cuixmala, later named by Architectural Digest among the seven most beautiful resorts on the Pacific. The commission lasted a decade. It launched Robert Couturier's career.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Since then, Couturier has worked across four continents. He was named to the <strong>AD100</strong>, Architectural Digest's definitive list of the world's top architects and designers. His monograph <em>Designing Paradises</em> was published by Rizzoli.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Las Orcas is his return to Mexico's Pacific Coast.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
    `,
  },
  day5: {
    subject: "Designing in Mexico — Couturier's Slow-Luxury Thesis",
    content: (firstName: string) => `
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Designing in Mexico</h1>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${firstName}` : ""},</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">"What I love about Mexico is the incredible kindness of its people, the devotion of its workers, and their intelligence in making your dream come true."</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Robert Couturier has worked in Mexico for over four decades. His thesis is simple: luxury is not marble and gold leaf. It is the ability to live simply, comfortably, with excellent food, with great services, and to have a slow, peaceful life.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">The Pacific Coast of Oaxaca has quietly become the most concentrated architectural destination in Mexico. Casa Wabi by Tadao Ando. Casona Sforza by Alberto Kalach. Hotel Terrestre. Casa TO by Ludwig Godefroy.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Until now, this architecture could be visited. It could not be inhabited. Las Orcas changes that.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
    `,
  },
  day9_matched: {
    subject: "Las Orcas — The Project",
    content: (firstName: string) => `
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Las Orcas</h1>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${firstName}` : ""},</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Seven private residences on a single beachfront parcel in Puerto Escondido, Oaxaca. Four villas and three casitas, designed by Robert Couturier as a small village.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">The construction is in concrete and stone. Each residence has its own private deed and rooftop plunge pool. Pre-titled lots. Direct access to the uncrowded beach of La Barra.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Six residences remain available. Casitas from $561,000. Villas from $861,000.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Construction by Quantia. Estimated completion: Q2 2026 to Q3 2027.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;"><strong>Your next step:</strong></p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">If you haven't already, schedule a conversation with Paul Krueger, who oversees the Las Orcas process.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;"><a href="https://virezia.com/circle/confirmed" style="display:inline-block;border:1px solid #1a1a1a;color:#1a1a1a;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;margin-top:8px;">View Full Details</a></p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
    `,
  },
  day9_unmatched: {
    subject: "Las Orcas — An Editorial Overview",
    content: (firstName: string) => `
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">Las Orcas</h1>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${firstName}` : ""},</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Seven private residences on a single beachfront parcel in Puerto Escondido, Oaxaca. Four villas and three casitas, designed by Robert Couturier, the architect behind Cuixmala.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">The construction is in concrete and stone. Each residence has its own private deed, rooftop plunge pool, and direct beach access. Six residences remain available.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Las Orcas is the first architect-designed residential project on the Oaxacan Coast, a stretch of coastline that has drawn Tadao Ando, Alberto Kalach, and Ludwig Godefroy.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">We will continue to share opportunities as they align with your profile.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
    `,
  },
  day14: {
    subject: "How VIREZIA Selections Works",
    content: (firstName: string) => `
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:300;line-height:1.3;color:#1a1a1a;margin:0 0 20px 0;">How Selections Work</h1>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Hello${firstName ? ` ${firstName}` : ""},</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">VIREZIA Selections is a small group of properties we've chosen for their architecture, their location, or the story behind them.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Every property in VIREZIA Circle was chosen for a reason. Usually it's the architecture, the location, or the investment logic. We keep the number small enough to know every property well.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">Las Orcas was our first Selection. More are in preparation. As a member of the VIREZIA Circle, you will be among the first to know when the next Selection is announced.</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:#4a4a4a;margin:0 0 16px 0;">If you have questions or want to discuss what you are looking for, reply to this email. Every message is read personally.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #e8e4de;height:1px;font-size:0;">&nbsp;</td></tr></table>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#c9a96e;margin:0;">&mdash; VIREZIA</p>
    `,
  },
};

export async function scheduleLasOrcasSequence(
  email: string,
  firstName: string,
  matched: boolean
) {
  const client = getResendClient();
  if (!client) {
    console.log("[Email] Skipped drip sequence (no API key):", email);
    return;
  }

  const safeName = escapeHtml(firstName);

  const emails = [
    {
      subject: SEQUENCE_EMAILS.day2.subject,
      html: emailWrapper(SEQUENCE_EMAILS.day2.content(safeName)),
      scheduledAt: scheduleDate(2),
    },
    {
      subject: SEQUENCE_EMAILS.day5.subject,
      html: emailWrapper(SEQUENCE_EMAILS.day5.content(safeName)),
      scheduledAt: scheduleDate(5),
    },
    {
      subject: matched ? SEQUENCE_EMAILS.day9_matched.subject : SEQUENCE_EMAILS.day9_unmatched.subject,
      html: emailWrapper(
        matched
          ? SEQUENCE_EMAILS.day9_matched.content(safeName)
          : SEQUENCE_EMAILS.day9_unmatched.content(safeName)
      ),
      scheduledAt: scheduleDate(9),
    },
    {
      subject: SEQUENCE_EMAILS.day14.subject,
      html: emailWrapper(SEQUENCE_EMAILS.day14.content(safeName)),
      scheduledAt: scheduleDate(14),
    },
  ];

  for (const em of emails) {
    try {
      await client.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO,
        to: email,
        subject: em.subject,
        html: em.html,
        scheduledAt: em.scheduledAt,
      });
    } catch (err) {
      console.error(`[Email] Sequence "${em.subject}" schedule failed:`, err);
    }
  }

  console.log(`[Email] Scheduled 4 sequence emails for ${email} (matched: ${matched})`);
}
