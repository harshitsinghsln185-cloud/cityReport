# Phase M0: Category Covers Pre-Generation Audit

**Branch**: `category-covers`  
**Date**: November 5, 2026  
**Auditor**: Antigravity Frontend Engineer & Art Director  

---

## 1. Current Cover Asset Usage Analysis

Each main civic category cover image is utilized across two critical UI surfaces:

1. **Category Cards (`/services` and Home Page `/` Category Grid)**:
   - Component: `ServiceCard.tsx`
   - Aspect Ratio: `aspect-[4/3]`
   - Image Rendering:
     - Optimized asset: `cardSrc` (800.webp / 480.webp)
     - `object-fit: cover`
     - `object-position: ${focalPoint.x}% ${focalPoint.y}%` (configured via `CATEGORY_CONTENT[slug].focal`)
     - Responsive hover zoom: `group-hover:scale-105 transition-transform duration-500`

2. **Category Page Hero Banner (`/services/:categorySlug`)**:
   - Component: `PageHero.tsx`
   - Aspect Ratio: `16:9` (`min-h-[380px] md:min-h-[420px] lg:min-h-[480px]`)
   - Left-to-right navy gradient overlay: `linear-gradient(to right, rgba(10, 31, 68, 0.95) 0%, rgba(10, 31, 68, 0.88) 35%, rgba(10, 31, 68, 0.45) 58%, rgba(10, 31, 68, 0) 75%)`
   - Mobile vertical gradient overlay: `linear-gradient(to bottom, rgba(10, 31, 68, 0.96) 0%, rgba(10, 31, 68, 0.8) 45%, rgba(10, 31, 68, 0.3) 100%)`
   - Requirement: Left 40% must remain calm (soft sky, atmospheric haze, unobtrusive background) to guarantee WCAG AAA text contrast, with the primary defect subject placed between 50% and 80% width.

---

## 2. Current Card Display Audit & Health Status

- **Status**: Verified in Playwright (`tests/civic-images.spec.ts`).
- **Cards displaying images**: **16 / 16 on `/services`** and **6 / 6 on Home `/`**.
- **Cards showing fallback icon**: **0 / 16**.
- **Image Natural Dimensions**: All 16 category cards report `naturalWidth > 0` (averaging 800px width on cards and 1920px on heroes).

---

## 3. Creative Commons Attribution Inventory (To be Replaced in M2)

Currently, 5 category covers are real photographs sourced from Wikimedia Commons and credited in `client/src/data/imageCredits.ts`, `docs/credits/IMAGE_CREDITS.md`, and the `/credits` page:

| Category Slug | Current Image Asset | Current Source | Author / Attribution | Current License |
|---|---|---|---|---|
| `roads-transportation` | `roads-transportation/_category.png` | Wikimedia Commons | Srvkumar09 | CC BY-SA 4.0 |
| `garbage-management` | `garbage-management/_category.png` | Wikimedia Commons | Pradip Paswan | CC BY-SA 4.0 |
| `water-drainage` | `water-drainage/_category.png` | Wikimedia Commons | Ganesh Dhamodkar | CC BY-SA 3.0 |
| `electricity-lighting` | `electricity-lighting/_category.png` | Wikimedia Commons | Subhashish Panigrahi | CC BY-SA 4.0 |
| `public-health` | `public-health/_category.png` | Wikimedia Commons | Pradeep Mohandas | CC BY-SA 4.0 |

*Note: The remaining 11 category covers are existing synthetic assets. All 16 covers will be newly generated in Phase M1 using Nano Banana to establish a unified documentary style.*

---

## 4. Composition & Art Direction Rules for M1

Every new cover generated with Nano Banana must adhere strictly to:
- **Aspect Ratio**: 16:9 ($2560 \times 1440\text{ px}$ original generation).
- **Subject Placement**: Right-center, spanning 50% to 80% of width.
- **Calm Zones**: Left 40% calm (clear/hazy sky, soft background) for hero typography; top 12% calm.
- **Tone & Mood**: Photorealistic documentary style at golden hour; cool navy shadows (`#0A1F44`), warm amber highlights, soft ivory sky.
- **Strict Exclusions**: No text, no readable signs/plates, no logos, no close-up faces, no 3D-render look, nothing graphic.
