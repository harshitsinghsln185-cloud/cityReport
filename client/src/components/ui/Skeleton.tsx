import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'card' | 'table-row';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-[#EDE9FE]/60 rounded';

  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    card: 'h-32 w-full rounded-xl',
    'table-row': 'h-10 w-full rounded-lg',
  };

  const skeletonElement = (idx: number) => (
    <div
      key={idx}
      className={`${baseClasses} ${variants[variant] || variants.text} ${className}`}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: count }).map((_, i) => skeletonElement(i))}
      </div>
    );
  }

  return skeletonElement(0);
};

export default Skeleton;
