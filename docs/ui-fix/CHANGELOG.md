# UI Fix & Refinement Changelog (CHANGELOG.md)

> This document tracks phase-by-phase progress, defect resolutions, and architecture decisions for the `ui-fix` branch.

---

## [Phase R0] - Audit, Benchmarking & Defect Inventory
**Date**: October 2026  
**Commit**: `R0: Audit, bug list and reference research`

### Completed Deliverables
- **Branch Created**: `ui-fix` branched directly from `ui-premium`.
- **Stack Detected**:
  - React 18.3, TypeScript 5.7, Vite 6.0, Tailwind CSS 3.4, React Router DOM 6.28.
  - TanStack React Query 5.64, Axios 1.7.9, Lucide React 0.473, Framer Motion 14.6, Leaflet 1.9.4.
  - Node.js v24 backend running Express with strict integer paise accounting at `:5000`.
- **Reference Research Completed (`REFERENCE_NOTES.md`)**:
  - Analyzed 3 domain-specific civic platforms: *FixMyStreet*, *SeeClickFix*, *CPGRAMS / Swachhata*.
  - Analyzed 3 global gold-standard benchmark applications: *Stripe*, *Linear*, *Airbnb*.
  - Extracted core design rules for spacing rhythm, touch target sizing, zonal navigation, and institutional trust color scheme.
- **Root-Cause Defect Inventory (`BUG_LIST.md`)**:
  - Cataloged 30 specific defects across Spacing/Layout, Color System, Brand Identity, Shared Components, Missing Heroes, and State Section architecture.
  - Formulated the complete **Master Hero Plan** for all 14 pages/portals with specific headlines, supporting sentences, and planned visual concepts.
- **Content Checklist (`CONTENT_TODO.md`)**:
  - Grounded all numbers and facts in the real codebase (36 States & UTs, integer paise, 50% escrow gate). Zero synthetic facts added.
- **Code Stability**:
  - Zero code modifications made in R0; app compiles with zero lint and build errors (`tsc -b && vite build` clean).

---

## [Phase R1] - Spacing and Layout Engine
**Date**: October 2026  
**Commit**: `R1: Spacing and layout tokens, global sizing and overflow fixes`

### Completed Deliverables
- **Section 1 Tokens Implemented (`tokens.css`)**:
  - Container max-width: `1200px` (wide pages up to `1280px`).
  - Container side padding: `clamp(1rem, 2.5vw, 2rem)` (16px mobile, 24px tablet, 32px desktop).
  - Section vertical rhythm: `clamp(4rem, 6.5vw, 7.5rem)` (64px mobile, 80px tablet, 96-120px desktop).
  - Grid card gap: `clamp(1rem, 2vw, 1.5rem)` (16px mobile, 20px tablet, 24px desktop).
  - Component heights: Button medium `44px` minimum height, Input/Select `48px` height.
  - Geometry: Card radius `clamp(16px, 1.5vw, 20px)`, Button and Input radius `12px`.
  - Stacking z-index scale: `--z-base: 0`, `--z-card: 1`, `--z-sticky: 30`, `--z-header: 40`, `--z-dropdown: 50`, `--z-modal: 60`, `--z-toast: 70`.
- **Global Reset & Overflow Prevention (`index.css`)**:
  - Enforced `box-sizing: border-box` across all elements.
  - Locked horizontal scroll with `overflow-x: hidden` and `width: 100%` on `html` and `body`.
  - Added anchor scroll margin `[id] { scroll-margin-top: calc(var(--header-height) + 1.5rem); }` to prevent sticky navbar content clipping.
- **Component Root-Cause Fixes**:
  - `Button.tsx`: Enforced 44px minimum height (`h-11 min-h-[44px]`), 20px/24px horizontal padding, and 12px radius.
  - `Input.tsx`: Enforced 48px height (`h-12 min-h-[48px]`), 16px padding, and 12px radius.
  - `Card.tsx`: Enforced responsive 16px/20px radius and 20px/24px/28px padding.
- **Verification**: `npm run lint` clean, zero build errors.

---

## [Phase R2] - Color System & Styleguide
**Date**: October 2026  
**Commit**: `R2: Institutional Midnight Navy and Warm Gold palette, WCAG contrast verification and dev styleguide`

