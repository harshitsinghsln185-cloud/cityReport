import React, { useState, useMemo, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { STATES_DATA, RegionType, StateType, StateData } from '../../data/statesData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHero from '../../components/ui/PageHero';
import EmptyState from '../../components/ui/EmptyState';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';

export const ZONE_STYLES: Record<RegionType, { badge: string }> = {
  North: { badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  South: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  East: { badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  West: { badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  Central: { badge: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  Northeast: { badge: 'bg-rose-50 text-rose-700 border-rose-200' },
};

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<'All' | RegionType>(
    ['North', 'South', 'East', 'West', 'Central', 'Northeast'].includes(initialZone) ? initialZone : 'All'
  );
  const [selectedType, setSelectedType] = useState<'All' | StateType>('All');
  const [sortBy, setSortBy] = useState<'name' | 'districts'>('name');

  // Keyboard shortcut '/' to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const target = e.target as HTMLElement;
        const isInput =
          target &&
          (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state changes with URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedRegion === 'All') {
      params.delete('zone');
    } else {
      params.set('zone', selectedRegion);
    }
    setSearchParams(params, { replace: true });
  }, [selectedRegion]);

  // Sync URL query changes to state (back/forward browser nav)
  useEffect(() => {
    const zoneFromUrl = searchParams.get('zone') as RegionType | null;
    if (zoneFromUrl && ['North', 'South', 'East', 'West', 'Central', 'Northeast'].includes(zoneFromUrl)) {
      if (selectedRegion !== zoneFromUrl) {
        setSelectedRegion(zoneFromUrl);
      }
    } else if (!zoneFromUrl && selectedRegion !== 'All') {
      setSelectedRegion('All');
    }
  }, [searchParams]);

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
        description="Access certified resolver networks, localized civic priorities, landmark photographic banners, and verified proof in all 28 states and 8 union territories with standardized pricing lists."
        primaryAction={
          <a href="#zone-switcher">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Filter by Zone
            </Button>
          </a>
        }
        secondaryAction={
          <Button to="/user/report-issue" variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
              Report Local Defect
            </Button>
        }
        visual={
          <div className="w-full max-w-sm rounded-[20px] bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Pan-India Coverage</span>
              <Badge variant="gold" size="sm">36 Total</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold font-heading text-white">28</div>
                <div className="text-xs text-slate-300 font-medium">States</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold font-heading text-white">8</div>
                <div className="text-xs text-slate-300 font-medium">Union Territories</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every region operates under verified milestone payments (50% advance, 50% balance) and photo verification standards.
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
                      className={`text-xs px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
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
        {/* Quick Highlights Bar (Styled in StateDetail Translucent Gold Glassmorphism) */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-accent/30 hover:bg-accent/35 backdrop-blur-xl border border-accent/50 shadow-xl shadow-navy/20 transition-all mb-8">
            {/* Regions Active */}
            <div className="p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Regions Active</span>
              </div>
              <p className="font-heading font-bold text-navy text-lg sm:text-xl tabular-nums truncate">
                {filteredStates.length} / 36 Pan-India
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Jurisdictions Listed</p>
            </div>

            {/* Jurisdictions Listed */}
            <div className="p-2 sm:p-2.5 border-l-0 sm:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Jurisdictions</span>
              </div>
              <p className="font-heading font-bold text-navy text-lg sm:text-xl tabular-nums truncate">
                {filteredStates.length} States & UTs
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Administrative Units</p>
            </div>

            {/* Administrative Units */}
            <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Users className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Districts</span>
              </div>
              <p className="font-heading font-bold text-navy text-lg sm:text-xl tabular-nums truncate">
                {totalDistricts} Districts
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Administrative Units</p>
            </div>

            {/* Zonal Coverage */}
            <div className="p-2 sm:p-2.5 border-t sm:border-t-0 lg:border-l border-navy/20">
              <div className="flex items-center gap-1.5 text-navy/90 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Clock className="w-3.5 h-3.5 text-navy shrink-0" />
                <span>Zonal Coverage</span>
              </div>
              <p className="font-heading font-bold text-navy text-lg sm:text-xl tabular-nums truncate">
                6 Regional Zones
              </p>
              <p className="text-[10px] text-navy/75 font-semibold">Decentralized Governance</p>
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
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state name, capital, or landmark (e.g. Bengaluru, Assam, Taj)..."
                className="w-full pl-10 pr-16 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-canvas/40"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-semibold"
                >
                  Clear
                </button>
              ) : (
                <div className="hidden sm:flex items-center absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-xs font-mono text-muted bg-canvas border border-border rounded shadow-xs" title="Press / to search">
                    /
                  </kbd>
                </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
  return (
    <Reveal delay={(idx % 8) * 0.03}>
      <Link to={`/states/${state.slug}`} className="block h-full group">
        <Card
          isInteractive
          variant="base"
          className="h-full flex flex-col justify-between rounded-2xl bg-surface border border-border p-5 hover:border-primary/40 hover:shadow-cardHover transition-all duration-200"
        >
          <div>
            {/* Top Row: Region Zone & Type Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                  ZONE_STYLES[state.region]?.badge || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {state.region} Zone
              </span>
              <span className="text-[11px] font-medium text-muted bg-canvas px-2 py-0.5 rounded border border-border">
                {state.type === 'Union Territory' ? 'UT' : 'State'}
              </span>
            </div>

            {/* State Name */}
            <h3 className="font-heading font-bold text-lg text-ink group-hover:text-primary transition-colors mb-1.5 leading-snug">
              {state.name}
            </h3>

            {/* Capital */}
            <p className="text-xs text-muted flex items-center gap-1.5 mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Capital: <strong className="text-secondaryText font-semibold">{state.capital}</strong>
              </span>
            </p>

            {/* Short Detail Blurb */}
            <p className="text-xs text-secondaryText leading-relaxed line-clamp-2 mb-4">
              {state.heroBlurb}
            </p>
          </div>

          {/* Footer: District count & View Details action */}
          <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
            <span className="text-xs font-mono font-medium text-muted">
              {state.districtsCount} Districts
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary-hover group-hover:translate-x-0.5 transition-all">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Card>
      </Link>
    </Reveal>
  );
};

export default StatesDirectory;
