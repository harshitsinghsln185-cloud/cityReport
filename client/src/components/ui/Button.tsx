import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gold' | 'danger' | 'outline' | 'ghost' | 'navy';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
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
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none ' +
    'hover:scale-[1.01] active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-cardHover hover:-translate-y-0.5 active:translate-y-0 border border-primary/20',
    secondary:
      'bg-primary-light text-primary hover:bg-[#DCE7F5] focus-visible:ring-accent hover:-translate-y-0.5 active:translate-y-0 border border-primary/10',
    accent:
      'bg-accent text-primary font-semibold hover:bg-accent-hover shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 border border-accent/20',
    gold:
      'bg-accent text-primary font-semibold hover:bg-accent-hover shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 border border-accent/20',
    navy:
      'bg-navy text-gold hover:bg-navy-muted font-semibold shadow-sm hover:shadow-cardHover hover:-translate-y-0.5 active:translate-y-0 border border-gold/30',
    danger:
      'bg-status-danger text-white hover:bg-[#991B1B] focus-visible:ring-red-400 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border border-border bg-white text-ink hover:bg-canvas hover:border-slate-400 focus-visible:ring-accent hover:-translate-y-0.5 active:translate-y-0 shadow-xs',
    ghost:
      'bg-transparent text-muted hover:text-ink hover:bg-primary-light/50 focus-visible:ring-accent',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    xs: 'h-7 text-xs px-2.5 py-1 gap-1 rounded-md font-medium',
    sm: 'h-9 min-h-[36px] text-xs px-3.5 sm:px-4 gap-1.5 rounded-lg font-medium',
    md: 'h-11 min-h-[44px] text-sm px-5 sm:px-6 gap-2 rounded-xl font-medium',
    lg: 'h-12 min-h-[48px] text-base px-6 sm:px-7 gap-2.5 rounded-xl font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${isFullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children && <span className="truncate">{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
