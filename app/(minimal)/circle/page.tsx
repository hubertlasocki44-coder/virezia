"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import FormInput from "@/components/forms/FormInput";
import { submitCircleRequest } from "@/lib/actions/public-submit";

export default function CirclePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const result = await submitCircleRequest(email);
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

  return (
    <section className="flex min-h-[80vh] items-center py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-lg">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold">
            By Invitation Only
          </p>

          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
            VIREZIA Circle
          </h1>

          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            Pre-market deal access for verified investors. Circle members
            review opportunities before public release — with priority
            allocation and direct access to our deal team.
          </p>

          {submitted ? (
            <div className="mt-10 border border-accent-gold/20 bg-accent-gold/5 px-6 py-5">
              <p className="font-sans text-sm text-text-primary">
                Request received. If your profile aligns, we will be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <FormInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Request Access"}
              </button>
            </form>
          )}

          <p className="mt-8 font-sans text-[12px] text-text-muted">
            VIREZIA Circle is not publicly described. Membership is
            extended based on investor profile and alignment.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
