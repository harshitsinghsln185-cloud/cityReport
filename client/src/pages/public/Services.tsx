import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Wrench,
  Clock,
  MapPin,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import categoryService, { Category } from '../../services/category.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Reveal from '../../components/ui/Reveal';
import EmptyState from '../../components/ui/EmptyState';
import SEO from '../../components/SEO';

export const Services: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getActiveCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load civic categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const safeCategories = Array.isArray(categories) ? categories : [];

  // Filter tags derived from categories
  const filterTags = useMemo(() => {
    const tags = new Set<string>(['All']);
    safeCategories.forEach((cat) => {
      const name = cat.name.toLowerCase();
      if (name.includes('road') || name.includes('pothole')) tags.add('Roads');
      else if (name.includes('drain') || name.includes('sewer') || name.includes('water')) tags.add('Water & Drainage');
      else if (name.includes('light') || name.includes('electric')) tags.add('Electrical');
      else if (name.includes('waste') || name.includes('garbage')) tags.add('Sanitation');
      else tags.add('General Civic');
    });
    return Array.from(tags);
  }, [safeCategories]);

  const filtered = useMemo(() => {
    return safeCategories.filter((c) => {
      const query = (searchQuery || '').toLowerCase();
      const matchesSearch =
        (c.name || '').toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (selectedTag === 'All') return true;

      const name = c.name.toLowerCase();
      if (selectedTag === 'Roads') return name.includes('road') || name.includes('pothole');
      if (selectedTag === 'Water & Drainage') return name.includes('drain') || name.includes('sewer') || name.includes('water');
      if (selectedTag === 'Electrical') return name.includes('light') || name.includes('electric');
      if (selectedTag === 'Sanitation') return name.includes('waste') || name.includes('garbage');
      return true;
    });
  }, [safeCategories, searchQuery, selectedTag]);

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen">
      <SEO
        title="Civic Services & Schedule of Rates (SOR) Directory"
        description="Transparent civic remediation services and indicative municipal rates for road repair, streetlight maintenance, drainage restoration, and public hazard fixes."
        keywords={[
          'civic services directory',
          'municipal repair rates',
          'pothole fixing cost',
          'drainage restoration',
          'streetlight replacement',
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
                item: 'https://crowdreport.in/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Services',
                item: 'https://crowdreport.in/services',
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Crowd Report Municipal Services Directory',
            provider: {
              '@type': 'Organization',
              name: 'Crowd Report',
              url: 'https://crowdreport.in',
            },
          },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Civic Services Directory' }]} className="mb-6" />

        {/* Section Header */}
        <Reveal>
          <SectionHeader
            eyebrow="Certified Municipal Catalog"
            eyebrowVariant="violet"
            title="Civic Services & Hazard Remediation Directory"
            subtitle="Explore all officially recognized municipal maintenance categories, paise-exact base tariffs, standard response SLAs, and direct reporting portals."
          />
        </Reveal>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white p-5 rounded-card border border-border shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. Pothole, Streetlight, Water Leak, Waste)..."
                className="w-full pl-10 pr-4 py-2.5 bg-canvas/40 border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Stat Counter */}
            <div className="flex items-center gap-2 text-xs text-muted shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Showing <strong>{filtered.length}</strong> certified public categories</span>
            </div>
          </div>

          {/* Quick Tag Pills */}
          {filterTags.length > 1 && (
            <div className="pt-3 border-t border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="text-muted font-medium mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors select-none shrink-0 ${
                    selectedTag === tag
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'bg-canvas text-secondaryText hover:text-ink hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-card bg-white border border-border p-6 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Wrench className="w-8 h-8 text-primary" />}
            title="No matching civic services found"
            description="Try searching with different keywords like road, light, pipe, or water, or select 'All' categories."
            actionButton={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('All');
                }}
              >
                Reset Search Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat, idx) => {
              const baseFeeInr = ((cat.baseFeePaise || 0) / 100).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <Reveal key={cat._id} delay={(idx % 6) * 0.05}>
                  <Card
                    isInteractive
                    variant="base"
                    className="h-full flex flex-col justify-between group hover:border-primary/40 hover:shadow-cardHover transition-all duration-200 bg-white"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-lavender text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <Badge variant="gold" size="sm" className="font-semibold shadow-xs">
                          From ₹{baseFeeInr}
                        </Badge>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading font-semibold text-lg text-ink mb-2 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-secondaryText leading-relaxed mb-4 line-clamp-3">
                        {cat.description ||
                          'Certified municipal hazard remediation with geo-proximity contractor dispatch and photo-proof audit.'}
                      </p>
                    </div>

                    <div>
                      {/* SLA and Radius Meta */}
                      <div className="pt-3.5 border-t border-border grid grid-cols-2 gap-2 text-xs text-muted mb-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="tabular-nums">Within {cat.estimatedResolutionHours || 48}h SLA</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="tabular-nums">{cat.freeRadiusKm || 5} km Free Base</span>
                        </div>
                      </div>

                      {/* Direct Reporting CTA Link */}
                      <Link
                        to={`/user/report-issue?category=${encodeURIComponent(cat._id)}`}
                        className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg bg-canvas group-hover:bg-lavender/60 text-primary text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span>Report This Hazard</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Civic Escrow & Quality Assurance Notice */}
        <Reveal delay={0.2}>
          <div className="mt-14 p-6 sm:p-8 rounded-card bg-gradient-to-r from-dark to-indigo text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h4 className="font-heading font-bold text-lg mb-1.5 text-white">
                Need a Custom Municipal Remediation or Ward Assessment?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If your neighborhood hazard does not fit standard categories, our civic coordination desk will assess the site, classify the trade requirements, and issue an itemized estimate.
              </p>
            </div>
            <Link to="/query" className="shrink-0">
              <Button variant="secondary" size="md">
                Inquire with Civic Desk
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Services;
