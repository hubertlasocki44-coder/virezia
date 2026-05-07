# VIREZIA — Claude Code Build Brief
## Complete Website Specification

**Version:** 2.0 (May 2026)
**Status:** Canonical
**Supersedes:** v1.0 (March 2026 — "Private Real Estate Intelligence" positioning)

---

## CONTEXT FOR CLAUDE CODE

Build a complete multi-page website for **VIREZIA** — a **curator-led editorial platform for exceptional homes and real estate investments**, with a focus on Latin America and a global scope.

VIREZIA is **NOT**:
- A marketplace
- A listing portal
- A traditional real estate agency
- A "real estate intelligence platform" (in public-facing language)
- A volume play

VIREZIA **IS**:
- A curator's selection of exceptional properties
- An editorial publication where each featured listing is told as story
- An invitation-only access layer for serious buyers
- A two-sided model: asset owners pay for placement, buyers apply for access

The website's job is to **filter the right people in and everyone else out**, while signaling status, taste, and exclusivity through restraint.

### Critical architectural rule

**Intelligence is the backend. Editorial is the front.**

The platform's actual capabilities (REACH, AI tooling, market data, due diligence partnerships, repositioning frameworks, audience matching) are **real** but **never appear on public-facing pages.** They power what is delivered, but the public sees only editorial curation.

For full reasoning, see `positioning-architecture.md`. For voice and language rules, see `brand-guidelines.md`. For featured listing copy, see `editorial-voice.md`.

---

## TECH STACK

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Fonts:** Cormorant Garamond (headings) + DM Sans (body) — load via Google Fonts
- **Animations:** Framer Motion (fade-in on scroll, staggered reveals — slow rhythm)
- **Forms:** React Hook Form (no external services)
- **Icons:** Lucide React (use sparingly — most sections need none)
- **Deployment:** Vercel-compatible static export

---

## DESIGN SYSTEM

```css
--bg-primary: #080808
--bg-secondary: #111111
--bg-card: #161616
--text-primary: #f0ece4
--text-secondary: #9a9690
--text-muted: #5a5650
--accent-gold: #c9a96e
--accent-gold-light: #e8d5b0
--border: #222222
--border-subtle: #1a1a1a
```

### Typography scale

- **H1:** Cormorant Garamond, 72–96px, weight 300, letter-spacing -0.02em
- **H2:** Cormorant Garamond, 48–64px, weight 300
- **H3:** Cormorant Garamond, 32px, weight 400
- **Body:** DM Sans, 16px, weight 300–400, line-height 1.7
- **Label/Caption:** DM Sans, 12px, weight 400, letter-spacing 0.12em, UPPERCASE

### Layout

- Max content width: 1200px, centered
- Section padding: 120px vertical
- Grid: 12-column with generous gutters
- Zero decorative dividers — space is the separator
- **No stock photography.** Architecture-grade imagery only, or CSS gradients / mesh backgrounds with subtle grain texture overlay (3% opacity)

### Grain overlay (apply globally)

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

---

## SITE ARCHITECTURE

```
/ ................. Homepage
/featured/[slug] .. Individual featured property pages (Las Orcas first)
/apply ............ Application form (primary buyer conversion)
/approach ......... How VIREZIA works (replaces /how-it-works — editorial framing)
/bespoke-living ... Blog / editorial content hub
/bespoke-living/[slug]
/circle ........... VIREZIA Circle — invitation only, minimal page
/for-owners ....... Asset owner / developer submission (replaces /partners)
```

### Main Navigation

Minimal, sticky, transparent → solid on scroll:

```
VIREZIA [logo/wordmark]    Featured   Approach   Bespoke Living   Apply →
```

- "Apply →" is a small outlined button with gold border
- **Circle** is visible only as a subtle line under the homepage hero CTA, and in the footer. **Never in main nav.**
- **For Owners** is a footer link only. Not in main nav.

---

## PAGE 1: HOMEPAGE ( / )

