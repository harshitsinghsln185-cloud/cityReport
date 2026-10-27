# UI Audit, Defect Inventory & Hero Masterplan (BUG_LIST.md)

> **Branch**: `ui-fix` (branched from `ui-premium`)  
> **Audit Date**: October 2026  
> **Status**: R8 Complete (All 30 Defects 100% Resolved & Audited)

---

## 1. Stack Detection

| Layer | Technology | Version | Notes / Capabilities |
|---|---|---|---|
| **Runtime & Bundler** | Node.js + Vite | Node v24.11 / Vite 6.0.7 | ESM native, fast HMR, dev proxy at `:5173` |
| **Framework** | React + TypeScript | React 18.3.1 / TS 5.7.3 | Strict mode, tsconfig strict checks |
| **Styling & Design Tokens** | Tailwind CSS + Vanilla CSS Tokens | Tailwind 3.4.17 | PostCSS 8.5, Autoprefixer, custom CSS variables |
| **Typography** | Fontsource Variable Fonts | Fraunces (Headings) / Manrope (Body) | Self-hosted WOFF2, zero Google Fonts layout shift |
| **Routing** | React Router DOM | v6.28.1 | Data router (`createBrowserRouter`), nested layouts |
| **Icons** | Lucide React | v0.473.0 | Tree-shakeable SVG icons |
| **Motion & Animation** | Framer Motion | v14.6.0 | Hardware-accelerated transforms & opacity |
| **Data Fetching & Cache** | TanStack React Query + Axios | Query v5.64.2 / Axios 1.7.9 | Integrated CSRF token & credentials support |
| **Mapping & GIS** | Leaflet | v1.9.4 | Geotagged civic coordinate picking |
| **Backend Integration** | Express.js REST API | Express 4.21 / Node 24 | Running at `:5000`, integer paise accounting |

---

## 2. Root-Cause Defect Inventory & Bug List

### Category A: Spacing, Sizing & Layout (Target: Phase R1)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-01** | Global | Container Max Width | Desktop (1024px+), 1536px | Inconsistent container wrappers across pages (`max-w-7xl` 1280px vs `max-w-4xl` vs `max-w-3xl`) without a single container token. | Scattered Tailwind max-w utilities instead of a unified container token. | Standardize `.container-custom` token to 1200px max-width (1280px on wide monitors). (R1) |
| **BUG-02** | Global | Container Side Padding | Mobile (360px), Tablet (768px), Desktop (1280px+) | Inconsistent side margins (`px-4 sm:px-6 lg:px-8` hardcoded in 30+ files). | Missing unified responsive side padding token. | Define container side padding: 16px (mobile), 24px (tablet), 32px (desktop) once in `tokens.css`. (R1) |
| **BUG-03** | Global | Section Vertical Padding | All viewports | Some pages use `py-8 sm:py-12`, others `pt-14 pb-20`, causing jarring height jumps during page transitions. | Unstandardized section wrappers. | Enforce Section Spec: 64px (<640px), 80px (640-1023px), 96-120px (1024px+). (R1) |
| **BUG-04** | Global | Button Component Tap Height | Mobile (360px), All | Medium (`md`) Button renders at ~36px height (`py-2 text-sm`), failing Apple/Google 44px minimum tap target spec. | Insufficient vertical padding and lack of explicit min-height on `Button.tsx`. | Set `Button` height: 44px (md), horizontal padding: 20px (mobile) / 24px (desktop), border-radius: 12px. (R1, R4) |
| **BUG-05** | Global | Input & Select Height | All viewports | Form inputs in `Input.tsx` render at ~40px (`py-2.5`), failing the 48px touch and desktop input standard. | Hardcoded `py-2.5` without fixed or minimum height. | Set input, select, and textarea base height to 48px with 12px border-radius. (R1, R4) |
| **BUG-06** | Global | Card Radii & Inner Padding | All viewports | `Card.tsx` inner padding is hardcoded `p-6` (24px) even on 360px mobile where 20px is required to avoid cramped text. | Non-responsive padding map in `Card.tsx`. | Implement responsive inner padding: 20px (mobile), 24px (tablet), 24-28px (desktop); radius: 16px (mobile/tablet), 20px (desktop). (R1, R4) |
| **BUG-07** | Global | Sticky Navbar Anchor Offset | All viewports | Anchoring to in-page section IDs hides the top 64px of content behind the fixed header. | Missing `scroll-margin-top` on headings and section IDs. | Add `scroll-margin-top: calc(var(--header-height) + 1.5rem)` globally in `index.css`. (R1) |
| **BUG-08** | Global | Horizontal Scroll Risk | Mobile (360px) | Full-width elements, fixed width tables, and unconstrained images risk horizontal scrollbar triggers. | Missing global `box-sizing: border-box` and unconstrained table wrappers. | Add global overflow guard, responsive table wrapper (`overflow-x-auto`), and check all element bounds. (R1) |

