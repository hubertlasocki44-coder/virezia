VIREZIA — Claude Code Build Brief
Complete Website Specification

CONTEXT FOR CLAUDE CODE
Build a complete multi-page website for VIREZIA — a private real estate verification and acquisition layer for globally-minded buyers entering Mexico's emerging destinations (Tulum, Riviera Maya, Oaxaca).
VIREZIA is NOT a marketplace, NOT a listing portal, NOT a traditional real estate agency.
It is a curated access and verification layer: showing clients fewer, better options —
sourced from the full market, verified end-to-end, and personally matched to each buyer's profile.
FIVE CORE DIFFERENTIATORS (always present in messaging):

FEW NOT MANY — small number of curated opportunities, not overwhelming volume
VERIFIED END-TO-END — on-site audit, legal check, price benchmark, market data
NO HIDDEN FEES — full transparency on costs, critical for foreign buyers in Mexico
PERSONALIZED MATCH — every client has a profile, receives only what fits them
ON-DEMAND AUDIT — client can commission verification of their own found deal

Off-market and pre-sale = premium subset ("including opportunities not yet publicly listed")
Not the only source — VIREZIA curates from the full market, selects the best.
The model is semi-manual and relationship-driven. The website's job is to filter the right people in, and everyone else out.

TECH STACK

Framework: Next.js 14 (App Router)
Styling: Tailwind CSS
Fonts: Cormorant Garamond (headings) + DM Sans (body) — load via Google Fonts
Animations: Framer Motion (fade-in on scroll, staggered reveals)
Forms: React Hook Form (no external form services)
Icons: Lucide React
Deployment ready: Vercel-compatible static export


DESIGN SYSTEM
css--bg-primary: #080808
--bg-secondary: #111111
--bg-card: #161616
--text-primary: #f0ece4
--text-secondary: #9a9690
--text-muted: #5a5650
--accent-gold: #c9a96e
--accent-gold-light: #e8d5b0
--border: #222222
--border-subtle: #1a1a1a
Typography scale:

H1: Cormorant Garamond, 72–96px, weight 300, letter-spacing -0.02em
H2: Cormorant Garamond, 48–64px, weight 300
H3: Cormorant Garamond, 32px, weight 400
Body: DM Sans, 16px, weight 300–400, line-height 1.7
Label/Caption: DM Sans, 12px, weight 400, letter-spacing 0.12em, UPPERCASE

Layout:

Max content width: 1200px, centered
Section padding: 120px vertical
Grid: 12-column with generous gutters
Zero decorative dividers — space is the separator
No stock photography. Use CSS gradients, abstract mesh backgrounds, and subtle grain texture overlay.

Grain overlay (apply globally):
cssbody::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}

SITE ARCHITECTURE
/ ............... Homepage
/apply .......... Application form (primary conversion)
/how-it-works ... Process explanation (trust builder)
/market ......... Market intelligence teaser
/bespoke-living . Blog/content hub
/circle ......... VIREZIA Circle — password/invite protected, invitation only
/partners ....... Developer/owner submission (hidden from main nav)
Main Navigation (minimal, sticky, transparent → solid on scroll):
VIREZIA [logo/wordmark]          How It Works   Market   Bespoke Living   Apply →
"Apply →" is a small outlined button with gold border.
Circle: visible only as a subtle link under the main CTA on homepage and in footer. Not in main nav.
Partners page: accessible only via footer link, not main nav.

PAGE 1: HOMEPAGE ( / )
Section 1 — HERO
Full viewport height. Dark background with subtle radial gradient (warm center, cold edges).
Animated: text fades in staggered on load.
[Small label, uppercase, gold, letter-spacing wide]
Private Real Estate Intelligence · Mexico

[H1, large, serif, light weight]
Fewer Options.
Better Ones. Yours.

[Body text, muted, max-width 520px]
We help expats and foreign investors buy property
in Mexico with full confidence.

Every opportunity we show you is curated from the full market,
verified on-site, benchmarked against real data,
and matched personally to your profile.

No hidden fees. No noise. No guesswork.

[CTA button, gold border, text: "Apply for Private Access"]
[Secondary link below: "Learn how it works →"]
Bottom of hero: thin horizontal line + small text: "Not a listing portal. Every option is selected for you specifically."

