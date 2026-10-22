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
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-white border border-[#E2E8F0] border-dashed ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-4">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-heading font-bold text-[#1E293B] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-6">
        {description}
      </p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
