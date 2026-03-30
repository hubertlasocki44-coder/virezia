export type UserRole =
  | "super_admin"
  | "employee"
  | "buyer"
  | "developer"
  | "agent"
  | "broker"
  | "asset_owner"
  | "service_partner";

export type PartnerType =
  | "relocation"
  | "concierge"
  | "beach_club"
  | "legal"
  | "other"
  | null;

export type ProfileStatus =
  | "active"
  | "pending_verification"
  | "suspended"
  | "rejected";

export type ApplicationStatus =
  | "pending"
  | "screening"
  | "qualified"
  | "approved"
  | "rejected"
  | "archived";

export type LeadStatus =
  | "new"
  | "screening"
  | "qualified"
  | "matched"
  | "in_progress"
  | "closed_won"
  | "closed_lost"
  | "archived";

export type LeadSource =
  | "apply"
  | "manual"
  | "referral"
  | "circle"
  | "reach_signal";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type SupplyArchetype =
  | "frustrated_visionary"
  | "stuck_developer"
  | "volume_seeker"
  | "kit_pusher";

export type BuyerArchetype =
  | "architect_of_life"
  | "investor_strategist"
  | "escapist_relocator"
  | "security_seeker"
  | "collector";

export type PriorityTier = "p1" | "p2" | "p3";

export type VisibilityLevel = "full" | "limited";

export type AssignmentStatus = "active" | "completed" | "revoked";

export type InteractionType =
  | "note"
  | "email"
  | "call"
  | "meeting"
  | "whatsapp"
  | "status_change"
  | "assignment";

export type AuditTier = "basic" | "premium" | "full_protection";

export type AuditStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type DealBriefTemplate =
  | "asset_repositioned"
  | "buyer_protected"
  | "matched_fast"
  | "developer_unblocked";

export type EmployeeModule =
  | "leads"
  | "blog"
  | "applications"
  | "users"
  | "partners"
  | "properties"
  | "analytics"
  | "settings"
  | "audits"
  | "briefs";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  company_name: string | null;
  role: UserRole;
  partner_type: PartnerType;
  status: ProfileStatus;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string | null;
  type: string;
  step_data: Record<string, unknown>;
  status: ApplicationStatus;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  client_id: string;
  status: LeadStatus;
  source: LeadSource;
  assigned_employee: string | null;
  priority: LeadPriority;
  score: number;
  supply_side: boolean;
  supply_archetype: SupplyArchetype | null;
  supply_scorecard: Record<string, unknown> | null;
  client_fit_scorecard: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Profile;
  employee?: Profile;
  assignments?: LeadAssignment[];
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  partner_id: string;
  visibility_level: VisibilityLevel;
  status: AssignmentStatus;
  notes: string | null;
  assigned_by: string;
  created_at: string;
  updated_at: string;
  partner?: Profile;
}

export interface BuyerProfile {
  id: string;
  user_id: string;
  investment_type: string;
  buyer_type: string;
  budget_range: string | null;
  timeline: string | null;
  regions_interest: string[];
  property_type: string[];
  purpose: string | null;
  priorities: string | null;
  lifestyle_preferences: string | null;
  archetype: BuyerArchetype | null;
  archetype_history: Record<string, unknown>[] | null;
  readiness_score: number;
  priority_tier: PriorityTier;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string;
  published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Interaction {
  id: string;
  lead_id: string;
  type: InteractionType;
  content: string;
  metadata: Record<string, unknown> | null;
  created_by: string;
  visible_to_partner: boolean;
  created_at: string;
  creator?: Profile;
}

export interface CircleRequest {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export interface AuditRequest {
  id: string;
  user_id: string | null;
  tier: AuditTier;
  property_address: string;
  property_type: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: AuditStatus;
  assigned_to: string | null;
  report_url: string | null;
  price_paid: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealBrief {
  id: string;
  template_type: DealBriefTemplate;
  content: string;
  metrics: Record<string, unknown>;
  published: boolean;
  created_at: string;
}

export interface EmployeePermissions {
  id: string;
  user_id: string;
  modules: EmployeeModule[];
  created_at: string;
}
