import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Wrench,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import categoryService, { Category } from '../../services/category.service';
import ServiceCard from '../../components/public/ServiceCard';
import Button from '../../components/ui/Button';
import PageHero from '../../components/ui/PageHero';
import Reveal from '../../components/ui/Reveal';
import EmptyState from '../../components/ui/EmptyState';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import servicesHeroImg from '../../assets/pages/services.png';
import { HERO_FOCAL } from '../../config/heroFocal';

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
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => (a.order ?? 99) - (b.order ?? 99)
        );
        setCategories(sorted);
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

  // Group tags for filtering
  const filterTags = [
    'All',
    'Transport & Roads',
    'Water & Sanitation',
    'Power & Safety',
    'Greenery & Environment',
  ];

  const matchesTag = (category: Category, tag: string) => {
    if (tag === 'All') return true;
    const slug = category.slug || '';
    if (tag === 'Transport & Roads') {
      return ['roads-transportation', 'public-transport', 'encroachment'].includes(slug);
    }
    if (tag === 'Water & Sanitation') {
      return ['water-drainage', 'garbage-management', 'public-health'].includes(slug);
    }
    if (tag === 'Power & Safety') {
      return ['electricity-lighting', 'public-safety', 'fire-emergency', 'public-property'].includes(slug);
    }
    if (tag === 'Greenery & Environment') {
      return ['environment', 'parks-greenery', 'animal-welfare', 'urban-planning', 'commercial-areas', 'public-amenities'].includes(slug);
    }
    return true;
  };

  const searchResults = useMemo(() => {
    const query = (searchQuery || '').trim().toLowerCase();

    return safeCategories
      .map((cat) => {
        const matchesCategoryName = (cat.name || '').toLowerCase().includes(query);
        const matchesDescription = (cat.description || '').toLowerCase().includes(query);
        const isMatch = !query || matchesCategoryName || matchesDescription;
        const passesTag = matchesTag(cat, selectedTag);

        return {
          category: cat,
          visible: isMatch && passesTag,
        };
      })
      .filter((item) => item.visible);
  }, [safeCategories, searchQuery, selectedTag]);

  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title="Civic Services & Municipal Category Directory | Crowd Report"
        description="Comprehensive directory of the 16 core municipal infrastructure categories across roads, sanitation, electricity, water, and public health."
        keywords={[
          'civic services directory',
          'municipal repair categories',
          'pothole fixing',
          'drainage restoration',
          'streetlight maintenance',
          'public works catalog',
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
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Crowd Report Municipal Services Directory',
            provider: {
              '@type': 'Organization',
              name: 'Crowd Report',
              url: SITE_URL,
              logo: `${SITE_URL}/icon-512.png`,
            },
          },
        ]}
      />

      {/* Left-Text Image Page Hero */}
      <PageHero
        backgroundImage={servicesHeroImg}
        imageAlt="Municipal public works technicians and road repair machinery"
        focalPoint={HERO_FOCAL.services}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services Directory' }]}
        eyebrow="Municipal Services"
        title="Civic Infrastructure Category Directory"
        description="Explore the 16 municipal service categories to report neighborhood defects or request certified civic remedial work."
        primaryAction={
          <Button to="/user/report-issue" variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Report an Issue
          </Button>
        }
        secondaryAction={
          <Button to="/track" variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
            Track Existing Ticket
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
                placeholder="Search municipal categories (e.g. Roads, Water, Electricity, Sanitation)..."
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
              <span>
                Showing <strong>{searchResults.length}</strong> of <strong>{safeCategories.length}</strong> categories
              </span>
            </div>
          </div>

          {/* Tag Pills */}
          <div className="w-full min-w-0 pt-3 border-t border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
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
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-card bg-white border border-border p-6 animate-pulse" />
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <EmptyState
            icon={<Wrench className="w-8 h-8 text-primary" />}
            title="No matching civic categories found"
            description="Try searching with different terms such as road, drainage, tree, waste, or light, or reset your filters."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(({ category }, idx) => (
              <Reveal key={category._id || category.slug} delay={(idx % 8) * 0.04}>
                <ServiceCard
                  category={category}
                  index={idx}
                />
              </Reveal>
            ))}
          </div>
        )}

        {/* Custom Ward Remediation Inquiries */}
        <Reveal delay={0.2}>
          <div className="mt-14 p-6 sm:p-8 rounded-card bg-navy text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h4 className="font-heading font-extrabold text-lg sm:text-xl mb-1.5 text-white tracking-tight leading-[1.15]">
                Need a Custom Municipal Remediation or Ward Assessment?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If your neighborhood hazard does not fit standard categories, our civic coordination desk will assess the site, classify the trade requirements, and issue an itemized estimate.
              </p>
            </div>
            <Button to="/query" variant="primary" size="md" className="shrink-0">
              Inquire with Civic Desk
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Services;
