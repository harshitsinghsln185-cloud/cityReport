# Phase F0: Frontend Codebase Audit Findings & Decisions

**Date**: 2026-10-27  
**Branch**: `ui-audit-fix`  
**Scope**: Crowd Report Platform Client (`client/src`, `client/tailwind.config.js`, `client/index.html`)

---

## 1. Stack & Configuration Audit

- **Core Framework**: React 18.3.1 with TypeScript 5.7.3 & Vite 6.0.7
- **Styling**: Tailwind CSS 3.4.17 + PostCSS 8.5.1 + Autoprefixer 10.4.20
- **Tailwind Plugins**: `[]` (Empty; `tailwindcss-animate` is **not** installed).
- **Fonts**:
  - Headings: `@fontsource-variable/fraunces` (variable serif)
  - Body & UI: `@fontsource-variable/manrope` (variable sans)
- **Icons**: `lucide-react` 0.473.0
- **Motion**: `framer-motion` 14.6.0
- **Tailwind Config Token Review**:
  - Primary: `#0A1F44` (hover `#12306A`, light `#EBF1FA`)
  - Accent: `#C8A24A` (hover `#B38E37`, light `#FAF4E6`, text `#8A6A1F`, border `#EEDCB2`)
  - Canvas: `#FAF8F3`, Surface: `#FFFFFF`, Ink: `#101828`, Muted: `#5B6577`
  - Status: Success (`#0E6E4C`), Info (`#1D4ED8`), Warning (`#B54708`), Danger (`#B42318`)
  - Shadows: `sm`, `subtle`, `card`, `cardHover`, `modal`
  - **Defect in Config**: `boxShadow.glow` currently uses purple `'0 0 28px -4px rgba(124, 58, 237, 0.25)'`. Needs alignment to navy/neutral.

---

## 2. Quantitative Scan Results (97 `.tsx` Files)

| Audit Category | Occurrences | Affected Files | Key Issue |
| :--- | :--- | :--- | :--- |
| **Hardcoded Hex Colors** | **527** | 62 files | 45 unique hexes; heavy violet/purple bleed (`#7c3aed`, `#5b4fe1`, `#ede9fe`, `#ddd6fe`). |
| **Invalid `<Link><Button>`** | **65** | 24 files | Emits invalid nested `<a><button>` DOM structure violating HTML specs. |
| **Small Text (< 12px)** | **223** | 51 files | `text-[10px]` and `text-[11px]` impair mobile readability; labels should be ≥ 12px. |
| **Heading Font Misuse** | **155** | 48 files | Headings using `font-bold` / `font-black` / `font-mono` instead of Fraunces 600. |
| **Unproven Claims / Fake Stats** | **124** | 28 files | Fake numbers (`12,480`, `99.4%`), fake claims (`escrow`, `municipal inspector`). |

---

## 3. Detailed Breakdown of Hardcoded Colors

### Top Violet & Purple Occurrences (To be eliminated in F2)
- `#7c3aed` (79 occurrences): Admin dashboards, status badges, buttons, icons, chatbot header.
- `#5b4fe1` (49 occurrences): Category pills, hero highlights, purple buttons, gradient borders.
- `#ede9fe` (30 occurrences): Category backgrounds, light badge tints.
- `#f8f7fc` (20 occurrences): Soft purple-gray card surfaces.
- `#ddd6fe` (10 occurrences): Light purple border accents.
- `#6d28d9` (6 occurrences): Dark violet hover states.
- `#a78bfa` (4 occurrences): Violet focus rings and canvas accents.

### Other Hardcoded Colors (To be mapped to Tokens in F2)
- `#64748b` (68) & `#475569` (14): Raw Tailwind slate-500/600 text; map to `muted` / `secondaryText`.
- `#1e293b` (53): Slate-800 text; map to `ink`.
- `#e2e8f0` (44): Slate-200 border; map to `border`.
- `#0a1f44` (30): Hardcoded navy; map to `primary` / `navy`.
- `#c8a24a` (29): Hardcoded gold; map to `accent`.
- `#ffffff` (21): Hardcoded white; map to `surface` / `white`.
- `#101828` (8): Hardcoded ink; map to `ink`.

---

## 4. Invalid Nested `<a><button>` Elements (65 Occurrences)

In React Router DOM, wrapping `<Button>` inside `<Link to="...">` outputs `<a href="..."><button>...</button></a>`. This is invalid HTML5, triggers browser accessibility warnings, and breaks screen reader interactive navigation.

