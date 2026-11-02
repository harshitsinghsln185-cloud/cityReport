import React from 'react';
import logoLight from '../../assets/logo/logo.svg';
import logoWhite from '../../assets/logo/logo-white.svg';

export interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'stacked';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
}

const SIZE_STYLES: Record<'sm' | 'md' | 'lg', {
  heightVar: string;
  textClass: string;
  subClass: string;
}> = {
  sm: {
    heightVar: 'var(--logo-h-sm, 28px)',
    textClass: 'text-[1.125rem] sm:text-[1.25rem]',
    subClass: 'text-[10px]',
  },
  md: {
    heightVar: 'var(--logo-h-md, 34px)',
    textClass: 'text-[1.25rem] sm:text-[1.45rem]',
    subClass: 'text-[11px]',
  },
  lg: {
    heightVar: 'var(--logo-h-lg, 44px)',
    textClass: 'text-[1.5rem] sm:text-[1.75rem]',
    subClass: 'text-xs',
  },
};

/**
 * LogoMark: The standalone vector mark (Location Pin + Community Silhouettes + Verified Checkmark).
 */
export const LogoMark: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
  alt?: string;
}> = ({
  size = 'md',
  theme = 'light',
  className = '',
  alt = 'Crowd Report',
}) => {
  const isDark = theme === 'dark';
  const logoSrc = isDark ? logoWhite : logoLight;
  const config = SIZE_STYLES[size];

  return (
    <img
      src={logoSrc}
      alt={alt}
      width={268}
      height={327}
      className={`shrink-0 select-none ${className}`}
      style={{
        height: config.heightVar,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
};

/**
 * Logo: Official Crowd Report Brand Lockup.
 * Variants:
 *  - 'mark': Icon only
 *  - 'horizontal': Icon + live Fraunces wordmark
 *  - 'stacked': Icon above live Fraunces wordmark
 *
 * Responsiveness:
 *  - Below 640px: horizontal logo scales text down cleanly
 *  - Below 360px: wordmark text hides automatically, displaying mark only
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  subtitle,
  className = '',
}) => {
  const isDark = theme === 'dark';
  const config = SIZE_STYLES[size];

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoMark size={size} theme={theme} alt="Crowd Report" />
      </div>
    );
  }

  const wordmark = (
    <div className="flex flex-col justify-center leading-none">
      <div
        className={`font-fraunces font-semibold tracking-tight inline-flex items-baseline gap-1 ${config.textClass} select-none`}
      >
        <span className={isDark ? 'text-white' : 'text-primary'}>
          Crowd
        </span>
        <span className="text-accent">
          Report
        </span>
      </div>
      {subtitle && (
        <span
          className={`font-sans uppercase font-medium tracking-wider mt-0.5 select-none ${config.subClass} ${
            isDark ? 'text-slate-300' : 'text-secondaryText'
          }`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  if (variant === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center gap-2 ${className}`}
        role="img"
        aria-label="Crowd Report"
      >
        <LogoMark size={size} theme={theme} alt="" />
        {wordmark}
      </div>
    );
  }

  // Default: Horizontal Lockup
  // Below 360px: wordmark is hidden to fit ultra-compact viewports without breaking navigation.
  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}
      role="img"
      aria-label="Crowd Report"
    >
      <LogoMark size={size} theme={theme} alt="" />
      <div className="hidden min-[360px]:flex flex-col justify-center">
        {wordmark}
      </div>
    </div>
  );
};

export default Logo;
