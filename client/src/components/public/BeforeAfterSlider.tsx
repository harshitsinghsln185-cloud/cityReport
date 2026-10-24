import React, { useState, useRef, useCallback } from 'react';
import { ShieldCheck, CheckCircle2, MapPin, Calendar, Sliders } from 'lucide-react';
import Badge from '../ui/Badge';

export interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  location?: string;
  date?: string;
  inspectorId?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = '/images/showcase/before-pothole.jpg',
  afterImage = '/images/showcase/after-pothole.jpg',
  beforeLabel = 'Reported Hazard',
  afterLabel = 'Remediated & Verified',
  title = 'Critical Asphalt Pothole & Road Resurfacing',
  location = 'Indiranagar Main Rd, Ward 112',
  date = 'Resolved in 28 hours',
  inspectorId = 'INSP-KA-8142',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm" dot>
              Photo-Proof Audit
            </Badge>
            <span className="text-xs text-muted font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {location}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg sm:text-xl text-ink">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-secondaryText flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-md border border-border">
            <Calendar className="w-3.5 h-3.5 text-muted" />
            {date}
          </span>
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Interactive Slider Box */}
      <div
        ref={containerRef}
        role="slider"
        aria-label="Before and after remediation comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/9] rounded-cardLg overflow-hidden select-none cursor-ew-resize border border-border shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Background: After Image (Full width) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Foreground: Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden select-none pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none select-none pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          />
        </div>

        {/* Split Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Grab Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-indigo border-2 border-primary shadow-modal flex items-center justify-center transition-transform hover:scale-110">
            <Sliders className="w-4 h-4 text-primary rotate-90" />
          </div>
        </div>

        {/* Floating Before Tag */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-dark/80 text-white backdrop-blur-md border border-white/20 shadow-xs">
            {beforeLabel}
          </span>
        </div>

        {/* Floating After Tag */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-white backdrop-blur-md border border-white/20 shadow-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>{afterLabel}</span>
          </span>
        </div>

        {/* Bottom Inspector Signature Tag */}
        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex items-center justify-between">
          <span className="text-[11px] text-white/90 bg-dark/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspector Sealed: {inspectorId}</span>
          </span>
          <span className="text-[11px] text-white/80 bg-dark/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 ml-auto">
            Drag slider or use arrow keys
          </span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
