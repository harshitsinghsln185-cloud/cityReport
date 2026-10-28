# Design System Color Tokens & Palette Reference

This document formalizes the unified color system for Crowd Report Platform, eliminating all previous ad-hoc purple/indigo variations in favor of an authoritative civic palette based on **Primary Navy (`#0A1F44`)**, **Warm Amber-Gold Accent (`#E8A33D`)**, and **Warm Ivory Canvas (`#FAF8F3`)**.

---

## 1. Core Palette Tokens

| Token Name | Hex | RGB | HSL | Contrast vs White (`#FFF`) | Contrast vs Canvas (`#FAF8F3`) | Primary Usage |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **`primary`** | `#0A1F44` | `10, 31, 68` | `218°, 74%, 15%` | **16.6:1 (AAA)** | **15.3:1 (AAA)** | Brand identity, primary CTAs, active tab indicators, major headings |
| **`primary-hover`** | `#12306A` | `18, 48, 106` | `220°, 71%, 24%` | **11.4:1 (AAA)** | **10.5:1 (AAA)** | Hover states for primary buttons and links |
| **`primary-light`** | `#EBF1FA` | `235, 241, 250` | `216°, 56%, 95%` | 1.1:1 (Surface) | 1.05:1 (Surface) | Tinted backgrounds, active filter pills, avatar containers |
| **`accent`** | `#E8A33D` | `232, 163, 61` | `36°, 80%, 57%` | 1.9:1 (Fill only) | 1.8:1 (Fill only) | Primary button on dark hero, highlight badges, gold accents |
| **`accent-hover`** | `#D4922F` | `212, 146, 47` | `36°, 66%, 51%` | 2.3:1 (Fill only) | 2.1:1 (Fill only) | Hover state for accent buttons |
| **`accent-light`** | `#FDF6E9` | `253, 246, 233` | `39°, 80%, 95%` | 1.1:1 (Surface) | 1.04:1 (Surface) | Background for notification counters and accent highlights |
| **`accent-text`** | `#8A6A1F` | `138, 106, 31` | `42°, 63%, 33%` | **4.8:1 (AA)** | **4.5:1 (AA)** | Readable gold text on light backgrounds (accessible alternative to `#E8A33D`) |
| **`accent-border`** | `#F2D399` | `242, 211, 153` | `39°, 77%, 77%` | 1.4:1 (Border) | 1.3:1 (Border) | Borders on accent cards and chips |
| **`canvas`** | `#FAF8F3` | `250, 248, 243` | `43°, 39%, 97%` | 1.07:1 (Surface) | 1:1 (Base) | Global page background, ivory warm editorial surface |
| **`surface`** | `#FFFFFF` | `255, 255, 255` | `0°, 0%, 100%` | 1:1 (Base) | 1.07:1 (Elevated) | Card backgrounds, modals, sheets, popovers |
| **`ink`** | `#0F172A` | `15, 23, 42` | `222°, 47%, 11%` | **17.5:1 (AAA)** | **16.1:1 (AAA)** | Primary body text, page titles, table headers |
| **`secondaryText`**| `#475569` | `71, 85, 105` | `215°, 19%, 35%` | **5.2:1 (AA)** | **4.8:1 (AA)** | Subheadings, labels, secondary information |
| **`muted`** | `#64748B` | `100, 116, 139` | `215°, 16%, 47%` | **4.5:1 (AA)** | **4.2:1 (AA)** | Timestamp text, inactive icons, helper text |
| **`card-border`** | `#E2E8F0` | `226, 232, 240` | `214°, 32%, 91%` | 1.2:1 (Border) | 1.1:1 (Border) | Structural dividers, card borders, table borders |

---

## 2. Semantic Status Tokens

All semantic status colors meet WCAG 2.1 Level AA for normal text (minimum 4.5:1 ratio) on white backgrounds:

| Semantic Role | Token Base | Base Hex | Light Surface Hex | Border Hex | Text Contrast on White |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Success / Resolved** | `status-success` | `#107569` | `#EDF7F5` | `#BCE3DB` | **4.6:1 (AA)** |
| **Info / In Review** | `status-info` | `#0E7490` | `#ECFEFF` | `#A5F3FC` | **4.7:1 (AA)** |
| **Warning / In Progress** | `status-warning` | `#B54708` | `#FFFAEB` | `#FEDF89` | **4.7:1 (AA)** |
| **Danger / Critical** | `status-danger` | `#B42318` | `#FEF3F2` | `#FECDCA` | **5.9:1 (AAA)** |

---

## 3. Zonal Color Mapping

India's geographical zones in the Directory & Live Map use consistent, distinguishable hues that maintain accessibility standards:

| Zone | Primary Color Hex | Light Background | Contrast vs White | Strategic Association |
| :--- | :--- | :--- | :---: | :--- |
| **North** | `#1D4ED8` (Royal Blue) | `#EFF6FF` | **5.4:1 (AA)** | Himalayan rivers, clear alpine skies |
| **South** | `#0E6E4C` (Deep Pine) | `#ECFDF5` | **5.6:1 (AA)** | Tropical coastline, western ghats vegetation |
| **East** | `#B54708` (Terracotta) | `#FFF7ED` | **4.7:1 (AA)** | Clay craftsmanship, rich historical heritage |
| **West** | `#0E7490` (Deep Teal) | `#ECFEFF` | **4.7:1 (AA)** | Arabian Sea ports, industrial coastlines |
| **Central** | `#78350F` (Earthy Umber) | `#FEF3C7` | **7.8:1 (AAA)** | Plateau, plateau earth, heartland forests |
| **Northeast** | `#9F1239` (Deep Berry) | `#FFF1F2` | **6.2:1 (AAA)** | Vibrant textiles, biodiversity hotspots |

---

## 4. Elimination of Legacy Colors

- **Eliminated**:
  - `#7C3AED` (Royal Indigo / Purple)
  - `#5B4FE1` (Primary Violet)
  - `#6D28D9` (Deep Purple)
  - `#EDE9FE` / `#DDD6FE` (Purple tint backgrounds)
  - `#A78BFA` (Purple border/glow)
  - `#F8F7FC` (Cold purple-tinted canvas)
- **Zero purple references** remain in `client/src`.
- The previous purple glow effect (`rgba(124, 58, 237, 0.4)`) has been replaced by natural warm shadow tokens (`rgba(232, 163, 61, 0.25)` or `rgba(10, 31, 68, 0.12)`).
