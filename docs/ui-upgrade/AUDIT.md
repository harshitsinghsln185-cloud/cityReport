# UI Upgrade Audit & Stack Adaptation Plan (P0)

**Project**: Crowd Report Platform (Civic Issue Reporting & Municipal Resolution)  
**Branch**: `ui-premium`  
**Date**: October 24, 2026  
**Auditor**: Antigravity Front-End & Motion System  

---

## 1. Stack Detection & Environment Overview

| Layer | Detected Technology | Current Version | Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | React + TypeScript | React 18.3.1, TS 5.7.3 | Strict TS mode, standard DOM root (`#root`) |
| **Bundler & Tooling** | Vite | Vite 6.0.7 | Fast HMR, ESM bundling, PostCSS integration |
| **Router** | React Router DOM | 6.28.1 | Data router via `createBrowserRouter` + `RouterProvider` |
| **Styling** | Tailwind CSS + CSS Variables | Tailwind 3.4.17 | Config in `tailwind.config.js`, tokens in `src/styles/tokens.css` |
| **Iconography** | Lucide React | 0.473.0 | Tree-shakeable SVG icons |
| **Maps / Geolocation** | Leaflet | 1.9.4 | Interactive geo-tagging in reporting & contractor routing |
| **HTTP Client** | Axios | 1.7.9 | Cookie-based session credentials, CSRF protection, unwrap interceptors |
| **State Management** | React Context + TanStack Query | Query v5.64.2 | `AuthContext` for user sessions; TanStack query installed |
| **Rendering Mode** | Single Page Application (CSR) | Pure Client SPA | Served via Vite dev / static distribution (`dist/index.html`) |

---

## 2. Page & Route Inventory

The application is structured into four distinct route realms: **Public**, **Citizen (`/user`)**, **Resolver Contractor (`/resolver`)**, and **Municipal Admin (`/admin`)**.

### 2.1 Public Pages (`PublicLayout`)
1. `/` — **Home Page** (`Home.tsx`): Hero banner, active categories showcase, 4-step municipal workflow, trust commitment, AI report widget.
2. `/services` — **Civic Services Directory** (`Services.tsx`): Directory of civic categories with indicative base fees and resolution SLAs.
3. `/about` — **Municipal Charter & Trust** (`About.tsx`): Mission statement, operational guarantees, escrow security, SLA standards.
4. `/track` — **Track Issue Status** (`TrackStatus.tsx`): Real-time issue tracking by unique issue code (`ISS-...`), audit timeline inspection.
5. `/query` — **Citizen Inquiries** (`WriteQuery.tsx`): Public inquiry submission to municipal administration.
6. `/login` — **Authentication** (`Login.tsx`): Role-aware credential login (Citizen, Resolver, Admin).
7. `/register` — **Citizen Registration** (`RegisterUser.tsx`): Self-service citizen account creation with address fields.
8. `/forgot-password` — **Password Recovery** (`ForgotPassword.tsx`).
9. `/reset-password` — **Password Reset** (`ResetPassword.tsx`).
10. `/register-resolver` — **Contractor Onboarding** (`RegisterResolver.tsx`): Municipal contractor KYC application with ID proof upload.
11. `/verify-email` — **Email Verification** (`VerifyEmail.tsx`).
12. `*` — **404 Not Found** (`AppRouter.tsx` wildcard).

### 2.2 New Routes to be Added (P6 & P7)
13. `/states` — **States & Union Territories Directory**: Complete listing of all 36 Indian states and UTs arranged by zonal council regions (North, South, East, West, Central, North-East).
14. `/states/:slug` — **Individual State Profile**: 36 unique pages with custom editorial copy, landmarks banner, quick facts, geography, natural resources, economy, culture, major cities, and municipal infrastructure links.

### 2.3 Citizen Portal (`/user/*` under `UserLayout`)
15. `/user` — **Dashboard Overview** (`WelcomePreview`)
16. `/user/report-issue` — **Report Civic Issue** (`ReportIssue.tsx`): Map coordinate picker, category selection, photos upload, fee quotation.
17. `/user/issues` — **My Issues List** (`MyIssues.tsx`): Paginated citizen issues with status filters.
18. `/user/issues/:id` — **Issue Detail & Evidence** (`IssueDetails.tsx`): Real-time timeline, photo evidence comparison, quote inspection.
19. `/user/checkout/:issueId` — **Escrow Checkout** (`Checkout.tsx`): Advance & balance fee deposit.
20. `/user/payments` — **Payments Ledger** (`Payments.tsx`): Payment receipts, status badges, PDF invoice links.
21. `/user/profile` — **Citizen Profile** (`ProfilePage.tsx`): Contact info and primary address management.
22. `/user/notifications` — **Citizen Notifications Feed** (`NotificationsPage.tsx`).

