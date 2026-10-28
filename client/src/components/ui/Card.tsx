import React, { useRef, useState, useEffect } from 'react';

export type CardVariant = 'base' | 'elevated' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant | 'stat' | 'glass'; // 'stat' & 'glass' aliased for compatibility
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isInteractive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'card' | 'cardLg';
  tilt?: boolean;
  spotlight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  header = null,
  footer = null,
  isInteractive = false,
  padding = 'md',
  radius = 'card',
  tilt = false,
  spotlight = false,
  className = '',
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch =
        'ontouchstart' in window ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  const isInteractiveVariant = isInteractive || variant === 'interactive' || tilt;

  // Standard 16px border-radius (rounded-2xl) across variants
  const radiusStyles: Record<NonNullable<CardProps['radius']>, string> = {
    sm: 'rounded-xl',
    md: 'rounded-xl',
    card: 'rounded-2xl',
    cardLg: 'rounded-2xl',
  };

  // Exactly 3 core standardized variants: base, elevated, interactive
  const variantStyles: Record<string, string> = {
    base: 'bg-white border border-card-border shadow-xs',
    elevated: 'bg-white border border-card-border shadow-card',
    interactive:
      'bg-white border border-card-border shadow-xs hover:shadow-cardHover hover:-translate-y-0.5 hover:border-primary/25 focus-within:ring-2 focus-within:ring-accent transition-all duration-200 cursor-pointer',
    stat: 'bg-white border border-card-border shadow-xs',
    glass: 'bg-white/95 backdrop-blur-md border border-card-border shadow-card',
  };

  const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-6 lg:p-7',
    lg: 'p-6 sm:p-8',
  };

  const interactiveStyles =
    isInteractiveVariant && variant !== 'interactive'
      ? 'hover:-translate-y-0.5 hover:shadow-cardHover hover:border-primary/25 focus-within:ring-2 focus-within:ring-accent transition-all duration-200 cursor-pointer'
      : '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseMove) onMouseMove(e);
    if (!cardRef.current || isTouchDevice) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlight) {
      setSpotlightPos({ x, y, opacity: 1 });
    }

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 4;
      const rotateY = ((x - centerX) / centerX) * 4;
      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseLeave) onMouseLeave(e);
    if (spotlight) {
      setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
    }
    if (tilt && cardRef.current && !isTouchDevice) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden transition-all duration-200
        ${radiusStyles[radius] || radiusStyles.card}
        ${variantStyles[variant] || variantStyles.base}
        ${interactiveStyles}
        ${className}
      `.trim()}
      {...props}
    >
      {/* Spotlight Radial Overlay */}
      {spotlight && !isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(232, 163, 61, 0.08), transparent 80%)`,
          }}
        />
      )}

      {header && (
        <div className="relative z-10 px-6 py-4 border-b border-card-border bg-canvas/60">
          {header}
        </div>
      )}
      <div className={`relative z-10 ${paddingStyles[padding] || paddingStyles.md}`}>
        {children}
      </div>
      {footer && (
        <div className="relative z-10 px-6 py-3.5 border-t border-card-border bg-canvas/60">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