**Top Affected Components**:
- `client/src/pages/public/Home.tsx` (6 instances)
- `client/src/components/public/Hero.tsx` (2 instances)
- `client/src/components/public/Navbar.tsx` (4 instances)
- `client/src/components/public/HowItWorks.tsx` (1 instance)
- `client/src/components/public/FaqSection.tsx` (1 instance)
- `client/src/pages/public/Services.tsx` (3 instances)
- `client/src/pages/public/About.tsx` (3 instances)
- `client/src/pages/public/StatesDirectory.tsx` (2 instances)
- `client/src/pages/public/StateDetail.tsx` (3 instances)
- `client/src/layouts/AdminSidebar.tsx` (2 instances)
- `client/src/pages/user/UserDashboard.tsx` (4 instances)
- `client/src/pages/resolver/ResolverDashboard.tsx` (4 instances)
- `client/src/pages/admin/Dashboard.tsx` (6 instances)

**Solution for F3**: Extend `Button` with polymorphic `as` prop (e.g. `<Button as={Link} to="...">` or dedicated `<ButtonLink>`) and replace all 65 pairs.

---

## 5. Unproven Claims, Fabricated Stats & Invented Data

### A. Landing Page & Public Copy
- **`Hero.tsx`**:
  - Eyebrow: `"36 States & UTs Live"` → Replace with factual platform label.
  - Social Proof pill: `"Over 12,000 hazards resolved across 36 states & UTs"` → Remove invented count.
  - Bullet 3: `"50% Escrow"` → Replace with `"50% advance, 50% on completion"`.
- **`LiveTicker.tsx`**:
  - Metrics: `"12,480+ Hazards Remediated"`, `"99.4% Disbursed SLA"` → Fabricated.
  - `LIVE_EVENTS`: 6 hardcoded events (`"Indiranagar, Bengaluru"`, `"Salt Lake, Kolkata"`, etc.) with fake ₹ amounts.
- **`TestimonialsTrust.tsx`**:
  - `TESTIMONIALS`: 3 fake personas ("Dr. Radhika Sen", "Vikramaditya Verma", "Ananya Deshmukh") with fake RWA associations. Replace section with honest "How we protect you" feature breakdown.
- **`About.tsx`**:
  - Claims `"12,000+ Verified Remediations"`, `"36 States Covered"`, `"100% Background Screened"`, `"GPS EXIF 50m match"`.

### B. State Directory & Detail Pages (`statesData.ts`)
- All 36 states contain fabricated `stats` object:
  - `resolvedIssues` (e.g., 2,840, 1,420)
  - `activeResolvers` (e.g., 184, 96)
  - `avgResponseHours` (e.g., 18, 24)
  - `satisfactionRate` (e.g., 99.2, 98.7)
- All 36 states contain fabricated `recentActivity`: 3 fake items each with fake IDs (`"KA-4821"`) and amounts (`"₹14,500"`).
- **Factual Data to Retain**: `name`, `slug`, `type`, `capital`, `region`, `population`, `area`, `districtsCount`.

### C. Dashboard Count Calculation Bug
- `UserDashboard.tsx` (lines 40-50): Calculates total, pending, and resolved counts by calling `.filter()` on `recentIssues` (which is hard-limited to 5 issues by the server query).
- If a user has 25 issues, the dashboard only shows counts out of 5.
- **Solution for F1**: Fetch real issue totals from API pagination metadata or status query.

---

## 6. Asset Audit

### State Banners (`client/public/states/`)
- 36 SVG state banners exist. They use low-opacity SVG vector sky/building silhouettes that appear washed out (`opacity-35`) behind scrims on `StateDetail.tsx`.

### Logo Asset Directory (`client/src/assets/logo/`)
- Unused logo concepts detected:
  - `concept-a-horizontal.svg`
  - `concept-a-mark.svg`
  - `concept-b-horizontal.svg`
  - `concept-b-mark.svg`
  - `concept-c-horizontal.svg`
  - `concept-c-mark.svg`
- Active logo in use: `client/src/components/ui/Logo.tsx` renders native SVG paths. The 6 concept SVG files can be safely deleted in F8.

---

## 7. Decisions for User Confirmation

1. **Public Statistics**:
   - **Finding**: The server provides `GET /admin/overview` only for authenticated Admins. There is **no unauthenticated public stats endpoint** (`GET /stats`).
   - **Recommendation (Default)**: Hide unproven public counters ("12,480+", "99.4%") from anonymous visitors and show only truthful, feature-led statements. Document `GET /api/public/stats` under "Needs backend".
2. **Payments & Escrow Wording**:
   - **Finding**: Payments use simulator / mock checkout logic (no third-party custodial escrow account).
   - **Recommendation (Default)**: Replace the legal term "escrow" across all customer-facing text with `"advance payment (50%) and balance on completion"`, clearly labelling demo payments where appropriate.
3. **Verification Steps & Inspector Wording**:
   - **Finding**: Resolution photos are reviewed by platform Admins in the admin portal; there are no municipal government inspectors on the platform.
   - **Recommendation (Default)**: Replace "municipal inspector" / "double-blind audit" with `"Admin verified"` or `"Photo verified"`.
