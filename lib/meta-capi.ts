"use server";

import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const API_VERSION = "v21.0";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface EventParams {
  eventName: "Lead" | "CompleteRegistration" | "ViewContent" | "PageView";
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;   // _fbc cookie
  fbp?: string;   // _fbp cookie
  eventId?: string; // for deduplication with client-side pixel
  sourceUrl?: string;
  customData?: Record<string, unknown>;
}

export async function sendMetaEvent(params: EventParams) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log("[Meta CAPI] Skipped (no pixel ID or access token):", params.eventName);
    return;
  }

  const eventId = params.eventId || `${params.eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const userData: Record<string, unknown> = {};
  if (params.email) userData.em = [sha256(params.email)];
  if (params.phone) userData.ph = [sha256(params.phone.replace(/[^0-9]/g, ""))];
  if (params.firstName) userData.fn = [sha256(params.firstName)];
  if (params.lastName) userData.ln = [sha256(params.lastName)];
  if (params.clientIp) userData.client_ip_address = params.clientIp;
  if (params.userAgent) userData.client_user_agent = params.userAgent;
  if (params.fbc) userData.fbc = params.fbc;
  if (params.fbp) userData.fbp = params.fbp;

  const event = {
    event_name: params.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: params.sourceUrl || "https://virezia.com/las-orcas",
    user_data: userData,
    custom_data: params.customData || {},
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event] }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[Meta CAPI] Error:", result);
    } else {
      console.log(`[Meta CAPI] ${params.eventName} sent:`, result);
    }
  } catch (err) {
    console.error("[Meta CAPI] Failed:", err);
  }
}