### Section 1 — HERO

Full viewport height. Dark background with subtle radial gradient (warm center, cold edges). Animated: text fades in staggered on load.

```
[Small label, uppercase, gold, letter-spacing wide]
A Curated Real Estate Network

[H1, large, serif, light weight — LOCKED]
Curated real estate,
selected — not listed.

[Sub-line, serif lighter weight, max-width 640px, muted]
A network where international investors meet
and find good opportunities.

[Body text, muted, max-width 520px]
VIREZIA selects properties from across the market —
architectural, design-led, location-driven, investment-grade —
and presents them inside VIREZIA Circle.

Apply to create your profile.
We work with buyers, investors, developers, and asset owners.

[CTA button, gold border, text: "Apply for Access"]
[Secondary link below: "How VIREZIA works →" → /approach]
```

Bottom of hero: thin horizontal line + small text:

> Properties available inside VIREZIA Circle. Apply to create your profile.

Below that, separate line, italic, muted gold (60% opacity):

> VIREZIA Circle — by invitation only. [→ /circle]

### Section 2 — WHAT VIREZIA IS

Replaces the previous "Currently Featured" section. Per architectural decision: **homepage does not display properties.** Featured properties are visible only on dedicated landing pages built per campaign, or inside VIREZIA Circle for members.

Single column, generous spacing. Confident, declarative.

```
[Label: "What VIREZIA Is"]

[H2]
A curated real estate network.

[Body, max 640px]
VIREZIA is not a listing portal.
We don't publish properties on the public homepage.

We select real estate from across the market —
architectural, design-led, location-driven, investment-grade —
and present each property inside VIREZIA Circle.

International investors apply to create a profile and access opportunities.
Developers and asset owners apply to submit properties for selection.
Each application is reviewed personally.
```

**No featured properties shown here.** No carousel. No grid. The work of presenting properties happens on dedicated landing pages, not on this surface.

### Section 3 — THE APPROACH

Single column, restrained, declarative.

```
[Label: "The Approach"]

[H2]
We don't list properties.
We select them.

[Body, max 640px]
Every property in VIREZIA Circle is selected personally —
for its architecture, design, location, story,
investment thesis, or off-market access.

We work with the owners and developers behind each property
to present it the way it deserves to be presented.

Some properties we feature are off the public market.
Others are publicly available, but worth a closer look
than the noise around them allows.

If a property earns a closer look, we feature it.
If it doesn't, we don't.

[Subtle link: "Read the full approach →" → /approach]
```

### Section 4 — FOR WHOM

Two columns, restrained. No bullets — short lines, line-broken.

```
[Label: "Who this is for"]

[Left — header: "VIREZIA is for"]
Buyers who value character over volume.
Investors with a discerning eye.
Owners of exceptional properties.
People who prefer to be introduced.

[Right — header: "VIREZIA is not for"]
Browsing.
Mass-market property search.
Volume listings.
Anyone expecting a portal.

[Note at bottom, small, muted]
Access is limited. Each application is reviewed individually.
```

### Section 5 — FOR OWNERS & DEVELOPERS (light touch)

A single quiet block — does not dominate the buyer-focused homepage.

```
[Label: "For Owners & Developers"]

[H3]
If your property is exceptional, we'd like to hear about it.

[Body, max 560px]
VIREZIA features a limited number of properties each year.
Owners and developers with architecturally distinctive,
design-led, or story-rich properties may submit for review.

[Link: "Submit a property →" → /for-owners]
```

### Section 6 — FINAL CTA

Full-width, high contrast, gold accent. Restrained.

```
[H2]
Create your VIREZIA profile.

[Body]
Tell us what you're looking for —
or what you're offering.
We respond personally within 48 hours.

[Button: "Apply for Access"]
[Small text below, muted: "Each application is reviewed individually."]
```

### FOOTER

Minimal, dark, border-top subtle.