### Completed Deliverables
- **Master Palette Configured (`tokens.css`, `tailwind.config.js`)**:
  - Primary: Midnight Navy (`#0A1F44`), Hover: `#12306A`, Light: `#EBF1FA`.
  - Accent: Warm Gold (`#C8A24A`), Hover: `#B38E37`, Text on Light: `#8A6A1F`, Bg: `#FAF4E6`.
  - Background: Soft Ivory (`#FAF8F3`), Surface Alt: `#F1EEE6`, Border: `#E7E2D6`.
  - Status: Success (`#0E6E4C`), Warning (`#B54708`), Danger (`#B42318`), Info (`#1D4ED8`).
- **WCAG 2.1 AA Contrast Verification (`PALETTE.md`)**:
  - All 14 text & background pairs verified with mathematical relative luminance calculations. All pairs pass AA and AAA.
  - Success text darkened from `#12805C` to `#0E6E4C` to achieve 5.59:1 contrast over `#E8F5F0`.
- **Shared Component Palette Updates**:
  - `Button.tsx`: Refactored all variants to Midnight Navy, Warm Gold, and Soft Tint.
  - `Badge.tsx`: Converted to Section 3 semantic tokens and contrast-verified status badges.
- **Development-Only Styleguide (`Styleguide.tsx`)**:
  - Mounted at `/styleguide` exclusively in dev mode (`import.meta.env.DEV`), marked `noindex, nofollow`, displaying live swatches, typography clamps, button states, inputs, and badges.
- **Verification**: `npm run lint` clean, zero errors.

---

## [Phase R3] - Brand Identity, Logo System & Asset Integration
**Date**: October 2026  
**Commit**: `R3: Vector logo design, favicon suite and brand identity replacement`

### Completed Deliverables
- **Vector Logo System Created (`client/src/assets/logo/`)**:
  - Concept A: "The Civic Node" (Hexagonal Civic Seal & Trust Keystone) selected.
  - Master vector assets:
    - `logo-mark.svg` (48x48 standalone icon)
    - `logo-horizontal.svg` (240x48 lockup for light backgrounds)
    - `logo-horizontal-dark.svg` (240x48 lockup for dark surfaces)
    - `logo-stacked.svg` (160x100 stacked hero lockup)
    - `logo-monochrome.svg` (single-color dark navy/black)
    - `logo-reversed.svg` (single-color pure white)
- **Modular Component (`Logo.tsx`)**:
  - Created reusable `<Logo />` and `<LogoMark />` components supporting `variant="mark" | "horizontal" | "stacked"`, `theme="light" | "dark"`, `size="sm" | "md" | "lg"`, and custom subtitles.
- **Brand Identity Integration Across System**:
  - `Navbar.tsx`: Integrated `Logo variant="horizontal" size="md"` (removed generic `ShieldCheck`).
  - `Footer.tsx`: Integrated `Logo variant="horizontal" theme="dark" size="md" subtitle="Civic Infrastructure"`.
  - `UserLayout.tsx`: Integrated `Logo variant="horizontal" size="sm" subtitle="Citizen Portal"` across desktop sidebar and mobile navigation drawer.
  - `AdminLayout.tsx`: Integrated `Logo variant="horizontal" theme="dark" size="sm" subtitle="Municipal Secretariat"` across desktop sidebar and mobile operations drawer.
  - `ResolverLayout.tsx`: Integrated `Logo variant="horizontal" size="sm" subtitle="Contractor Console"` across desktop sidebar and mobile contractor drawer.
- **Favicon, Manifest & Social Share Suite**:
  - Overwrote outdated 123KB purple favicon with crisp vector `client/public/favicon.svg` using Concept A mark.
  - Created `client/public/site.webmanifest` with Soft Ivory background and Midnight Navy theme color.
  - Created `client/public/images/og-card.svg` (1200x630) social share card in Midnight Navy and Warm Gold.
  - Updated `client/index.html` with complete web manifest, theme-color, and Open Graph metadata.
- **Brand Identity Documentation (`LOGO.md`)**:
  - Authored full design rationale, geometric vertices grid, clear-space minimums, minimum digital sizing, and brand misuse rules.
- **Verification**: `npm run lint` clean, zero errors.

---

