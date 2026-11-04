# Crowd Report Civic Asset Management Guide (ASSETS.md)

This document provides clear, operational instructions for adding, updating, optimizing, or removing category and sub-issue photographic assets within the Crowd Report Platform.

---

## 1. Directory Structure

```text
client/design-source/civic/<category-slug>/_category.png        Original category cover (>= 1920x1080, 16:9, gitignored)
client/design-source/civic/<category-slug>/<sub-slug>.png       Original sub-issue photo (>= 800x600, 4:3, gitignored)

client/src/assets/images/civic/<category-slug>/_category/       Optimized responsive covers:
                                                                1920.webp, 1280.webp, 768.webp, 800.webp, 480.webp (+ .avif) + blur.webp
client/src/assets/images/civic/<category-slug>/<sub-slug>/       Optimized responsive sub-issue cards:
                                                                800.webp, 480.webp (+ .avif) + blur.webp

client/src/data/civicContent.ts                                 Per-slug description, alt text, and focal point
client/src/data/imageCredits.ts                                 Machine-readable credits and attribution
docs/credits/IMAGE_CREDITS.md                                   Human-readable credit ledger and license audit
docs/civic-taxonomy/CONTACT_SHEET.html                          Visual contact sheet for quality auditing
```

---

## 2. Art Direction & Quality Bar

1. **Resolution & Crop Ratios:**
   - **Category Covers:** 16:9 aspect ratio, minimum $1920 \times 1080\text{ px}$. Subject centered or right-third (50% to 85% width); left 40% calm for high-contrast hero text overlay.
   - **Sub-Issue Cards:** 4:3 aspect ratio, minimum $800 \times 600\text{ px}$. Subject clearly visible in center.
2. **Visual Consistency:**
   - Soft natural daylight (morning or late afternoon).
   - Crisp focus on the problem/defect.
   - Gentle shared color grade (cool navy shadows `#0A1F44`, warm highlights).
3. **Strict Exclusions:**
   - No identifiable human faces or close-ups.
   - No readable private vehicle license plates, brand logos, or phone numbers.
   - No watermarks, stock overlays, or artistic filters.
4. **Sensitive Sub-Issues Policy:**
   - Issues involving animal carcasses, biomedical refuse, public urination, or hazardous live wires must use **indirect municipal framing** (clean municipal container, sanitary perimeter cordon, hazard signage). Never display graphic injury, gore, or nudity.

---

## 3. How to Add or Replace an Image

### Step 1: Save the Original Image
Place your uncompressed PNG file into the `design-source` directory:
- For a category cover: `client/design-source/civic/<category-slug>/_category.png`
- For a sub-issue card: `client/design-source/civic/<category-slug>/<sub-slug>.png`

### Step 2: Run the Optimization Pipeline
In the `client` directory, run:
```bash
npm run civic:images
```
This automatically:
- Generates all responsive WebP and AVIF variants (1920, 1280, 768, 800, 480 for covers; 800, 480 for sub-issues).
- Produces ultra-lightweight `blur.webp` placeholders.
- Strips all EXIF and camera GPS data.
- Ensures file size budgets ($< 200\text{ KB}$ for 1920 WebP covers; $< 70\text{ KB}$ for 800 WebP sub-issues).

### Step 3: Record Attribution & Metadata
1. If the photo is from an open-access source (e.g. Wikimedia Commons, Unsplash), add author, URL, and license details to:
   - `docs/credits/IMAGE_CREDITS.md`
   - `client/src/data/imageCredits.ts`
2. Update alt text, focal point, and descriptions in:
   - `client/src/data/civicContent.ts`

### Step 4: Run Consistency Checks
In the `client` directory, run:
```bash
npm run civic:check
```
The check ensures all taxonomy slugs match, image sizes exist, and credits are recorded.

---

## 4. How to Remove an Image
1. Remove the file from `client/design-source/civic/<category-slug>/<sub-slug>.png`.
2. Delete the corresponding folder in `client/src/assets/images/civic/<category-slug>/<sub-slug>/`.
3. If the sub-issue remains active in `server/src/seed/civicTaxonomy.js`, the platform cleanly falls back to an accessible icon-on-tint card.
4. Run `npm run civic:check` to ensure no orphaned references exist.
