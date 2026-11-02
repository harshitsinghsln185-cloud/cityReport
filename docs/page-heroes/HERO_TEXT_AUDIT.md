# Hero Text Audit — Current State

This document catalogs the exact text, metadata, badges, and visual card contents currently rendered in the `PageHero` of all five target pages prior to Phase H1.

---

## 1. Services (`client/src/pages/public/Services.tsx`)

| Element | Exact Text / Markup |
| :--- | :--- |
| **Breadcrumbs** | `Home` > `Services Directory` |
| **Eyebrow** | `Certified Municipal Catalog` (with `Wrench` icon) |
| **Title** | `Public Infrastructure Repair` |
| **Highlighted Title** | `& Standard Tariff Directory` |
| **Description** | `Transparent base tariffs, 48h response SLAs, and direct contractor dispatch for road repairs, streetlights, drainage, and waste management across 36 Indian regions.` |
| **Primary Action** | Button: `Report a Hazard` (links to `/user/report-issue`, gold variant) |
| **Secondary Action**| Button: `Track Existing Ticket` (links to `/track`, outline variant) |
| **Visual Card Header** | `Municipal Service Standards` |
| **Visual Card Badge** | Badge: `SOR Audited` (gold) |
| **Visual Card Content** | - **50% Advance Payment:** Advance payment confirmed prior to contractor mobilization.<br>- **Geotagged Proof:** Verification via GPS-stamped before and after photos.<br>- **Pan-India Coverage:** Standardized Schedule of Rates (SOR) across 36 States & UTs. |

---

## 2. States & Union Territories Directory (`client/src/pages/public/StatesDirectory.tsx`)

| Element | Exact Text / Markup |
| :--- | :--- |
| **Breadcrumbs** | `Home` > `States & Union Territories` |
| **Eyebrow** | `Nationwide Civic Infrastructure` (with `MapPin` icon) |
| **Title** | `Monitor Municipal Health` |
| **Highlighted Title** | `Across 36 Indian Regions` |
| **Description** | `Access certified resolver networks, localized civic priorities, landmark photographic banners, and verified proof in all 28 states and 8 union territories with standardized pricing lists.` |
| **Primary Action** | Button: `Filter by Zone` (anchors to `#zone-switcher`, gold variant) |
| **Secondary Action**| Button: `Report Local Defect` (links to `/user/report-issue`, outline variant) |
| **Visual Card Header** | `Pan-India Coverage` |
| **Visual Card Badge** | Badge: `36 Total` (gold) |
| **Visual Card Content** | - Stat: `28` States<br>- Stat: `8` Union Territories<br>- Paragraph: `Every region operates under verified milestone payments (50% advance, 50% balance) and photo verification standards.` |

---

## 3. Track Status (`client/src/pages/public/TrackStatus.tsx`)

| Element | Exact Text / Markup |
| :--- | :--- |
| **Breadcrumbs** | `Home` > `Track Issue Status` |
| **Eyebrow** | `Public Verification Ledger` (with `Clock` icon) |
| **Title** | `Inspect Live Remediation` |
| **Highlighted Title** | `& Milestone Progress` |
| **Description** | `Enter your unique tracking reference code to audit contractor dispatch timestamps, before/after photographic proof, and milestone completion receipts in real time.` |
| **Primary Action** | *None in PageHero* (Search form sits directly below hero in content flow) |
| **Secondary Action**| *None in PageHero* |
| **Visual Card Header** | `Public Ledger Standards` |
| **Visual Card Badge** | Badge: `Live SLA` (emerald pill) |
| **Visual Card Content** | - `Standard Dispatch SLA:` Within 48 Hours<br>- `Verification Method:` Geotagged Camera EXIF<br>- `Balance Release:` Citizen / Admin Sign-off |

---

## 4. About & Governance (`client/src/pages/public/About.tsx`)

| Element | Exact Text / Markup |
| :--- | :--- |
| **Breadcrumbs** | `Home` > `About & Governance` |
| **Eyebrow** | `Civic Problem Reporting` (with `Lock` icon) |
| **Title** | `Built for Transparency,` |
| **Highlighted Title** | `Backed by Milestone Payments` |
| **Description** | `Crowd Report bridges the divide between citizens dealing with hazardous neighborhood defects and certified local contractors through transparent pricing and double-verified photographic proof.` |
| **Primary Action** | Button: `Read Operating Model` (anchors to `#operating-model`, gold variant) |
| **Secondary Action**| Button: `Contact Secretariat Desk` (links to `/query`, outline variant) |
| **Visual Card Header** | `Milestone Payment Model` |
| **Visual Card Badge** | Badge: `50% Advance` (gold) |
| **Visual Card Content** | - **Milestone Advance:** Initial 50% advance mobilization to start work on site.<br>- **Photo Verification:** Timestamped Before and After photo comparison reviewed by admin.<br>- **Direct Payout:** Balance released to verified resolver upon confirmed completion. |

---

## 5. Write Query / Help Desk (`client/src/pages/public/WriteQuery.tsx`)

| Element | Exact Text / Markup |
| :--- | :--- |
| **Breadcrumbs** | `Home` > `Help Desk & Inquiries` |
| **Eyebrow** | `Official Civic Liaison Office` (with `Mail` icon) |
| **Title** | `Direct Civic Inquiries` |
| **Highlighted Title** | `to Municipal Secretariat` |
| **Description** | `Submit formal inquiries regarding ward jurisdiction coverage, contractor accreditation standards, fee tariffs, or commercial tax invoices with guaranteed 24-48h response SLA.` |
| **Primary Action** | *None in PageHero* (Inquiry submission form sits in content column below hero) |
| **Secondary Action**| *None in PageHero* |
| **Visual Card Header** | `Liaison Office Contacts` |
| **Visual Card Badge** | Badge: `24-48h SLA` (emerald pill) |
| **Visual Card Content** | - `Working Hours: Mon – Sat, 9:00 AM – 6:00 PM IST`<br>- `Secretariat: Central Civic Infrastructure Registry`<br>- `Inquiry SLA: Reference ID issued upon submission` |

