"use server";

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function esc(v: unknown): string {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

const STAGE: Record<string, string> = {
  new: "New",
  screening: "In Progress",
  qualified: "Qualified",
  matched: "Qualified",
  in_progress: "In Progress",
  closed_won: "Connected",
  closed_lost: "Unqualified",
  archived: "Unqualified",
};
const PRIORITY: Record<string, string> = {
  low: "LOW", medium: "MEDIUM", high: "HIGH", urgent: "URGENT",
};

function lc(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

export async function GET(req: NextRequest) {
  // Auth: must be an admin/employee
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["super_admin", "employee"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const svc = await createServiceClient();
  const campaign = req.nextUrl.searchParams.get("campaign") || "las_orcas";

  // 1. Applications for this campaign
  const { data: apps } = await svc
    .from("applications")
    .select("user_id, step_data, created_at, user:profiles!applications_user_id_fkey(id, email, full_name, phone)")
    .eq("type", "las_orcas_campaign");

  // 2. Leads
  const { data: leads } = await svc
    .from("leads")
    .select("id, client_id, status, priority, score, notes, created_at")
    .eq("source", campaign === "las_orcas" ? "circle" : "manual");
  const leadByClient = new Map((leads ?? []).map((l) => [l.client_id, l]));

  // 3. All interactions for these leads (with creator name)
  const leadIds = (leads ?? []).map((l) => l.id).filter(Boolean);
  const { data: interactions } = leadIds.length
    ? await svc
        .from("interactions")
        .select("lead_id, type, content, created_at, creator:profiles!interactions_created_by_fkey(full_name)")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: true })
    : { data: [] as { lead_id: string; type: string; content: string; created_at: string; creator: { full_name?: string } | null }[] };

  // Group interactions per lead
  const intsByLead = new Map<string, string[]>();
  for (const i of interactions ?? []) {
    const creator = (i.creator as { full_name?: string } | null)?.full_name || "team";
    const ts = (i.created_at || "").slice(0, 16).replace("T", " ");
    const line = `[${ts}] ${i.type.toUpperCase()} (${creator}): ${i.content}`;
    const arr = intsByLead.get(i.lead_id) || [];
    arr.push(line);
    intsByLead.set(i.lead_id, arr);
  }

  // 4. Merge by email (prefer Stage 2 app)
  type AppRow = NonNullable<typeof apps>[number];
  const byEmail = new Map<string, { a: AppRow; sd: Record<string, unknown> }>();
  for (const a of apps ?? []) {
    const sd = (a.step_data || {}) as Record<string, unknown>;
    const email = lc((a.user as { email?: string } | null)?.email || (sd.email as string));
    if (!email) continue;
    const existing = byEmail.get(email);
    if (!existing || sd.las_orcas_founding_interest === true) byEmail.set(email, { a, sd });
  }

  // 5. Build rows
  type Row = Record<string, string | number>;
  const rows: Row[] = [];

  for (const [email, { a, sd }] of Array.from(byEmail.entries())) {
    const prof = a.user as { id?: string; full_name?: string; phone?: string } | null;
    const lead = prof?.id ? leadByClient.get(prof.id) : undefined;
    const isFounding = sd.las_orcas_founding_interest === true;
    const matched = sd.matched === true;

    const fullName = ((prof?.full_name as string) || (sd.full_name as string) || "").trim();
    const [first, ...rest] = fullName.split(" ");
    const last = rest.join(" ");

    const interactions_text = lead
      ? (intsByLead.get(lead.id) || []).join(" | ")
      : "";

    rows.push({
      "First Name": first || "",
      "Last Name": last || "",
      "Email": email,
      "Phone Number": (prof?.phone as string) || (sd.phone as string) || "",
      "Lifecycle Stage": matched ? "marketingqualifiedlead" : "lead",
      "Lead Status": lead ? (STAGE[lead.status] || "New") : (isFounding ? "In Progress" : "New"),
      "Priority": lead ? (PRIORITY[lead.priority] || "") : "",
      "Lead Score": lead?.score ?? "",
      "Budget Range": (sd.investment_range as string) || (sd.budget_range as string) || "",
      "Timeline": (sd.timeline as string) || "",
      "Intent / Purpose": (sd.intent as string) || (sd.purpose as string) || (sd.context as string) || "",
      "Investment Type": (sd.investment_type as string) || "",
      "Regions of Interest": Array.isArray(sd.regions_interest)
        ? (sd.regions_interest as string[]).join("; ")
        : ((sd.regions_interest as string) || ""),
      "Campaign": "Las Orcas",
      "Source": "Circle / Las Orcas Campaign",
      "Stage in Funnel": isFounding
        ? (matched ? "Founding — Matched" : "Founding — Not Matched")
        : "Circle Join (Stage 1 only)",
      "Founding Interest": isFounding ? "Yes" : "No",
      "Budget Matched": matched ? "Yes" : "No",
      "UTM Source": (sd.utm_source as string) || "",
      "UTM Medium": (sd.utm_medium as string) || "",
      "UTM Campaign": (sd.utm_campaign as string) || "",
      "CRM Notes": lead?.notes || "",
      "Interaction History": interactions_text,
      "Created Date": (a.created_at || "").slice(0, 10),
    });
  }

  // Sort: matched → founding → circle-only → by date
  rows.sort((a, b) => {
    if (a["Budget Matched"] !== b["Budget Matched"]) return a["Budget Matched"] === "Yes" ? -1 : 1;
    if (a["Founding Interest"] !== b["Founding Interest"]) return a["Founding Interest"] === "Yes" ? -1 : 1;
    return String(a["Created Date"]).localeCompare(String(b["Created Date"]));
  });

  if (!rows.length) {
    return NextResponse.json({ error: "No data" }, { status: 404 });
  }

  const headers = Object.keys(rows[0]);
  const csv =
    "﻿" + // BOM for Excel
    [headers.map(esc).join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="las-orcas-leads-${date}.csv"`,
    },
  });
}
