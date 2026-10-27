# Crowd Report Brand Identity & Logo Specifications

## 1. Brand Concept: Concept A — "The Civic Node"
"The Civic Node" is the official brand identity for Crowd Report. It embodies institutional dignity, decentralized civic accountability, and sovereign escrow security.

### Symbolic Architecture
- **Outer Hexagonal Seal (`#0A1F44` Midnight Navy)**: Represents structural municipal geometry, civic integrity, and institutional strength.
- **Inner Chamber (`#06132B` Deep Navy)**: Creates spatial depth, symbolizing an immutable civic ledger where reports are permanently logged.
- **Keystone Pillar (`#C8A24A` Warm Gold)**: Represents the citizen's sovereign voice and the locked escrow stake that anchors resolution.
- **Civic Core (`#FAF8F3` Soft Ivory)**: The central focus point representing verified resolution, public transparency, and civic progress.

---

## 2. Geometric Construction & Grid
- **Master Viewbox**: `0 0 48 48`
- **Exterior Hexagon Vertices**:
  - Top: `(24, 4)`
  - Top-Right: `(42, 14.5)`
  - Bottom-Right: `(42, 33.5)`
  - Bottom: `(24, 44)`
  - Bottom-Left: `(6, 33.5)`
  - Top-Left: `(6, 14.5)`
- **Keystone Vertices**:
  - Apex: `(24, 16)`
  - Right: `(30, 20)`
  - Lower Right: `(28, 24)`
  - Bottom: `(24, 32)`
  - Lower Left: `(18, 28)`
  - Left: `(18, 20)`
- **Core Radius**: `r = 3px` centered at `(24, 24)`

---

## 3. Typographic Lockup
- **"Crowd"**: Set in `Fraunces Variable` serif, Weight 700, tracking `-0.5px`, fill `#0A1F44` (or `#FAF8F3` on dark surfaces).
- **"Report"**: Set in `Manrope Variable` sans-serif, Weight 600, tracking `-0.5px`, fill `#101828` (or `#E2E8F0` on dark surfaces).
- **Keystone Accent Dot**: Diameter `6px`, fill `#C8A24A`, vertically aligned with the cap-height of typography.

---

## 4. Logo System Assets
All vector master files reside in `client/src/assets/logo/`:

| Asset File | Use Case | Target Dimensions |
| :--- | :--- | :--- |
| `logo-mark.svg` | Standalone icon, mobile compact avatar, app icons | 48 x 48 (scalable) |
| `logo-horizontal.svg` | Desktop headers, documents, invoices on light backgrounds | 240 x 48 |
| `logo-horizontal-dark.svg` | Dark headers, footers, terminal consoles | 240 x 48 |
| `logo-stacked.svg` | Splash screens, hero intros, certificates | 160 x 100 |
| `logo-monochrome.svg` | Single-color print, letterheads, legal filings | 48 x 48 |
| `logo-reversed.svg` | Single-color pure white on high-contrast surfaces | 48 x 48 |

---

## 5. Clear Space & Minimum Sizing
- **Clear Space**: The minimum clear space surrounding the mark and horizontal lockup is equal to `0.5X`, where `X` is the height of the mark. No typography, borders, or layout elements may invade this perimeter.
- **Minimum Digital Sizes**:
  - Favicon / UI Icon: `16 x 16 px` (crisp hexagonal silhouette)
  - Standalone Mark: `24 x 24 px`
  - Horizontal Lockup: `120 x 24 px` (minimum readable typography)
  - Print Minimum: `8mm` width for mark, `25mm` width for horizontal lockup.

---

## 6. Prohibited Usage (Brand Violations)
1. **Never alter proportions**: Do not stretch, compress, or shear the hexagonal mark.
2. **Never apply generic drop shadows**: Use only crisp borders or subtle elevation tokens (`shadow-xs` / `shadow-sm`).
3. **Never alter token colors**: Do not replace Warm Gold (`#C8A24A`) or Midnight Navy (`#0A1F44`) with generic cyan, neon purple, or arbitrary hex codes.
4. **Never reverse hierarchy**: "Crowd" must always appear in Fraunces serif; "Report" must always appear in Manrope sans-serif.
