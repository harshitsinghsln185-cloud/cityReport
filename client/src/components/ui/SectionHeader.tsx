import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  eyebrowVariant?: 'violet' | 'gold' | 'neutral';
  title: React.ReactNode;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
  subtitle?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowVariant = 'violet',
  title,
  titleAs: TitleTag = 'h2',
  subtitle,
  align = 'left',
  actions,
  className = '',
}) => {
  const eyebrowStyles = {
    violet: 'bg-lavender text-primary border-primary/20',
    gold: 'bg-gold-light text-gold-hover border-gold-border',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotStyles = {
    violet: 'bg-primary',
    gold: 'bg-gold',
    neutral: 'bg-slate-400',
  };

  const alignmentWrapper = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-12 ${className}`}
    >
      <div className={`flex flex-col ${alignmentWrapper} max-w-3xl`}>
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold tracking-wide border uppercase">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${eyebrowStyles[eyebrowVariant]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[eyebrowVariant]}`} />
              <span>{eyebrow}</span>
            </span>
          </div>
        )}

        <TitleTag className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-ink leading-tight">
          {title}
        </TitleTag>

        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-secondaryText leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className={`flex items-center gap-3 shrink-0 ${align === 'center' ? 'mx-auto' : ''}`}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
