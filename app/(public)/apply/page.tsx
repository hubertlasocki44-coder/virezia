"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import FormRadioGroup from "@/components/forms/FormRadioGroup";
import FormCheckboxGroup from "@/components/forms/FormCheckboxGroup";
import {
  applyStep1Schema,
  applyStep2BuyerSchema,
  applyStep2PartnerSchema,
  applyStep3Schema,
  type ApplyStep1Input,
  type ApplyStep2BuyerInput,
  type ApplyStep2PartnerInput,
  type ApplyStep3Input,
} from "@/lib/validations/apply";
import { submitApplication } from "@/lib/actions/public-submit";

const REGIONS = [
  { value: "mexico", label: "Mexico" },
  { value: "argentina", label: "Argentina" },
  { value: "other_latam", label: "Other Latin America" },
  { value: "europe", label: "Europe" },
  { value: "other", label: "Other" },
];

const TIMELINES = [
  { value: "immediate", label: "Immediate (0-3 months)" },
  { value: "short", label: "Short-term (3-6 months)" },
  { value: "medium", label: "Medium-term (6-12 months)" },
  { value: "long", label: "Long-term (12+ months)" },
  { value: "exploring", label: "Evaluating the market" },
];

const BUDGETS = [
  { value: "under_500k", label: "Under $500,000" },
  { value: "500k_1m", label: "$500,000 – $1,000,000" },
  { value: "1m_3m", label: "$1,000,000 – $3,000,000" },
  { value: "3m_plus", label: "$3,000,000+" },
  { value: "undecided", label: "Prefer not to say" },
];

const ACCOUNT_TYPES = [
  { value: "individual", label: "Individual buyer" },
  { value: "institutional", label: "Institutional investor" },
  { value: "developer", label: "Developer / Landowner" },
  { value: "agent", label: "Agent / Broker" },
  { value: "partner", label: "Service partner" },
];

const PROPERTY_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land / Development" },
  { value: "hospitality", label: "Hospitality" },
  { value: "mixed_use", label: "Mixed-Use" },
];

const STORAGE_KEY = "virezia_apply_state";

