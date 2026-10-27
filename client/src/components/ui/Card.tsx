import React, { useRef, useState, useEffect } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'stat' | 'glass' | 'interactive';
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

  const shouldBeInteractive = isInteractive || variant === 'interactive' || tilt;

  const radiusStyles: Record<NonNullable<CardProps['radius']>, string> = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    card: 'rounded-[16px] lg:rounded-[20px]',
    cardLg: 'rounded-[20px] lg:rounded-[24px]',
  };

  const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
    base: 'bg-white border border-border shadow-subtle',
    elevated: 'bg-white border border-border shadow-card',
    stat: 'bg-white border border-border shadow-subtle',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-card',
    interactive: 'bg-white border border-border shadow-subtle',
  };

  const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-6 lg:p-7',
    lg: 'p-6 sm:p-8',
  };

  const interactiveStyles = shouldBeInteractive
    ? 'card-hover-lift cursor-pointer hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary'
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
      // Max tilt: 5 degrees
      const rotateX = -((y - centerY) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;

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
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(200, 162, 74, 0.08), transparent 80%)`,
          }}
        />
      )}

      {header && (
        <div className="relative z-10 px-6 py-4 border-b border-border bg-canvas/60">
          {header}
        </div>
      )}
      <div className={`relative z-10 ${paddingStyles[padding] || paddingStyles.md}`}>
        {children}
      </div>
      {footer && (
        <div className="relative z-10 px-6 py-3.5 border-t border-border bg-canvas/60">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