---

### Category B: Color System & Contrast (Target: Phase R2)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-09** | Global | Brand Primary & Accent | All viewports | Current brand uses vibrant purple/violet (`#7C3AED`) and lavender (`#EDE9FE`), which feels like a generic SaaS rather than a trusted civic governance & escrow platform. | Initial prototype palette used Tailwind default violet. | Migrate brand to institutional Midnight Navy (`#0A1F44`) primary with Warm Gold (`#C8A24A`) accent on soft ivory canvas (`#FAF8F3`). (R2) |
| **BUG-10** | Global | Hardcoded Hex Colors | All viewports | Multiple components (`PublicLayout.tsx`, `About.tsx`, `AppRouter.tsx`, `Button.tsx`) contain hardcoded hexes like `#F8F7FC`, `#1E293B`, `#64748B`, `#141838`, `#C4B5FD`. | Ad-hoc styling during rapid feature prototyping. | Replace every single hardcoded hex with a semantic token from `tokens.css` / Tailwind theme. (R2) |
| **BUG-11** | Global | Color Contrast on Secondary Text | Mobile, Desktop | Secondary text on some dark cards (`text-slate-400` on `#141838`) falls below WCAG AA 4.5:1 ratio. | Insufficient lightness on dark surface secondary text. | Run contrast checker script; enforce `#FFFFFF` (headings), `#CBD5E1` (secondary on dark) and `#101828` on `#FAF8F3`. (R2) |
| **BUG-12** | Developer | Styleguide Page | Development | No centralized visual testing page for palette swatches, type scale, buttons, inputs, and cards. | Feature was not implemented. | Create dev-only `/styleguide` page (marked `noindex`, excluded from sitemap & prod builds). (R2) |

---

### Category C: Brand Identity & Logo (Target: Phase R3)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-13** | Navbar, Footer, Favicon | Logo & Mark | All viewports | Logo currently uses generic `ShieldCheck` Lucide icon inside a gradient rounded box with generic gradient text. No true vector brandmark. | Temporary icon placeholder used in UI phase. | Design 3 geometric, trustworthy vector SVG concepts; produce horizontal, stacked, monochrome, and reversed SVGs upon selection. (R3) |
| **BUG-14** | Public Assets | Favicon & App Icons | All viewports | `favicon.svg` is 123KB unoptimized SVG; missing complete multi-density favicon set (`favicon.ico`, apple-touch, 192, 512 PNG). | Incomplete icon manifest generation. | Generate optimized vector mark and multi-resolution PNG/ICO suite for browser tabs and web manifest. (R3) |
| **BUG-15** | SEO / Social | Open Graph Share Image | 1200x630 | `og-card.png` uses old purple branding and generic typography. | Created under legacy color theme. | Generate new 1200x630 social share card featuring Midnight Navy + Warm Gold branding. (R3) |

---

