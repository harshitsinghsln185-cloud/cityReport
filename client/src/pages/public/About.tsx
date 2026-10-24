import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SectionHeader from '../../components/ui/SectionHeader';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Reveal from '../../components/ui/Reveal';

export const About: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'About & Workflow' }]} className="mb-6" />

        {/* Hero Section */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="primary" size="md" className="mb-4 font-semibold uppercase tracking-wider">
              Governance & Workflow
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink tracking-tight mb-4 leading-tight">
              Transforming Municipal Maintenance Through Mathematical Accountability
            </h1>
            <p className="text-base sm:text-lg text-secondaryText leading-relaxed font-sans">
              Crowd Report bridges the divide between active citizens dealing with dangerous neighborhood hazards and certified local contractors operating under transparent, escrow-guaranteed contracts.
            </p>
          </div>
        </Reveal>

        {/* Impact Numbers Counter */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-card bg-white border border-border shadow-subtle mb-16">
            <div className="p-4 text-center">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-primary tabular-nums mb-1">
                12,480+
              </p>
              <p className="text-xs text-muted font-medium">Hazards Remediated</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Photo Proof Verified</p>
            </div>

            <div className="p-4 text-center border-l-0 sm:border-l border-border">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-indigo tabular-nums mb-1">
                36
              </p>
              <p className="text-xs text-muted font-medium">States & UTs Covered</p>
              <p className="text-[11px] text-muted mt-1">Nationwide Geo-Registry</p>
            </div>

            <div className="p-4 text-center border-t sm:border-t-0 lg:border-l border-border">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-emerald-600 tabular-nums mb-1">
                99.4%
              </p>
              <p className="text-xs text-muted font-medium">Verified SLA Compliance</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Within 24–48 Hours</p>
            </div>

            <div className="p-4 text-center border-t sm:border-t-0 lg:border-l border-border">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-gold tabular-nums mb-1">
                ₹0
              </p>
              <p className="text-xs text-muted font-medium">Unverified Fund Leakage</p>
              <p className="text-[11px] text-muted mt-1">Paise-Exact Escrow Gate</p>
            </div>
          </div>
        </Reveal>

        {/* Problem vs Solution Comparison */}
        <section className="mb-16">
          <Reveal>
            <SectionHeader
              eyebrow="The Civic Reality"
              eyebrowVariant="violet"
              title="Traditional Bureaucracy vs. The Crowd Report Standard"
              subtitle="Why civic problem reporting historically stalled, and how our escrow-backed model delivers guaranteed remediation."
              align="center"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Broken Status Quo */}
            <Reveal delay={0.1}>
              <Card variant="base" className="h-full bg-red-50/40 border-red-200/80 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 text-red-700 font-heading font-bold text-lg mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-700" />
                  </div>
                  <span>The Traditional Reporting Impasse</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span><strong>Endless Waiting:</strong> Physical letters and unmonitored complaint registers sit unaddressed for months without status feedback.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span><strong>No Fiscal Accountability:</strong> Public municipal maintenance funds are disbursed on paper without proof that work was physically executed on site.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span><strong>Unvetted Workers:</strong> Random ad-hoc laborers dispatched with non-standard materials and zero structural warranties.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span><strong>No Recourse:</strong> If a pothole caves in 2 weeks later, citizens have no mechanism to reopen tickets or claim rework.</span>
                  </li>
                </ul>
              </Card>
            </Reveal>

            {/* The Crowd Report Solution */}
            <Reveal delay={0.2}>
              <Card variant="base" className="h-full bg-emerald-50/40 border-emerald-200/80 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 text-emerald-900 font-heading font-bold text-lg mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span>The Crowd Report Solution</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Paise-Exact Escrow:</strong> 50% advance locked in a segregated civic escrow gate until completion. Zero contractor payout without approved verification.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Geo-Tagged Photographic Proof:</strong> Mandatory high-resolution Before and After photos with EXIF timestamp and GPS coordinate matching.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Accredited Resolver Pool:</strong> Every resolver is identity-vetted, holds municipal trade registrations, and operates within a 25 km radius.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>7-Day Inspection Reopen Window:</strong> Citizens have a binding quality review window to dispute or reopen unsatisfactory repairs.</span>
                  </li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* 4 Pillars of Architecture */}
        <section className="mb-16">
          <Reveal>
            <SectionHeader
              eyebrow="Architectural Pillars"
              eyebrowVariant="gold"
              title="Built for Uncompromising Civic Trust"
              subtitle="Every subsystem is engineered to eliminate corruption, preserve privacy, and maintain full transparency."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0.05}>
              <Card variant="base" className="h-full bg-white border-border hover:shadow-cardHover transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-lavender text-primary flex items-center justify-center mb-4 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                  Accredited Resolver Network
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Tradespeople submit government identity proof (Aadhaar/PAN), trade licenses, and proof of municipal experience before being unlocked to accept nearby work orders.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card variant="base" className="h-full bg-white border-border hover:shadow-cardHover transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                  Escrow Guarantee
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  All transaction values are calculated in integer paise. The 50% advance remains escrowed until the physical hazard is verified by supervisory inspectors and the citizen reporter.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.15}>
              <Card variant="base" className="h-full bg-white border-border hover:shadow-cardHover transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4 shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                  Deterministic SOR Pricing
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Quotes are calculated automatically from official municipal Schedule of Rates (SOR). No contractor haggling, no unexpected surcharges, and instant GST invoices generated.
                </p>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* Contractor Onboarding Teaser */}
        <Reveal delay={0.2}>
          <div className="p-8 sm:p-10 rounded-card bg-gradient-to-br from-dark via-[#141838] to-indigo text-white mb-16 relative overflow-hidden shadow-card">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-lavender mb-3 border border-white/15">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Contractor & Resolver Portal</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3 tracking-tight">
                  Are You a Certified Municipal Contractor or Tradesperson?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join our nationwide network of accredited problem solvers. Gain direct access to verified neighborhood repair assignments in your ward, guaranteed advance escrow, and weekly direct-to-bank payouts.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link to="/register-resolver">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                    <span>Apply as Resolver</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/query">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <span>Inquire About Tenders</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick Contact Link */}
        <div className="text-center">
          <p className="text-xs text-muted mb-2">Need to speak with our municipal governance liaison?</p>
          <Link
            to="/query"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            <span>Write a query to administration</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