Section 2 — PROBLEM CONTRAST
Two-column layout. Left: the broken market. Right: VIREZIA's approach.
Background: slightly lighter (#111).
[Left column — label: "The market"]
Hundreds of listings.
Inflated prices.
No legal clarity.
No independent verification.
Brokers optimizing for commission,
not for your outcome.

[Right column — label: "VIREZIA"]
Every deal audited before you see it.
Price benchmarked against market signals.
Legal status verified by local counsel.
Matched to your intent, not our inventory.
You see less. You decide with more clarity.

Section 3 — WHAT IS VIREZIA
Full-width section. Single column, centered. Large serif text.
[Label: "What we are"]

[H2]
We Don't Show You Everything.
We Show You What's Right for You.

[Body]
VIREZIA curates a small number of opportunities from the full
Mexican real estate market — not one list for everyone,
but a personal selection built around your profile.

Every property we surface is verified on-site, benchmarked
against real market data, and reviewed for legal clarity.
No hidden fees. No noise. No guesswork.

And if you've already found something —
you can commission an independent audit through our partner network.

[Three items in a row — minimalist, no icons, just numbers + text]

01 — Personal Profile
Tell us your goals, budget, and priorities.
We build your buyer profile and match opportunities to it —
not the other way around.

02 — Curated & Verified
Every option is sourced from the full market, selected for quality,
verified on-site by our due diligence partner, and benchmarked
against current pricing data. Including off-market and pre-sale
opportunities not yet publicly listed.

03 — Guided to Close
Full transparency from first contact to notarial close.
No hidden fees. Legal support, partner network, and clear
process at every step — or audit your own found deal on demand.

Section 4 — HOW IT WORKS (abbreviated)
Three steps. Horizontal on desktop, vertical on mobile.
[Label: "The process"]

[Step 1]
Define Your Direction
Tell us your goals, budget, and timeline.
We build your buyer profile.

[Step 2]
Receive Verified Options
We surface audited opportunities matched to your intent.
Off-market, pre-sales, and selected listings — verified before delivery.

[Step 3]
Acquire with Clarity
We guide you from first review to final close.
Legal support, notarial process, partner network — all coordinated.

[Link: "Full process breakdown →" → /how-it-works]

Section 5 — FOR WHOM (qualification filter)
Two columns. Clean, direct.
[Label: "Who this is for"]

[Left — "VIREZIA is for:"]
· Expats relocating to Mexico
· Foreign investors entering emerging markets
· Remote founders seeking a base of operations
· Individuals who value clarity over volume
· Buyers who don't want to navigate an unfamiliar market alone

[Right — "VIREZIA is not for:"]
· Browsing hundreds of listings
· Comparing options without intent to buy
· Those expecting an automated platform
· Mass-market property search

[Note at bottom, small, muted]
Access is limited. Each application is reviewed individually.

[Separate line, italic, color: --accent-gold at 60% opacity]
For investors seeking pre-market deal access before public release —
VIREZIA Circle operates by invitation only. [→ /circle]

Section 6 — TRUST SIGNALS
Dark card background. No fabricated testimonials. Real-feeling signals only.
[Label: "Track record"]

[Stat 1]
3 Focus Regions
Tulum · Riviera Maya · Oaxaca
Markets monitored daily for pricing, demand, and legal shifts.

[Stat 2]
Independent Verification Standard
Legal title · Physical on-site inspection · Registro Público records
Every deal audited by our due diligence partner before you see it.

[Stat 3]
Full Cycle Support
From first inquiry to acquisition close.
Including legal, notarial, and relocation partners.

[Anonymous case note — styled as a card]
"A US-based founder with a $280k budget and a 90-day timeline
received three verified options in Tulum within 5 days.
Acquisition completed in 7 weeks."
— Anonymous · Q1 2026

Section 7 — FINAL CTA
Full-width, high contrast. Gold accent.
[H2]
Private Access.
Reviewed Individually.

[Body]
Submit your application and tell us what you are looking for.
We review every request and respond within 48 hours.

[Button: "Apply for Private Access"]
[Small text below: "No commitment. No browsing. Just clarity."]

[Subtle line below button, smaller, muted]
Already a member? → VIREZIA Circle  [links to /circle]

---

### Section 7 — FINAL CTA

Full-width, high contrast. Gold accent.
[H2]
Private Access.
Reviewed Individually.
[Body]
Submit your application and tell us what you are looking for.
We review every request and respond within 48 hours.
[Button: "Apply for Private Access"]
[Small text below: "No commitment. No browsing. Just clarity."]

---

### FOOTER

Minimal. Dark, border-top subtle.
[Left: VIREZIA wordmark + tagline: Bespoke Living]
[Center links]
How It Works · Market · Bespoke Living · Apply
[Right]
hello@virezia.com
Cancún · Mexico
[Bottom row]
© 2026 VIREZIA. All rights reserved.
Privacy Policy · Terms · [hidden: List Your Property →]

"List Your Property →" links to /partners — visible only in footer, no main nav.

---

## PAGE 2: /apply

### Purpose
Primary conversion page. Multi-step form. No external services (Typeform, etc.) — built inline.

### Header
[H1]
Apply for Private Access
[Body, max 480px]
VIREZIA works with a limited number of buyers at any time.
Submit your profile and we'll review your request within 48 hours.

### Form — 3 Steps (progress indicator at top)

**Step 1 — You**
- Full Name (text)
- Email (email)
- Country of residence (select — common options: USA, Canada, UK, Germany, Poland, Other)
- How did you hear about VIREZIA? (select: Referral / LinkedIn / Search / Other)

**Step 2 — Your Intent**
- I am looking to: (radio) Relocate to Mexico / Invest in property / Both / Still exploring
- Preferred region: (multi-select) Tulum / Riviera Maya / Oaxaca / Not sure yet
- Timeline: (radio) Immediately / 3–6 months / 6–12 months / Exploring for now
- Budget range: (radio) Under $150k / $150k–$300k / $300k–$600k / $600k+ / Prefer not to say

**Step 3 — Context**
- Tell us briefly what you are looking for: (textarea, 4 rows)
- Placeholder: "What matters most to you in this acquisition? Investment return, lifestyle, relocation, something else?"

**Submit button:** "Submit Application"

**After submit:** Show confirmation message inline (no redirect):
Your application has been received.
We review every request individually and will be in touch within 48 hours.
— VIREZIA

---

## PAGE 3: /how-it-works

### Purpose
Destroy objections before application. Show that the process is real, structured, and trustworthy.

### Structure

**Header:**
[H1] A Different Way to Enter the Market
[Body] Most buyers in Mexico navigate alone — relying on a single agent
with a conflict of interest. VIREZIA was built to close that gap.

**Section 1 — Signal Collection**
[H3] How We See the Market
We continuously aggregate data from multiple sources:
· Social media demand signals across expat and investor communities
· Rental performance data (AirDNA and equivalent)
· Historical pricing and transaction records
· Direct developer relationships and pre-market access
· On-ground physical audits through local partner network
This gives us a real-time map of what the market is doing —
not what developers want you to believe it's doing.

**Section 2 — Verification Standard**
[H3] What "Verified" Means
Every property that enters our network passes a multi-point independent review
conducted by our due diligence partner — a registered Mexican entity operating
under Swiss standards of accuracy and transparency.
Legal audit — Title verification via Registro Público de la Propiedad.
Liens, debt status, ejido classification, permit review, developer background.
Physical inspection — On-site visit: keys, utilities, structural condition,
photos, written report. Conducted before any opportunity is presented.
Price benchmark — Compared against current market data for the region and asset type.
Rental potential — AirDNA occupancy and ADR estimates where relevant.
Only properties that pass this standard enter our network.
Full legal and notarial report available as a paid add-on.
Basic verification: from $890. Full asset protection: from $4,500.
Included in complete acquisition packages — ask when you apply.

**Section 3 — Buyer Profile**
[H3] Your Profile Drives Everything
When you apply, we build a detailed buyer profile:
· Acquisition intent (investment, relocation, both)
· Timeline and flexibility
· Budget range and financing situation
· Lifestyle and location preferences
· Risk tolerance
Every opportunity we surface is matched against this profile.
We don't send you a list — we send you what fits.

**Section 4 — Full Cycle Support**
[H3] From First Contact to Close
We accompany every client through the full acquisition cycle:
· Initial options delivery (typically within 72 hours of profile completion)
· Property walkthroughs (virtual or in-person)
· Negotiation support
· Legal and notarial coordination through trusted partners
· Relocation, residency, and financing referrals
We do not disappear after the introduction.
We stay until the transaction is closed.

**CTA at bottom:**
[H2] Ready to begin?
[Button: Apply for Private Access]

---

## PAGE 4: /market

### Purpose
Demonstrate intelligence capability. Teaser only — full access post-application.

### Structure

**Header:**
[H1] Market Intelligence
[Body] A public snapshot of what we monitor across our three focus regions.
Full analysis and verified deal data is available to active members.

**Three region cards (one per region):**

Each card:
- Region name (Tulum / Riviera Maya / Oaxaca)
- 2–3 data points (example placeholders — replace with real data):
  - Average price per m² (condos): $X,XXX
  - Average short-term rental yield: X%
  - Demand trend: ↑ Rising / → Stable / ↓ Cooling
- One sentence of editorial context
- "View verified opportunities →" → links to /apply

**Section below cards:**
[H3] What We Monitor
· Listing price trends across Tulum, Akumal, Puerto Morelos, Puerto Escondido
· Short-term rental performance (AirDNA)
· Developer pipeline and pre-sale absorption rates
· Legal risk indicators by zone (ejido, coastal restrictions)
· Expat and investor demand signals from community monitoring
[Note, muted]
This data informs every deal in our network.
It is not public. It is not available elsewhere.
Full access is provided to verified buyers after application.

---

## PAGE 5: /bespoke-living

### Purpose
Content hub. Lifestyle + intelligence editorial. Each post ends with one CTA.

### Structure

**Header:**
[H1] Bespoke Living
[Body] Notes on life, markets, and acquisition in Mexico's emerging destinations.

**Post grid:** 2-column masonry grid. Each card: title, date, 2-line excerpt, "Read →"

**No sidebar. No categories. No comments.**

**Every post footer:**

Interested in acquiring in this market?
[Button: Apply for Private Access]

---

## PAGE 6: /circle

### Purpose
Signals the existence of a higher-access tier. Publicly visible but functionally gated.
No details about what Circle contains — interest is captured via email only.
Operational launch of Circle is deferred until minimum deal flow exists (3+ pre-market assets).

### Access gate
Page is publicly accessible but contains no member content.
Future: add password protection or invite-token system once Circle is operational.

### Structure

**Full-page layout. Minimal. Dark. No nav links visible except logo.**
[Small label, uppercase, gold]
By Invitation Only
[H1, large serif]
VIREZIA Circle
[Body, centered, max 480px]
A private network for investors with active acquisition intent
in Mexico's emerging markets.
Pre-market deals. Off-market assets. Verified before release.
Access to opportunities that never reach the public.
[Separator — thin gold line, short, centered]
[H3, lighter weight]
How membership works
[Three lines, minimal]
· Deals are sourced and verified before any public listing
· Members receive priority access based on acquisition profile
· Network introductions available within the Circle
[Separator]
[Single input field + button]
Request an introduction
[Email input placeholder: "Your email address"]
[Button: "Submit Request"]
[Muted note below]
All requests are reviewed individually.
Membership is granted by invitation or direct referral only.
Current availability is limited.
[Footer link only — no main nav]
← Return to VIREZIA

### Behavior after submit
Show inline confirmation:
Your request has been noted.
If there is a fit, someone will reach out directly.
— VIREZIA
No automated email. Manual review. This is intentional.

---

## PAGE 7: /partners

### Purpose
Hidden entry point for developers and property owners who want to list with VIREZIA.
NOT advertised in main nav. Footer link only.

### Structure

**Header:**
[H1] Submit Your Property
[Body] VIREZIA evaluates a limited number of developer and owner
opportunities each quarter. Every submission is reviewed against
our buyer demand data before acceptance.

**What we look for:**
· Properties in Tulum, Riviera Maya, or Oaxaca / Puerto Escondido
· Pricing aligned with market data (not wishful listing prices)
· Clean legal title or clear regularization path
· Developer or owner with capacity to support due diligence

**Form (simple, single step):**
- Name
- Email
- Property location (text)
- Property type (select: Condo / Villa / Land / Commercial / Other)
- Asking price (text)
- Current status (select: Pre-sale / Active listing / Off-market / Under development)
- Brief description (textarea)

**Submit button:** "Submit for Evaluation"

**After submit:**
Thank you. We review all submissions against current buyer demand.
If there is a fit, we will reach out within 5 business days.

---

## COMPONENT SPECIFICATIONS

### Navigation Component
- Transparent on load, transitions to `rgba(8,8,8,0.95)` with backdrop-blur on scroll
- Logo: "VIREZIA" in Cormorant Garamond, tracking wide, gold color
- Links: DM Sans, small, uppercase, letter-spacing wide, text-secondary
- CTA: small outlined button, gold border, gold text, hover: fills gold, text dark

### Button Variants
Primary: gold border + gold text, dark bg. Hover: bg fills gold, text #080808
Secondary: text only with underline animation
Ghost: fully transparent, border subtle

### Card Component
- Background: #161616
- Border: 1px solid #222
- Padding: 32px
- No border-radius OR very subtle (4px max)
- Hover: border color shifts to gold (subtle)

### Form Component
- Input fields: bg #111, border #222, text primary
- Focus: border shifts to gold
- Labels: uppercase, small, letter-spacing wide, text-muted
- Error states: red border, small error text below
- Progress bar (multi-step): thin gold line across top, fills per step

### Scroll Animations
- All sections: fade-in + translateY(20px) → translateY(0) on enter
- Stagger delay for lists: 0.1s per item
- Use Framer Motion `useInView` hook

---

## COPY RULES (enforce throughout)

- Never use: "browse," "search listings," "find properties," "explore options"
- Always use: "verified," "audited," "matched," "curated," "clarity"
- Tone: calm, precise, confident. Zero hype. Zero urgency language.
- No exclamation marks anywhere on the site.
- Numbers and specificity over adjectives wherever possible.
- When describing the service: "we" not "our team" (solo operation, keep it lean)

---

## WHAT TO EXCLUDE

- Social media icons (omit entirely until profiles are active)
- Any testimonials not in the exact format specified above
- "For Agents" language or nav items
- Any language implying a browsable database
- Stock photography of smiling people, tropical beaches, generic real estate
- Alexa Ramírez persona (communications only, not on website)
- Three redundant pillars that say the same thing

---

## FILE STRUCTURE (suggested)
/app
/page.tsx .................. Homepage
/apply/page.tsx ............ Application form
/how-it-works/page.tsx ..... Process page
/market/page.tsx ........... Market intelligence
/bespoke-living/page.tsx ... Blog index
/bespoke-living/[slug]/page.tsx
/partners/page.tsx ......... Hidden partner form
layout.tsx ................. Root layout with nav + footer
/components
Nav.tsx
Footer.tsx
Hero.tsx
SectionLabel.tsx
Button.tsx
Card.tsx
ApplyForm.tsx .............. Multi-step form
PartnerForm.tsx
AnimatedSection.tsx ........ Scroll reveal wrapper
/lib
fonts.ts ................... Google Fonts config
constants.ts ............... Site copy constants
/styles
globals.css ................ CSS variables + base styles

---

## LAUNCH CHECKLIST (before going live)

- [ ] Replace placeholder market data in /market with real numbers
- [ ] Add one real anonymous case study (Q1 2026 format)
- [ ] Connect form submissions to email (Resend or Nodemailer → hello@virezia.com)
- [ ] Set up form data storage (simple: Notion API or Airtable as backend)
- [ ] Remove "List Your Property →" footer link until /partners is ready
- [ ] Add Google Analytics or Plausible (privacy-first preferred)
- [ ] Meta tags: OG image, title, description per page
- [ ] Mobile QA: all sections responsive, form usable on iOS

---

*Brief version: 1.0 — March 2026*
*Built for Claude Code. All copy is final unless marked [PLACEHOLDER].*