### Category D: Shared Component Consistency (Target: Phase R4)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-16** | Navbar | Mobile Drawer Menu | Mobile (<1024px) | Mobile drawer does not trap focus, does not close on `Escape` key, and does not prevent body scrolling while active. | Incomplete a11y keyboard and scroll handling. | Implement accessible mobile menu with focus trap, `Escape` key listener, and body scroll lock. (R4) |
| **BUG-17** | Footer | Column Layout & Contrast | Mobile, Desktop | Footer links have uneven column heights on tablet/mobile and inconsistent hover focus rings. | Footer grid lacked uniform column spacing and keyboard focus rings. | Refactor Footer with structured columns, exact 4px grid spacing, and accessible focus states. (R4) |
| **BUG-18** | Tables & Lists | Admin / Resolver Lists | Mobile (<640px) | Data tables on mobile force horizontal clipping if screen width is 360px without a designated container wrapper. | Tables lack a responsive card-fallback or dedicated smooth scroll container. | Add responsive `.table-container` with sticky headers and mobile card transformation. (R4) |
| **BUG-19** | Badges & Chips | Status Indicators | All viewports | `Badge.tsx` and `StatusBadge.tsx` have overlapping variants and different border-radius styles (`pill` vs `rounded-md`). | Two separate badge components with diverging designs. | Unify badge geometry: 9999px pill radius, consistent font-size (12px), clear status semantic colors. (R4) |

---

### Category E: Missing Hero Sections & Art Direction (Target: Phase R5)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-20** | `/services` | Top Section | All viewports | Page starts abruptly with a plain breadcrumb and text header; completely lacks a hero section with topic photography. | Omitted in previous build. | Implement Split Hero (`split` variant) with municipal catalog hero image, headline, and category count badge. (R5) |
| **BUG-21** | `/states` | Top Section | All viewports | Directory page has no visual hero banner; immediately begins with stat counters and filters. | Omitted in previous build. | Implement Split Hero (`split` variant) with pan-India infrastructure imagery, zonal scope, and search bar. (R5) |
| **BUG-22** | `/about` | Top Section | All viewports | Center-aligned text block on flat background without hero image or visual anchoring. | Omitted in previous build. | Implement Full/Split Hero (`split` variant) featuring civic partnership photography and escrow trust pillars. (R5) |
| **BUG-23** | `/track` | Top Section | All viewports | Has only a small text header; lookup card floats in vast empty space. | Omitted in previous build. | Implement Compact Hero (`compact` variant) with milestone progress preview and verified lookup input. (R5) |
| **BUG-24** | `/query` | Top Section | All viewports | Form appears on flat white canvas without an engaging liaison header. | Omitted in previous build. | Implement Compact Hero (`compact` variant) featuring administrative liaison office imagery. (R5) |
| **BUG-25** | `/login` & `/register` | Auth Pages | All viewports | Form cards appear on generic canvas with zero branding imagery or platform value highlights. | Auth templates used minimal centered card. | Implement Compact Hero framing with brand value highlights and secure credential reassurance. (R5) |

---

### Category F: States Directory & State Detail Pages (Target: Phase R7)

| ID | Page / Area | Element / Component | Affected Viewports | Problem Description | Root Cause | Planned Fix (Phase) |
|---|---|---|---|---|---|---|
| **BUG-26** | `/states/:slug` (All 36) | Hero Banner | All viewports | All 36 state pages display a synthetic CSS color-palette gradient box (`bg-gradient-to-br from-dark...`) instead of real photographic landmarks. | Temporary palette banner placeholder used in P8. | Replace all 36 state banners with high-res cinematic landmark/landscape images (`states/<slug>-banner.webp`) with readable overlay. (R7) |
| **BUG-27** | `/states` | Zonal Navigation | All viewports | Directory has loose region buttons (`Region: All, North, South, East, West, Central, Northeast`) without zonal council structure or sticky switcher. | Non-standardized filter chips. | Implement sticky 6-zone switcher (`All`, `North`, `South`, `East`, `West`, `Central`, `North-East`) with count chips and URL sync (`?zone=north`). (R7) |
| **BUG-28** | `/states` | Grouping under 'All' | All viewports | When 'All' is selected, states are dumped into a single flat list without zone section breaks. | Flat list rendering. | Render each zone as its own distinct section with zone heading, description, count, and card grid. (R7) |
| **BUG-29** | `/states` | State Cards | All viewports | Cards are text-only boxes with badges and numbers; zero photography, zero 3D tilt, no hover zoom. | Card component lacked media header. | Redesign State Card to be image-led: 4:5 / 16:10 landmark image, state name, capital, zone chip, 3D tilt & cursor spotlight. (R7) |
| **BUG-30** | `/states/:slug` | In-Page Navigation | Desktop, Mobile | Long state pages lack quick in-page section navigation and reading progress. | No scroll-spy navigation. | Add sticky in-page section navigation with scroll-spy and progress bar. (R7) |

