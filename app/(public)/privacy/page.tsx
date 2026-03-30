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
            Last updated: March 2026
          </p>

          <div className="mt-12 space-y-10 font-sans text-base font-light leading-relaxed text-text-secondary">
            <div>
              <h2 className="font-serif text-xl text-text-primary">1. Information We Collect</h2>
              <p className="mt-4">
                When you apply for access or use our platform, we collect information you provide directly: your name, email address, phone number, country of residence, investment preferences, budget range, and any additional context you share in your application.
              </p>
              <p className="mt-3">
                We also collect technical data automatically, including IP address, browser type, device information, and browsing behavior on our site through cookies and analytics tools.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">2. How We Use Your Information</h2>
              <p className="mt-4">
                We use your information to review and process applications, build your buyer or partner profile, match you with relevant opportunities, communicate service updates, and improve our platform. We do not sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">3. Information Sharing</h2>
              <p className="mt-4">
                We share your information only as necessary to deliver our services: with verified partners (developers, agents, service providers) who are matched with your profile, and only to the extent required for the specific engagement. Partners receive information based on their role — some receive your full profile, others receive only limited context.
              </p>
              <p className="mt-3">
                We may also share information when required by law or to protect our rights.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">4. Data Security</h2>
              <p className="mt-4">
                We implement industry-standard security measures to protect your information, including encrypted data transmission, secure server infrastructure, and access controls. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">5. Your Rights</h2>
              <p className="mt-4">
                You may request access to, correction of, or deletion of your personal information at any time by contacting us at hello@virezia.com. You may also opt out of marketing communications.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">6. Cookies</h2>
              <p className="mt-4">
                We use essential cookies for site functionality and analytics cookies to understand how visitors interact with our site. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-text-primary">7. Contact</h2>
              <p className="mt-4">
                For questions about this policy or your data, contact us at{" "}
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
