import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'gold'
    | 'navy'
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
      bg: 'bg-primary-light',
      text: 'text-primary',
      border: 'border-primary/20',
      dot: 'bg-primary',
    },
    navy: {
      bg: 'bg-navy',
      text: 'text-white',
      border: 'border-navy-muted',
      dot: 'bg-gold',
    },
    secondary: {
      bg: 'bg-surfaceAlt',
      text: 'text-ink',
      border: 'border-border',
      dot: 'bg-muted',
    },
    gold: {
      bg: 'bg-accent-light',
      text: 'text-accent-text',
      border: 'border-accent-border',
      dot: 'bg-accent',
    },
    success: {
      bg: 'bg-status-success-bg',
      text: 'text-status-success',
      border: 'border-emerald-200',
      dot: 'bg-status-success',
    },
    info: {
      bg: 'bg-status-info-bg',
      text: 'text-status-info',
      border: 'border-blue-200',
      dot: 'bg-status-info',
    },
    warning: {
      bg: 'bg-status-warning-bg',
      text: 'text-status-warning',
      border: 'border-amber-200',
      dot: 'bg-status-warning',
    },
    danger: {
      bg: 'bg-status-danger-bg',
      text: 'text-status-danger',
      border: 'border-red-200',
      dot: 'bg-status-danger',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-ink',
      border: 'border-border',
      dot: 'bg-slate-400',
    },
    neutral: {
      bg: 'bg-surfaceAlt',
      text: 'text-secondaryText',
      border: 'border-border',
      dot: 'bg-muted',
    },
  };

  const current = variantStyles[variant] || variantStyles.neutral;

  const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
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