---

## 3. Master Hero Plan (Every Page)

As mandated by Section 6, a single reusable `Hero` component with three variants (`full`, `split`, `compact`) will be deployed across **every page**. Below is the exhaustive page-by-page specification:

| # | Page & Route | Hero Variant | Eyebrow | Headline (Visitor Action / Purpose) | Supporting Sentence (Real Platform Facts) | Primary Action | Secondary Action | Planned Hero Image Concept |
|---|---|---|---|---|---|---|---|---|
| **1** | **Home** (`/`) | `full` | National Civic Remediation Network | Report Local Hazards, Track Verified Resolution | Connect with certified municipal contractors across 36 states and union territories under transparent, 50% advance escrow protection. | `Report an Issue` (`/user/report-issue`) | `Browse States` (`/states`) | Procedural 3D Civic Sphere + Photorealistic night city road remediation overlay |
| **2** | **Services Directory** (`/services`) | `split` | Certified Municipal Catalog | Explore Public Infrastructure Repair Categories | Transparent base tariffs, response SLAs, and direct contractor dispatch for road repairs, streetlights, drainage, and waste management. | `Report a Hazard` (`/user/report-issue`) | `Track Ticket` (`/track`) | Municipal civil engineering crew inspecting road and drainage infrastructure |
| **3** | **States & UTs Directory** (`/states`) | `split` | Nationwide Civic Coverage | Monitor Municipal Health Across 36 Indian Regions | Access certified resolver networks, localized civic priorities, and audited photographic proof in all 28 states and 8 union territories. | `Filter by Zone` (scrolls to zone bar) | `Report Local Defect` (`/user/report-issue`) | Iconic collage of Indian infrastructure: bridges, urban corridors, and clean highways |
| **4** | **State Detail** (`/states/:slug`) | `full` | `${state.region} Zone • ${state.capital}` | `${state.name} Municipal Infrastructure Portal` | `${state.heroBlurb}` Verified contractors, localized civic priorities, and escrow-guaranteed remediation proof across `${state.districtsCount}` districts. | `Report Issue in ${state.name}` | `View Local Resolvers` | Recognizable landmark or cinematic natural landscape of the specific state/UT (Section 8.1) |
| **5** | **About & Governance** (`/about`) | `split` | Mathematical Civic Governance | Built for Transparency, Backed by Milestone Escrow | Learn how Crowd Report bridges citizen issue reporting with certified contractor fulfillment through strict integer paise accounting and double-verified photographic proof. | `Read Operating Model` (scrolls down) | `Contact Admin` (`/query`) | Civic engineering review table: architectural blueprints, digital tablet, and safety helmets |
| **6** | **Track Issue Status** (`/track`) | `compact` | Public Verification Ledger | Inspect Live Remediation & Milestone Progress | Enter your unique issue reference code to audit contractor dispatch timestamps, before/after photographic proof, and escrow verification receipts. | `Enter Issue Code` (focuses input) | `Report New Issue` (`/user/report-issue`) | High-tech tablet displaying GPS verification pin and photographic repair proof |
| **7** | **Citizen Help Desk & Query** (`/query`) | `compact` | Official Civic Liaison | Direct Inquiries to Municipal Administration | Submit formal inquiries regarding ward jurisdiction coverage, contractor accreditation standards, fee tariffs, or commercial tax invoices. | `Write an Inquiry` (scrolls to form) | `Track Status` (`/track`) | Modern civic administration desk with welcoming municipal liaison team |
| **8** | **Citizen Login** (`/login`) | `compact` | Secure Citizen Access | Sign In to Manage Your Civic Reports | Access real-time issue tracking, review contractor cost estimates, authorize milestone escrow releases, and download verified completion certificates. | `Sign In` (form submit) | `Create Account` (`/register`) | Citizen using smartphone near a newly restored public park sidewalk |
| **9** | **Citizen Registration** (`/register`) | `compact` | Citizen Account Setup | Join India's Verified Civic Action Network | Report municipal infrastructure defects, track geotagged contractor repairs, and protect public neighborhood assets in your district. | `Register Account` (form submit) | `Already registered? Login` | Neighborhood community members actively collaborating in a clean, restored urban street |
| **10** | **Contractor Onboarding** (`/register-resolver`) | `split` | Municipal Contractor Accreditation | Join the Certified Municipal Resolver Network | Receive proximity-dispatched municipal work orders, guaranteed 50% escrow advance payouts, and verifiable public reputation in your local zone. | `Apply for Accreditation` (scrolls to form) | `Contractor FAQs` | Certified electrical and civil infrastructure contractor in safety gear at worksite |
| **11** | **Password Recovery** (`/forgot-password`, `/reset-password`) | `compact` | Account Security Recovery | Restore Secure Access to Your Account | Enter your verified email address to receive an encrypted password reset token and regain control of your civic issue portal. | `Send Reset Link` | `Back to Sign In` (`/login`) | Shield lock security visual on dark midnight navy background |
| **12** | **User Portal** (`/user/*`) | `compact` | Citizen Management Portal | Welcome Back to Your Neighborhood Command Desk | Track active reports, verify contractor photographic proof, and release milestone escrow payments across your reported civic issues. | `Report New Hazard` | `Payment Receipts` | Panoramic clean urban streetscape with verified civic checkmarks |
| **13** | **Resolver Portal** (`/resolver/*`) | `compact` | Municipal Contractor Desk | Active Civic Work Orders & Task Queue | Review assigned infrastructure defects, upload geotagged before/after photographic evidence, and claim milestone escrow compensation. | `View Open Tasks` | `Earnings Summary` | Municipal contractor inspecting asphalt and drainage repair equipment |
| **14** | **Admin Console** (`/admin/*`) | `compact` | Platform Governance | System Administration & Triage Operations | Audit statewide defect reports, verify contractor credentials, manage fee tariffs, and oversee integer paise escrow releases across all 36 jurisdictions. | `Triage Queue` | `Finance Ledger` | Institutional governance dashboard showing pan-India civic metrics |

---

## 4. Final Audit & Defect Resolution Summary

| Defect ID Range | Category | Defects Count | Status | Verifying Phase & Commit |
|---|---|---|---|---|
| **BUG-01 to BUG-08** | Spacing, Sizing & Layout | 8 | **RESOLVED** | R1 (`cd77fbd`), R4 (`fb317e7`) |
| **BUG-09 to BUG-12** | Color System & Contrast | 4 | **RESOLVED** | R2 (`513e2f7`) |
| **BUG-13 to BUG-15** | Brand Identity & Logo | 3 | **RESOLVED** | R3 (`bb8e15c`) |
| **BUG-16 to BUG-19** | Shared Component Consistency | 4 | **RESOLVED** | R4 (`fb317e7`) |
| **BUG-20 to BUG-25** | Missing Hero Sections & Art Direction | 6 | **RESOLVED** | R5 (`d53822b`) |
| **BUG-26 to BUG-30** | States Directory & State Detail Pages | 5 | **RESOLVED** | R7 (`66b8dcb`) |
| **TOTAL** | **All Categories** | **30 / 30** | **100% RESOLVED** | **Phases R1 - R8** |
