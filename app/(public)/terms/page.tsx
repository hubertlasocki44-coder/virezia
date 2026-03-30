import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — VIREZIA",
  description: "VIREZIA terms of service. Terms governing use of our platform and services.",
};

export default function TermsPage() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-3xl">
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-light">
            Terms of Service
          </h1>
          <p className="mt-4 font-sans text-sm text-text-muted">
            Last updated: March 2026
          </p>

          <div className="mt-12 space-y-10 font-sans text-base font-light leading-relaxed text-text-secondary">
            <div>
              <h2 className="font-serif text-xl text-text-primary">1. Overview</h2>
              <p className="mt-4">
                VIREZIA provides private real estate intelligence services, including property verification, buyer-developer matching, and market analysis for emerging markets. By accessing or using our platform, you agree to these terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">2. Access and Accounts</h2>
              <p className="mt-4">
                Access to VIREZIA is by application only. We reserve the right to approve, deny, or revoke access at our discretion. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">3. Services</h2>
              <p className="mt-4">
                VIREZIA acts as an intelligence and coordination layer between buyers and the real estate market. We are not a brokerage, listing platform, or financial advisor. Our verification standard is designed to reduce risk, but does not constitute a guarantee of any investment outcome.
              </p>
              <p className="mt-3">
                Paid audit services (Basic, Premium, Full Protection) are subject to separate terms communicated at the time of engagement. Audit reports represent our professional assessment based on available information and should not be treated as legal advice.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">4. Fees and Payments</h2>
              <p className="mt-4">
                VIREZIA operates on a success-based model for matched transactions. Commission structures are disclosed transparently before any engagement. Paid audit services require upfront payment. All fees are in USD unless otherwise specified.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">5. Confidentiality</h2>
              <p className="mt-4">
                Information shared through the platform — including buyer profiles, deal details, and market analysis — is confidential. You agree not to share, distribute, or commercially use any proprietary information obtained through VIREZIA without written consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">6. Limitation of Liability</h2>
              <p className="mt-4">
                VIREZIA provides information and coordination services. We are not liable for investment decisions, market fluctuations, construction delays, or third-party actions. Our services reduce risk but do not eliminate it. All investment decisions remain your responsibility.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">7. Termination</h2>
              <p className="mt-4">
                Either party may terminate the relationship at any time. Upon termination, your access to the platform and confidential information will be revoked. Obligations related to confidentiality and payment survive termination.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">8. Governing Law</h2>
              <p className="mt-4">
                These terms are governed by the laws of Mexico. Any disputes arising from these terms will be resolved through arbitration.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">9. Contact</h2>
              <p className="mt-4">
                For questions about these terms, contact us at{" "}
                <a href="mailto:hello@virezia.com" className="text-accent-gold hover:text-accent-gold-light transition-colors">
                  hello@virezia.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