### 2.4 Resolver Contractor Portal (`/resolver/*` under `ResolverLayout`)
23. `/resolver/pending` — **Pending Approval Notice** (`PendingApproval.tsx`): State screen while admin verifies contractor ID proof.
24. `/resolver` — **Contractor Dashboard** (`ResolverDashboard.tsx`): Active task counters, earnings preview, proximity metrics.
25. `/resolver/assignments` — **Dispatched Assignments** (`ResolverAssignmentsPage.tsx`): Accept or decline proximity-assigned jobs.
26. `/resolver/tasks` — **Active Repair Tasks** (`ResolverTasksPage.tsx`): Start work, track task lifecycle.
27. `/resolver/tasks/:id` — **Task Execution Details** (`ResolverTaskDetailsPage.tsx`): Navigation coordinates, instructions, photographic proof upload.
28. `/resolver/history` — **Completed Tasks Archive** (`ResolverCompletedHistoryPage.tsx`): Inspection history.
29. `/resolver/earnings` — **Earnings & Payout Ledger** (`ResolverEarnings.tsx`): Accumulated earnings and payout request log.
30. `/resolver/profile` — **Contractor Profile & Radius** (`ResolverProfilePage.tsx`): Service location, operating radius (km), trade skills, availability toggle.
31. `/resolver/notifications` — **Contractor Notifications Feed** (`NotificationsPage.tsx`).

### 2.5 Municipal Operations Administration (`/admin/*` under `AdminLayout`)
32. `/admin` — **Executive Operations Dashboard** (`Dashboard.tsx`): High-level KPIs, unassigned queue, revenue metrics.
33. `/admin/issues` — **Issue Management Master Table** (`AdminIssuesPage.tsx`): Filterable issue table across all statuses.
34. `/admin/issues/:id` — **Issue Dispatch & Verification** (`AdminIssueDetailsPage.tsx`): Manual quotation, resolver candidate geo-matching, resolution verification, rework request.
35. `/admin/users` — **User Management** (`AdminUsersPage.tsx`): Account administration, role filtering, account suspension/blocking.
36. `/admin/resolvers` — **Contractor KYC Applications** (`ResolverRequestsPage.tsx`): Review signed ID proof, trade certifications, approve/reject applications.
37. `/admin/finance` — **Financial Overview** (`FinanceOverview.tsx`): Gross volume, escrow deposits, platform commissions, contractor payouts.
38. `/admin/payments` — **All Payments Ledger** (`AdminPayments.tsx`).
39. `/admin/payouts` — **Contractor Payouts Ledger** (`AdminPayouts.tsx`): Approve and mark contractor disbursements as paid.
40. `/admin/categories` — **Civic Categories Management** (`CategoriesPage.tsx`): Create/update categories, base rates, SLAs.
41. `/admin/fee-settings` — **Global Fee Engine Settings** (`FeeSettingsPage.tsx`): Configure free radius, per-km rates, severity multipliers.
42. `/admin/queries` — **Citizen Queries Inbox** (`AdminQueries.tsx`): Review and dispatch replies to citizen contact queries.
43. `/admin/notifications` — **Operations Alert Stream** (`NotificationsPage.tsx`).

---

## 3. Shared Component Kit & Styling Inventory

### 3.1 Existing Shared Components (`src/components/ui/`)
- `Button.tsx`: Variants (`primary`, `secondary`, `accent`, `danger`, `outline`, `ghost`), sizes (`sm`, `md`, `lg`), disabled and loading states.
- `Card.tsx`: Basic container wrapper with rounded borders and padding.
- `Input.tsx`: Form input field with label, helper text, and error indicators.
- `Modal.tsx`: Accessible dialog backdrop with keyboard escape handler.
- `EmptyState.tsx`: Neutral dashed-border container for empty list states.
- `Pagination.tsx`: Numbered page switcher with previous/next controls.
- `Skeleton.tsx`: Pulsing gray placeholder blocks.
- `StatusBadge.tsx`: Color-coded semantic badges for issue statuses and resolver approvals.
- `Table.tsx`: Generic data table with header and row rendering.
- `ErrorBoundary.tsx`: Catch-all route error fallback.

