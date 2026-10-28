import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Compass,
  Sparkles,
} from 'lucide-react';
import { STATES_DATA, RegionType, StateType, StateData } from '../../data/statesData';
import { getStateLandmark } from '../../data/landmarks';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHero from '../../components/ui/PageHero';
import EmptyState from '../../components/ui/EmptyState';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';

const ZONES: { id: 'All' | RegionType; label: string; description: string }[] = [
  { id: 'All', label: 'All India', description: 'Complete directory of 28 states and 8 union territories' },
  { id: 'North', label: 'North Zone', description: 'Delhi NCR, Himalayan states, and northern agricultural plains' },
  { id: 'South', label: 'South Zone', description: 'Peninsular technology hubs, coastal corridors, and urban metros' },
  { id: 'East', label: 'East Zone', description: 'Ganges basin, eastern seaboard, and mineral-rich industrial belts' },
  { id: 'West', label: 'West Zone', description: 'Commercial capitals, western ghats, and industrial manufacturing belts' },
  { id: 'Central', label: 'Central Zone', description: 'Heartland river basins, central plateaus, and transit logistics hubs' },
  { id: 'Northeast', label: 'Northeast Zone', description: 'Seven sisters and Sikkim across eastern Himalayan biodiversity zones' },
];

export const StatesDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialZone = (searchParams.get('zone') as RegionType) || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'All' | RegionType>(
    ['North', 'South', 'East', 'West', 'Central', 'Northeast'].includes(initialZone) ? initialZone : 'All'
  );
  const [selectedType, setSelectedType] = useState<'All' | StateType>('All');
  const [sortBy, setSortBy] = useState<'name' | 'districts'>('name');

  // Sync state changes with URL query
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedRegion === 'All') {
      params.delete('zone');
    } else {
      params.set('zone', selectedRegion);
    }
    setSearchParams(params, { replace: true });
  }, [selectedRegion]);

  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = { All: STATES_DATA.length };
    STATES_DATA.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return counts;
  }, []);

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
      if (sortBy === 'districts') {
        return b.districtsCount - a.districtsCount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedRegion, selectedType, sortBy]);

  // Aggregate factual counts across filtered dataset
  const totalDistricts = useMemo(
    () => filteredStates.reduce((acc, curr) => acc + curr.districtsCount, 0),
    [filteredStates]
  );

  const isDefaultView = selectedRegion === 'All' && !searchQuery.trim() && selectedType === 'All' && sortBy === 'name';

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title="Indian States & Union Territories Civic Directory"
        description="Explore civic resolution metrics, landmark visual banners, verified municipal contractor coverage, and infrastructure priorities across all 36 Indian states and union territories."
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
              'Browse civic hazard resolution metrics, state landmark visual banners, and active municipal resolver networks across 36 Indian states and UTs.',
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
        description="Access certified resolver networks, localized civic priorities, landmark photographic banners, and audited proof in all 28 states and 8 union territories under standardized Schedule of Rates (SOR)."
        primaryAction={
          <a href="#zone-switcher">
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
              Every jurisdiction operates under verified milestone payments (50% advance, 50% balance) and photo verification standards.
            </p>
          </div>
        }
      />

      {/* Sticky Zonal Navigation Switcher */}
      <nav aria-label="Zonal Navigation Switcher" className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs" id="zone-switcher">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mr-2 hidden sm:flex items-center gap-1 shrink-0">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>Zone:</span>
              </span>
              {ZONES.map((zone) => {
                const count = zoneCounts[zone.id] || 0;
                const isActive = selectedRegion === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedRegion(zone.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none shrink-0 ${
                      isActive
                        ? 'bg-navy text-gold shadow-xs ring-1 ring-gold/40'
                        : 'bg-canvas text-secondaryText hover:text-ink hover:bg-slate-200'
                    }`}
                  >
                    <span>{zone.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                        isActive ? 'bg-gold/20 text-gold' : 'bg-slate-200/80 text-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center text-xs text-muted tabular-nums shrink-0">
              <span className="font-semibold text-ink">{filteredStates.length}</span>
              <span className="ml-1">of 36 Regions Shown</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Quick Highlights Bar */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-card bg-surface border border-border shadow-subtle mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Regions Active</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {filteredStates.length} / 36 Pan-India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Jurisdictions Listed</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {filteredStates.length} States & UTs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Administrative Units</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  {totalDistricts} Districts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Zonal Coverage</p>
                <p className="font-heading font-bold text-ink text-base sm:text-lg tabular-nums">
                  6 Regional Zones
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Filters and Search Bar */}
        <div className="bg-surface p-5 rounded-card border border-border shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state name, capital, or landmark (e.g. Bengaluru, Assam, Taj)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-canvas/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-semibold"
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
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-surface text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                <option value="name">Alphabetical (A - Z)</option>
                <option value="districts">Districts (Most First)</option>
              </select>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="pt-3 border-t border-border flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-muted font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Jurisdiction Type:</span>
              </span>
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors select-none ${
                    selectedType === t
                      ? 'bg-navy text-white font-semibold shadow-xs'
                      : 'bg-canvas text-secondaryText hover:text-ink hover:bg-slate-200'
                  }`}
                >
                  {t === 'All' ? 'All (36)' : t === 'State' ? 'States (28)' : 'Union Territories (8)'}
                </button>
              ))}
            </div>

            {(selectedRegion !== 'All' || selectedType !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion('All');
                  setSelectedType('All');
                  setSearchQuery('');
                  setSortBy('name');
                }}
                className="text-primary hover:underline text-xs font-semibold"
              >
                Reset all filters
              </button>
            )}
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
                className="px-4 py-2 rounded-lg bg-navy text-gold text-xs font-semibold hover:bg-navy-muted transition-colors"
              >
                Reset Filters
              </button>
            }
          />
        ) : isDefaultView ? (
          /* Zonal Grouped Layout when viewing All with no search filters */
          <div className="space-y-12">
            {ZONES.filter((z) => z.id !== 'All').map((zone) => {
              const zoneStates = STATES_DATA.filter((s) => s.region === zone.id);
              if (zoneStates.length === 0) return null;

              return (
                <section key={zone.id} className="scroll-mt-32" id={`zone-${zone.id.toLowerCase()}`}>
                  {/* Zonal Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="navy" size="sm">
                          {zone.label}
                        </Badge>
                        <span className="text-xs font-mono text-muted tabular-nums">
                          {zoneStates.length} Jurisdictions
                        </span>
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-ink">
                        {zone.label} Regional Network
                      </h2>
                      <p className="text-xs text-secondaryText mt-0.5 max-w-2xl">
                        {zone.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRegion(zone.id)}
                      className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Focus on {zone.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Zonal Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zoneStates.map((state, idx) => (
                      <StateCard key={state.slug} state={state} idx={idx} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Filtered or Sorted Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-medium text-secondaryText">
                Showing <strong className="text-ink font-semibold">{filteredStates.length}</strong> regions
                {selectedRegion !== 'All' && <span> in <strong>{selectedRegion} Zone</strong></span>}
                {selectedType !== 'All' && <span> ({selectedType}s)</span>}
                {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStates.map((state, idx) => (
                <StateCard key={state.slug} state={state} idx={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StateCardProps {
  state: StateData;
  idx: number;
}

const StateCard: React.FC<StateCardProps> = ({ state, idx }) => {
  const landmarkInfo = getStateLandmark(state.slug);

  return (
    <Reveal delay={(idx % 6) * 0.04}>
      <Link to={`/states/${state.slug}`} className="block h-full group">
        <Card
          isInteractive
          variant="base"
          className="h-full flex flex-col justify-between overflow-hidden group-hover:border-primary/40 group-hover:shadow-cardHover transition-all duration-200 bg-surface p-0 border border-border"
        >
          <div>
            {/* 16:10 Landmark Visual Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
              <img
                src={landmarkInfo.bannerUrl}
                alt={`${state.name} - ${landmarkInfo.landmark}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Scrim Gradient for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                <Badge
                  variant={state.type === 'Union Territory' ? 'gold' : 'navy'}
                  size="sm"
                  className="shadow-sm backdrop-blur-xs"
                >
                  {state.type}
                </Badge>
                <span className="text-[11px] font-mono font-medium text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                  {state.region} Zone
                </span>
              </div>

              {/* Landmark Caption Badge */}
              <div className="absolute bottom-2.5 left-3 right-3 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[11px]">
                  <Sparkles className="w-3 h-3 text-gold shrink-0" />
                  <span className="truncate font-medium">{landmarkInfo.landmark}</span>
                </div>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-heading font-bold text-xl text-ink group-hover:text-primary transition-colors">
                  {state.name}
                </h3>
                <span className="text-xs text-muted tabular-nums font-mono font-medium shrink-0 pt-0.5">
                  {state.districtsCount} Dist.
                </span>
              </div>

              <p className="text-xs text-muted flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Capital: <strong className="text-secondaryText font-medium">{state.capital}</strong></span>
              </p>

              {/* Short Blurb */}
              <p className="text-xs text-secondaryText leading-relaxed mb-4 line-clamp-2">
                {state.heroBlurb}
              </p>

              {/* Priority Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {state.civicPriorities.slice(0, 2).map((p) => (
                  <span
                    key={p.title}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-canvas text-secondaryText border border-border font-medium truncate max-w-[200px]"
                  >
                    {p.title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card Footer: 3 Factual Metrics & Action Button */}
          <div className="p-5 pt-0">
            <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div>
                <span className="block font-heading font-semibold text-ink text-xs truncate">
                  {state.capital}
                </span>
                <span className="text-[10px] text-muted">Capital</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-ink text-xs tabular-nums">
                  {state.districtsCount}
                </span>
                <span className="text-[10px] text-muted">Districts</span>
              </div>
              <div>
                <span className="block font-heading font-semibold text-ink text-xs truncate">
                  {state.population}
                </span>
                <span className="text-[10px] text-muted">Population</span>
              </div>
            </div>

            <div className="w-full py-2.5 px-3 rounded-lg bg-canvas group-hover:bg-lavender/60 text-primary font-semibold text-xs flex items-center justify-between transition-colors">
              <span>View State Infrastructure</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </Reveal>
  );
};

export default StatesDirectory;
