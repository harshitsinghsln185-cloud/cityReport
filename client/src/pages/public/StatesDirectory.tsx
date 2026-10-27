import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { STATES_DATA, RegionType, StateType } from '../../data/statesData';
import SectionHeader from '../../components/ui/SectionHeader';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';

export const StatesDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'All' | RegionType>('All');
  const [selectedType, setSelectedType] = useState<'All' | StateType>('All');
  const [sortBy, setSortBy] = useState<'name' | 'resolved' | 'resolvers'>('name');

  const regions: ('All' | RegionType)[] = [
    'All',
    'North',
    'South',
    'East',
    'West',
    'Central',
    'Northeast',
  ];

  const types: ('All' | StateType)[] = ['All', 'State', 'Union Territory'];

  const filteredStates = useMemo(() => {
    return STATES_DATA.filter((state) => {
      const matchesSearch =
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || state.region === selectedRegion;
      const matchesType = selectedType === 'All' || state.type === selectedType;
      return matchesSearch && matchesRegion && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'resolved') {
        return b.stats.resolvedIssues - a.stats.resolvedIssues;
      }
      if (sortBy === 'resolvers') {
        return b.stats.activeResolvers - a.stats.activeResolvers;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedRegion, selectedType, sortBy]);

  // Aggregate stats across filtered dataset
  const totalResolved = useMemo(
    () => filteredStates.reduce((acc, curr) => acc + curr.stats.resolvedIssues, 0),
    [filteredStates]
  );
  const totalResolvers = useMemo(
    () => filteredStates.reduce((acc, curr) => acc + curr.stats.activeResolvers, 0),
    [filteredStates]
  );

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title="Indian States & Union Territories Civic Directory"
        description="Explore civic resolution metrics, verified municipal contractor coverage, and infrastructure priorities across all 36 Indian states and union territories."
        keywords={[
          'Indian states civic directory',
          'municipal coverage India',
          'state civic infrastructure',
          'resolver network India',
          'local government works',
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
                name: 'States & Union Territories',
                item: `${SITE_URL}/states`,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Indian States & Union Territories Civic Directory',
            description:
              'Browse civic hazard resolution metrics and active municipal resolver networks across 36 Indian states and UTs.',
            url: `${SITE_URL}/states`,
          },
        ]}
      />

      {/* Institutional Split Page Hero */}
      <PageHero
        variant="split"
        theme="navy"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'States & Union Territories' }]}
        eyebrow="Nationwide Civic Infrastructure"
        eyebrowIcon={<MapPin className="w-3.5 h-3.5" />}
        title="Monitor Municipal Health Across 36 Indian Regions"
        description="Access certified resolver networks, localized civic priorities, and audited photographic proof in all 28 states and 8 union territories under standardized Schedule of Rates (SOR)."
        primaryAction={
          <a href="#directory-filters">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Filter by Zone
            </Button>
          </a>
        }
        secondaryAction={
          <Link to="/user/report-issue">
            <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
              Report Local Defect
            </Button>
          </Link>
        }
        visual={
          <div className="w-full max-w-sm rounded-[20px] bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Pan-India Jurisdiction</span>
              <Badge variant="gold" size="sm">36 Total</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold font-heading text-white">28</div>
                <div className="text-[11px] text-slate-300 font-medium">Sovereign States</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold font-heading text-white">8</div>
                <div className="text-[11px] text-slate-300 font-medium">Union Territories</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every jurisdiction operates under the verified 50% milestone escrow protocol and GPS-stamped photo verification standard.
            </p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="directory-filters">

        {/* Quick Highlights Bar */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-card bg-white border border-border shadow-subtle mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Monitored</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {filteredStates.length} / 36 Regions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Hazards Remediated</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {totalResolved.toLocaleString('en-IN')}+
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Active Resolvers</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {totalResolvers.toLocaleString('en-IN')} Certified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Response Guarantee</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  24-48h SLA
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Filters and Search Bar */}
        <div className="bg-white p-5 rounded-card border border-border shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state name or capital (e.g. Bengaluru, Assam, Delhi)..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-canvas/40"
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <label htmlFor="sort-states" className="text-xs text-muted flex items-center gap-1 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-states"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-white text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                <option value="name">Alphabetical (A - Z)</option>
                <option value="resolved">Most Hazards Resolved</option>
                <option value="resolvers">Most Active Resolvers</option>
              </select>
            </div>
          </div>

          {/* Region & Type Filter Tabs */}
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Region Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-muted font-medium mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Region:</span>
              </span>
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors select-none shrink-0 ${
                    selectedRegion === region
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-canvas text-secondaryText hover:text-ink hover:bg-slate-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Type Tabs */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-muted font-medium mr-1">Type:</span>
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors select-none ${
                    selectedType === t
                      ? 'bg-indigo text-white font-semibold'
                      : 'bg-canvas text-secondaryText hover:text-ink hover:bg-slate-200'
                  }`}
                >
                  {t === 'All' ? 'All Types' : t === 'State' ? 'States' : 'UTs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredStates.length === 0 ? (
          <EmptyState
            title="No states or territories match your criteria"
            description="Try clearing your search keyword or selecting 'All' regions to view the full directory."
            actionButton={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                  setSelectedType('All');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStates.map((state, idx) => (
              <Reveal key={state.slug} delay={(idx % 6) * 0.05}>
                <Link to={`/states/${state.slug}`} className="block h-full group">
                  <Card
                    isInteractive
                    variant="base"
                    className="h-full flex flex-col justify-between group-hover:border-primary/40 group-hover:shadow-cardHover transition-all duration-200 bg-white"
                  >
                    <div>
                      {/* Card Header with Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={state.type === 'Union Territory' ? 'gold' : 'secondary'}
                            size="sm"
                          >
                            {state.type}
                          </Badge>
                          <span className="text-[11px] text-muted font-medium bg-canvas px-2 py-0.5 rounded border border-border">
                            {state.region} Region
                          </span>
                        </div>
                        <span className="text-xs text-muted tabular-nums font-medium">
                          {state.districtsCount} Districts
                        </span>
                      </div>

                      {/* State Title & Capital */}
                      <h3 className="font-heading font-semibold text-xl text-ink group-hover:text-primary transition-colors mb-1">
                        {state.name}
                      </h3>
                      <p className="text-xs text-muted flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Capital: <strong className="text-secondaryText font-medium">{state.capital}</strong></span>
                      </p>

                      {/* Short Blurb */}
                      <p className="text-xs text-secondaryText leading-relaxed mb-4 line-clamp-2">
                        {state.heroBlurb}
                      </p>

                      {/* Key Priority Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {state.civicPriorities.slice(0, 2).map((p) => (
                          <span
                            key={p.title}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-canvas text-slate-700 border border-slate-200 font-medium truncate max-w-[200px]"
                          >
                            {p.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Stats & Navigation Link */}
                    <div>
                      <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center text-xs mb-3">
                        <div>
                          <span className="block font-heading font-bold text-ink tabular-nums">
                            {state.stats.resolvedIssues.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-muted">Resolved</span>
                        </div>
                        <div>
                          <span className="block font-heading font-bold text-ink tabular-nums">
                            {state.stats.activeResolvers}
                          </span>
                          <span className="text-[10px] text-muted">Resolvers</span>
                        </div>
                        <div>
                          <span className="block font-heading font-bold text-emerald-600 tabular-nums">
                            {state.stats.avgResponseHours}h
                          </span>
                          <span className="text-[10px] text-muted">Avg SLA</span>
                        </div>
                      </div>

                      <div className="w-full py-2 px-3 rounded-lg bg-canvas group-hover:bg-lavender/60 text-primary font-semibold text-xs flex items-center justify-between transition-colors">
                        <span>View State Infrastructure</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatesDirectory;
