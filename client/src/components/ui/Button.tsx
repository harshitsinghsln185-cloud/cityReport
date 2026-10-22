import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus-visible:ring-[#A78BFA] shadow-sm',
    secondary: 'bg-[#EDE9FE] text-[#312E81] hover:bg-[#DDD6FE] focus-visible:ring-[#A78BFA]',
    accent: 'bg-[#312E81] text-white font-semibold hover:bg-[#171A3B] focus-visible:ring-[#A78BFA] shadow-sm',
    danger: 'bg-[#991B1B] text-white hover:bg-[#7F1D1D] focus-visible:ring-[#F87171]',
    outline: 'border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F8F7FC] hover:border-[#CBD5E1] focus-visible:ring-[#A78BFA]',
    ghost: 'bg-transparent text-[#64748B] hover:text-[#1E293B] hover:bg-[#EDE9FE]/60 focus-visible:ring-[#A78BFA]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
