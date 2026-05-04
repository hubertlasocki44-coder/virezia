"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { submitCircleRequest } from "@/lib/actions/public-submit";

export default function CirclePage() {
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
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
            A private network for those with active acquisition intent
            in markets we cover.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            Membership is granted by invitation or direct referral.
          </p>

          {/* Separator */}
          <div className="mt-10 mb-10 w-12 border-t border-accent-gold/40" />

          {submitted ? (
            <div className="border border-accent-gold/20 bg-accent-gold/5 px-6 py-5">
              <p className="font-sans text-sm text-text-primary">
                Your request has been noted.
                If there is a fit, someone will reach out directly.
              </p>
              <p className="mt-4 font-sans text-sm text-text-muted">
                &mdash; VIREZIA
              </p>
            </div>
          ) : (
            <>
              <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary mb-6">
                Request an introduction
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                />
                <FormTextarea
                  label="Brief context (optional)"
                  placeholder=""
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 font-sans text-[12px] text-text-muted">
            All requests are reviewed personally.
            Current availability is limited.
          </p>

          <Link
            href="/"
            className="mt-10 inline-block font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors"
          >
            &larr; Return to VIREZIA
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
