"use client";

import { useState } from "react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import FormInput from "@/components/forms/FormInput";
import { updateLeadStatus, updateLeadPriority, updateLeadScore } from "@/lib/actions/leads";
import { addInteraction } from "@/lib/actions/interactions";
import { assignPartner, revokeAssignment } from "@/lib/actions/assignments";
import type { InteractionType, VisibilityLevel, LeadStatus, LeadPriority } from "@/lib/types";

interface Props {
  lead: Record<string, unknown>;
  buyerProfile: Record<string, unknown> | null;
  interactions: Record<string, unknown>[];
  assignments: Record<string, unknown>[];
  application: Record<string, unknown> | null;
  partners: Record<string, unknown>[];
  employees: Record<string, unknown>[];
}

const TABS = ["Profile", "Interactions", "Assignments", "Application", "Scorecards"];
const LEAD_STATUSES: LeadStatus[] = ["new", "screening", "qualified", "matched", "in_progress", "closed_won", "closed_lost", "archived"];
const PRIORITIES: LeadPriority[] = ["low", "medium", "high", "urgent"];
const INTERACTION_TYPES: InteractionType[] = ["note", "email", "call", "meeting", "whatsapp"];

export default function LeadDetailClient({
  lead,
  buyerProfile,
  interactions,
  assignments,
  application,
  partners,
  employees,
}: Props) {
  const [tab, setTab] = useState("Profile");
  const [assignModal, setAssignModal] = useState(false);
  const [interactionModal, setInteractionModal] = useState(false);

  const client = lead.client as Record<string, unknown> | null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="font-sans text-[12px] text-text-muted hover:text-text-secondary"
          >
            ← Back to Pipeline
          </Link>
          <h1 className="mt-2 font-serif text-[28px] font-light text-text-primary">
            {(client?.full_name as string) || (client?.email as string) || "Unknown Client"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <AdminStatusBadge status={lead.status as string} />
            <span className="font-sans text-sm text-text-muted">
              Priority: {lead.priority as string}
            </span>
            <span className="font-sans text-sm text-text-muted">
              Score: {lead.score as number}
            </span>
            {lead.source ? (
              <span className="font-sans text-[11px] text-text-muted">
                Source: {lead.source as string}
              </span>
            ) : null}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <select
            defaultValue={lead.status as string}
            onChange={async (e) => {
              await updateLeadStatus(lead.id as string, e.target.value as LeadStatus);
            }}
            className="border border-border bg-bg-card px-3 py-1.5 font-sans text-sm text-text-secondary"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            defaultValue={lead.priority as string}
            onChange={async (e) => {
              await updateLeadPriority(lead.id as string, e.target.value as LeadPriority);
            }}
            className="border border-border bg-bg-card px-3 py-1.5 font-sans text-sm text-text-secondary"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={() => setAssignModal(true)}
            className="border border-accent-gold/30 bg-accent-gold/5 px-3 py-1.5 font-sans text-sm text-accent-gold transition-colors hover:bg-accent-gold/10"
          >
            Assign Partner
          </button>
          <button
            onClick={() => setInteractionModal(true)}
            className="border border-border px-3 py-1.5 font-sans text-sm text-text-secondary hover:border-text-muted"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 font-sans text-sm transition-colors ${
              tab === t
                ? "border-accent-gold text-accent-gold"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tab === "Profile" && <ProfileTab client={client} buyerProfile={buyerProfile} />}
        {tab === "Interactions" && <InteractionsTab interactions={interactions} />}
        {tab === "Assignments" && (
          <AssignmentsTab
            assignments={assignments}
            leadId={lead.id as string}
          />
        )}
        {tab === "Application" && <ApplicationTab application={application} />}
        {tab === "Scorecards" && <ScorecardsTab lead={lead} />}
      </div>

      {/* Assign Partner Modal */}
      <AssignPartnerModal
        open={assignModal}
        onClose={() => setAssignModal(false)}
        partners={partners}
        leadId={lead.id as string}
      />

      {/* Add Interaction Modal */}
      <AddInteractionModal
        open={interactionModal}
        onClose={() => setInteractionModal(false)}
        leadId={lead.id as string}
      />
    </div>
  );
}

