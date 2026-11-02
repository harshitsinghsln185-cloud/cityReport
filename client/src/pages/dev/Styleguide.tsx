import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlusCircle, CheckCircle2, AlertTriangle, AlertCircle, Info, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Logo, { LogoMark } from '../../components/ui/Logo';

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

        {/* Official Brand Logo System */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-ink">Official Brandmark & Logo System</h2>
              <p className="text-sm text-muted mt-1">
                Precision vector SVG brandmark featuring Civic Location Pin, Community Silhouettes, and Verified Resolution Checkmark in Midnight Navy (#0A1F44) and Warm Amber (#E8A33D). Live Fraunces (600) wordmark.
              </p>
            </div>
            <Badge variant="primary" size="md">Production Standard</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Horizontal Light */}
            <Card variant="base" className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading font-bold text-base text-ink">Horizontal Lockup (Light)</h3>
                <Badge variant="outline" size="sm">Default</Badge>
              </div>
              <div className="p-6 rounded-xl bg-canvas border border-border flex items-center justify-center min-h-[90px]">
                <Logo variant="horizontal" theme="light" size="md" subtitle="Civic Infrastructure" />
              </div>
              <p className="text-xs text-muted">Primary lockup used on light headers, public navigation, and official documentation.</p>
            </Card>

            {/* Horizontal Dark */}
            <Card variant="base" className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading font-bold text-base text-ink">Horizontal Lockup (Dark)</h3>
                <Badge variant="primary" size="sm">Dark/Navy</Badge>
              </div>
              <div className="p-6 rounded-xl bg-primary border border-primary/20 flex items-center justify-center min-h-[90px]">
                <Logo variant="horizontal" theme="dark" size="md" subtitle="Civic Infrastructure" />
              </div>
              <p className="text-xs text-muted">Inverted mark with crisp white pin and warm amber check on midnight navy surfaces.</p>
            </Card>

            {/* Stacked & Multi-scale */}
            <Card variant="base" className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading font-bold text-base text-ink">Responsive Sizes & Mark</h3>
                <Badge variant="gold" size="sm">Scalable</Badge>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border flex items-center justify-around gap-4 min-h-[90px]">
                <div className="flex flex-col items-center gap-1 text-[11px] text-muted">
                  <LogoMark size="sm" />
                  <span>sm (28px)</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] text-muted">
                  <LogoMark size="md" />
                  <span>md (34px)</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] text-muted">
                  <LogoMark size="lg" />
                  <span>lg (44px)</span>
                </div>
              </div>
              <p className="text-xs text-muted">Responsive mark scales cleanly without pixel distortion using SVG vector paths.</p>
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
          <h2 className="text-2xl font-heading font-semibold text-ink">2. Typography Hierarchy (Plus Jakarta Sans & Manrope)</h2>
          <Card variant="base" className="space-y-6 p-6">
            <div>
              <p className="text-xs font-mono text-muted uppercase">Display (Plus Jakarta Sans Variable - 36px to 60px)</p>
              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight">
                Empowering Citizens, Restoring Neighborhoods
              </h1>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase">H1 (Plus Jakarta Sans Variable - 30px to 44px)</p>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
                Municipal Defect Remediation & Milestone Dispatch
              </h1>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase">H2 (Plus Jakarta Sans Variable - 24px to 34px)</p>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
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
