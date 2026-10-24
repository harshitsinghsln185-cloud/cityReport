import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'card' | 'stat' | 'table-row' | 'button';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const baseClasses =
    'relative overflow-hidden bg-slate-200/70 before:absolute before:inset-0 ' +
    'before:-translate-x-full before:animate-[shimmer_2s_infinite] ' +
    'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

  const variants: Record<NonNullable<SkeletonProps['variant']>, string> = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full w-10 h-10 shrink-0',
    card: 'h-40 w-full rounded-card border border-border/60',
    stat: 'h-24 w-full rounded-card border border-border/60',
    'table-row': 'h-12 w-full rounded-lg',
    button: 'h-10 w-28 rounded-lg',
  };

  const skeletonElement = (idx: number) => (
    <div
      key={idx}
      aria-hidden="true"
      className={`${baseClasses} ${variants[variant] || variants.text} ${className}`}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3 w-full" aria-busy="true" aria-live="polite">
        {Array.from({ length: count }).map((_, i) => skeletonElement(i))}
      </div>
    );
  }

  return (
    <div className="w-full" aria-busy="true" aria-live="polite">
      {skeletonElement(0)}
    </div>
  );
};

export default Skeleton;
