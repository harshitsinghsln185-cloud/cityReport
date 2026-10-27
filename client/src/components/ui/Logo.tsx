import React from 'react';

export interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'stacked';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
}

export const LogoMark: React.FC<{ sizeClass?: string; theme?: 'light' | 'dark' }> = ({
  sizeClass = 'w-9 h-9',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  return (
    <svg
      viewBox="0 0 48 48"
      className={`${sizeClass} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Hexagon Seal */}
      <path
        d="M24 4L42 14.5V33.5L24 44L6 33.5V14.5L24 4Z"
        fill={isDark ? '#12306A' : '#0A1F44'}
        stroke={isDark ? '#C8A24A' : '#0A1F44'}
        strokeWidth={isDark ? '1.5' : '1'}
      />
      {/* Inner Chamber */}
      <path
        d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
        fill={isDark ? '#0A1F44' : '#06132B'}
      />
      {/* Warm Gold Keystone */}
      <path
        d="M24 16L30 20V28L24 32L18 28V20L24 16Z"
        fill="#C8A24A"
      />
      {/* Civic Core */}
      <circle cx="24" cy="24" r="3" fill="#FAF8F3" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  subtitle,
  className = '',
}) => {
  const isDark = theme === 'dark';

  const markSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  if (variant === 'mark') {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        role="img"
        aria-label="Crowd Report Logo Mark"
      >
        <LogoMark sizeClass={markSizeMap[size]} theme={theme} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center gap-2 ${className}`}
        role="img"
        aria-label="Crowd Report Logo"
      >
        <LogoMark sizeClass={markSizeMap[size]} theme={theme} />
        <div>
          <div className="flex items-center justify-center gap-1 font-heading font-bold text-lg tracking-tight">
            <span className={isDark ? 'text-canvas' : 'text-primary'}>Crowd</span>
            <span className={isDark ? 'text-slate-200' : 'text-ink'}>Report</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          {subtitle && (
            <div className="text-[10px] uppercase font-mono tracking-widest text-gold font-semibold mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Lockup
  return (
    <div
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="img"
      aria-label="Crowd Report"
    >
      <LogoMark sizeClass={markSizeMap[size]} theme={theme} />
      <div className="flex flex-col">
        <div className={`flex items-baseline gap-1 font-heading font-bold ${titleSizeMap[size]} tracking-tight leading-none`}>
          <span className={isDark ? 'text-canvas' : 'text-primary'}>Crowd</span>
          <span className={isDark ? 'text-slate-200' : 'text-ink font-semibold'}>Report</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block translate-y-[-2px]" />
        </div>
        {subtitle && (
          <span className={`text-[10px] uppercase tracking-wider font-semibold leading-tight mt-1 ${isDark ? 'text-gold' : 'text-gold-text'}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
