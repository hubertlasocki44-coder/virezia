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
            Last updated: March 29, 2026
          </p>

          <div className="mt-12 space-y-10 font-sans text-base font-light leading-relaxed text-text-secondary">
            <div>
              <h2 className="font-serif text-xl text-text-primary">1. Company Information</h2>
              <p className="mt-4">
                VIREZIA is a brand operated by KONAMIYA LLC, a company registered in the state of Wyoming, United States.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                KONAMIYA LLC<br />
                30 N Gould St, STE R<br />
                Sheridan, WY 82801, USA
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">2. Nature of Services</h2>
              <p className="mt-4">
                VIREZIA is a real estate intelligence platform. We provide market information, verified data, curated reports, and matched recommendations across emerging markets worldwide. Our coverage includes, but is not limited to, regions such as Riviera Maya, Oaxaca, and Argentina.
              </p>
              <p className="mt-3">
                We are <strong>not</strong> a real estate brokerage, agency, or listing platform. We are not a real estate agent, broker, dealer, or intermediary. We do not participate as a legal party in any real estate transaction.
              </p>
              <p className="mt-3">
                All transactions are finalized exclusively by licensed and legally authorized third parties — our verified partner network of agents, notaries, attorneys, and developers. VIREZIA facilitates introductions and provides intelligence; we do not execute, mediate, or guarantee any transaction.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">3. No Legal or Financial Advice</h2>
              <p className="mt-4">
                Nothing on this platform constitutes legal, financial, tax, or investment advice. The information, reports, market intelligence, and recommendations provided by VIREZIA are for informational purposes only. We recommend services provided by our verified partner network based on our research and data, but we do not endorse, guarantee, or take responsibility for the outcomes of any engagement with third parties.
              </p>
              <p className="mt-3">
                You should consult qualified legal, financial, and tax professionals before making any investment or purchase decision.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">4. Access and Accounts</h2>
              <p className="mt-4">
                Access to VIREZIA is by application only. We reserve the right to approve, deny, or revoke access at our discretion. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">5. Partner Network</h2>
              <p className="mt-4">
                VIREZIA works with a verified network of partners — real estate agents, developers, legal professionals, and service providers — who are independently licensed and authorized to conduct transactions in their respective jurisdictions. These partners are independent entities. VIREZIA is not liable for their actions, representations, or services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">6. Fees and Payments</h2>
              <p className="mt-4">
                VIREZIA operates on a success-based model for matched transactions. Commission structures are disclosed transparently before any engagement. Paid audit services require upfront payment. All fees are in USD unless otherwise specified.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">7. Confidentiality</h2>
              <p className="mt-4">
                Information shared through the platform — including buyer profiles, deal details, and market analysis — is confidential. You agree not to share, distribute, or commercially use any proprietary information obtained through VIREZIA without written consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">8. Intellectual Property</h2>
              <p className="mt-4">
                All content, reports, market analysis, methodologies, data, and proprietary processes available through the platform are the exclusive intellectual property of KONAMIYA LLC. You may not reproduce, distribute, modify, or commercially use any platform content without written consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">9. Warranty Disclaimer</h2>
              <p className="mt-4">
                The platform and all services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or that any information provided will be complete or accurate.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">10. Indemnification</h2>
              <p className="mt-4">
                You agree to indemnify and hold harmless KONAMIYA LLC, its officers, employees, and partners from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the platform, engagement with any third-party partner introduced through VIREZIA, or violation of these terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">11. Limitation of Liability</h2>
              <p className="mt-4">
                VIREZIA provides information and intelligence services only. We are not liable for investment decisions, market fluctuations, construction delays, partner performance, or any third-party actions. Our services are designed to reduce risk through verified information, but do not eliminate it. All investment and purchase decisions remain your sole responsibility.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">12. Termination</h2>
              <p className="mt-4">
                Either party may terminate the relationship at any time. Upon termination, your access to the platform and confidential information will be revoked. Obligations related to confidentiality and payment survive termination.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">13. Modifications</h2>
              <p className="mt-4">
                We may update these terms from time to time. Material changes will be communicated through the platform or via email. Continued use of the platform following any changes constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">14. Governing Law</h2>
              <p className="mt-4">
                These terms are governed by the laws of the state of Wyoming, United States. Any disputes arising from these terms will be resolved through arbitration in the state of Wyoming.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">15. Contact</h2>
              <p className="mt-4">
                For questions about these terms, contact us at{" "}
                <a href="mailto:hello@virezia.com" className="text-accent-gold hover:text-accent-gold-light transition-colors">
                  hello@virezia.com
                </a>.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                KONAMIYA LLC<br />
                30 N Gould St, STE R<br />
                Sheridan, WY 82801, USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