```
[Left: VIREZIA wordmark + small line: "Curated homes, by invitation."]

[Center links]
Featured · Approach · Bespoke Living · Apply

[Right]
hello@virezia.com
Cancún · Mexico

[Bottom row]
© 2026 VIREZIA. All rights reserved.
Privacy · Terms · For Owners → · Circle →
```

---

## PAGE 2: /featured/[slug] — Individual Featured Property

### Purpose
The editorial heart of VIREZIA. Each featured property is a long-form curatorial introduction.

For full writing guidance, see `editorial-voice.md`.

### Structure (mirrors editorial-voice.md §2)

```
[Hero image — architecture photography, full-width]

[Small label: "Featured · [Region]"]

[H1]
[Property Name]

[Subtitle, serif, lighter weight]
[One-line editorial framing — e.g., "A coastal retreat by Robert Couturier"]

[Body — written following editorial-voice.md]

  Block 1: The Lead (1–2 paragraphs)
  Block 2: The Place (2–3 paragraphs)
  Block 3: The Property (2–3 paragraphs)
  Block 4: The Practical (compressed, sidebar or short paragraph)
  Block 5: The Invitation (CTA)
```

### Practical sidebar (or compressed bottom block)

Right column on desktop, below body on mobile. Minimal.

```
ARCHITECT / DESIGNER
Robert Couturier

LOCATION
Pacific Coast, Mexico

CONFIGURATION
11 residences

STATUS
Pre-sale · 2026 delivery

ACCESS
By application via VIREZIA
```

**No prices on the public page.** Pricing is disclosed post-qualification, in private 1:1 conversation.

### CTA at bottom

```
[H3]
Express interest in [Property Name]

[Body, brief]
Currently accepting expressions of interest from qualified buyers.
Inquiries are reviewed personally.

[Button: "Apply for Private Access"]
```

---

## PAGE 3: /apply — Application Form

### Purpose
Primary conversion page for buyers. Multi-step form, built inline, no external services.

### Header

```
[H1]
Apply for Private Access

[Body, max 480px]
VIREZIA works with a limited number of buyers at any time.
Submit your profile and we'll review your request within 48 hours.
```

### Form — 3 Steps (progress indicator at top, thin gold line)

**Step 1 — You**
- Full Name (text)
- Email (email)
- Country of residence (select)
- I am: (radio) Buyer / Investor / Developer / Asset owner / Real estate professional / Other
- How did you hear about VIREZIA? (select: Featured property / Referral / LinkedIn / Bespoke Living / Other)

**Step 2 — Your Intent**
- I am looking to: (radio) Acquire a primary residence / Acquire as investment / Both / Submit a property / Still exploring
- Property character that interests you: (multi-select) Architectural distinction / Design lineage / Coastal / Urban / Land / Investment-grade / Off-market / Pre-sale
- Preferred regions: (multi-select) Mexico / Argentina / Other Latin America / Europe / Other
- Timeline: (radio) Immediately / 3–6 months / 6–12 months / Exploring
- Budget range: (radio) Under $500k / $500k–$1M / $1M–$3M / $3M+ / Prefer not to say

**Step 3 — Context**
- What kind of property would you most want to be introduced to? (textarea, 4 rows)
- Placeholder: "Tell us what would make a property worth your attention. Specific architects, locations, lifestyles, investment thesis, or anything else that defines what you're looking for."

**Submit button:** "Submit Application"

**After submit (inline confirmation, no redirect):**

```
Your application has been received.
We review every request individually
and will be in touch within 48 hours.

— VIREZIA
```

---

## PAGE 4: /approach — How VIREZIA Works (editorial)

### Purpose
Explain the model **without** revealing backend mechanics. Reassure serious applicants. Build trust through restraint, not feature lists.

This page replaces the previous `/how-it-works` page, which was service-catalog-style.

### Structure

```
[H1]
The Approach

[Body, max 640px]
VIREZIA exists because the way exceptional properties
are usually presented does them a disservice.

Most homes are listed. A small number deserve to be introduced.

These are the ones we work with.
```

