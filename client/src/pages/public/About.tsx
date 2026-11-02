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
  MapPin,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Reveal from '../../components/ui/Reveal';
import PageHero from '../../components/ui/PageHero';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import aboutHeroImg from '../../assets/pages/about.png';
import { HERO_FOCAL } from '../../config/heroFocal';

export const About: React.FC = () => {
  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title="About & Municipal Accountability Architecture"
        description="Learn how Crowd Report combines upfront fee estimation, milestone contractor payments, and photographic verification to fix urban infrastructure."
        keywords={[
          'civic accountability',
          'municipal workflow',
          'milestone contractor payments',
          'photographic audit verification',
          'civic technology India',
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${SITE_URL}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: `${SITE_URL}/about`,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Crowd Report Municipal Governance Platform',
            description:
              'Crowd Report is a civic infrastructure platform connecting citizens with verified local contractors.',
          },
        ]}
      />

      {/* Left-Text Image Page Hero */}
      <PageHero
        backgroundImage={aboutHeroImg}
        imageAlt="Citizens and municipal civil engineering contractor collaborating over public infrastructure plan"
        focalPoint={HERO_FOCAL.about}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About & Governance' }]}
        eyebrow="About Crowd Report"
        title="Built for Transparent Civic Infrastructure Repair"
        description="Crowd Report connects citizens reporting public hazards with verified local contractors through upfront pricing and photographic proof."
        primaryAction={
          <Button href="#operating-model" variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Read Operating Model
          </Button>
        }
        secondaryAction={
          <Button to="/query" variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
            Contact Secretariat Desk
          </Button>
        }
      />

      {/* Floating Overlapping 4-Metric Card (Half on Hero, Half Below, Styled in Translucent Yellow/Gold) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-11 mb-2" id="operating-model">
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-accent/30 hover:bg-accent/35 backdrop-blur-xl border border-accent/50 shadow-xl shadow-navy/20 transition-all">
            {/* States & UTs Covered */}
            <div className="p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>States & UTs Covered</span>
              </div>
              <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums truncate">
                36
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Nationwide Geo-Registry</p>
            </div>

            {/* Photo Proof Required */}
            <div className="p-2 sm:p-2.5 border-l-0 sm:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Camera className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Photo Proof Required</span>
              </div>
              <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums truncate">
                100%
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Before & After Verified</p>
            </div>

            {/* Milestone Split */}
            <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Milestone Split</span>
              </div>
              <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums truncate">
                50 / 50
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Advance & Completion</p>
            </div>

            {/* Itemized Invoices */}
            <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <FileText className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Itemized Invoices</span>
              </div>
              <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums truncate">
                GST
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Full Tax Breakdown</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Problem vs Solution Comparison */}
        <section className="mb-16">
          <Reveal>
            <SectionHeader
              eyebrow="The Civic Reality"
              eyebrowVariant="violet"
              title="Traditional Bureaucracy vs. The Crowd Report Standard"
              subtitle="Why civic problem reporting historically stalled, and how our milestone model delivers verified repair."
              align="center"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Broken Status Quo */}
            <Reveal delay={0.1}>
              <Card variant="base" className="h-full bg-red-50/40 border-red-200/80 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 text-red-700 font-heading font-extrabold text-lg mb-4 tracking-tight">
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
                <div className="flex items-center gap-2.5 text-emerald-900 font-heading font-extrabold text-lg mb-4 tracking-tight">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span>The Crowd Report Solution</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Milestone Payments:</strong> 50% advance to initiate repair work; 50% balance payable only after completion photos are submitted and verified.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Geo-Tagged Photographic Proof:</strong> Mandatory high-resolution Before and After photos with timestamp and location coordinates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>Accredited Resolver Pool:</strong> Every resolver is identity-vetted, holds verified trade registrations, and operates within a local service radius.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span><strong>7-Day Inspection Reopen Window:</strong> Citizens have a quality review window to dispute or reopen unsatisfactory repairs before closure.</span>
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
                <h3 className="font-heading font-extrabold tracking-tight text-lg text-ink mb-2">
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
                <h3 className="font-heading font-extrabold tracking-tight text-lg text-ink mb-2">
                  Milestone Guarantee
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  All transaction values are calculated in integer paise. The 50% advance initiates work, and the remaining 50% balance is payable only after physical repair is verified with photographic proof.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.15}>
              <Card variant="base" className="h-full bg-white border-border hover:shadow-cardHover transition-all p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4 shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold tracking-tight text-lg text-ink mb-2">
                  Upfront Fee Estimation
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Quotes are calculated transparently with category base fees and travel distance rates. No contractor haggling, no unexpected surcharges, and instant GST invoices generated.
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
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-3 tracking-tight leading-[1.15]">
                  Are You a Certified Municipal Contractor or Tradesperson?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join our nationwide network of accredited problem solvers. Gain direct access to verified neighborhood repair assignments in your ward, guaranteed milestone payouts, and weekly direct-to-bank disbursements.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Button to="/register-resolver" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-black/20 flex items-center justify-center gap-2 font-bold text-navy">
                    <span>Apply as Resolver</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                <Button to="/query" variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <span>Inquire About Tenders</span>
                  </Button>
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
