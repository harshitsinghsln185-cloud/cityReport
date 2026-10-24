import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { getStateBySlug, STATES_DATA } from '../../data/statesData';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Accordion from '../../components/ui/Accordion';
import SectionHeader from '../../components/ui/SectionHeader';
import Reveal from '../../components/ui/Reveal';

export const StateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const stateData = useMemo(() => {
    if (!slug) return undefined;
    return getStateBySlug(slug);
  }, [slug]);

  // Dynamic SEO Title & Meta Description update
  useEffect(() => {
    if (stateData) {
      document.title = `${stateData.name} Civic Infrastructure & Hazard Reporting | Crowd Report`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute(
        'content',
        `Track verified civic hazard resolutions, escrow-backed contractor dispatch, and local public works in ${stateData.name}. ${stateData.heroBlurb}`
      );
    } else {
      document.title = 'State Not Found | Crowd Report';
    }

    return () => {
      document.title = 'Crowd Report Platform - Civic Issue Reporting & Resolution';
    };
  }, [stateData]);

  if (!stateData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-canvas">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-ink mb-2">
          State or Territory Not Found
        </h1>
        <p className="text-sm text-secondaryText max-w-md mb-6 leading-relaxed">
          The requested regional slug does not match any of the 36 monitored Indian states or union territories in our database.
        </p>
        <Link to="/states">
          <Button variant="primary" leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Back to States Directory
          </Button>
        </Link>
      </div>
    );
  }

  // Find neighbor states for quick navigation
  const currentIndex = STATES_DATA.findIndex((s) => s.slug === stateData.slug);
  const prevNeighbor = STATES_DATA[(currentIndex - 1 + STATES_DATA.length) % STATES_DATA.length];
  const nextNeighbor = STATES_DATA[(currentIndex + 1) % STATES_DATA.length];

  const faqAccordionItems = stateData.faqs.map((f, i) => ({
    id: `faq-${i}`,
    title: f.question,
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
    content: <p>{f.answer}</p>,
  }));

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'States & Union Territories', href: '/states' },
            { label: stateData.name },
          ]}
          className="mb-6"
        />

        {/* State Hero Banner */}
        <Reveal>
          <div className="relative rounded-cardLg overflow-hidden bg-gradient-to-br from-dark via-[#141838] to-indigo text-white p-6 sm:p-10 mb-8 border border-white/10 shadow-card">
            {/* Ambient Background Gradient Orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                {/* Region & Type Pills */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge
                    variant={stateData.type === 'Union Territory' ? 'gold' : 'primary'}
                    size="sm"
                    className="font-semibold shadow-xs"
                  >
                    {stateData.type}
                  </Badge>
                  <span className="text-xs text-lavender font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    {stateData.region} Region
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Capital: <strong className="text-white">{stateData.capital}</strong>
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-300">
                    {stateData.districtsCount} Districts
                  </span>
                </div>

                {/* State Heading */}
                <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4 tracking-tight leading-tight">
                  {stateData.name}
                </h1>

                {/* Unique Hero Blurb */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mb-6">
                  {stateData.heroBlurb}
                </p>

                {/* Secondary Geographic Fact Pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Population:</span>
                    <strong className="text-white font-semibold tabular-nums">{stateData.population}</strong>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Geographic Area:</span>
                    <strong className="text-white font-semibold tabular-nums">{stateData.area}</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col gap-3">
                <Link to={`/user/report-issue?state=${encodeURIComponent(stateData.name)}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group"
                  >
                    <span>Report an Issue in {stateData.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>50% Escrow Protected</span>
                  <span>•</span>
                  <span>Photo Proof Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Key Stats Bar */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-card bg-white border border-border shadow-subtle mb-10">
            <div className="p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Hazards Remediated</span>
              </div>
              <p className="font-heading font-bold text-ink text-2xl tabular-nums">
                {stateData.stats.resolvedIssues.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% Photo-Proof Sealed</p>
            </div>

            <div className="p-3 border-l-0 sm:border-l border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <Users className="w-4 h-4 text-indigo" />
                <span>Certified Resolvers</span>
              </div>
              <p className="font-heading font-bold text-ink text-2xl tabular-nums">
                {stateData.stats.activeResolvers}
              </p>
              <p className="text-[11px] text-muted mt-0.5">Vetted Ward Contractors</p>
            </div>

            <div className="p-3 border-t sm:border-t-0 lg:border-l border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <Clock className="w-4 h-4 text-gold" />
                <span>Average Response SLA</span>
              </div>
              <p className="font-heading font-bold text-ink text-2xl tabular-nums">
                {stateData.stats.avgResponseHours} Hours
              </p>
              <p className="text-[11px] text-muted mt-0.5">From Quote to On-Site</p>
            </div>

            <div className="p-3 border-t sm:border-t-0 lg:border-l border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Citizen Satisfaction</span>
              </div>
              <p className="font-heading font-bold text-ink text-2xl tabular-nums">
                {stateData.stats.satisfactionRate}%
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Post-Inspection Audits</p>
            </div>
          </div>
        </Reveal>

        {/* Local Civic Priorities Section */}
        <section className="mb-12">
          <Reveal>
            <SectionHeader
              eyebrow="Key Focus Areas"
              eyebrowVariant="violet"
              title={`Civic Priorities in ${stateData.name}`}
              subtitle="Targeted remediation focus areas tailored to regional climate, terrain challenges, and urban congestion profiles."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stateData.civicPriorities.map((priority, idx) => (
              <Reveal key={priority.title} delay={idx * 0.1}>
                <Card
                  variant="base"
                  className="h-full flex flex-col justify-between bg-white border-border hover:border-primary/40 hover:shadow-cardHover transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge
                        variant={
                          priority.urgency === 'Critical'
                            ? 'danger'
                            : priority.urgency === 'High'
                            ? 'warning'
                            : 'secondary'
                        }
                        size="sm"
                        dot
                      >
                        {priority.urgency} Urgency
                      </Badge>
                      <span className="text-[11px] text-muted font-medium bg-canvas px-2 py-0.5 rounded border border-border">
                        {priority.category}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                      {priority.title}
                    </h3>
                    <p className="text-xs text-secondaryText leading-relaxed mb-4">
                      {priority.description}
                    </p>
                  </div>

                  <Link
                    to={`/user/report-issue?state=${encodeURIComponent(stateData.name)}&category=${encodeURIComponent(priority.category)}`}
                    className="inline-flex items-center justify-between w-full pt-3 border-t border-border text-xs font-semibold text-primary hover:text-primary-hover group"
                  >
                    <span>Report {priority.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Recent State Activity Stream */}
        <section className="mb-12">
          <Reveal>
            <SectionHeader
              eyebrow="Verified Stream"
              eyebrowVariant="gold"
              title={`Recent Remediations in ${stateData.name}`}
              subtitle="Live chronological log of verified contractor submissions, municipal approvals, and settled escrow disbursements."
            />
          </Reveal>

          <div className="bg-white rounded-card border border-border overflow-hidden shadow-subtle divide-y divide-border">
            {stateData.recentActivity.map((act) => (
              <div
                key={act.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-canvas/50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-semibold text-sm text-ink">
                        {act.hazard}
                      </span>
                      <span className="text-[11px] font-mono text-muted bg-canvas px-1.5 py-0.2 rounded border border-border">
                        {act.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{act.locality}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                  <span className="font-heading font-semibold text-ink tabular-nums">
                    {act.amount}
                  </span>
                  <Badge variant="success" size="sm">
                    {act.status}
                  </Badge>
                  <span className="text-muted flex items-center gap-1 tabular-nums font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {act.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* State-Specific FAQ Accordion */}
        <section className="mb-14">
          <Reveal>
            <SectionHeader
              eyebrow="Local Governance"
              eyebrowVariant="neutral"
              title={`Frequently Asked Questions for ${stateData.name}`}
              subtitle="Jurisdiction, response SLAs, and contractor vetting standards specific to this state."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <Accordion items={faqAccordionItems} defaultOpenId="faq-0" />
            </div>
          </Reveal>
        </section>

        {/* Regional Navigation Links (Previous & Next States) */}
        <div className="pt-6 border-t border-border flex items-center justify-between text-xs">
          <Link
            to={`/states/${prevNeighbor.slug}`}
            className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: {prevNeighbor.name}</span>
          </Link>

          <Link
            to="/states"
            className="text-muted hover:text-ink font-semibold uppercase tracking-wider"
          >
            All 36 States & UTs
          </Link>

          <Link
            to={`/states/${nextNeighbor.slug}`}
            className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors font-medium"
          >
            <span>Next: {nextNeighbor.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StateDetail;