function ProfileTab({
  client,
  buyerProfile,
}: {
  client: Record<string, unknown> | null;
  buyerProfile: Record<string, unknown> | null;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="border border-border bg-bg-card p-6">
        <h3 className="font-serif text-lg text-text-primary">Client Info</h3>
        <dl className="mt-4 space-y-3">
          {[
            ["Name", client?.full_name],
            ["Email", client?.email],
            ["Phone", client?.phone],
            ["Company", client?.company_name],
            ["Role", client?.role],
          ].map(([label, value]) => (
            <div key={label as string}>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                {label as string}
              </dt>
              <dd className="mt-0.5 font-sans text-sm text-text-secondary">
                {(value as string) || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {buyerProfile && (
        <div className="border border-border bg-bg-card p-6">
          <h3 className="font-serif text-lg text-text-primary">
            Bespoke Property Profile
          </h3>
          <dl className="mt-4 space-y-3">
            {[
              ["Investment Type", buyerProfile.investment_type],
              ["Buyer Type", buyerProfile.buyer_type],
              ["Budget", buyerProfile.budget_range],
              ["Timeline", buyerProfile.timeline],
              ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
              ["Property Type", (buyerProfile.property_type as string[])?.join(", ")],
              ["Purpose", buyerProfile.purpose],
              ["Archetype", buyerProfile.archetype],
              ["Readiness Score", buyerProfile.readiness_score],
              ["Priority Tier", buyerProfile.priority_tier],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  {label as string}
                </dt>
                <dd className="mt-0.5 font-sans text-sm text-text-secondary">
                  {String(value ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function InteractionsTab({ interactions }: { interactions: Record<string, unknown>[] }) {
  return (
    <div className="space-y-3">
      {interactions.length === 0 && (
        <p className="font-sans text-sm text-text-muted">No interactions yet.</p>
      )}
      {interactions.map((i) => (
        <div key={i.id as string} className="border border-border-subtle bg-bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-accent-gold">
              {i.type as string}
            </span>
            <span className="font-sans text-[11px] text-text-muted">
              {new Date(i.created_at as string).toLocaleString()}
            </span>
            {(i.creator as Record<string, unknown>)?.full_name ? (
              <span className="font-sans text-[11px] text-text-muted">
                by {(i.creator as Record<string, unknown>).full_name as string}
              </span>
            ) : null}
            {i.visible_to_partner ? (
              <span className="font-sans text-[10px] uppercase text-emerald-400">
                visible to partner
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-sans text-sm text-text-secondary">
            {i.content as string}
          </p>
        </div>
      ))}
    </div>
  );
}

function AssignmentsTab({
  assignments,
  leadId,
}: {
  assignments: Record<string, unknown>[];
  leadId: string;
}) {
  return (
    <div className="space-y-3">
      {assignments.length === 0 && (
        <p className="font-sans text-sm text-text-muted">No partner assignments yet.</p>
      )}
      {assignments.map((a) => {
        const partner = a.partner as Record<string, unknown> | null;
        return (
          <div key={a.id as string} className="flex items-center justify-between border border-border-subtle bg-bg-card p-4">
            <div>
              <p className="font-sans text-sm text-text-primary">
                {(partner?.full_name as string) || (partner?.email as string)}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-sans text-[11px] text-text-muted">
                  {(partner?.role as string)?.replace(/_/g, " ")}
                </span>
                <AdminStatusBadge status={a.status as string} />
                <span className="font-sans text-[10px] uppercase text-text-muted">
                  {a.visibility_level as string} access
                </span>
              </div>
            </div>
            {a.status === "active" && (
              <button
                onClick={async () => {
                  await revokeAssignment(a.id as string, leadId);
                }}
                className="font-sans text-[12px] text-red-400 hover:text-red-300"
              >
                Revoke
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApplicationTab({ application }: { application: Record<string, unknown> | null }) {
  if (!application) {
    return <p className="font-sans text-sm text-text-muted">No application data.</p>;
  }

  const stepData = application.step_data as Record<string, unknown>;

  return (
    <div className="border border-border bg-bg-card p-6">
      <h3 className="font-serif text-lg text-text-primary">Application Data</h3>
      <div className="mt-2 flex items-center gap-3">
        <AdminStatusBadge status={application.status as string} />
        <span className="font-sans text-[11px] text-text-muted">
          Type: {application.type as string}
        </span>
        <span className="font-sans text-[11px] text-text-muted">
          {new Date(application.created_at as string).toLocaleDateString()}
        </span>
      </div>
      <dl className="mt-4 space-y-3">
        {Object.entries(stepData).map(([key, value]) => (
          <div key={key}>
            <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
              {key.replace(/_/g, " ")}
            </dt>
            <dd className="mt-0.5 font-sans text-sm text-text-secondary">
              {Array.isArray(value) ? value.join(", ") : String(value ?? "—")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ScorecardsTab({ lead }: { lead: Record<string, unknown> }) {
  if (!lead.supply_side) {
    return (
      <p className="font-sans text-sm text-text-muted">
        Scorecards are available for supply-side leads only.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="border border-border bg-bg-card p-6">
        <h3 className="font-serif text-lg text-text-primary">
          Deal Qualification Scorecard
        </h3>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Weighted criteria for deal assessment. Scoring available during active evaluation.
        </p>
        {lead.supply_scorecard ? (
          <pre className="mt-4 overflow-auto rounded bg-bg-primary p-4 font-sans text-xs text-text-secondary">
            {JSON.stringify(lead.supply_scorecard, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 font-sans text-sm text-text-muted">No scorecard data yet.</p>
        )}
      </div>
      <div className="border border-border bg-bg-card p-6">
        <h3 className="font-serif text-lg text-text-primary">
          Client Fit Scorecard
        </h3>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Developer/owner retainer qualification. Scoring available during matching.
        </p>
        {lead.client_fit_scorecard ? (
          <pre className="mt-4 overflow-auto rounded bg-bg-primary p-4 font-sans text-xs text-text-secondary">
            {JSON.stringify(lead.client_fit_scorecard, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 font-sans text-sm text-text-muted">No scorecard data yet.</p>
        )}
      </div>
    </div>
  );
}

function AssignPartnerModal({
  open,
  onClose,
  partners,
  leadId,
}: {
  open: boolean;
  onClose: () => void;
  partners: Record<string, unknown>[];
  leadId: string;
}) {
  const [partnerId, setPartnerId] = useState("");
  const [visibility, setVisibility] = useState<VisibilityLevel>("limited");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!partnerId) return;
    setLoading(true);
    await assignPartner(leadId, partnerId, visibility, notes);
    setLoading(false);
    setPartnerId("");
    setNotes("");
    onClose();
  };

  return (
    <AdminModal title="Assign Partner" open={open} onClose={onClose}>
      <div className="space-y-4">
        <FormSelect
          label="Partner"
          placeholder="Select partner"
          options={partners.map((p) => ({
            value: p.id as string,
            label: `${p.full_name || p.email} (${(p.role as string)?.replace(/_/g, " ")})`,
          }))}
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
        />
        <FormSelect
          label="Visibility Level"
          options={[
            { value: "full", label: "Full — sees complete buyer profile" },
            { value: "limited", label: "Limited — sees name and service context only" },
          ]}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as VisibilityLevel)}
        />
        <FormTextarea
          label="Internal Notes (optional)"
          placeholder="Notes about this assignment"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={handleAssign}
          disabled={!partnerId || loading}
          className="w-full bg-accent-gold px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </AdminModal>
  );
}

function AddInteractionModal({
  open,
  onClose,
  leadId,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
}) {
  const [type, setType] = useState<InteractionType>("note");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await addInteraction(leadId, type, content, visible);
    setLoading(false);
    setContent("");
    onClose();
  };

  return (
    <AdminModal title="Add Interaction" open={open} onClose={onClose}>
      <div className="space-y-4">
        <FormSelect
          label="Type"
          options={INTERACTION_TYPES.map((t) => ({ value: t, label: t }))}
          value={type}
          onChange={(e) => setType(e.target.value as InteractionType)}
        />
        <FormTextarea
          label="Content"
          placeholder="What happened?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-sans text-sm text-text-secondary">
            Visible to assigned partners
          </span>
        </label>
        <button
          onClick={handleAdd}
          disabled={!content.trim() || loading}
          className="w-full bg-accent-gold px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Interaction"}
        </button>
      </div>
    </AdminModal>
  );
}
