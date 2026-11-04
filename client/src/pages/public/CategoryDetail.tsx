import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  AlertTriangle,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import categoryService, { Category, SubCategory } from '../../services/category.service';
import PageHero from '../../components/ui/PageHero';
import Button from '../../components/ui/Button';
import SEO from '../../components/SEO';
import { getCategoryImage, getSubIssueImage } from '../../lib/civicImage';
import { CATEGORY_CONTENT } from '../../data/civicContent';

const PLATFORM_STEPS = [
  {
    step: '1',
    title: 'Report with photo and location',
    desc: 'Submit exact GPS coordinates and photographic evidence of the defect.',
  },
  {
    step: '2',
    title: 'Receive quote and pay 50% advance',
    desc: 'Review transparent municipal rate computation and authorize contractor mobilization.',
  },
  {
    step: '3',
    title: 'Resolver completes the work and uploads photo proof',
    desc: 'Certified local remediation crew clears the issue and uploads timestamped completion photos.',
  },
  {
    step: '4',
    title: 'Pay balance and receive invoice',
    desc: 'Inspect verified photographic resolution, settle remaining balance, and download official receipt.',
  },
];

export const CategoryDetail: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categorySlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);
        const [catData, allData] = await Promise.all([
          categoryService.getCategoryBySlug(categorySlug),
          categoryService.getActiveCategories(),
        ]);

        if (catData) {
          setCategory(catData);
        } else {
          setNotFound(true);
        }

        const sorted = (Array.isArray(allData) ? allData : []).sort(
          (a, b) => (a.order ?? 99) - (b.order ?? 99)
        );
        setAllCategories(sorted);
      } catch (err) {
        console.error('Failed to load category detail:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  // Compute previous and next category navigation links by order
  const { prevCat, nextCat } = useMemo(() => {
    if (!category || allCategories.length === 0) return { prevCat: null, nextCat: null };
    const currentIndex = allCategories.findIndex((c) => c.slug === category.slug);
    if (currentIndex === -1) return { prevCat: null, nextCat: null };

    const prevIndex = (currentIndex - 1 + allCategories.length) % allCategories.length;
    const nextIndex = (currentIndex + 1) % allCategories.length;

    return {
      prevCat: allCategories[prevIndex],
      nextCat: allCategories[nextIndex],
    };
  }, [category, allCategories]);

  if (loading) {
    return (
      <div className="bg-canvas min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-muted">Loading municipal category data...</p>
        </div>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="bg-canvas min-h-screen py-24 px-4">
        <SEO
          title="Category Not Found | Crowd Report"
          description="The requested municipal category could not be located in our civic service registry."
          robots="noindex, nofollow"
        />
        <div className="max-w-xl mx-auto text-center bg-white p-8 sm:p-12 rounded-2xl border border-border shadow-subtle">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink mb-3">
            Category Not Found
          </h1>
          <p className="text-sm text-secondaryText leading-relaxed mb-8">
            The civic category <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{categorySlug}</code> does not exist or may have been renamed in our taxonomy registry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button to="/services" variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Browse All Services
            </Button>
            <Button to="/user/report-issue" variant="outline" size="md">
              Report an Issue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const civicCover = getCategoryImage(category.slug);
  const contentMeta = CATEGORY_CONTENT[category.slug];
  const subCategories: SubCategory[] = category.subCategories || [];
  const isEmergencyCategory = ['electricity-lighting', 'public-safety', 'fire-emergency'].includes(
    category.slug
  );

  const defaultGenericSteps = [
    `Inspect the reported defect and surrounding civic infrastructure at the site coordinates`,
    `Prepare itemized remediation plan and mobilize certified local repair contractors`,
    `Carry out structural or sanitary repairs in accordance with municipal safety guidelines`,
    `Capture timestamped photographic proof confirming complete issue remediation`,
  ];
  const remediationSteps = (contentMeta?.resolutionSteps && contentMeta.resolutionSteps.length > 0)
    ? contentMeta.resolutionSteps
    : defaultGenericSteps;

  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title={`${category.name} Issues & Remediation | Crowd Report`}
        description={category.description || `${category.name} municipal defect reporting and contractor dispatch.`}
        keywords={[
          `${category.name.toLowerCase()} report`,
          'municipal repair',
          'civic issue dispatch',
          'public hazard fix',
          category.slug,
        ]}
      />

      {/* 1. Hero banner with category cover, left-aligned text, no buttons */}
      <PageHero
        backgroundImage={civicCover?.src || ''}
        imageAlt={civicCover?.alt || `${category.name} category cover`}
        focalPoint={
          civicCover?.focalPoint
            ? `${civicCover.focalPoint.x * 100}% ${civicCover.focalPoint.y * 100}%`
            : '50% 50%'
        }
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: category.name },
        ]}
        eyebrow="Category"
        title={category.name}
        description={category.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2. Sub-issue count heading */}
        <div className="mb-6 flex items-baseline justify-between">
          <p className="text-sm font-semibold text-secondaryText">
            {subCategories.length} {subCategories.length === 1 ? 'issue type' : 'issue types'} in this category
          </p>
        </div>

        {/* Sub-issue cards grid (State card style: 4:3 photo on top, bold name below, small arrow, whole card is link) */}
        <div data-testid="sub-issue-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subCategories.map((sub: SubCategory, idx: number) => {
            const subImg = getSubIssueImage(category.slug, sub.slug);
            const reportUrl = `/user/report-issue?category=${encodeURIComponent(category.slug)}&sub=${encodeURIComponent(sub.slug)}`;

            return (
              <Link
                key={sub.slug}
                to={reportUrl}
                data-testid="sub-issue-card"
                className="group block h-full rounded-2xl bg-white border border-border hover:border-accent/80 hover:shadow-cardHover hover:-translate-y-[2px] transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* 4:3 photo container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    {subImg ? (
                      <picture>
                        {subImg.sources.map((source, sIdx) => (
                          <source
                            key={sIdx}
                            type={source.type}
                            srcSet={source.srcSet}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        ))}
                        <img
                          src={subImg.cardSrc}
                          alt={subImg.alt}
                          width={subImg.width}
                          height={subImg.height}
                          loading={idx < 4 ? 'eager' : 'lazy'}
                          fetchPriority={idx < 2 ? 'high' : 'auto'}
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 motion-reduce:transform-none"
                        />
                      </picture>
                    ) : (
                      <div className="w-full h-full bg-navy/90 flex flex-col items-center justify-center p-4 text-center">
                        <Wrench className="w-8 h-8 text-accent mb-2" />
                        <span className="font-heading font-bold text-white text-xs tracking-wider uppercase opacity-85">
                          {sub.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sub-issue name and action arrow below photo */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {sub.name}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. Section "How we resolve {category.name} issues" */}
        <section className="mt-14 rounded-2xl bg-white border border-border p-6 sm:p-10 shadow-subtle">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink mb-6">
            How we resolve {category.name} issues
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left column: Category-specific remediation steps */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                Remediation workflow
              </h3>
              <ol className="space-y-4">
                {remediationSteps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy/10 text-navy font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span className="text-sm text-secondaryText leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right column: 4-step platform process */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                Platform process
              </h3>
              <ol className="space-y-4">
                {PLATFORM_STEPS.map((ps) => (
                  <li key={ps.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-ink font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {ps.step}
                    </span>
                    <div className="text-sm leading-relaxed">
                      <strong className="text-ink font-semibold">{ps.title}</strong>
                      <p className="text-secondaryText text-xs sm:text-sm mt-0.5">{ps.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Emergency Note for electricity-lighting, public-safety, fire-emergency */}
          {isEmergencyCategory && (
            <div className="mt-8 p-4 sm:p-5 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3.5">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="font-bold text-red-900">Life-threatening emergency guidance: </strong>
                For active fire, live fallen electrical wires, structural building collapse, or immediate life-threatening hazards, call <strong>112</strong> (or <strong>101</strong> for Fire Services) immediately before submitting a report.
              </div>
            </div>
          )}
        </section>

        {/* 4. Report an issue button & account note */}
        <div className="mt-10 text-center">
          <Button
            to={`/user/report-issue?category=${encodeURIComponent(category.slug)}`}
            variant="accent"
            size="lg"
            className="px-8 py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Report an issue in {category.name}
          </Button>
          <p className="text-xs text-muted mt-2.5">
            You need an account to report an issue. It takes a minute.
          </p>
        </div>

        {/* 5. Previous & Next category navigation links */}
        <div className="mt-14 pt-8 border-t border-border flex items-center justify-between text-xs sm:text-sm font-semibold text-ink">
          {prevCat ? (
            <Link
              to={`/services/${prevCat.slug}`}
              className="inline-flex items-center gap-2 text-secondaryText hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prevCat.name}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextCat && (
            <Link
              to={`/services/${nextCat.slug}`}
              className="inline-flex items-center gap-2 text-secondaryText hover:text-primary transition-colors ml-auto"
            >
              <span>Next: {nextCat.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
