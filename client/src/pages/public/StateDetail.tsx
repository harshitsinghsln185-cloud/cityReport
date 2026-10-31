import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  FileCheck2,
  Lock,
  ChevronRight,
  Building2,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { getStateBySlug, STATES_DATA } from '../../data/statesData';
import { getStateLandmark } from '../../data/landmarks';
import { getStateBanner } from '../../lib/stateBanner';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Accordion from '../../components/ui/Accordion';
import SectionHeader from '../../components/ui/SectionHeader';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { BeforeAfterSlider } from '../../components/public/BeforeAfterSlider';
import { SITE_URL } from '../../config/site';

interface NavSection {
  id: string;
  label: string;
}

const NAV_SECTIONS: NavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'priorities', label: 'Wards & Priorities' },
  { id: 'resolvers', label: 'Local Contractors' },
  { id: 'showcase', label: 'Before/After Showcase' },
  { id: 'faqs', label: 'State FAQs' },
];

export const StateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const stateData = useMemo(() => {
    if (!slug) return undefined;
    return getStateBySlug(slug);
  }, [slug]);

  const landmarkInfo = useMemo(() => {
    return slug ? getStateLandmark(slug) : null;
  }, [slug]);

  const banner = useMemo(() => {
    return slug ? getStateBanner(slug) : null;
  }, [slug]);

  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener for reading progress and section spy
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }

      // Check active section
      const sectionElements = NAV_SECTIONS.map((sec) => document.getElementById(sec.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!stateData || !landmarkInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-canvas">
        <SEO title="State Not Found" robots="noindex, nofollow" />
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-ink mb-2">
          State or Territory Not Found
        </h1>
        <p className="text-sm text-secondaryText max-w-md mb-6 leading-relaxed">
          The requested regional slug does not match any of the 36 monitored Indian states or union territories in our database.
        </p>
        <Button to="/states" variant="navy" leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Back to States Directory
          </Button>
      </div>
    );
  }

  // Zone-filtered neighbor navigation within the same geographic zone
  const zoneStates = useMemo(() => {
    return STATES_DATA.filter((s) => s.region === stateData.region);
  }, [stateData.region]);

  const zoneCurrentIndex = zoneStates.findIndex((s) => s.slug === stateData.slug);
  const zonePrev = zoneStates[(zoneCurrentIndex - 1 + zoneStates.length) % zoneStates.length];
  const zoneNext = zoneStates[(zoneCurrentIndex + 1) % zoneStates.length];

  const faqAccordionItems = stateData.faqs.map((f, i) => ({
    id: `faq-${i}`,
    title: f.question,
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
    content: <p className="text-secondaryText leading-relaxed">{f.answer}</p>,
  }));

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title={`${stateData.name} Civic Infrastructure & Hazard Reporting`}
        description={`Track verified civic hazard resolutions, local contractor dispatch, and public works in ${stateData.name}. Landmark: ${landmarkInfo.landmark}. ${stateData.heroBlurb}`}
        keywords={[
          `${stateData.name} civic issues`,
          `${stateData.name} road repairs`,
          `${stateData.name} municipality`,
          `${stateData.capital} civic portal`,
          `${stateData.name} contractor dispatch`,
          landmarkInfo.landmark,
        ]}
        canonical={`${SITE_URL}/states/${stateData.slug}`}
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
                name: 'States & Union Territories',
                item: `${SITE_URL}/states`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: stateData.name,
                item: `${SITE_URL}/states/${stateData.slug}`,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'GovernmentService',
            name: `${stateData.name} Civic Repair Service`,
            serviceType: 'Civic Hazard Reporting & Verified Contractor Dispatch',
            areaServed: {
              '@type': 'AdministrativeArea',
              name: stateData.name,
            },
            provider: {
              '@type': 'Organization',
              name: 'Crowd Report',
              url: SITE_URL,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: stateData.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]}
      />

      {/* Cinematic Landmark Visual Hero Banner */}
      <section className="relative overflow-hidden bg-navy text-white min-h-[560px] md:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between border-b border-navy-muted">
        {/* Background Banner with AVIF / WebP picture or graceful fallback */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          {banner ? (
            <picture className="w-full h-full block">
              {banner.sources.map((src) => (
                <source key={src.type} type={src.type} srcSet={src.srcSet} sizes="100vw" />
              ))}
              <img
                src={banner.src}
                alt={landmarkInfo.bannerAlt || landmarkInfo.landmark}
                width={banner.width}
                height={banner.height}
                // @ts-expect-error - fetchpriority is supported in modern browsers
                fetchpriority="high"
                decoding="async"
                className="w-full h-full object-cover object-right md:object-center transform md:scale-100 md:hover:scale-[1.03] transition-transform duration-1000 ease-out motion-reduce:transform-none"
              />
            </picture>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy via-[#11244E] to-[#1e3a8a] relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF8F3_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}

          {/* Left-focused Navy Scrim Overlay (Calm left 40% for text, open right for landmark) */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/95 md:bg-gradient-to-r md:from-navy md:via-navy/85 md:to-transparent md:w-[68%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full flex-1 flex flex-col justify-between">
          <div>
            {/* Breadcrumb Navigation */}
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'States', href: '/states' },
                { label: stateData.name },
              ]}
              className="mb-5 text-slate-300"
            />

            <div className="max-w-3xl">
              {/* Type and Region Chips */}
              <div className="flex items-center gap-2 flex-wrap mb-3.5">
                <Badge
                  variant={stateData.type === 'Union Territory' ? 'gold' : 'navy'}
                  size="sm"
                  className="font-semibold shadow-xs"
                >
                  {stateData.type}
                </Badge>
                <span className="text-xs text-lavender font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  {stateData.region} Zone
                </span>
              </div>

              {/* State Name Heading with Balanced Dual-Color */}
              <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-[1.14] mb-3 text-white">
                <span className="block">{stateData.name}</span>
                <span className="block bg-gradient-to-r from-accent via-[#F2D399] to-white bg-clip-text text-transparent text-2xl sm:text-4xl mt-1">
                  Civic Infrastructure & Resolution
                </span>
              </h1>

              {/* Capital City Line with MapPin Icon */}
              <p className="text-sm sm:text-base text-amber-200 font-medium flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>Capital: <strong className="text-white font-semibold">{stateData.capital}</strong></span>
              </p>

              {/* Hero Blurb Description */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-xl text-balance mb-4">
                {stateData.heroBlurb}
              </p>

              {/* Famous Places 2x2 Grid (2 in one row, 2 in next row) */}
              {landmarkInfo.places && landmarkInfo.places.length > 0 && (
                <div className="mb-6">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Famous Heritage & Regional Places:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                    {landmarkInfo.places.slice(0, 4).map((place) => (
                      <span
                        key={place.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 text-xs text-slate-100 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-gold shrink-0" />
                        <span className="font-medium truncate">{place.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">({place.kind})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary and Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <Button
                  to={`/user/report-issue?state=${encodeURIComponent(stateData.name)}`}
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-gold/20 flex items-center justify-center gap-2 group font-semibold"
                >
                  <span>Report an issue in {stateData.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  to="/register-resolver"
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10"
                >
                  Apply as Ward Contractor
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Landmark Caption Chip */}
        <div className="absolute bottom-10 right-4 sm:bottom-14 sm:right-8 z-20 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/85 hover:bg-navy backdrop-blur-md border border-white/20 text-xs text-white shadow-lg transition-colors">
            <Camera className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="font-medium tracking-wide">{landmarkInfo.landmark}</span>
          </div>
        </div>
      </section>

      {/* Floating Overlapping 4-Metric Card (Half on Hero, Half Below, Styled in Translucent Yellow/Gold) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-11 mb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-accent/30 hover:bg-accent/35 backdrop-blur-xl border border-accent/50 shadow-xl shadow-navy/20 transition-all">
          {/* Capital */}
          <div className="p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <Building2 className="w-3.5 h-3.5 text-navy shrink-0" />
              <span>Capital</span>
            </div>
            <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl truncate">
              {stateData.capital}
            </p>
            <p className="text-[10px] text-navy/75 font-semibold">Headquarters</p>
          </div>

          {/* Districts */}
          <div className="p-2 sm:p-2.5 border-l-0 sm:border-l border-navy/20">
            <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
              <span>Districts</span>
            </div>
            <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums">
              {stateData.districtsCount}
            </p>
            <p className="text-[10px] text-navy/75 font-semibold">Collectorates</p>
          </div>

          {/* Population */}
          <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
            <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <Users className="w-3.5 h-3.5 text-navy shrink-0" />
              <span>Population</span>
            </div>
            <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums">
              {stateData.population}
            </p>
            <p className="text-[10px] text-navy/75 font-semibold">Census Estimate</p>
          </div>

          {/* Area */}
          <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
            <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-navy shrink-0" />
              <span>Area</span>
            </div>
            <p className="font-heading font-extrabold tracking-tight text-navy text-lg sm:text-xl tabular-nums">
              {stateData.area}
            </p>
            <p className="text-[10px] text-navy/75 font-semibold">State Territory</p>
          </div>
        </div>
      </div>

      {/* Sticky In-Page Navigation Bar with Reading Progress */}
      <nav aria-label="Page Sections Navigation" className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        {/* Scroll Progress Bar */}
        <div className="h-0.5 bg-canvas w-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {NAV_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollTo(sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-navy text-gold shadow-xs'
                        : 'text-secondaryText hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0 text-xs">
              <Link
                to={`/user/report-issue?state=${encodeURIComponent(stateData.name)}`}
                className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1"
              >
                <span>Report Defect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Section 1: Overview & Regional Brief */}
        <section id="overview" className="scroll-mt-36">
          {/* Regional Geographic & Municipal Brief */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-card bg-surface border border-border shadow-subtle">
              <h2 className="font-heading font-bold text-xl text-ink mb-3">
                Civic Infrastructure Profile: {stateData.name}
              </h2>
              <p className="text-sm text-secondaryText leading-relaxed mb-4">
                Operating across {stateData.districtsCount} administrative districts from headquarters in {stateData.capital}, Crowd Report coordinates public works repair in {stateData.name}. Our contractor network enables wards to resolve road potholes, streetlighting blackouts, garbage backlogs, and water pipe fractures with verified photographic provenance and milestone payments.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border">
                <div className="p-3 rounded-lg bg-canvas">
                  <span className="text-xs text-muted block">Regional Capital</span>
                  <strong className="text-sm text-ink font-semibold">{stateData.capital}</strong>
                </div>
                <div className="p-3 rounded-lg bg-canvas">
                  <span className="text-xs text-muted block">Zonal Classification</span>
                  <strong className="text-sm text-ink font-semibold">{stateData.region} India</strong>
                </div>
                <div className="p-3 rounded-lg bg-canvas col-span-2 sm:col-span-1">
                  <span className="text-xs text-muted block">Districts Monitored</span>
                  <strong className="text-sm text-ink font-semibold">{stateData.districtsCount} Districts</strong>
                </div>
              </div>
            </div>

            {/* Landmark Showcase Card */}
            <div className="p-6 rounded-card bg-surface border border-border shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Featured State Landmark</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-ink mb-2">
                  {landmarkInfo.landmark}
                </h3>
                <p className="text-xs text-secondaryText leading-relaxed mb-4">
                  Symbolic architectural and natural heritage anchor representing {stateData.name}&apos;s civic identity and historical public works traditions.
                </p>
              </div>

              <div className="aspect-[16/10] rounded-lg overflow-hidden border border-border bg-navy">
                <img
                  src={banner?.cardSrc || banner?.src || landmarkInfo.bannerUrl}
                  alt={landmarkInfo.bannerAlt || landmarkInfo.landmark}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Civic Priorities */}
        <section id="priorities" className="scroll-mt-36">
          <Reveal>
            <SectionHeader
              eyebrow="Key Focus Areas"
              eyebrowVariant="violet"
              title={`Civic Priorities in ${stateData.name}`}
              subtitle="Targeted repair focus areas tailored to regional climate, terrain challenges, and urban congestion profiles."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stateData.civicPriorities.map((priority, idx) => (
              <Reveal key={priority.title} delay={idx * 0.1}>
                <Card
                  variant="base"
                  className="h-full flex flex-col justify-between bg-surface border-border hover:border-primary/40 hover:shadow-cardHover transition-all duration-200"
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
                      <span className="text-xs text-muted font-medium bg-canvas px-2 py-0.5 rounded border border-border">
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
                    <span>Report {priority.category} Hazard</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Section 3: Resolver Network */}
        <section id="resolvers" className="scroll-mt-36">
          <Reveal>
            <SectionHeader
              eyebrow="Contractor Mesh"
              eyebrowVariant="gold"
              title={`Approved Municipal Resolvers in ${stateData.name}`}
              subtitle="Local contractor accreditation, valid license verification, and milestone payment protections."
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-card bg-surface border border-border shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-ink">
                Verified Trade Accreditation
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                Every active resolver in {stateData.name} must submit proof of valid trade licenses, GSTIN compliance, and past repair experience.
              </p>
              <div className="pt-2 text-xs font-semibold text-primary">
                ✓ Document & Identity Verified
              </div>
            </div>

            <div className="p-6 rounded-card bg-surface border border-border shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-ink">
                50% Advance & Balance Milestone
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                50% advance payment initiates repair work with the assigned resolver; the remaining 50% balance is payable only after photo inspection confirms satisfactory completion.
              </p>
              <div className="pt-2 text-xs font-semibold text-primary">
                ✓ Itemized GST Invoices
              </div>
            </div>

            <div className="p-6 rounded-card bg-navy text-white shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">Join Network</span>
                <h3 className="font-heading font-bold text-lg text-white mt-1 mb-2">
                  Are You a Contractor in {stateData.name}?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get certified to receive local ward repair assignments with upfront itemized fee estimates.
                </p>
              </div>

              <Button to="/register-resolver" variant="gold" size="md" className="w-full flex items-center justify-center gap-2 font-semibold">
                  <span>Register as Resolver</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </section>

        {/* Section 4: Before/After Showcase */}
        <section id="showcase" className="scroll-mt-36">
          <Reveal>
            <SectionHeader
              eyebrow="Verified Provenance"
              eyebrowVariant="gold"
              title={`Verified Repair Showcase in ${stateData.name}`}
              subtitle={`Every civic work completed across ${stateData.name} requires photographic Before and After proof with GPS coordinates before final sign-off and balance payout.`}
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface p-6 sm:p-8 rounded-card border border-border shadow-subtle">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="navy" size="sm">
                {stateData.region} Zone Proof
              </Badge>
              <h3 className="font-heading font-bold text-xl text-ink">
                Photographic Evidence Before Final Balance Release
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                Civic repairs conducted in {stateData.name} follow our two-stage inspection protocol. Citizens and admins verify photographic alignment with exact GPS coordinates before the remaining 50% contractor payout is approved.
              </p>
              <div className="space-y-2 pt-2 text-xs text-secondaryText">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Geotagged timestamp matching initial hazard ticket</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Photo verification sign-off prior to balance payout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Permanent public audit trail</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <BeforeAfterSlider />
            </div>
          </div>
        </section>

        {/* Section 5: State-Specific FAQ Accordion */}
        <section id="faqs" className="scroll-mt-36">
          <Reveal>
            <SectionHeader
              eyebrow="Local Governance"
              eyebrowVariant="neutral"
              title={`Frequently Asked Questions for ${stateData.name}`}
              subtitle="Jurisdiction, response SLAs, and contractor vetting standards specific to this state."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-4xl mr-auto">
              <Accordion items={faqAccordionItems} defaultOpenId="faq-0" />
            </div>
          </Reveal>
        </section>

        {/* Regional Navigation Links (Within Same Geographic Zone) */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link
            to={`/states/${zonePrev.slug}`}
            className="flex items-center gap-2 text-secondaryText hover:text-primary transition-colors font-medium p-2 rounded-lg hover:bg-canvas"
          >
            <ChevronLeft className="w-4 h-4 text-primary" />
            <div className="text-left">
              <span className="block text-xs text-muted uppercase tracking-wider font-semibold">Prev in {stateData.region} Zone</span>
              <span className="font-semibold text-ink">{zonePrev.name}</span>
            </div>
          </Link>

          <Link
            to={`/states?zone=${stateData.region}`}
            className="px-4 py-2 rounded-full bg-canvas text-secondaryText hover:text-ink font-semibold uppercase tracking-wider text-xs border border-border hover:border-primary/30 transition-colors"
          >
            All {zoneStates.length} {stateData.region} States
          </Link>

          <Link
            to={`/states/${zoneNext.slug}`}
            className="flex items-center gap-2 text-secondaryText hover:text-primary transition-colors font-medium p-2 rounded-lg hover:bg-canvas"
          >
            <div className="text-right">
              <span className="block text-xs text-muted uppercase tracking-wider font-semibold">Next in {stateData.region} Zone</span>
              <span className="font-semibold text-ink">{zoneNext.name}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StateDetail;