### Section: Selection

```
[H3] What we feature

[Body]
Every property featured on VIREZIA is selected personally
for one or more of the following:

— Architectural or design distinction
— Location with character
— A story worth telling
— A defined investment thesis
— Off-market access not available elsewhere

We feature a defined number of properties at any time.
Not the largest. Not the cheapest. The right ones for the right buyer.
```

### Section: How buyers engage

```
[H3] If you are looking to acquire

[Body]
You apply. We respond personally within 48 hours.

If there is alignment between what you are looking for
and what we are featuring or sourcing,
we begin a private conversation.

What follows is shaped by the property and by you —
not by a fixed process diagram.
```

### Section: How owners engage

```
[H3] If you own a property worth featuring

[Body]
Owners and developers approach VIREZIA when they want
their property told properly — and placed in front of
buyers who will value it.

Featured selection is reviewed quarterly.
Inclusion is by invitation following submission.

[Link: "Submit a property →" → /for-owners]
```

### Section: What we do not do

A confident, restrained closing block.

```
[H3] What we do not do

[Body, line-broken]
We do not list.
We do not browse.
We do not work with mass-market product.
We do not feature what we would not personally consider exceptional.

Selectivity is the entire point.
```

### Final CTA

```
[Button: "Apply for Private Access"]
```

**What this page does NOT contain:**
- Verification mechanics
- Due diligence pricing or packages
- AI / intelligence claims
- Process flowcharts with "Step 1 / Step 2 / Step 3"
- Service tier comparisons

---

## PAGE 5: /bespoke-living — Blog / Editorial Hub

### Purpose
Editorial content hub. Lifestyle, architecture, design, place. The voice of the curator.

### Header

```
[H1]
Bespoke Living

[Body]
Notes on architecture, design, and life across the places
VIREZIA features.
```

### Layout

