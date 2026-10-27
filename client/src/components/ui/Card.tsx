import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'stat' | 'glass' | 'interactive';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isInteractive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'card' | 'cardLg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  header = null,
  footer = null,
  isInteractive = false,
  padding = 'md',
  radius = 'card',
  className = '',
  ...props
}) => {
  const shouldBeInteractive = isInteractive || variant === 'interactive';

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

  return (
    <div
      className={`
        overflow-hidden transition-all duration-200
        ${radiusStyles[radius] || radiusStyles.card}
        ${variantStyles[variant] || variantStyles.base}
        ${interactiveStyles}
        ${className}
      `.trim()}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border bg-canvas/60">
          {header}
        </div>
      )}
      <div className={paddingStyles[padding] || paddingStyles.md}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3.5 border-t border-border bg-canvas/60">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
