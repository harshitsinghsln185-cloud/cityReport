import React from 'react';
import Badge, { BadgeProps } from './Badge';

export type IssueStatus =
  | 'AwaitingAdvance'
  | 'AwaitingQuote'
  | 'Submitted'
  | 'UnderReview'
  | 'Assigned'
  | 'Accepted'
  | 'InProgress'
  | 'Resolved'
  | 'BalanceDue'
  | 'Closed'
  | 'Rejected'
  | 'Cancelled'
  | 'ReassignNeeded'
  | 'Reopened'
  | 'Pending'
  | 'Paid'
  | 'Approved'
  | string;

export interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'Submitted',
  size = 'md',
  className = '',
}) => {
  const configs: Record<string, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
    AwaitingAdvance: { label: 'Awaiting Advance', variant: 'warning' },
    AwaitingQuote: { label: 'Awaiting Quote', variant: 'warning' },
    Submitted: { label: 'Submitted', variant: 'info' },
    UnderReview: { label: 'Under Review', variant: 'info' },
    Assigned: { label: 'Assigned', variant: 'info' },
    Accepted: { label: 'Accepted', variant: 'info' },
    InProgress: { label: 'In Progress', variant: 'info' },
    Resolved: { label: 'Resolved', variant: 'success' },
    BalanceDue: { label: 'Balance Due', variant: 'warning' },
    Closed: { label: 'Closed', variant: 'success' },
    Rejected: { label: 'Rejected', variant: 'danger' },
    Cancelled: { label: 'Cancelled', variant: 'danger' },
    ReassignNeeded: { label: 'Reassign Needed', variant: 'warning' },
    Reopened: { label: 'Reopened', variant: 'warning' },
    Pending: { label: 'Pending', variant: 'warning' },
    Paid: { label: 'Paid', variant: 'success' },
    Approved: { label: 'Approved', variant: 'success' },
  };

  const config = configs[status] || {
    label: status.replace(/([A-Z])/g, ' $1').trim(),
    variant: 'neutral' as const,
  };

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
