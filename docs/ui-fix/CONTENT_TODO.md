# Content & Business Facts Verification Checklist (CONTENT_TODO.md)

> This document tracks verified business facts from the active codebase versus items requiring client confirmation or external copy review. In accordance with Ground Rule 4, no synthetic or hallucinated metrics, testimonials, or legal claims are added to visible UI pages.

---

## 1. Verified Facts (Grounded in Codebase)

| Fact / Data Item | Code Source | Verified Value |
|---|---|---|
| **Platform Brand Name** | `package.json`, `README.md`, `site.ts` | **Crowd Report** |
| **Jurisdictional Coverage** | `client/src/data/statesData.ts` | **36 States & Union Territories of India** (28 States, 8 UTs) |
| **Zonal Grouping** | `client/src/data/statesData.ts` | **6 Zones**: North, South, East, West, Central, North-East |
| **Core Service Categories** | `server/src/seed/seedDefaults.js` | Road Damage, Pothole Fixing, Streetlight Repair, Water Leakage, Drainage Clogging, Waste Removal |
| **Accounting Model** | `docs/FINANCE.md`, `paymentService.js` | **Strict Integer Paise Accounting** (100 paise = 1 INR); 50% advance milestone escrow, 50% completion payout |
| **Escrow Guarantee** | `docs/FINANCE.md` | Escrow held until photographic remediation proof is submitted and verified |
| **Administrative Roles** | `server/src/models/User.js` | Citizen User (`User`), Municipal Contractor (`Resolver`), System Admin (`Admin`) |

---

## 2. Items Pending Client Review / Future Verification

| Section | Item | Status / Plan | Action Required |
|---|---|---|---|
| **Footer / Legal** | Registered Company Address | Kept as civic administrative portal liaison; omitted physical street address | Confirm exact registered business address and CIN / LLPIN |
| **Footer / Legal** | Privacy Policy & Terms URLs | Linked to internal modal/routing; no placeholder external URLs | Provide finalized legal text for `/privacy` and `/terms` |
| **State Portals** | Official Municipal Helpline Numbers | Uses standard pan-India 112 / 1077 district numbers | Verify state-specific municipal disaster helplines |
| **Testimonials** | Resolver & Citizen Testimonials | Replaced with verified transaction proofs (e.g. "DL-101 Pothole Remediation, Connaught Place") | Confirm if named citizen endorsements are to be published |
