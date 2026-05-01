"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { submitPartnerApplication } from "@/lib/actions/public-submit";

export default function ForOwnersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    property_location: "",
    property_type: "",
    asking_price: "",
    project_status: "",
    description: "",
    portfolio_link: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.property_location) {
      setError("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await submitPartnerApplication(formData as unknown as Record<string, unknown>);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Try again or email hello@virezia.com.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="flex min-h-[70vh] items-center py-[120px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-xl">
            <SectionLabel text="Submission received" />
            <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
              Thank you.
            </h1>
            <p className="mt-6 font-sans text-base font-light text-text-secondary">
              We review every submission against our current featuring criteria.
              If there is a fit, we will reach out within 5 business days.
            </p>
            <p className="mt-6 font-sans text-sm text-text-muted">
              &mdash; VIREZIA
            </p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="For Owners & Developers" />
          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
            Submit a Property
          </h1>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            VIREZIA features a limited number of exceptional properties each year &mdash;
            sourced globally, with current focus across Latin America.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            If your property has architectural distinction, design lineage,
            location character, or a story worth telling &mdash; we&apos;d like to hear from you.
          </p>
          <p className="mt-4 font-sans text-sm text-text-muted">
            Submission begins with a brief intake. Featured selection is reviewed quarterly.
          </p>
        </AnimatedSection>

        {/* Selection criteria */}
        <AnimatedSection className="mt-14 max-w-2xl">
          <h3 className="font-serif text-[24px] font-light">Selection criteria</h3>
          <div className="mt-6 space-y-3">
            <p className="font-sans text-[15px] font-light text-text-secondary">&mdash; Architectural or design distinction</p>
            <p className="font-sans text-[15px] font-light text-text-secondary">&mdash; Location with character or lineage</p>
            <p className="font-sans text-[15px] font-light text-text-secondary">&mdash; Pricing aligned with market reality</p>
            <p className="font-sans text-[15px] font-light text-text-secondary">&mdash; Clean legal title or clear regularization path</p>
            <p className="font-sans text-[15px] font-light text-text-secondary">&mdash; Owner willing to support editorial repositioning of the offer</p>
          </div>
        </AnimatedSection>

        {error && (
          <div className="mt-8 max-w-2xl border border-red-500/30 bg-red-500/5 px-4 py-3">
            <p className="font-sans text-sm text-red-400">{error}</p>
          </div>
        )}

        <AnimatedSection className="mt-14 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="Name"
                placeholder="Your name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />
              <FormInput
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <FormSelect
              label="Role"
              placeholder="Select role"
              options={[
                { value: "owner", label: "Owner" },
                { value: "developer", label: "Developer" },
                { value: "architect", label: "Architect" },
                { value: "representing", label: "Representing seller" },
              ]}
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
            <FormInput
              label="Property location"
              placeholder="e.g. Puerto Escondido, Oaxaca"
              value={formData.property_location}
              onChange={(e) => handleChange("property_location", e.target.value)}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <FormSelect
                label="Property type"
                placeholder="Select type"
                options={[
                  { value: "single_residence", label: "Single residence" },
                  { value: "multi_unit", label: "Multi-unit" },
                  { value: "land", label: "Land" },
                  { value: "mixed_use", label: "Mixed-use" },
                  { value: "other", label: "Other" },
                ]}
                value={formData.property_type}
                onChange={(e) => handleChange("property_type", e.target.value)}
              />
              <FormInput
                label="Asking price range"
                placeholder="e.g. $500K - $1M USD"
                value={formData.asking_price}
                onChange={(e) => handleChange("asking_price", e.target.value)}
              />
            </div>
            <FormSelect
              label="Current status"
              placeholder="Select status"
              options={[
                { value: "pre_sale", label: "Pre-sale" },
                { value: "active_listing", label: "Active listing" },
                { value: "off_market", label: "Off-market" },
                { value: "under_development", label: "Under development" },
              ]}
              value={formData.project_status}
              onChange={(e) => handleChange("project_status", e.target.value)}
            />
            <FormTextarea
              label="What makes this property worth featuring?"
              placeholder="Tell us about the architecture, design, location, or story."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <FormInput
              label="Image / portfolio link (optional)"
              placeholder="https://..."
              value={formData.portfolio_link}
              onChange={(e) => handleChange("portfolio_link", e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
