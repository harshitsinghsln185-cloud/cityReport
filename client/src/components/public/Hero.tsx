import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Zap,
  Waves,
  X,
  ChevronDown,
} from 'lucide-react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { HERO_HOTSPOTS } from '../../data/heroHotspots';

// Responsive hero WebP and AVIF assets
import hero2560Avif from '../../assets/images/home/hero-2560.avif';
import hero2560Webp from '../../assets/images/home/hero-2560.webp';
import hero1920Avif from '../../assets/images/home/hero-1920.avif';
import hero1920Webp from '../../assets/images/home/hero-1920.webp';
import hero1280Avif from '../../assets/images/home/hero-1280.avif';
import hero1280Webp from '../../assets/images/home/hero-1280.webp';
import hero768Avif from '../../assets/images/home/hero-768.avif';
import hero768Webp from '../../assets/images/home/hero-768.webp';
import heroM1080Avif from '../../assets/images/home/hero-m-1080.avif';
import heroM1080Webp from '../../assets/images/home/hero-m-1080.webp';
import heroM720Avif from '../../assets/images/home/hero-m-720.avif';
import heroM720Webp from '../../assets/images/home/hero-m-720.webp';
import heroBlurWebp from '../../assets/images/home/hero-blur.webp';

const HOTSPOT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  AlertTriangle,
  Trash2,
  Zap,
  Waves,
};

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hintFirstPin, setHintFirstPin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check device capabilities
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    // Initial interactive hint after short delay
    const hintTimer = setTimeout(() => {
      setHintFirstPin(true);
    }, 1500);

    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', motionListener);
      clearTimeout(hintTimer);
    };
  }, []);

  // Idle slow zoom animation via direct CSS variable (NO React state re-renders = 60fps)
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    let startTime = performance.now();
    let animId: number;

    const animateZoom = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // 20 second period oscillating between 1.00 and 1.035
      const wave = Math.sin((elapsed / 20) * Math.PI * 2);
      const scale = 1.0 + ((wave + 1) / 2) * 0.035;
      
      if (transformContainerRef.current) {
        transformContainerRef.current.style.setProperty('--hero-zoom', scale.toFixed(4));
      }
      animId = requestAnimationFrame(animateZoom);
    };

    animId = requestAnimationFrame(animateZoom);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion, isTouchDevice]);

  // Pointer move handler for parallax and radial warm light (Direct DOM manipulation = 0 React re-renders)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || isTouchDevice) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Parallax moves opposite to pointer up to 12px
      const normX = (clientX / rect.width - 0.5) * 2;
      const normY = (clientY / rect.height - 0.5) * 2;
      const parallaxX = (-normX * 12).toFixed(1);
      const parallaxY = (-normY * 10).toFixed(1);

      if (transformContainerRef.current) {
        transformContainerRef.current.style.setProperty('--parallax-x', `${parallaxX}px`);
        transformContainerRef.current.style.setProperty('--parallax-y', `${parallaxY}px`);
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${clientX}px`);
        spotlightRef.current.style.setProperty('--spotlight-y', `${clientY}px`);
        spotlightRef.current.style.opacity = '1';
      }
    },
    [prefersReducedMotion, isTouchDevice]
  );

  const handlePointerLeave = useCallback(() => {
    if (prefersReducedMotion || isTouchDevice) return;
    if (transformContainerRef.current) {
      transformContainerRef.current.style.setProperty('--parallax-x', '0px');
      transformContainerRef.current.style.setProperty('--parallax-y', '0px');
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  }, [prefersReducedMotion, isTouchDevice]);

  // Keyboard navigation & Esc key handler for hotspots
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeHotspotId) {
        setActiveHotspotId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeHotspotId]);

  // Close active card on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeHotspotId) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-hotspot-container]')) {
          setActiveHotspotId(null);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeHotspotId]);

  // Hotspots to display (3 on mobile, 4 on desktop)
  const displayedHotspots = isMobile
    ? HERO_HOTSPOTS.filter((h) => Boolean(h.mobile))
    : HERO_HOTSPOTS;

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-[max(640px,88svh)] flex flex-col justify-between overflow-hidden bg-primary text-white pt-14 pb-8 sm:pt-20 sm:pb-10 select-none"
    >
      {/* 1. Background Image Layer with Parallax & Hotspot Pins */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Tiny blurred placeholder to eliminate layout shift */}
        <img
          src={heroBlurWebp}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 blur-xl scale-105 ${
            isImageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Parallax & Zoom Container with pure CSS variables */}
        <div
          ref={transformContainerRef}
          className="absolute inset-0 w-full h-full will-change-transform transition-transform duration-300 ease-out"
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : 'translate3d(var(--parallax-x, 0px), var(--parallax-y, 0px), 0) scale(var(--hero-zoom, 1))',
          }}
        >
          {/*
            Exact Aspect Ratio Frame:
            Desktop: 16:9 frame centered over section.
            Mobile: 4:5 frame centered over section.
            Ensures Hotspot pins anchored at percentage coordinates stay perfectly on target objects.
          */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-full min-h-full aspect-[4/5] md:aspect-[16/9]">
            <picture className="w-full h-full block">
              {/* Mobile Portrait (AVIF & WebP) */}
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet={`${heroM720Avif} 720w, ${heroM1080Avif} 1080w`}
                sizes="100vw"
              />
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet={`${heroM720Webp} 720w, ${heroM1080Webp} 1080w`}
                sizes="100vw"
              />
              {/* Desktop / Tablet Landscape (AVIF & WebP) */}
              <source
                type="image/avif"
                srcSet={`${hero768Avif} 768w, ${hero1280Avif} 1280w, ${hero1920Avif} 1920w, ${hero2560Avif} 2560w`}
                sizes="100vw"
              />
              <source
                type="image/webp"
                srcSet={`${hero768Webp} 768w, ${hero1280Webp} 1280w, ${hero1920Webp} 1920w, ${hero2560Webp} 2560w`}
                sizes="100vw"
              />
              <img
                src={hero1920Webp}
                alt="Panoramic view of Indian city street infrastructure"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                width={1920}
                height={1080}
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </picture>

            {/* Hotspots Interactive Layer */}
            <div
              data-hotspot-container
              className="absolute inset-0 pointer-events-auto"
              aria-label="Interactive street hazard inspection pins"
            >
              {displayedHotspots.map((hotspot, index) => {
                const coord = isMobile && hotspot.mobile ? hotspot.mobile : hotspot.desktop;
                const isActive = activeHotspotId === hotspot.id;
                const IconComponent = HOTSPOT_ICONS[hotspot.iconName] || AlertTriangle;

                // Smart edge positioning: flip tooltip if near screen boundaries
                const flipHorizontal = coord.x > 68;
                const flipVertical = coord.y > 60;

                return (
                  <div
                    key={hotspot.id}
                    className="absolute z-30"
                    style={{
                      left: `${coord.x}%`,
                      top: `${coord.y}%`,
                    }}
                  >
                    {/* Hotspot Button Pin */}
                    <button
                      type="button"
                      aria-label={`Show details for ${hotspot.name}`}
                      aria-expanded={isActive}
                      aria-controls={`hotspot-details-${hotspot.id}`}
                      onClick={() => setActiveHotspotId(isActive ? null : hotspot.id)}
                      onMouseEnter={() => !isTouchDevice && setActiveHotspotId(hotspot.id)}
                      onFocus={() => setActiveHotspotId(hotspot.id)}
                      className={`
                        relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
                        w-11 h-11 rounded-full cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                        transition-transform duration-200 hover:scale-110 active:scale-95
                      `}
                    >
                      {/* Pulsing beacon ring */}
                      {!prefersReducedMotion && (
                        <span
                          className={`
                            absolute inset-1.5 rounded-full border border-accent/70
                            ${hintFirstPin && index === 0 ? 'animate-ping' : 'animate-pulse opacity-60'}
                          `}
                        />
                      )}

                      {/* Core pin marker */}
                      <span
                        className={`
                          relative flex items-center justify-center w-4 h-4 rounded-full
                          ${isActive ? 'bg-accent ring-4 ring-accent/30' : 'bg-accent ring-2 ring-white/90 shadow-md'}
                          transition-colors duration-200
                        `}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                      </span>
                    </button>

                    {/* Popover Detail Card (Only one open at a time) */}
                    {isActive && (
                      <div
                        id={`hotspot-details-${hotspot.id}`}
                        role="region"
                        aria-live="polite"
                        className={`
                          absolute z-40 w-72 max-w-[calc(100vw-32px)] p-4 rounded-2xl
                          bg-primary/95 border border-white/20 backdrop-blur-md shadow-2xl text-left
                          transition-all duration-200 animate-in fade-in zoom-in-95
                          ${flipHorizontal ? 'right-4' : 'left-4'}
                          ${flipVertical ? 'bottom-6' : 'top-6'}
                        `}
                      >
                        {/* Card Header with Icon, Category & Close */}
                        <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-white/10 text-primary-light">
                              <IconComponent className="w-4 h-4 text-accent" />
                            </span>
                            <span className="text-xs font-semibold text-primary-light tracking-wide uppercase">
                              {hotspot.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label="Close hazard card"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspotId(null);
                            }}
                            className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-heading font-bold text-sm text-white mb-1 leading-snug">
                          {hotspot.name}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {hotspot.description}
                        </p>

                        {/* CTA Link to Report Page with Category pre-fill */}
                        <Button
                          to={`/user/report-issue?category=${hotspot.categorySlug}`}
                          variant="accent"
                          size="sm"
                          className="w-full text-xs flex items-center justify-center gap-1.5 py-1.5"
                        >
                          <span>Report this issue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Soft Radial Warm Light (Desktop cursor spotlight via CSS variables) */}
        {!isTouchDevice && !prefersReducedMotion && (
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(550px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(232, 163, 61, 0.12), transparent 75%)',
            }}
          />
        )}

        {/* 2. Contrast Overlays for WCAG AAA Compliance (White text contrast > 10:1) */}
        {/* Desktop left-to-right gradient overlay */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent pointer-events-none"
          style={{ width: '60%' }}
        />
        {/* Mobile top-to-bottom gradient overlay */}
        <div
          aria-hidden="true"
          className="md:hidden absolute inset-0 bg-gradient-to-b from-primary via-primary/85 to-transparent pointer-events-none"
          style={{ height: '70%' }}
        />
        {/* Subtle top shade for navbar and bottom shade for section transition */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary to-transparent pointer-events-none"
        />
      </div>

      {/* 3. Foreground Content (Left Column) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 my-auto">
        <div className="max-w-2xl text-left">
          {/* Eyebrow Label */}
          <Reveal direction="down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-xs font-semibold text-accent mb-5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Civic issue reporting & resolution</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span className="text-emerald-300 font-medium hidden sm:inline">Pan-India Coverage</span>
            </div>
          </Reveal>

          {/* Plain, Direct H1 Headline in Plus Jakarta Sans - Balanced 2-line dual color */}
          <Reveal delay={0.1}>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.14] mb-5 text-white">
              <span className="block">Civic problems resolved,</span>
              <span className="block bg-gradient-to-r from-accent via-[#F2D399] to-white bg-clip-text text-transparent">
                with verified proof.
              </span>
            </h1>
          </Reveal>

          {/* Natural Supporting Sentences (2 concise sentences) */}
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-7 max-w-xl font-sans">
              Submit a photo and GPS location to connect with verified local contractors. Track live repair milestones until work is completed and verified.
            </p>
          </Reveal>

          {/* Primary & Secondary Action Buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <Button
                to="/user/report-issue"
                variant="accent"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-black/20 flex items-center justify-center gap-2 group text-navy font-bold"
              >
                <span>Report an issue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              <Button
                to="/track"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 text-white border-white/25 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-primary-light" />
                <span>Track status</span>
              </Button>
            </div>
          </Reveal>

          {/* 3 Real Product Operating Points */}
          <Reveal delay={0.4}>
            <div className="pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Photo & GPS pin</p>
                  <p className="text-xs text-slate-300">Geo-tagged evidence</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Assigned local resolver</p>
                  <p className="text-xs text-slate-300">Verified local dispatch</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Milestone payouts</p>
                  <p className="text-xs text-slate-300">50% advance, balance on fix</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 4. Subtle Bottom Scroll Cue */}
      <div className="relative z-20 mx-auto pt-4 pb-1 text-center">
        <a
          href="#categories-section"
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <span>Explore civic services</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
