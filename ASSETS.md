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

---

## 5. Civic Category Covers (Nano Banana)

The 16 civic category cover images were generated using **Nano Banana** (Google Gemini Image Model) under unified art direction and documentary styling (16:9 aspect ratio, natural daylight at golden hour, navy blue shadows, warm amber highlights, soft ivory sky, right-centre subject 50%–80%, calm left 40% for hero text, zero readable text, zero identifiable faces, zero logos):

1. **Roads & Transportation** (`roads-transportation/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban setting. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A damaged asphalt road with several water-filled potholes and cracked edges on a busy city street, a few two-wheelers and an auto-rickshaw far in the background. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-05
2. **Garbage Management** (`garbage-management/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban setting. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): An overflowing green municipal dustbin on a footpath with garbage bags and litter spilling onto the road, a collection tricycle far in the background. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-05
3. **Water & Drainage** (`water-drainage/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban setting. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A leaking underground water pipe pushing clean drinking water up through cracked road asphalt, the water flowing along a waterlogged street gutter with an open broken drainage grill beside it. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-06
4. **Electricity & Lighting** (`electricity-lighting/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at dusk/late golden hour (deep navy-blue shadows, warm amber street glow), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian city street. Palette leans navy blue shadows, warm amber highlights, soft dusk sky. Main subject situated in the right-centre (between 50% and 80% width): A visibly leaning weathered concrete electric utility pole with a dark, broken glass streetlight fixture and a chaotic tangle of loose sagging black cables hanging down, with residential buildings blurred in the background. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-06
5. **Public Health** (`public-health/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban lane. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A neglected municipal public toilet block with weathered stained tiles, closed rusted door, and standing puddle of water beside it, weeds growing along the foundation. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-05
6. **Environment** (`environment/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban periphery setting. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A dried-up urban pond or canal bed with deeply cracked mud, scattered plastic waste, dry silt and low parched scrub under a hazy sky. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-06
7. **Parks & Greenery** (`parks-greenery/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian public municipal park setting. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): An overgrown, neglected municipal park corner with a dilapidated broken concrete/wooden park bench with missing slats, unpruned wild thorny bushes and tall weeds aggressively bursting through a cracked stone walking path. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-06
8. **Public Safety** (`public-safety/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight transitioning to dusk/early evening (deep navy-teal shadows, subtle amber glow in the distance), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban alleyway or underpass entrance. Palette leans navy blue shadows, warm amber highlights, soft twilight sky. Main subject situated in the right-centre (between 50% and 80% width): A dim, unlit pedestrian passage or alleyway corner with broken pavement pavers, dark alcoves, weathered peeling plaster walls with no graffiti, and an unlit dead street light bracket, with warm municipal street light visible only in the far background. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-06
9. **Public Transport** (`public-transport/_category.png`):
   - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban corridor. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A damaged municipal bus shelter with a bent corrugated metal roof and rusted iron support frame, with an empty cracked concrete platform. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
   - *Date*: 2026-11-05
10. **Animal Welfare** (`animal-welfare/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban street corner. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A pack of three stray Indian native street dogs resting near an overturned wooden food cart on a quiet street corner, with an ear-notched stray dog visible, showing the need for animal welfare and community care. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up human faces, no animal cruelty or graphic injury."
    - *Date*: 2026-11-06
11. **Encroachment** (`encroachment/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian city street. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): Makeshift wooden vendor stalls, crates, and blue/orange tarpaulin awnings completely occupying the pedestrian footpath, showing footpath encroachment. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
    - *Date*: 2026-11-06
12. **Public Amenities** (`public-amenities/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian public town square. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A damaged public municipal drinking water booth with a broken corroded brass tap dripping into an algae-stained cracked stone basin, missing drain grate, and rusted dry water pipes. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
    - *Date*: 2026-11-06
13. **Fire & Emergency** (`fire-emergency/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban neighborhood lane. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): An official red municipal fire hydrant partly obstructed by tightly parked scooters, bicycles, and stacked wooden construction timber against an aged brick wall with an emergency hose box. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces, no fire, no smoke."
    - *Date*: 2026-11-05
14. **Urban Planning** (`urban-planning/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian urban city corridor. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): An unfinished elevated flyover concrete pillar standing in the middle of a messy construction corridor, with faded yellow/black construction barricades, gravel, rebar, and concrete rubble around its base. Calm left 40%, calm top 12%. No text, no logos, no license plates, no close-up faces."
    - *Date*: 2026-11-06
15. **Commercial Areas** (`commercial-areas/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian commercial bazaar lane. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A crowded commercial market street corner where shop displays, clothing racks, plastic goods, and cartons spill out excessively onto the walkway beneath a dense tangle of overhead electrical cabling. Calm left 40%, calm top 12%. No text, no readable shop signs, no logos, no license plates, no close-up faces."
    - *Date*: 2026-11-06
16. **Public Property** (`public-property/_category.png`):
    - *Prompt*: "Photorealistic documentary-style photograph, 16:9, natural daylight at golden hour (soft warm light, cool navy-teal shadows), 35mm lens, slightly elevated eye-level angle, shallow depth of field, crisp detail on the main subject, realistic Indian municipal public square or park. Palette leans navy blue shadows, warm amber highlights, soft ivory sky. Main subject situated in the right-centre (between 50% and 80% width): A neglected and vandalized public park pavilion structure with broken wrought-iron railings, chipped stone pillars, missing corrugated roofing sheets, and peeling paint. Calm left 40%, calm top 12%. No text, no readable signs, no logos, no license plates, no close-up faces."
    - *Date*: 2026-11-06


