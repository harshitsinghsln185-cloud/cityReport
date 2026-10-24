import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'gold'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
  ...props
}) => {
  const variantStyles: Record<NonNullable<BadgeProps['variant']>, { bg: string; text: string; border: string; dot: string }> = {
    primary: {
      bg: 'bg-lavender',
      text: 'text-primary',
      border: 'border-primary/20',
      dot: 'bg-primary',
    },
    secondary: {
      bg: 'bg-indigo/10',
      text: 'text-indigo',
      border: 'border-indigo/20',
      dot: 'bg-indigo',
    },
    gold: {
      bg: 'bg-gold-light',
      text: 'text-gold-hover',
      border: 'border-gold-border',
      dot: 'bg-gold',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      dot: 'bg-green-600',
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      dot: 'bg-blue-600',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-600',
    },
    danger: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      dot: 'bg-red-600',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-ink',
      border: 'border-border',
      dot: 'bg-slate-400',
    },
    neutral: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const current = variantStyles[variant] || variantStyles.neutral;

  const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border tabular-nums select-none
        ${current.bg} ${current.text} ${current.border}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `.trim()}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
