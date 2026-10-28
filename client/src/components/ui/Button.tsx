import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | 'gold' | 'navy' | 'purple'; // Backwards-compatible aliases
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  to?: LinkProps['to'];
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  isFullWidth = false,
  className = '',
  type = 'button',
  onClick,
  to,
  href,
  target,
  rel,
  ...props
}) => {
  // Focus rings use warm amber-gold accent for crisp visibility on both dark & light surfaces
  const baseStyles =
    'inline-flex flex-row items-center justify-center whitespace-nowrap font-medium select-none ' +
    'transition-all duration-150 ease-out ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none ' +
    'hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100';

  // Standardized variants matching Section 3: primary, accent, secondary, outline, ghost, danger
  const variants: Record<string, string> = {
    primary:
      'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-cardHover border border-primary/20',
    accent:
      'bg-accent text-navy font-semibold hover:bg-accent-hover shadow-sm hover:shadow border border-accent/20',
    gold:
      'bg-accent text-navy font-semibold hover:bg-accent-hover shadow-sm hover:shadow border border-accent/20',
    navy:
      'bg-primary text-white hover:bg-primary-hover font-semibold shadow-sm hover:shadow-cardHover border border-primary/20',
    purple:
      'bg-primary text-white hover:bg-primary-hover font-semibold shadow-sm hover:shadow-cardHover border border-primary/20',
    secondary:
      'bg-canvas text-primary hover:bg-[#F2EDE2] border border-card-border shadow-xs',
    outline:
      'border border-primary/30 bg-transparent text-primary hover:bg-primary-light hover:border-primary shadow-xs',
    ghost:
      'bg-transparent text-primary hover:bg-primary-light/60',
    danger:
      'bg-status-danger text-white hover:bg-red-800 shadow-sm hover:shadow',
  };

  // 44px minimum touch target on mobile for sm, md, lg; xs reserved for dense tables/chips
  const sizes: Record<ButtonSize, string> = {
    xs: 'min-h-[32px] h-8 text-xs px-2.5 py-1 gap-1 rounded-md font-medium',
    sm: 'min-h-[44px] h-11 sm:h-9 text-xs sm:text-xs px-3.5 sm:px-4 gap-1.5 rounded-lg font-medium',
    md: 'min-h-[44px] h-11 text-sm px-5 sm:px-6 gap-2 rounded-xl font-medium',
    lg: 'min-h-[48px] h-12 text-base px-6 sm:px-7 gap-2.5 rounded-xl font-semibold',
  };

  const resolvedVariantClass = variants[variant] || variants.primary;
  const resolvedSizeClass = sizes[size] || sizes.md;
  const widthClass = isFullWidth ? 'w-full' : '';

  const combinedClasses = `
    ${baseStyles}
    ${resolvedVariantClass}
    ${resolvedSizeClass}
    ${widthClass}
    ${className}
  `.trim();

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children && (
        <span className="inline-flex flex-row items-center gap-1.5 truncate">
          {children}
        </span>
      )}
      {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </>
  );

  // Polymorphic rendering: if `to` is passed, render React Router <Link>
  if (to) {
    return (
      <Link
        to={to}
        className={combinedClasses}
        onClick={onClick as any}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  // Polymorphic rendering: if `href` is passed, render <a>
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' && !rel ? 'noopener noreferrer' : rel}
        className={combinedClasses}
        onClick={onClick as any}
        {...(props as any)}
      >
        {content}
      </a>
    );
  }

  // Default: native <button>
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

export const ButtonLink = Button;

export default Button;