## [Phase R4] - Standardized Component Suite and Bug List Remediation
**Date**: October 2026  
**Commit**: `R4: Standardized component suite and bug list remediation`

### Completed Deliverables
- **Navbar Accessibility & Mobile Drawer (Defect 4.1)**:
  - Added `Escape` key event listener to close drawer immediately.
  - Implemented automatic body scroll locking (`document.body.style.overflow = 'hidden'`) with guaranteed cleanup on close or component unmount.
  - Implemented route-change auto-closing (`location.pathname` dependency).
  - Added dark backdrop overlay with tap-to-dismiss (`bg-dark/40 backdrop-blur-xs`).
  - Added complete ARIA semantics (`role="dialog"`, `aria-modal="true"`, `aria-label="Mobile Navigation"`, `aria-controls="mobile-nav-drawer"`).
- **Footer Dark Theme Contrast & Rhythm (Defect 4.2)**:
  - Replaced low-contrast navy icons on dark surface with high-contrast Warm Gold (`text-gold`).
  - Replaced generic purple/lavender chips with gold badges (`bg-gold/20 text-gold`).
  - Cleaned 4px grid rhythm and structured 5-column layout.
- **Enhanced 3D Card Engine (Defect 4.3)**:
  - Added optional 3D perspective tilt (`tilt?: boolean`) with max 5-degree rotation and smooth spring return.
  - Added cursor spotlight radial illumination (`spotlight?: boolean`) following mouse coordinates.
  - Added touch device detection (`pointer: coarse` / `ontouchstart`) to cleanly disable gyro/tilt effects on mobile devices.
- **Status Badge System Unification (Defect 4.4)**:
  - Completely refactored `StatusBadge.tsx` to wrap `Badge.tsx` and use Section 3 contrast-verified tokens.
  - Eliminated arbitrary hex codes (`#FEF3C7`, `#EDE9FE`, `#DBEAFE`); mapped all 17 issue states to semantic status variants (`success`, `warning`, `danger`, `info`, `neutral`).
- **Responsive Table Suite (Defect 4.5)**:
  - Refactored `Table.tsx` with design tokens (`border-border`, `bg-surfaceAlt`, `text-ink`, `text-muted`).
  - Added sticky header with `backdrop-blur-xs bg-surfaceAlt/90`.
  - Added `.table-wrapper` and sleek institutional custom scrollbar styles to `index.css`.
- **Verification**: `npm run lint` clean, zero errors.

---

## [Phase R5] - Hero Sections Across Every Page
**Date**: October 2026  
**Commit**: `R5: Universal hero section component and page deployments`

### Completed Deliverables
- **Universal PageHero Component (`PageHero.tsx`)**:
  - Implemented 3 responsive structural variants (`full`, `split`, `compact`).
  - Integrated theme modes (`navy` institutional dark, `ivory` light, `surface` subtle tint).
  - Built-in support for breadcrumbs, eyebrow badges with icons, Fraunces serif headings with gold highlights, dual call-to-actions, visual highlight cards, and tabular metrics strips.
- **Page Deployments (Master Hero Plan Implementation)**:
  - **Home (`/`)**: Refined `Hero.tsx` with Midnight Navy (`#0A1F44`), Warm Gold accents, gold pill badges, and high-contrast CTA buttons.
  - **Services Directory (`/services`)**: Deployed `split` variant with certified municipal catalog eyebrow, SOR audited trust card, 50% escrow notice, and direct hazard reporting CTAs.
  - **States Directory (`/states`)**: Deployed `split` variant with pan-India coverage highlights (28 States, 8 UTs), zone filtering CTA, and municipal coverage metrics.
  - **About & Governance (`/about`)**: Deployed `split` variant with mathematical governance copy, milestone escrow architecture visual, and secretariat liaison links.
  - **Track Status (`/track`)**: Deployed `split` variant with public verification ledger details, 48h SLA indicators, and photographic EXIF audit standards.
  - **Query & Liaison Desk (`/query`)**: Deployed `split` variant with administrative liaison contact details, working hours, and SLA response guarantees.
  - **Contractor Accreditation (`/register-resolver`)**: Deployed `split` variant with contractor advance escrow benefits, localized dispatch radius, and KYC requirements.
- **Verification**: `npm run lint` clean, zero errors.
