import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlusCircle, CheckCircle2, AlertTriangle, AlertCircle, Info, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export const Styleguide: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const swatches = [
    { name: 'Primary (Midnight Navy)', hex: '#0A1F44', token: '--color-primary', text: '#FFFFFF' },
    { name: 'Primary Hover', hex: '#12306A', token: '--color-primary-hover', text: '#FFFFFF' },
    { name: 'Accent (Warm Gold)', hex: '#C8A24A', token: '--color-accent', text: '#0A1F44' },
    { name: 'Accent Text (High Contrast)', hex: '#8A6A1F', token: '--color-accent-text-light', text: '#FFFFFF' },
    { name: 'Background (Soft Ivory)', hex: '#FAF8F3', token: '--color-canvas', text: '#101828' },
    { name: 'Surface (Pure White)', hex: '#FFFFFF', token: '--color-surface', text: '#101828' },
    { name: 'Surface Alt', hex: '#F1EEE6', token: '--color-surface-alt', text: '#101828' },
    { name: 'Ink (Main Text)', hex: '#101828', token: '--color-ink', text: '#FFFFFF' },
    { name: 'Muted (Secondary)', hex: '#5B6577', token: '--color-muted', text: '#FFFFFF' },
    { name: 'Hairline Border', hex: '#E7E2D6', token: '--color-border', text: '#101828' },
    { name: 'Success (Verified)', hex: '#0E6E4C', token: '--color-success', text: '#FFFFFF' },
    { name: 'Warning (Advance Due)', hex: '#B54708', token: '--color-warning', text: '#FFFFFF' },
    { name: 'Danger (Critical Hazard)', hex: '#B42318', token: '--color-danger', text: '#FFFFFF' },
    { name: 'Info (In Review)', hex: '#1D4ED8', token: '--color-info', text: '#FFFFFF' },
  ];

  return (
    <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Design System Styleguide (Dev Only) | Crowd Report</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <Badge variant="primary" size="sm" className="mb-3 font-semibold uppercase tracking-wider">
            Development Token Inspector
          </Badge>
          <h1 className="text-4xl font-heading font-bold text-ink tracking-tight">
            Crowd Report Design System & Component Library
          </h1>
          <p className="mt-2 text-muted text-base">
            Live interactive reference for palette swatches, typography clamps, button states, inputs, and card elevations. Excluded from production builds.
          </p>
        </div>

        {/* Phase R3: Logo Design Concepts Selection */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-ink">Phase R3: Vector Logo Concepts (Select One)</h2>
              <p className="text-sm text-muted mt-1">
                Precision vector SVG brandmarks built on geometric grids. Review below at 16px favicon, 48px mark, and horizontal lockup on Light & Dark surfaces.
              </p>
            </div>
            <Badge variant="gold" size="md">Phase R3 Review</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Concept A */}
            <Card variant="base" className="space-y-4 p-5 border-2 hover:border-primary transition-all">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-ink">Concept A: Civic Node</h3>
                  <p className="text-xs text-muted">Hexagonal Civic Seal & Trust Keystone</p>
                </div>
                <Badge variant="primary" size="sm">Recommended</Badge>
              </div>

              {/* Horizontal Lockup Light */}
              <div className="p-4 rounded-xl bg-white border border-border flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <path d="M20 0L38 10V30L20 40L2 30V10L20 0Z" fill="#0A1F44" />
                    <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="#06132B" />
                    <path d="M20 12L26 16V24L20 28L14 24V16L20 12Z" fill="#C8A24A" />
                    <circle cx="20" cy="20" r="2.5" fill="#FAF8F3" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#0A1F44" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#101828" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Horizontal Lockup Dark */}
              <div className="p-4 rounded-xl bg-primary border border-primary/20 flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <path d="M20 0L38 10V30L20 40L2 30V10L20 0Z" fill="#FFFFFF" />
                    <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="#0A1F44" />
                    <path d="M20 12L26 16V24L20 28L14 24V16L20 12Z" fill="#C8A24A" />
                    <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#FFFFFF" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#EBF1FA" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Multi-scale preview (48px and 16px) */}
              <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted">
                <div className="flex items-center gap-3">
                  <span className="font-mono">48px:</span>
                  <svg viewBox="0 0 40 40" className="w-8 h-8">
                    <path d="M20 0L38 10V30L20 40L2 30V10L20 0Z" fill="#0A1F44" />
                    <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="#06132B" />
                    <path d="M20 12L26 16V24L20 28L14 24V16L20 12Z" fill="#C8A24A" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">16px favicon:</span>
                  <svg viewBox="0 0 40 40" className="w-4 h-4">
                    <path d="M20 0L38 10V30L20 40L2 30V10L20 0Z" fill="#0A1F44" />
                    <circle cx="20" cy="20" r="8" fill="#C8A24A" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Concept B */}
            <Card variant="base" className="space-y-4 p-5 border-2 hover:border-primary transition-all">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-ink">Concept B: Civic Horizon</h3>
                  <p className="text-xs text-muted">Intersecting Community Arcs & Keystone</p>
                </div>
                <Badge variant="outline" size="sm">Modern</Badge>
              </div>

              {/* Horizontal Lockup Light */}
              <div className="p-4 rounded-xl bg-white border border-border flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <path d="M4 32C4 23.1634 11.1634 16 20 16C28.8366 16 36 23.1634 36 32H30C30 25.3726 24.6274 20 20 20C15.3726 20 10 25.3726 10 32H4Z" fill="#0A1F44" />
                    <path d="M10 16C10 10.4772 14.4772 6 20 6C25.5228 6 30 10.4772 30 16H25C25 12.6863 22.3137 10 20 10C17.6863 10 15 12.6863 15 16H10Z" fill="#C8A24A" />
                    <polygon points="20,0 24,6 16,6" fill="#C8A24A" />
                    <circle cx="20" cy="32" r="2.5" fill="#0A1F44" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#0A1F44" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#101828" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Horizontal Lockup Dark */}
              <div className="p-4 rounded-xl bg-primary border border-primary/20 flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <path d="M4 32C4 23.1634 11.1634 16 20 16C28.8366 16 36 23.1634 36 32H30C30 25.3726 24.6274 20 20 20C15.3726 20 10 25.3726 10 32H4Z" fill="#FFFFFF" />
                    <path d="M10 16C10 10.4772 14.4772 6 20 6C25.5228 6 30 10.4772 30 16H25C25 12.6863 22.3137 10 20 10C17.6863 10 15 12.6863 15 16H10Z" fill="#C8A24A" />
                    <polygon points="20,0 24,6 16,6" fill="#C8A24A" />
                    <circle cx="20" cy="32" r="2.5" fill="#FFFFFF" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#FFFFFF" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#EBF1FA" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Multi-scale preview */}
              <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted">
                <div className="flex items-center gap-3">
                  <span className="font-mono">48px:</span>
                  <svg viewBox="0 0 40 40" className="w-8 h-8">
                    <path d="M4 32C4 23.1634 11.1634 16 20 16C28.8366 16 36 23.1634 36 32H30C30 25.3726 24.6274 20 20 20C15.3726 20 10 25.3726 10 32H4Z" fill="#0A1F44" />
                    <path d="M10 16C10 10.4772 14.4772 6 20 6C25.5228 6 30 10.4772 30 16H25C25 12.6863 22.3137 10 20 10C17.6863 10 15 12.6863 15 16H10Z" fill="#C8A24A" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">16px favicon:</span>
                  <svg viewBox="0 0 40 40" className="w-4 h-4">
                    <circle cx="20" cy="20" r="18" fill="#0A1F44" />
                    <polygon points="20,8 26,18 14,18" fill="#C8A24A" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Concept C */}
            <Card variant="base" className="space-y-4 p-5 border-2 hover:border-primary transition-all">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-ink">Concept C: Municipal Grid</h3>
                  <p className="text-xs text-muted">4-Quadrant Civic Matrix & Proof Check</p>
                </div>
                <Badge variant="outline" size="sm">Geometric</Badge>
              </div>

              {/* Horizontal Lockup Light */}
              <div className="p-4 rounded-xl bg-white border border-border flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <rect x="4" y="4" width="14" height="14" rx="3" fill="#0A1F44" />
                    <rect x="22" y="4" width="14" height="14" rx="3" fill="#12306A" />
                    <rect x="4" y="22" width="14" height="14" rx="3" fill="#12306A" />
                    <rect x="22" y="22" width="14" height="14" rx="3" fill="#0A1F44" />
                    <path d="M12 20L18 26L28 12" stroke="#C8A24A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#0A1F44" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#101828" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Horizontal Lockup Dark */}
              <div className="p-4 rounded-xl bg-primary border border-primary/20 flex items-center justify-center">
                <svg viewBox="0 0 240 48" className="h-10 w-auto">
                  <g transform="translate(4, 4)">
                    <rect x="4" y="4" width="14" height="14" rx="3" fill="#FFFFFF" />
                    <rect x="22" y="4" width="14" height="14" rx="3" fill="#EBF1FA" />
                    <rect x="4" y="22" width="14" height="14" rx="3" fill="#EBF1FA" />
                    <rect x="22" y="22" width="14" height="14" rx="3" fill="#FFFFFF" />
                    <path d="M12 20L18 26L28 12" stroke="#C8A24A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <text x="56" y="31" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="22" fontWeight="700" fill="#FFFFFF" letterSpacing="-0.5">Crowd</text>
                  <text x="135" y="31" fontFamily="'Manrope Variable', sans-serif" fontSize="22" fontWeight="600" fill="#EBF1FA" letterSpacing="-0.5">Report</text>
                  <circle cx="216" cy="28" r="3" fill="#C8A24A" />
                </svg>
              </div>

              {/* Multi-scale preview */}
              <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted">
                <div className="flex items-center gap-3">
                  <span className="font-mono">48px:</span>
                  <svg viewBox="0 0 40 40" className="w-8 h-8">
                    <rect x="4" y="4" width="14" height="14" rx="3" fill="#0A1F44" />
                    <rect x="22" y="4" width="14" height="14" rx="3" fill="#12306A" />
                    <rect x="4" y="22" width="14" height="14" rx="3" fill="#12306A" />
                    <rect x="22" y="22" width="14" height="14" rx="3" fill="#0A1F44" />
                    <path d="M12 20L18 26L28 12" stroke="#C8A24A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">16px favicon:</span>
                  <svg viewBox="0 0 40 40" className="w-4 h-4">
                    <rect x="2" y="2" width="36" height="36" rx="8" fill="#0A1F44" />
                    <path d="M10 20L18 28L30 12" stroke="#C8A24A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 1. Color Palette Swatches */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-ink">1. Color Tokens & Surface Swatches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {swatches.map((s) => (
              <div
                key={s.name}
                className="p-3.5 rounded-xl border border-border shadow-xs flex flex-col justify-between h-36 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: s.hex, color: s.text }}
              >
                <div>
                  <p className="font-semibold text-xs leading-tight">{s.name}</p>
                  <p className="text-xs opacity-80 font-mono mt-0.5">{s.hex}</p>
                </div>
                <p className="text-xs opacity-75 font-mono">{s.token}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-ink">2. Typography Hierarchy (Fraunces & Manrope)</h2>
          <Card variant="base" className="space-y-6 p-6">
            <div>
              <p className="text-xs font-mono text-muted uppercase">Display (Fraunces Variable - 36px to 60px)</p>
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-ink">
                Empowering Citizens, Restoring Neighborhoods
              </h1>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase">H1 (Fraunces Variable - 30px to 44px)</p>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
                Municipal Defect Remediation & Milestone Dispatch
              </h1>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase">H2 (Fraunces Variable - 24px to 34px)</p>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-ink">
                36 States & Union Territories Coverage
              </h2>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase">Body & Paragraph (Manrope Variable - 16px to 18px, 1.6 line-height)</p>
              <p className="text-base text-secondaryText max-w-prose">
                Citizens report verified neighborhood defects, inspect contractor cost estimates, and authorize milestone payments. Strict integer paise accounting ensures zero floating-point discrepancies across all financial ledgers.
              </p>
            </div>
          </Card>
        </section>

        {/* 3. Button Component States & Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-ink">3. Buttons (44px Minimum Touch Target)</h2>
          <Card variant="base" className="space-y-8 p-6">
            <div>
              <p className="text-xs font-mono text-muted uppercase mb-3">Sizes (xs, sm, md: 44px height, lg: 48px height)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small (xs)</Button>
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium Default (md: 44px)</Button>
                <Button size="lg">Large Hero (lg: 48px)</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-muted uppercase mb-3">Variants (Section 3 Palette)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary (Navy)</Button>
                <Button variant="accent">Accent (Navy/Gold)</Button>
                <Button variant="gold">Gold Seal</Button>
                <Button variant="secondary">Secondary (Tint)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-muted uppercase mb-3">Interactive States & Icons</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  With Left Icon
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 4. Form Controls & Inputs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-ink">4. Form Inputs (48px Height & 12px Radius)</h2>
          <Card variant="base" className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <Input
              label="Standard Text Input"
              placeholder="Enter your full name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Helper description text"
            />
            <Input
              label="Input with Left Icon"
              placeholder="e.g. Connaught Place, New Delhi"
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Input with Validation Error"
              placeholder="CR-2026-000001"
              defaultValue="INVALID-CODE"
              error="No civic defect record exists with this code."
            />
          </Card>
        </section>

        {/* 5. Badges & Status Indicators */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-ink">5. Badges & Semantic Status Chips</h2>
          <Card variant="base" className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary">Primary Navy</Badge>
              <Badge variant="gold">Warm Gold UT</Badge>
              <Badge variant="secondary">Secondary Neutral</Badge>
              <Badge variant="outline">Outline Pill</Badge>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-success-bg text-status-success border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-warning-bg text-status-warning border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" /> 50% Advance Pending
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-danger-bg text-status-danger border border-red-200">
                <AlertCircle className="w-3.5 h-3.5" /> Critical Hazard
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-info-bg text-status-info border border-blue-200">
                <Info className="w-3.5 h-3.5" /> In Municipal Review
              </span>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Styleguide;
