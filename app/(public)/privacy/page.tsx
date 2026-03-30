import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — VIREZIA",
  description: "VIREZIA privacy policy. How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-3xl">
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-light">
            Privacy Policy
          </h1>
          <p className="mt-4 font-sans text-sm text-text-muted">
            Last updated: March 29, 2026
          </p>

          <div className="mt-12 space-y-10 font-sans text-base font-light leading-relaxed text-text-secondary">
            <div>
              <h2 className="font-serif text-xl text-text-primary">1. Data Controller</h2>
              <p className="mt-4">
                Your personal data is processed by KONAMIYA LLC, operating as VIREZIA.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                KONAMIYA LLC<br />
                30 N Gould St, STE R<br />
                Sheridan, WY 82801, USA<br />
                hello@virezia.com
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">2. Information We Collect</h2>
              <p className="mt-4">
                When you apply for access or use our platform, we collect information you provide directly: your name, email address, phone number, country of residence, investment preferences, budget range, and any additional context you share in your application.
              </p>
              <p className="mt-3">
                We also collect technical data automatically, including IP address, browser type, device information, and browsing behavior on our site through cookies and analytics tools.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">3. How We Use Your Information</h2>
              <p className="mt-4">
                We use your information to review and process applications, build your buyer or partner profile, match you with relevant opportunities, communicate service updates, and improve our platform. We do not sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">4. Information Sharing</h2>
              <p className="mt-4">
                We share your information only as necessary to deliver our services: with verified partners (developers, agents, legal professionals, service providers) who are matched with your profile, and only to the extent required for the specific engagement.
              </p>
              <p className="mt-3">
                We may also share information when required by law or to protect our rights.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">5. Data Security</h2>
              <p className="mt-4">
                We implement industry-standard security measures to protect your information, including encrypted data transmission, secure server infrastructure, and access controls. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">6. Cookies</h2>
              <p className="mt-4">
                We use the following types of cookies:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li><strong>Strictly necessary cookies</strong> — required for site functionality, authentication, and security. These cannot be disabled.</li>
                <li><strong>Analytics cookies</strong> — help us understand how visitors interact with our site. These are only set with your consent.</li>
              </ul>
              <p className="mt-3">
                You can manage your cookie preferences at any time using the cookie settings link in our footer, or through your browser settings. Refusing analytics cookies does not affect your ability to use the platform.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">7. Your Rights</h2>
              <p className="mt-4">
                Depending on your jurisdiction, you may have the following rights regarding your personal data:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
                <li><strong>Correction</strong> — request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion</strong> — request deletion of your personal data.</li>
                <li><strong>Portability</strong> — request a machine-readable copy of your data.</li>
                <li><strong>Objection</strong> — object to certain types of processing.</li>
                <li><strong>Withdraw consent</strong> — where processing is based on consent, you may withdraw it at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:hello@virezia.com" className="text-accent-gold hover:text-accent-gold-light transition-colors">
                  hello@virezia.com
                </a>. We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">8. Data Retention</h2>
              <p className="mt-4">
                We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. When data is no longer needed, it is securely deleted or anonymized.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">9. International Transfers</h2>
              <p className="mt-4">
                As we operate across emerging markets, your data may be transferred to and processed in countries outside your country of residence. We ensure appropriate safeguards are in place for all such transfers.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">10. Changes to This Policy</h2>
              <p className="mt-4">
                We may update this privacy policy from time to time. Material changes will be communicated through the platform or via email.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">11. Contact</h2>
              <p className="mt-4">
                For questions about this policy or your data, contact us at{" "}
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
