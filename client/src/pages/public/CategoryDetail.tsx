import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  AlertTriangle,
  ArrowLeft,
  Wrench,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import categoryService, { Category, SubCategory } from '../../services/category.service';
import PageHero from '../../components/ui/PageHero';
import Button from '../../components/ui/Button';
import Reveal from '../../components/ui/Reveal';
import EmptyState from '../../components/ui/EmptyState';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import { getCategoryImage, getSubIssueImage } from '../../lib/civicImage';
import { CATEGORY_CONTENT, CIVIC_CONTENT } from '../../data/civicContent';

export const CategoryDetail: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subSearchQuery, setSubSearchQuery] = useState<string>('');
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

  // Compute previous and next category navigation links
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

  // Filter sub-issues if searching
  const filteredSubCategories = useMemo(() => {
    const subs = category?.subCategories || [];
    if (!subSearchQuery.trim()) return subs;
    const q = subSearchQuery.trim().toLowerCase();
    return subs.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.slug || '').toLowerCase().includes(q)
    );
  }, [category, subSearchQuery]);

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
        <div className="max-w-xl mx-auto text-center bg-white p-8 sm:p-12 rounded-card border border-border shadow-subtle">
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
  const isEmergencyCategory = ['public-safety', 'fire-emergency', 'electricity-lighting'].includes(
    category.slug
  );

  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title={`${category.name} Civic Issues Directory & Municipal Remediation | Crowd Report`}
        description={category.description || `${category.name} municipal defect reporting and contractor dispatch.`}
        keywords={[
          `${category.name.toLowerCase()} report`,
          'municipal repair',
          'civic issue dispatch',
          'public hazard fix',
          category.slug,
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
                name: 'Services',
                item: `${SITE_URL}/services`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: `${SITE_URL}/services/${category.slug}`,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${category.name} Municipal Remediation`,
            description: category.description,
            provider: {
              '@type': 'Organization',
              name: 'Crowd Report',
              url: SITE_URL,
            },
          },
        ]}
      />

      {/* Hero with Category Cover as Background */}
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
        eyebrow="Municipal Category"
        title={category.name}
        description={category.description || 'Certified municipal remediation with geo-proximity contractor dispatch and verified photo proof.'}
        primaryAction={
          <Button
            to={`/user/report-issue?category=${encodeURIComponent(category.slug)}`}
            variant="accent"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Report an issue
          </Button>
        }
        secondaryAction={
          <Button
            to="/services"
            variant="outline"
            size="md"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white"
          >
            All services
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Intro Section */}
        <div className="bg-white p-6 sm:p-8 rounded-card border border-border shadow-subtle mb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>Category Scope & Responsibility</span>
          </div>

          <p className="text-sm sm:text-base text-ink leading-relaxed font-normal">
            {contentMeta?.introParagraph || category.description}
          </p>

          <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
            <p>
              <strong>Administrative Note:</strong>{' '}
              {contentMeta?.responsibleAgencyNote || 'The responsible municipal corporation, utility provider, or development authority can differ by city.'}
            </p>
            <span className="shrink-0 bg-slate-100 px-3 py-1 rounded-full text-ink font-semibold">
              {category.subCategories?.length || 0} Issue Types Registered
            </span>
          </div>
        </div>

        {/* Emergency Alert Banner if applicable */}
        {isEmergencyCategory && (
          <div className="mb-8 p-4 sm:p-5 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold text-red-900">Life-Threatening Emergency Guidance: </strong>
              If this incident involves live electrical sparking, fallen wires, building collapse risk, or an active fire hazard where lives are in danger, please dial <strong>112</strong> (or <strong>101</strong> for Fire Services) immediately before submitting a report ticket.
            </div>
          </div>
        )}

        {/* Header & Sub-Category Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">
              Sub-Issues in {category.name}
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              Select any sub-issue below to initiate an itemized municipal report with pre-filled classification.
            </p>
          </div>

          {/* Search box if more than 12 sub-issues */}
          {(category.subCategories?.length || 0) > 12 && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subSearchQuery}
                onChange={(e) => setSubSearchQuery(e.target.value)}
                placeholder="Filter sub-issues..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-border rounded-lg text-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Sub-Issues Grid */}
        {filteredSubCategories.length === 0 ? (
          <EmptyState
            icon={<Wrench className="w-8 h-8 text-primary" />}
            title="No matching sub-issues"
            description={`No sub-issues matching "${subSearchQuery}" found in this category.`}
            actionButton={
              <Button variant="outline" size="sm" onClick={() => setSubSearchQuery('')}>
                Clear Filter
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubCategories.map((sub: SubCategory, idx: number) => {
              const subImg = getSubIssueImage(category.slug, sub.slug);
              const subMeta = CIVIC_CONTENT[`${category.slug}/${sub.slug}`];
              const priority = sub.defaultPriority || 'Medium';

              const priorityClasses: Record<string, string> = {
                Critical: 'bg-red-50 text-red-700 border-red-200',
                High: 'bg-amber-50 text-amber-800 border-amber-200',
                Medium: 'bg-blue-50 text-blue-800 border-blue-200',
                Low: 'bg-slate-100 text-slate-700 border-slate-200',
              };

              return (
                <Reveal key={sub.slug} delay={(idx % 8) * 0.04}>
                  <div className="group h-full rounded-2xl bg-white border border-border hover:border-accent/80 hover:shadow-cardHover hover:-translate-y-[3px] transition-all duration-300 motion-reduce:transform-none overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Top Image (4:3) */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                        {subImg ? (
                          <picture>
                            {subImg.sources.map((source, sIdx) => (
                              <source key={sIdx} type={source.type} srcSet={source.srcSet} />
                            ))}
                            <img
                              src={subImg.cardSrc}
                              alt={subImg.alt}
                              width={subImg.width}
                              height={subImg.height}
                              loading={idx < 4 ? 'eager' : 'lazy'}
                              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 motion-reduce:transform-none"
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

                        {/* Priority Badge on Top-Right */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                              priorityClasses[priority] || priorityClasses.Medium
                            }`}
                          >
                            {priority}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5">
                        <h3 className="font-heading font-bold text-sm sm:text-base text-ink mb-1.5 group-hover:text-primary transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-secondaryText leading-relaxed line-clamp-2">
                          {subMeta?.description || `${sub.name} reported in public areas requiring municipal inspection.`}
                        </p>
                      </div>
                    </div>

                    {/* Report Link */}
                    <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-border/60 flex items-center justify-between mt-auto">
                      <span className="text-[11px] font-mono text-muted">
                        #{sub.slug}
                      </span>
                      <Link
                        to={`/user/report-issue?category=${encodeURIComponent(category.slug)}&sub=${encodeURIComponent(sub.slug)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-accent transition-colors"
                      >
                        <span>Report this</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Bottom Call to Action */}
        <Reveal delay={0.2}>
          <div className="mt-14 p-6 sm:p-10 rounded-card bg-navy text-white text-center space-y-4">
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              Ready to report an issue in {category.name}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Submit your report with exact geo-coordinates and photographic evidence. Our system estimates indicative rates and dispatches verified local remediation contractors.
            </p>
            <div className="pt-2">
              <Button
                to={`/user/report-issue?category=${encodeURIComponent(category.slug)}`}
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Report an issue in {category.name}
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              You need an account to report an issue. It takes a minute.
            </p>
          </div>
        </Reveal>

        {/* Category Navigation Links (Prev / Next) */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs sm:text-sm font-semibold text-ink">
          {prevCat ? (
            <Link
              to={`/services/${prevCat.slug}`}
              className="inline-flex items-center gap-2 hover:text-primary transition-colors"
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
              className="inline-flex items-center gap-2 hover:text-primary transition-colors ml-auto"
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
