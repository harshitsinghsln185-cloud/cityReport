# Color System & WCAG 2.1 Contrast Audit (PALETTE.md)

> **Design Goal**: Trustworthy, institutional, premium, and calm. Built on a dignified **Midnight Navy** (`#0A1F44`) primary and **Warm Gold** (`#C8A24A`) accent against a warm, glare-free **Soft Ivory** (`#FAF8F3`) background.

---

## 1. Master Semantic Color Tokens

| Role | Hex | Token Variable | Tailwind Class | Intended Use & Surface Pairing |
|---|---|---|---|---|
| **Primary (Midnight Navy)** | `#0A1F44` | `--color-primary` | `bg-primary`, `text-primary` | Header, primary buttons, hero sections, dark cards |
| **Primary Hover** | `#12306A` | `--color-primary-hover` | `hover:bg-primary-hover` | Interactive hover state for primary controls |
| **Primary Light / Tint** | `#EBF1FA` | `--color-primary-light` | `bg-primary-light` | Active nav link badges, subtle table row selections |
| **Accent (Warm Gold)** | `#C8A24A` | `--color-accent` | `bg-accent`, `text-accent` | Verified milestone seals, UT badges, focus rings, key dark-mode accents |
| **Accent Hover** | `#B38E37` | `--color-accent-hover` | `hover:bg-accent-hover` | Hover state for accent buttons & action links |
| **Accent Text on Light** | `#8A6A1F` | `--color-accent-text-light` | `text-accent-text` | High-contrast gold text on light surfaces (passes 4.5:1 WCAG AA) |
| **Accent Subtle Bg** | `#FAF4E6` | `--color-accent-bg` | `bg-accent-light` | Gold pill/badge backgrounds |
| **Background (Soft Ivory)**| `#FAF8F3` | `--color-canvas` | `bg-canvas` | Global page background, glare-reducing warm tint |
| **Surface (Card White)** | `#FFFFFF` | `--color-surface` | `bg-surface` | Elevated cards, forms, dialogs |
| **Surface Alt** | `#F1EEE6` | `--color-surface-alt` | `bg-surfaceAlt` | Alternate section background, table headers, breadcrumbs |
| **Surface Subtle** | `#F7F5EE` | `--color-surface-subtle` | `bg-surfaceSubtle` | Inset code blocks, neutral stat panels |
| **Ink (Main Text)** | `#101828` | `--color-ink` | `text-ink` | Headings, primary body copy, bold metrics |
| **Muted (Secondary Text)** | `#5B6577` | `--color-muted` | `text-muted` | Supporting copy, helper text, timestamps, labels |
| **Hairline Border** | `#E7E2D6` | `--color-border` | `border-border` | 1px clean separation borders |
| **Success** | `#0E6E4C` | `--color-success` | `text-status-success` | Completed fixes, verified photo proofs |
| **Success Bg** | `#E8F5F0` | `--color-success-bg` | `bg-status-success-bg` | Positive status pill backgrounds |
| **Warning** | `#B54708` | `--color-warning` | `text-status-warning` | Pending contractor action, 50% milestone escrow notice |
| **Warning Bg** | `#FEF6EE` | `--color-warning-bg` | `bg-status-warning-bg` | Warning banner backgrounds |
| **Danger** | `#B42318` | `--color-danger` | `text-status-danger` | Critical municipal hazard, overdue resolution |
| **Danger Bg** | `#FEF3F2` | `--color-danger-bg` | `bg-status-danger-bg` | Error alert backgrounds |
| **Info** | `#1D4ED8` | `--color-info` | `text-status-info` | In-review civic tickets, resolver dispatch notes |
| **Info Bg** | `#EFF6FF` | `--color-info-bg` | `bg-status-info-bg` | Info callout backgrounds |

---

## 2. WCAG 2.1 AA Contrast Verification Audit

Calculated using the official relative luminance formula ($L = 0.2126R + 0.7152G + 0.0722B$). Standard requirement: Normal body text $\ge 4.5:1$, Large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$) $\ge 3.0:1$.

| Text Color | Background Color | Contrast Ratio | WCAG Requirement | Result |
|---|---|---|---|---|
| **Ink** (`#101828`) | **Background** (`#FAF8F3`) | **16.72 : 1** | $\ge 4.5:1$ | **PASS (AAA)** |
| **Ink** (`#101828`) | **Surface** (`#FFFFFF`) | **17.75 : 1** | $\ge 4.5:1$ | **PASS (AAA)** |
| **Ink** (`#101828`) | **Surface Alt** (`#F1EEE6`) | **15.31 : 1** | $\ge 4.5:1$ | **PASS (AAA)** |
| **Muted** (`#5B6577`) | **Background** (`#FAF8F3`) | **5.54 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Muted** (`#5B6577`) | **Surface** (`#FFFFFF`) | **5.88 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Accent Text** (`#8A6A1F`) | **Background** (`#FAF8F3`) | **4.75 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Accent Text** (`#8A6A1F`) | **Surface** (`#FFFFFF`) | **5.05 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Accent Gold** (`#C8A24A`) | **Midnight Navy** (`#0A1F44`) | **6.75 : 1** | $\ge 3.0:1$ | **PASS (AAA)** |
| **White** (`#FFFFFF`) | **Midnight Navy** (`#0A1F44`) | **16.25 : 1** | $\ge 4.5:1$ | **PASS (AAA)** |
| **White** (`#FFFFFF`) | **Navy Hover** (`#12306A`) | **12.68 : 1** | $\ge 4.5:1$ | **PASS (AAA)** |
| **Success** (`#0E6E4C`) | **Success Bg** (`#E8F5F0`) | **5.59 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Warning** (`#B54708`) | **Warning Bg** (`#FEF6EE`) | **5.07 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Danger** (`#B42318`) | **Danger Bg** (`#FEF3F2`) | **6.05 : 1** | $\ge 4.5:1$ | **PASS (AA)** |
| **Info** (`#1D4ED8`) | **Info Bg** (`#EFF6FF`) | **6.16 : 1** | $\ge 4.5:1$ | **PASS (AA)** |

---

## 3. Surface & Section Pairing Guidelines

1. **Light Sections**: Use `--color-canvas` (`#FAF8F3`) for body wrappers with elevated white cards (`#FFFFFF`) bordered by hairline `--color-border` (`#E7E2D6`).
2. **Alternate Sections**: Use `--color-surface-alt` (`#F1EEE6`) to establish visual rhythm between alternating feature blocks.
3. **Dark Feature Sections (Midnight Navy)**: Use `--color-primary` (`#0A1F44`) with subtle gradient to `#06132B`. Text uses pure white (`#FFFFFF`) headings and slate silver (`#CBD5E1`) secondary text. **Never use blue-purple "AI" gradients.**