### 3.2 Current Typography & Tokens
- **Current Headings**: `Plus Jakarta Sans`, 600-800 weight, loaded via Google Fonts CDN in `index.html`.
- **Current Body**: `Inter`, 400-700 weight, loaded via Google Fonts CDN in `index.html`.
- **Palette**:
  - Primary Accent: Royal Violet `#7C3AED` (hover `#6D28D9`)
  - Deep Secondary: Royal Indigo `#312E81`, Midnight Navy `#171A3B`
  - Canvas / Background: Soft Lavender Tint `#F8F7FC`
  - Surfaces: `#FFFFFF` with hairline borders `#E2E8F0`
  - Text: Ink `#1E293B`, Secondary `#475569`, Muted `#64748B`

---

## 4. Data Loading, Caching & Rendering Strategy

- **Client Data Flow**: Pages fetch data on mount using `useEffect` calling methods on domain service singletons (`categoryService`, `issueService`, `adminService`, etc.).
- **Response Format**: Handled via `api.ts` response interceptor returning unwrapped payloads directly.
- **Rendering Model**: Vite SPA. Everything renders in client browser memory.
- **Pre-rendering & SEO Adaptation Strategy**:
  - The 36 state profiles and `/states` directory require immediate crawlability and clean indexing.
  - We will author structured, highly detailed static datasets in `src/data/states/` containing all 36 state profiles (geography, resources, economy, culture, cities, demographics).
  - We will integrate `react-helmet-async` for robust dynamic `<title>`, `<meta name="description">`, Open Graph (`og:image`, `og:title`), canonical link tags, and structured `BreadcrumbList` JSON-LD schema on each route.
  - We will generate a comprehensive static `public/sitemap.xml` containing all 36 state routes + public routes, and configure `public/robots.txt`.
  - For static crawler indexing of the SPA, we will provide a static prerender build script (`npm run build:prerender`) that outputs prerendered HTML snapshots to `dist/` for bots that execute minimal JavaScript.

---

## 5. Lists Requiring Pagination & Progressive Disclosure

| Page | List Description | Current State | Required Upgrade |
| :--- | :--- | :--- | :--- |
| `/services` | Civic Services Directory | Renders all in a single grid | Progressive disclosure: compact cards with modal/drawer for detailed formulas; client pagination when search/list exceeds 12 items. |
| `/states` | States Directory (36 states & UTs) | New page to build | Grouped cleanly by 6 Zonal Council regions with sticky anchor navigation, full-card click, image zoom, progressive facts on hover/open. |
| `/user/issues` | Citizen Issues List | Basic server pagination | Animated page transitions, compact issue summary card, progressive drawer for full timeline & payment status. |
| `/user/payments` | Citizen Payments Ledger | Static table | 12 items/page pagination, progressive disclosure modal for itemized receipt. |
| `/resolver/assignments` | Available Contractor Assignments | Flat list | Compact dispatch card with distance & fee estimate, modal/drawer for incident preview before accepting. |
| `/resolver/tasks` | Active Repair Tasks | Tabbed list | 12 items/page pagination, progressive drawer showing repair milestones and photo requirements. |
| `/resolver/history` | Completed History Archive | Flat list | Paginated archive with before/after photo comparison modal. |
| `/admin/issues` | Master Administrative Issue Queue | Table with server pagination | Animated page transition, compact priority badges, full-screen progressive inspection drawer. |
| `/admin/users` | User Directory | Table with server pagination | Animated page transition, user detail modal with audit history. |
| `/admin/resolvers` | Contractor KYC Queue | Table with server pagination | Paginated queue, full progressive modal for ID proof inspection & skills review. |
| `/admin/queries` | Citizen Inquiries Inbox | Table with server pagination | Compact thread card, drawer for reply composition. |

---

## 6. Site Purpose & 3D Hero Scene Concept

