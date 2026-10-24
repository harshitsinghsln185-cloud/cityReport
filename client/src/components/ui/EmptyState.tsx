import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  icon = null,
  actionButton = null,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card bg-white border border-border border-dashed shadow-xs ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-lavender flex items-center justify-center text-primary mb-4 shadow-xs">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-heading font-semibold text-ink mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-secondaryText max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionButton && <div className="flex items-center gap-3">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
