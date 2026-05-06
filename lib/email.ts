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

/* ─── Las Orcas Drip Sequence (5 emails / 14 days) ─────────── */

function scheduleDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(10, 0, 0, 0); // 10:00 AM
  return d.toISOString();
}

const SEQUENCE_EMAILS = {
  day2: {
    subject: "Robert Couturier — A Brief Biography",
    content: (firstName: string) => `
      <h1>Robert Couturier</h1>
      <p>Hello${firstName ? ` ${firstName}` : ""},</p>
      <p>In 1987, Sir James Goldsmith entrusted a thirty-two-year-old French architect with the single greatest private commission of modern times: a 20,000-acre estate on Mexico&rsquo;s Pacific Coast.</p>
      <p>The result was Cuixmala &mdash; later named by Architectural Digest among the seven most beautiful resorts on the Pacific. The commission lasted a decade. It launched Robert Couturier&rsquo;s career.</p>
      <p>Since then, Couturier has worked across four continents &mdash; from Manhattan townhouses to estates in France, England, Russia, and the Middle East. He was named to the <strong>AD100</strong>, Architectural Digest&rsquo;s definitive list of the world&rsquo;s top architects and designers. His monograph <em>Designing Paradises</em> was published by Rizzoli.</p>
      <p>His clients have included Sir James Goldsmith and Jeff Koons. His work has been published in <em>Architectural Digest</em>, <em>The New York Times</em>, <em>Elle</em>, and <em>1stDibs</em>.</p>
      <p>Las Orcas is his return to Mexico&rsquo;s Pacific Coast &mdash; the first time he has designed a private residential project in the country since Cuixmala.</p>
      <hr class="separator">
      <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">&mdash; VIREZIA</p>
    `,
  },
  day5: {
    subject: "Designing in Mexico — Couturier's Slow-Luxury Thesis",
    content: (firstName: string) => `
      <h1>Designing in Mexico</h1>
      <p>Hello${firstName ? ` ${firstName}` : ""},</p>
      <p>&ldquo;What I love about Mexico is the incredible kindness of its people, the devotion of its workers, and their intelligence in making your dream come true.&rdquo;</p>
      <p>Robert Couturier has worked in Mexico for over four decades. When the developers of Las Orcas approached him about Puerto Escondido, his answer was personal before it was professional.</p>
      <p>His thesis is simple: luxury is not marble and gold leaf. It is the ability to live simply, comfortably, with excellent food, with great services &mdash; and to have a slow, peaceful life.</p>
      <p>&ldquo;Puerto Escondido is being discovered. Most of the developments there are environmentally friendly, family-friendly. You don&rsquo;t have the feeling that you live on top of each other.&rdquo;</p>
      <p>The Pacific Coast of Oaxaca has quietly become the most concentrated architectural destination in Mexico. Casa Wabi by Tadao Ando. Casona Sforza by Alberto Kalach. Hotel Terrestre. Casa TO by Ludwig Godefroy.</p>
      <p>Until now, this architecture could be visited. It could not be inhabited. Las Orcas changes that.</p>
      <hr class="separator">
      <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">&mdash; VIREZIA</p>
    `,
  },
  day9_matched: {
    subject: "Las Orcas — The Project",
    content: (firstName: string, siteUrl: string) => `
      <h1>Las Orcas</h1>
      <p>Hello${firstName ? ` ${firstName}` : ""},</p>
      <p>Seven private residences on a single beachfront parcel in Puerto Escondido, Oaxaca. Four villas and three casitas, designed by Robert Couturier as a small village.</p>
      <p>The construction is in concrete and stone &mdash; materials chosen to live in the sea air and age gracefully. Each residence has its own private deed and rooftop plunge pool. Pre-titled lots. Direct access to the uncrowded beach of La Barra.</p>
      <p>Five residences remain available. Casitas from $561,000. Villas from $861,000.</p>
      <p>Construction by Quantia. Estimated completion: Q2 2026 &mdash; Q3 2027.</p>
      <hr class="separator">
      <p><strong>Your next step:</strong></p>
      <p>If you haven&rsquo;t already, schedule a conversation with Paul Krueger, who oversees the Las Orcas process.</p>
      <p><a href="${siteUrl}/circle/confirmed" class="btn">View Full Details</a></p>
      <hr class="separator">
      <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">&mdash; VIREZIA</p>
    `,
  },
  day9_unmatched: {
    subject: "Las Orcas — An Editorial Overview",
    content: (firstName: string) => `
      <h1>Las Orcas</h1>
      <p>Hello${firstName ? ` ${firstName}` : ""},</p>
      <p>Seven private residences on a single beachfront parcel in Puerto Escondido, Oaxaca. Four villas and three casitas, designed by Robert Couturier &mdash; the architect behind Cuixmala.</p>
      <p>The construction is in concrete and stone. Each residence has its own private deed, rooftop plunge pool, and direct beach access. Five residences remain available.</p>
      <p>Las Orcas is the first private residential project at this tier on the Oaxacan Coast &mdash; a stretch of coastline that has drawn Tadao Ando, Alberto Kalach, and Ludwig Godefroy.</p>
      <p>We will continue to share opportunities as they align with your profile.</p>
      <hr class="separator">
      <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">&mdash; VIREZIA</p>
    `,
  },
  day14: {
    subject: "How VIREZIA Selections Works",
    content: (firstName: string) => `
      <h1>How Selections Work</h1>
      <p>Hello${firstName ? ` ${firstName}` : ""},</p>
      <p>VIREZIA Selections is a small set of curated opportunities &mdash; selected for architectural significance, location, and the story behind them.</p>
      <p>We don&rsquo;t list properties. We select them. Every property in VIREZIA Circle is chosen personally for its architecture, design, location, story, investment thesis, or off-market access.</p>
      <p>We feature a defined number of properties at any time. Not the largest. Not the cheapest. The right ones for the right buyer.</p>
      <p>Las Orcas was our first Selection. More are in preparation. As a member of the VIREZIA Circle, you will be among the first to know when the next Selection is announced.</p>
      <p>If you have questions or want to discuss what you are looking for, reply to this email. Every message is read personally.</p>
      <hr class="separator">
      <p class="gold" style="font-family: Georgia, serif; font-size: 14px; font-style: italic;">&mdash; VIREZIA</p>
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virezia.vercel.app";
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
          ? SEQUENCE_EMAILS.day9_matched.content(safeName, siteUrl)
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