function loadSavedState() {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function ApplyPage() {
  const saved = useRef(loadSavedState());
  const [step, setStep] = useState(saved.current?.step ?? 1);
  const [step1Data, setStep1Data] = useState<ApplyStep1Input | null>(saved.current?.step1Data ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const step2Ref = useRef<Record<string, unknown> | null>(saved.current?.step2Data ?? null);

  const isBuyerPath =
    step1Data?.account_type === "individual" ||
    step1Data?.account_type === "institutional";

  const totalSteps = 3;

  const persistState = useCallback((s: number, s1: ApplyStep1Input | null, s2: Record<string, unknown> | null) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step: s, step1Data: s1, step2Data: s2 }));
    } catch { /* storage full or unavailable */ }
  }, []);

  // Clear saved state on successful submission
  useEffect(() => {
    if (submitted) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [submitted]);

  const handleStep1 = (data: ApplyStep1Input) => {
    setStep1Data(data);
    setStep(2);
    persistState(2, data, step2Ref.current);
  };

  const handleStep2Buyer = async (data: ApplyStep2BuyerInput) => {
    const s2 = data as unknown as Record<string, unknown>;
    step2Ref.current = s2;
    setStep(3);
    persistState(3, step1Data, s2);
  };

  const handleStep2Partner = async (data: ApplyStep2PartnerInput) => {
    const s2 = data as unknown as Record<string, unknown>;
    step2Ref.current = s2;
    setStep(3);
    persistState(3, step1Data, s2);
  };

  const handleStep3 = async (data: ApplyStep3Input) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const step2Data = step2Ref.current ?? {};
      const stepData = {
        ...step1Data,
        ...step2Data,
        ...data,
      };

      const result = await submitApplication(stepData);

      if (result.error) {
        setSubmitError(result.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again or email hello@virezia.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="flex min-h-[80vh] items-center py-[120px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-xl">
            <SectionLabel text="Application received" />
            <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
              Your application has been received.
            </h1>
            <p className="mt-6 font-sans text-base font-light text-text-secondary">
              We review every request individually
              and will be in touch within 48 hours.
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
          <SectionLabel text="Apply for private access" />
          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
            Apply for Private Access
          </h1>
          <p className="mt-4 font-sans text-base font-light text-text-secondary">
            VIREZIA works with a limited number of buyers at any time.
            Submit your profile and we&apos;ll review your request within 48 hours.
          </p>
        </AnimatedSection>

        {/* Progress bar */}
        <div className="mt-12 max-w-2xl">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-[2px] flex-1 transition-colors duration-300 ${
                  i < step ? "bg-accent-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 font-sans text-[12px] text-text-muted">
            Step {step} of {totalSteps}
          </p>
        </div>

        {submitError && (
          <div className="mt-6 max-w-2xl border border-red-500/30 bg-red-500/5 px-4 py-3">
            <p className="font-sans text-sm text-red-400">{submitError}</p>
          </div>
        )}

        <div className="mt-8 max-w-2xl">
          {step === 1 && <Step1Form onSubmit={handleStep1} />}
          {step === 2 && isBuyerPath && (
            <Step2BuyerForm onSubmit={handleStep2Buyer} onBack={() => setStep(1)} />
          )}
          {step === 2 && !isBuyerPath && (
            <Step2PartnerForm onSubmit={handleStep2Partner} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <Step3Form
              onSubmit={handleStep3}
              onBack={() => setStep(2)}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Step1Form({ onSubmit }: { onSubmit: (data: ApplyStep1Input) => void }) {
  const [accountType, setAccountType] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplyStep1Input>({
    resolver: zodResolver(applyStep1Schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Full Name"
        placeholder="Your full name"
        {...register("full_name")}
        error={errors.full_name?.message}
      />
      <FormInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <FormInput
        label="Country of Residence"
        placeholder="e.g. United States"
        {...register("country")}
        error={errors.country?.message}
      />
      <FormSelect
        label="How did you hear about us?"
        placeholder="Select one"
        options={[
          { value: "featured_property", label: "Featured property" },
          { value: "referral", label: "Referral" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "bespoke_living", label: "Bespoke Living" },
          { value: "other", label: "Other" },
        ]}
        {...register("referral_source")}
      />
      <FormRadioGroup
        label="I am a..."
        name="account_type"
        options={ACCOUNT_TYPES}
        value={accountType}
        onChange={(val) => {
          setAccountType(val);
          setValue("account_type", val as ApplyStep1Input["account_type"]);
        }}
        error={errors.account_type?.message}
      />
      <button
        type="submit"
        className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
      >
        Continue
      </button>
    </form>
  );
}

function Step2BuyerForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: ApplyStep2BuyerInput) => void;
  onBack: () => void;
}) {
  const [investmentType, setInvestmentType] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplyStep2BuyerInput>({
    resolver: zodResolver(applyStep2BuyerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormRadioGroup
        label="I am looking to..."
        name="investment_type"
        options={[
          { value: "personal", label: "Acquire a primary residence" },
          { value: "investment", label: "Acquire as investment" },
          { value: "both", label: "Both" },
          { value: "exploring", label: "Still exploring" },
        ]}
        value={investmentType}
        onChange={(val) => {
          setInvestmentType(val);
          setValue("investment_type", val as ApplyStep2BuyerInput["investment_type"]);
        }}
        error={errors.investment_type?.message}
      />
      <FormCheckboxGroup
        label="Preferred regions"
        options={REGIONS}
        values={regions}
        onChange={(vals) => {
          setRegions(vals);
          setValue("regions_interest", vals);
        }}
        error={errors.regions_interest?.message}
      />
      <FormSelect
        label="Timeline"
        placeholder="Select timeline"
        options={TIMELINES}
        {...register("timeline")}
        error={errors.timeline?.message}
      />
      <FormSelect
        label="Budget Range"
        placeholder="Select budget"
        options={BUDGETS}
        {...register("budget_range")}
        error={errors.budget_range?.message}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-6 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-text-secondary transition-colors hover:border-text-muted"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

function Step2PartnerForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: ApplyStep2PartnerInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyStep2PartnerInput>({
    resolver: zodResolver(applyStep2PartnerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      <FormSelect
        label="Property Type"
        placeholder="Select type"
        options={PROPERTY_TYPES}
        {...register("property_type")}
        error={errors.property_type?.message}
      />
      <FormInput
        label="Portfolio Size (optional)"
        placeholder="e.g. 12 units"
        {...register("portfolio_size")}
      />
      <FormTextarea
        label="Tell us about your project"
        placeholder="What are you developing or selling? What stage is the project at?"
        {...register("description")}
        error={errors.description?.message}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-6 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-text-secondary transition-colors hover:border-text-muted"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

function Step3Form({
  onSubmit,
  onBack,
  submitting,
}: {
  onSubmit: (data: ApplyStep3Input) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyStep3Input>({
    resolver: zodResolver(applyStep3Schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormTextarea
        label="Tell us what you are looking for"
        placeholder="Tell us what would make a property worth your attention. Specific architects, places, lifestyles, or stories you've followed."
        {...register("context")}
        error={errors.context?.message}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-6 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-text-secondary transition-colors hover:border-text-muted"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
