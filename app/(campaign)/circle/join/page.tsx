"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { submitLasOrcasForm } from "@/lib/actions/campaign-submit";

// Ambient types for GTM / gtag — loaded by GTM-T49MNCXR snippet in layout.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const INVESTMENT_OPTIONS = [
  { value: "under_500k", label: "Under $500K" },
  { value: "500k_1m", label: "$500K \u2013 $1M" },
  { value: "1m_2m", label: "$1M \u2013 $2M" },
  { value: "2m_plus", label: "$2M+" },
];

const TIMELINE_OPTIONS = [
  { value: "ready_now", label: "Ready now" },
  { value: "3_6_months", label: "3\u20136 months" },
  { value: "exploring", label: "Exploring" },
];

const INTENT_OPTIONS = [
  { value: "personal_residence", label: "Personal residence" },
  { value: "mixed", label: "Mixed" },
  { value: "investment_yield", label: "Investment yield" },
];

type Stage = "name" | "email" | "phone" | "decision" | "budget" | "timeline" | "intent" | "done";

const STAGE_1: Stage[] = ["name", "email", "phone"];
const STAGE_2: Stage[] = ["budget", "timeline", "intent"];

function stageNumber(stage: Stage): { current: number; total: number; label: string } {
  if (STAGE_1.includes(stage)) {
    return { current: STAGE_1.indexOf(stage) + 1, total: 3, label: "Join the Circle" };
  }
  if (STAGE_2.includes(stage)) {
    return { current: STAGE_2.indexOf(stage) + 1, total: 3, label: "Founding Member" };
  }
  return { current: 0, total: 0, label: "" };
}

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full text-left border px-6 py-4 transition-colors ${
        selected
          ? "border-accent-gold bg-accent-gold/5"
          : "border-border bg-bg-card hover:border-border-subtle"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            selected ? "border-accent-gold" : "border-text-muted"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-accent-gold" />}
        </span>
        <span className="font-sans text-sm text-text-primary">{label}</span>
      </div>
    </button>
  );
}

export default function CircleJoinPage() {
  return (
    <Suspense>
      <CircleJoinWizard />
    </Suspense>
  );
}

function CircleJoinWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFoundingEntry = searchParams.get("intent") === "founding";
  const campaign = isFoundingEntry ? "las_orcas" : "circle";

  const [stage, setStage] = useState<Stage>("name");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [investmentRange, setInvestmentRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [stage1Submitted, setStage1Submitted] = useState(false);

  // Google Ads conversion IDs.
  // AW_ID: account-level tag ID. LABEL_STAGE1 / LABEL_STAGE2: per-conversion-action.
  // Replace LABEL_* with real values from Google Ads → Conversions → Tag setup.
  const AW_ID = "AW-8356345156";
  const LABEL_STAGE1 = "REPLACE_WITH_STAGE1_LABEL"; // Stage 1: name+email+phone
  const LABEL_STAGE2 = "REPLACE_WITH_STAGE2_LABEL"; // Stage 2: founding member intent

  // Guards: each milestone fires at most once per session.
  const stage1ConversionFiredRef = useRef(false);
  const conversionFiredRef = useRef(false);

  const utmRef = useRef({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    fbc: "",
    fbp: "",
  });

  useEffect(() => {
    const fbclid = searchParams.get("fbclid");
    const cookie = (name: string) =>
      document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] || "";
    // Prefer the _fbc cookie if Meta set one; otherwise build it from fbclid.
    const fbc = cookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");
    utmRef.current = {
      utmSource: searchParams.get("utm_source") || "",
      utmMedium: searchParams.get("utm_medium") || "",
      utmCampaign: searchParams.get("utm_campaign") || "",
      utmContent: searchParams.get("utm_content") || "",
      utmTerm: searchParams.get("utm_term") || "",
      fbc,
      fbp: cookie("_fbp"),
    };
  }, [searchParams]);

  const submitStage1 = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await submitLasOrcasForm({
        fullName,
        email,
        phone,
        investmentRange: "",
        timeline: "",
        intent: "",
        campaign,
        ...utmRef.current,
      });
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }
      setStage1Submitted(true);
      setLoading(false);
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const submitStage2 = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await submitLasOrcasForm({
        fullName,
        email,
        phone,
        investmentRange,
        timeline,
        intent,
        campaign,
        ...utmRef.current,
      });
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Stage 2 conversion: founding member intent submitted successfully.
      if (!conversionFiredRef.current) {
        conversionFiredRef.current = true;
        // Google Ads — direct hit, real-time, no GA4 delay.
        window.gtag?.("event", "conversion", {
          send_to: `${AW_ID}/${LABEL_STAGE2}`,
          value: 561000,
          currency: "USD",
        });
        // dataLayer for GTM + GA4.
        window.gtag?.("event", "generate_lead", {
          form: "las_orcas_founding_member",
          value: 561000,
          currency: "USD",
        });
        window.dataLayer?.push({
          event: "generate_lead",
          form: "las_orcas_founding_member",
        });
      }

      if (result.matched) {
        router.push("/circle/confirmed");
      } else {
        router.push("/circle/welcome");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const goNext = async () => {
    setError("");

    switch (stage) {
      case "name":
        if (!fullName.trim()) { setError("Please enter your name."); return; }
        setStage("email");
        break;
      case "email":
        if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
        if (!consent) { setError("Please agree to receive emails to continue."); return; }
        // Save email immediately (partial capture) — silent, no team email.
        {
          const earlyResult = await submitLasOrcasForm({
            fullName,
            email,
            phone: "",
            investmentRange: "",
            timeline: "",
            intent: "",
            campaign,
            notify: false,
            ...utmRef.current,
          });
          if (earlyResult.error) {
            setError(earlyResult.error);
            return;
          }
          setStage1Submitted(true);
        }
        setStage("phone");
        break;
      case "phone": {
        // Stage 1 complete — persist (with phone if given). Send ONE team email
        // here for plain Circle joins; founding-path users are notified at Stage 2.
        const phoneResult = await submitLasOrcasForm({
          fullName,
          email,
          phone,
          investmentRange: "",
          timeline: "",
          intent: "",
          campaign,
          notify: !isFoundingEntry,
          ...utmRef.current,
        });
        if (phoneResult.error) {
          setError(phoneResult.error);
          return;
        }

        // Stage 1 conversion: name + email + phone submitted successfully.
        // Fires for BOTH founding path and circle-only path.
        if (!stage1ConversionFiredRef.current) {
          stage1ConversionFiredRef.current = true;
          window.gtag?.("event", "conversion", {
            send_to: `${AW_ID}/${LABEL_STAGE1}`,
            value: 561000,
            currency: "USD",
          });
          window.dataLayer?.push({
            event: "las_orcas_stage1_complete",
            form: "las_orcas_circle_join",
            has_phone: phone.trim().length > 0,
          });
        }

        if (isFoundingEntry) {
          setStage("budget");
        } else {
          setStage("decision");
        }
        break;
      }
      case "budget":
        if (!investmentRange) { setError("Please select an option."); return; }
        setStage("timeline");
        break;
      case "timeline":
        if (!timeline) { setError("Please select an option."); return; }
        setStage("intent");
        break;
      case "intent":
        if (!intent) { setError("Please select an option."); return; }
        await submitStage2();
        break;
    }
  };

  const goBack = () => {
    switch (stage) {
      case "email": setStage("name"); break;
      case "phone": setStage("email"); break;
      case "budget": setStage(isFoundingEntry ? "phone" : "decision"); break;
      case "timeline": setStage("budget"); break;
      case "intent": setStage("timeline"); break;
    }
    setError("");
  };

  const canGoBack = !["name", "decision", "done"].includes(stage);
  const info = stageNumber(stage);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back to Las Orcas */}
      <div className="fixed top-0 right-0 px-6 py-6 md:px-10 z-50">
        <Link href="/las-orcas" className="font-sans text-[11px] text-text-muted hover:text-text-secondary transition-colors">
          Back to Las Orcas
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              {info.total > 0 && (
                <p className="font-sans text-[11px] text-text-muted text-center mb-16">
                  {info.current} of {info.total}
                </p>
              )}

              {/* STAGE 1 — Name */}
              {stage === "name" && (
                <div className="text-center">
                  <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-light leading-[1.2] mb-10">
                    What is your name?
                  </h2>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                    placeholder="Your full name"
                    autoFocus
                    className="w-full border-b border-border bg-transparent px-0 py-4 font-serif text-2xl text-center text-text-primary placeholder:text-text-muted/40 focus:border-accent-gold focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* STAGE 1 — Email */}
              {stage === "email" && (
                <div className="text-center">
                  <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-light leading-[1.2] mb-10">
                    Where can we reach you?
                  </h2>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && consent && goNext()}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full border-b border-border bg-transparent px-0 py-4 font-sans text-lg text-center text-text-primary placeholder:text-text-muted/40 focus:border-accent-gold focus:outline-none transition-colors"
                  />
                  <label className="flex items-start gap-3 mt-8 text-left cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-accent-gold"
                    />
                    <span className="font-sans text-[13px] font-light text-text-muted leading-relaxed">
                      I agree to receive emails from VIREZIA about Las Orcas and future Selections. You can unsubscribe at any time.
                    </span>
                  </label>
                </div>
              )}

              {/* STAGE 1 — Phone */}
              {stage === "phone" && (
                <div className="text-center">
                  <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-light leading-[1.2] mb-2">
                    And by phone?
                  </h2>
                  <p className="font-sans text-[13px] text-text-muted mb-8">Optional</p>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                    placeholder="+1 555 000 0000"
                    autoFocus
                    className="w-full border-b border-border bg-transparent px-0 py-4 font-sans text-lg text-center text-text-primary placeholder:text-text-muted/40 focus:border-accent-gold focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* DECISION POINT — after Stage 1 */}
              {stage === "decision" && (
                <div className="text-center">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-6">
                    VIREZIA Circle
                  </p>
                  <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-light leading-[1.2] mb-6">
                    You&apos;re in.
                  </h2>
                  <p className="font-sans text-base font-light text-text-secondary leading-relaxed mb-4">
                    The full conversation with Robert Couturier and your welcome series are on their way to your inbox.
                  </p>
                  <p className="font-sans text-sm font-light text-text-muted mb-12">
                    Want to express interest in Las Orcas as a Founding Member? Three more questions.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => setStage("budget")}
                      className="w-full bg-accent-gold px-8 py-4 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
                    >
                      Continue
                    </button>
                    <Link
                      href="/circle/welcome"
                      className="block w-full py-3 font-sans text-[13px] text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Not now
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 2 — Budget */}
              {stage === "budget" && (
                <div>
                  <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] font-light leading-[1.2] mb-10 text-center">
                    What investment range are you considering for this kind of residence?
                  </h2>
                  <div className="space-y-3">
                    {INVESTMENT_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt.value}
                        label={opt.label}
                        selected={investmentRange === opt.value}
                        onClick={() => setInvestmentRange(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE 2 — Timeline */}
              {stage === "timeline" && (
                <div>
                  <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] font-light leading-[1.2] mb-10 text-center">
                    What is your timeline?
                  </h2>
                  <div className="space-y-3">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt.value}
                        label={opt.label}
                        selected={timeline === opt.value}
                        onClick={() => setTimeline(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE 2 — Intent */}
              {stage === "intent" && (
                <div>
                  <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] font-light leading-[1.2] mb-10 text-center">
                    What draws you to Las Orcas?
                  </h2>
                  <div className="space-y-3">
                    {INTENT_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt.value}
                        label={opt.label}
                        selected={intent === opt.value}
                        onClick={() => setIntent(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="font-sans text-sm text-red-400 text-center mt-6">{error}</p>
              )}

              {/* Navigation */}
              {stage !== "decision" && (
                <div className="mt-10 flex items-center justify-between">
                  <div>
                    {canGoBack && (
                      <button
                        onClick={goBack}
                        className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors"
                      >
                        Back
                      </button>
                    )}
                  </div>
                  <button
                    onClick={goNext}
                    disabled={loading}
                    className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "..." : "Continue"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