- 2-column masonry post grid
- Each card: title (serif), date, 2-line excerpt, "Read →"
- No sidebar. No categories. No comments. No author bylines (the curator's voice is implicit).

### Every post footer

```
Interested in acquiring in this market?

[Button: "Apply for Private Access"]

Or browse currently featured properties →
```

### Post structure (template — see editorial-voice.md)

- Long-form (1,000–2,500 words)
- Architecture-grade imagery
- Personal voice
- Always closes with one CTA only

---

## PAGE 6: /circle — VIREZIA Circle

### Purpose
Signal that Circle exists. Capture interest. **Never disclose what Circle contains** on public surfaces.

For positioning rule, see `value-propositions.md` §Track 3.

### Structure (full-page, minimal, dark, no main nav)

```
[Small label, uppercase, gold]
By Invitation Only

[H1, large serif]
VIREZIA Circle

[Body, centered, max 480px]
A private network for those with active acquisition intent
in markets we cover.

Membership is granted by invitation or direct referral.

[Separator — thin gold line, short, centered]

[Single input field + button]
Request an introduction
[Email input placeholder: "Your email address"]
[Optional textarea: "Brief context (optional)"]
[Button: "Submit Request"]

[Muted note below]
All requests are reviewed personally.
Current availability is limited.

[Footer link only — no main nav]
← Return to VIREZIA
```

### Behavior after submit

```
Your request has been noted.
If there is a fit, someone will reach out directly.

— VIREZIA
```

No automated email. Manual review. This is intentional.

### What this page does NOT contain
- Description of what Circle members receive
- Pre-market deal mechanics
- Pricing of any kind
- Member benefits list
- Tier structures

The page exists to signal Circle's existence to those already aware of it. Anyone who needs more explanation is not the target.

---

## PAGE 7: /for-owners — Asset Owner / Developer Submission

### Purpose
Hidden entry point for owners and developers who want to submit a property for featuring consideration.

**Footer link only. Not in main nav.**

### Structure

```
[Label: "For Owners & Developers"]

[H1]
Submit a Property

[Body, max 640px]
VIREZIA features a limited number of exceptional properties each year —
sourced globally, with current focus across Latin America.

If your property has architectural distinction, design lineage,
location character, or a story worth telling — we'd like to hear from you.

Submission begins with a brief intake. Featured selection is reviewed quarterly.
```

### What we look for

```
[H3] Selection criteria

— Architectural, design, or location distinction
— A defined investment thesis or off-market access
— Pricing aligned with market reality
— Clean legal title or clear regularization path
— Owner willing to support thoughtful presentation of the offer
```

### Form (single step, simple)

- Name
- Email
- Role (select: Owner / Developer / Architect / Representing seller)
- Property location
- Property type (select: Single residence / Multi-unit / Land / Mixed-use / Other)
- Asking price range (text)
- Current status (select: Pre-sale / Active listing / Off-market / Under development)
- What makes this property worth featuring? (textarea, 5 rows)
- Image / portfolio link (optional, URL)

**Submit button:** "Submit for Review"

### After submit

```
Thank you.

We review every submission against our current featuring criteria.
If there is a fit, we will reach out within 5 business days.

— VIREZIA
```

### What this page does NOT contain

- Repositioning / campaign pricing
- Retainer fee structure
- "Featured packages" or tiers
- Service-catalog mechanics
- Audience size claims

These are disclosed in private conversation **after** initial submission review.

---

## COMPONENT SPECIFICATIONS

### Navigation Component
- Transparent on load, transitions to `rgba(8,8,8,0.95)` with backdrop-blur on scroll
- Logo: "VIREZIA" in Cormorant Garamond, tracking wide, gold color
- Links: DM Sans, small, uppercase, letter-spacing wide, text-secondary
- CTA: small outlined button, gold border, gold text. Hover: fills gold, text dark.

### Button Variants
- **Primary:** gold border + gold text, dark bg. Hover: bg fills gold, text #080808
- **Secondary:** text only with underline animation
- **Ghost:** fully transparent, border subtle

### Featured Property Card
- Background: #161616
- Border: 1px solid #222
- Padding: 0 (image bleeds to edge), 32px on text section
- No border-radius OR very subtle (4px max)
- Hover: border color shifts to gold (subtle), image subtle zoom (1.02 scale)

### Form Component
- Input fields: bg #111, border #222, text primary
- Focus: border shifts to gold
- Labels: uppercase, small, letter-spacing wide, text-muted
- Error states: red border, small error text below
- Progress bar (multi-step): thin gold line across top, fills per step

### Scroll Animations
- All sections: fade-in + translateY(20px) → translateY(0) on enter
- Stagger delay for lists: 0.1s per item
- **Slow rhythm** — animations should breathe, not snap
- Use Framer Motion `useInView` hook

---

## COPY RULES (enforce throughout)

### Always use
- *Featured, curated, selected, presented, introduced*
- *By invitation, by application, by referral*
- *Exceptional, distinctive, distinguished* (only when literally true)
- *Story, design, architecture, place, character*

### Never use (front-end)
- *Browse, search listings, find properties, explore options*
- *Verified, audited, due diligence* (in copy or pricing)
- *Intelligence, smart, AI-powered, tech-enabled*
- *Listings, inventory, database*
- *Best, top, leading, premier, world-class, luxurious*
- *Exclamation marks anywhere on the site*
- *Don't miss, limited time, act now*

### Tone
- Calm, precise, confident
- Slow rhythm — sentences breathe
- Specific over decorative
- Confident through restraint, not volume

### Voice
- "We" not "our team" (solo curator-led operation)
- First person where natural ("we featured this because...")
- Editorial framing, not service-provider framing

---

## WHAT TO EXCLUDE (anti-pattern checklist)

- Stock photography of any kind (smiling people, beaches, generic interiors)
- Social media icons (omit until profiles are active and editorially aligned)
- Three-pillar service catalogs ("Personal Profile / Curated & Verified / Guided to Close")
- Five-differentiator lists ("Few not many · Verified · No hidden fees...")
- Due diligence pricing or service packages on any public page
- Process flowcharts with numbered steps
- Testimonials in standard format (use anonymous case notes only, sparingly)
- Alexa Ramírez persona (deprecated entirely)
- "Bespoke Living" as homepage tagline (it's the blog name now)
- "Live Beyond Borders" hero (deprecated)
- "Private Real Estate Intelligence" anywhere on public pages
- Any geographic claim broader than what is actually featured
- AI / intelligence / tech-enabled language anywhere customer-facing
- Generic real estate adjective stacking

---

## FILE STRUCTURE

```
/app
  page.tsx                      # Homepage
  /featured
    /[slug]/page.tsx            # Individual featured property
  /apply/page.tsx               # Application form
  /approach/page.tsx            # The approach (replaces /how-it-works)
  /bespoke-living
    page.tsx                    # Blog index
    /[slug]/page.tsx            # Blog post
  /circle/page.tsx              # VIREZIA Circle (minimal)
  /for-owners/page.tsx          # Submission form (replaces /partners)
  layout.tsx                    # Root layout (nav + footer)

/components
  Nav.tsx
  Footer.tsx
  Hero.tsx
  FeaturedCard.tsx
  SectionLabel.tsx
  Button.tsx
  ApplyForm.tsx                 # Multi-step
  OwnerSubmissionForm.tsx
  CircleRequestForm.tsx
  AnimatedSection.tsx           # Scroll reveal wrapper

/content
  /featured                     # MDX or markdown for each featured property
    las-orcas.mdx
  /bespoke-living               # MDX or markdown for blog posts

/lib
  fonts.ts
  constants.ts                  # Site copy constants

/styles
  globals.css                   # CSS variables + base styles
```

---

## LAUNCH CHECKLIST

### Before campaign reactivation (Las Orcas)

- [ ] Tagline decision finalized (see `brand-guidelines.md` §6)
- [ ] Las Orcas featured page (`/featured/las-orcas`) drafted with full editorial copy
- [ ] All references to "intelligence," "verified," "audited" pricing removed from public pages
- [ ] DD pricing migrated to post-qualification flow (private only)
- [ ] `/market` page deprecated or redirected to `/approach`
- [ ] `/partners` redirected to `/for-owners`
- [ ] Hero copy reviewed against `brand-guidelines.md` §10 decision filter
- [ ] At least 3 hero-quality images for Las Orcas confirmed
- [ ] Apply form connected to email + storage (Notion or Airtable backend)
- [ ] Privacy / Terms pages basic version live

### Operational readiness

- [ ] Form submissions route to `hello@virezia.com`
- [ ] Manual review process for Apply, Circle, For Owners submissions
- [ ] Analytics: privacy-first (Plausible recommended)
- [ ] Meta tags: OG image, title, description per page
- [ ] Mobile QA: all sections responsive, forms usable on iOS

### Post-launch monitoring

- [ ] Anti-drift check (against `positioning-architecture.md` §7)
- [ ] First Bespoke Living post drafted within 30 days of launch
- [ ] Second featured property sourced and editorial drafted within 60 days

---

## RELATED DOCUMENTS (read before building)

- `brand-guidelines.md` — Voice, tone, language, decision filter
- `value-propositions.md` — Audience-specific messaging (buyer, owner, Circle)
- `editorial-voice.md` — How to write featured listings and blog posts
- `positioning-architecture.md` — Front-vs-backend separation, anti-drift triggers

When this brief conflicts with older briefs or strategy notes, **this version wins.**
When this brief conflicts with `positioning-architecture.md`, **that document wins** (it is the highest-level decision document).

---

*Brief version: 2.3 — May 2026 (tagline LOCKED: "Curated real estate, selected — not listed." + sub-line "A network where international investors meet and find good opportunities.")*
*Built for Claude Code. All copy is final unless marked [DECISION PENDING].*
*Maintained by: Lucas Hubert*