### 6.1 Purpose
"Crowd Report" is an enterprise civic infrastructure and municipal issue dispatch network. It bridges citizens reporting local municipal problems (damaged roads, non-functional streetlights, water supply disruptions, garbage overflow) with certified local contractors and municipal administrators, backed by transparent mathematical fee estimation, geotagged photo proof verification, and automated escrow settlement.

### 6.2 3D Hero Concept: Procedural Civic Topology Globe
- **Technology**: React Three Fiber (`@react-three/fiber`), `@react-three/drei`, and `three.js`.
- **Theme**: A lightweight procedural 3D **Civic Grid & Topology Sphere**.
  - A stylized, gently rotating geodesic mesh representing interconnected urban and rural infrastructure.
  - Glowing node points positioned along geometric intersections representing municipal service hubs across Indian states.
  - Subtle pulsing data beacon rings expanding outward from active resolution hubs.
  - Delicate orbital longitude/latitude guide rings with smooth camera mouse parallax.
- **Performance Rules**:
  - Dynamic `import()` code-splitting with `React.lazy` and `Suspense`. The 3D bundle will NOT be in the initial page chunk.
  - Static fallback poster (`home-poster.webp`) acts as the high-priority LCP image and serves users on mobile, low-power devices, or `prefers-reduced-motion`.
  - `<Canvas frameloop="demand">` with `PerformanceMonitor` and `dpr={[1, 2]}` to maintain 60 FPS without battery drain.

---

## 7. Adaptation & Execution Plan

### 7.1 Font System (P1)
- Install `@fontsource-variable/fraunces` and `@fontsource-variable/manrope`.
- Update `index.html` to remove external Google Fonts links and preload self-hosted variable font files.
- Configure Tailwind `fontFamily` tokens (`fraunces` for headings, `manrope` for body/UI with `tabular-nums` support).

### 7.2 Design Tokens & Component Kit (P1)
- Refactor `src/styles/tokens.css` with fluid `clamp()` type scale, 8px grid spacing tokens, layered shadow elevation tokens, hairline 1px border variables, and restrained royal indigo/slate palette.
- Modernize all components in `src/components/ui/` with magnetic/lift hover micro-interactions, visible keyboard focus rings, accessible ARIA attributes, and consistent 16-24px radii.

### 7.3 Motion Foundation (P2)
- Install `framer-motion`.
- Create reusable `Reveal` scroll wrapper (`whileInView`, `viewport={{ once: true, amount: 0.2 }}`), card 3D tilt component, and page transition helper.
- Ensure strict adherence to `prefers-reduced-motion: reduce`.

### 7.4 Heroes & Visual Assets (P3)
- Create procedural 3D hero with React Three Fiber.
- Generate high-resolution webp hero banners and the Home 3D fallback poster.

### 7.5 Pagination & Progressive Disclosure (P4)
- Upgrade `Pagination.tsx` with smooth animated transitions, URL query state (`?page=2`), and full keyboard navigation.
- Implement progressive disclosure drawers/modals across listing pages.

### 7.6 Editorial & Content Audit (P5)
- Audit all copy across existing pages, eliminate clichés and AI-sounding filler, and author `CONTENT_AUDIT.md` and `CONTENT_TODO.md`.

### 7.7 States Directory & 36 Individual State Pages (P6 & P7)
- Author rich, factual data files for all 28 states and 8 union territories under `src/data/states/`.
- Build `/states` region-grouped directory and `/states/:slug` comprehensive profile pages with landmarks, quick facts, geography, natural resources, economy, culture, and major cities.

### 7.8 SEO & Metadata (P8)
- Integrate `react-helmet-async`, canonical URLs, Open Graph tags, JSON-LD breadcrumbs, XML sitemap (`/states` + 36 state slugs), and `robots.txt`.

### 7.9 Polish & Quality Assurance (P9)
- Run Lighthouse audits, verify keyboard focus and reduced motion, check bundle size code splitting, and write final documentation.

---

## 8. Package Installation Plan

The following lightweight, standard packages will be added across the phases:
1. **P1**: `@fontsource-variable/fraunces`, `@fontsource-variable/manrope` (self-hosted variable fonts, zero external network dependency).
2. **P2**: `framer-motion` (motion design, scroll reveals, card tilt, spring transitions).
3. **P3**: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` (procedural 3D hero, dynamically imported).
4. **P8**: `react-helmet-async` (head and meta tags management for client-rendered routes).
