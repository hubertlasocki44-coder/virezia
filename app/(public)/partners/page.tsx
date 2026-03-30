"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnerApplicationSchema,
  type PartnerApplicationInput,
} from "@/lib/validations/partner";
import { submitPartnerApplication } from "@/lib/actions/public-submit";

export default function PartnersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerApplicationInput>({
    resolver: zodResolver(partnerApplicationSchema),
  });

  const onSubmit = async (data: PartnerApplicationInput) => {
    setLoading(true);
    setError("");

    try {
      const result = await submitPartnerApplication(data as unknown as Record<string, unknown>);
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
            <SectionLabel text="Application received" />
            <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
              We Will Review Your Submission.
            </h1>
            <p className="mt-6 font-sans text-base font-light text-text-secondary">
              Every partner application is reviewed by our team. We respond
              within 5 business days.
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
          <SectionLabel text="For developers & partners" />
          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
            List With VIREZIA.
          </h1>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            We help landowners and developers place their assets with qualified
            capital — by repositioning the deal, structuring it properly, and
            distributing it privately to verified investors.
          </p>
          <p className="mt-4 font-sans text-sm text-text-muted">
            VIREZIA is not a marketing agency. Not a lead tool. If this
            language resonates, proceed with your application.
          </p>
        </AnimatedSection>

        {error && (
          <div className="mt-8 max-w-2xl border border-red-500/30 bg-red-500/5 px-4 py-3">
            <p className="font-sans text-sm text-red-400">{error}</p>
          </div>
        )}

        <AnimatedSection className="mt-12 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="Full Name"
                placeholder="Your name"
                {...register("full_name")}
                error={errors.full_name?.message}
              />
              <FormInput
                label="Email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
            <FormInput
              label="Company Name"
              placeholder="Your company"
              {...register("company_name")}
              error={errors.company_name?.message}
            />
            <FormInput
              label="Property / Project Location"
              placeholder="e.g. Tulum, Quintana Roo"
              {...register("property_location")}
              error={errors.property_location?.message}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <FormSelect
                label="Property Type"
                placeholder="Select type"
                options={[
                  { value: "residential", label: "Residential" },
                  { value: "commercial", label: "Commercial" },
                  { value: "land", label: "Land / Development" },
                  { value: "hospitality", label: "Hospitality" },
                  { value: "mixed_use", label: "Mixed-Use" },
                ]}
                {...register("property_type")}
                error={errors.property_type?.message}
              />
              <FormInput
                label="Asking Price (optional)"
                placeholder="e.g. $450,000 USD"
                {...register("asking_price")}
              />
            </div>
            <FormSelect
              label="Project Status"
              placeholder="Select status"
              options={[
                { value: "pre_construction", label: "Pre-construction" },
                { value: "under_construction", label: "Under construction" },
                { value: "completed", label: "Completed / Ready" },
                { value: "land_only", label: "Land only" },
                { value: "repositioning", label: "Repositioning" },
              ]}
              {...register("project_status")}
              error={errors.project_status?.message}
            />
            <FormTextarea
              label="Description"
              placeholder="Tell us about the property or project. What stage is it at? What kind of buyer are you looking for?"
              {...register("description")}
              error={errors.description?.message}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
