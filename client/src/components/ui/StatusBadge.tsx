import React from 'react';

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
  const configs: Record<string, { text: string; bg: string; textCol: string; dot: string }> = {
    AwaitingAdvance: {
      text: 'Awaiting Advance',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    AwaitingQuote: {
      text: 'Awaiting Quote',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    Submitted: {
      text: 'Submitted',
      bg: 'bg-blue-50',
      textCol: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    UnderReview: {
      text: 'Under Review',
      bg: 'bg-blue-50',
      textCol: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    Assigned: {
      text: 'Assigned',
      bg: 'bg-blue-50',
      textCol: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    Accepted: {
      text: 'Accepted',
      bg: 'bg-blue-50',
      textCol: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    InProgress: {
      text: 'In Progress',
      bg: 'bg-blue-50',
      textCol: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    Resolved: {
      text: 'Resolved',
      bg: 'bg-emerald-50',
      textCol: 'text-emerald-800',
      dot: 'bg-emerald-500',
    },
    BalanceDue: {
      text: 'Balance Due',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    Closed: {
      text: 'Closed',
      bg: 'bg-green-50',
      textCol: 'text-green-800',
      dot: 'bg-green-500',
    },
    Rejected: {
      text: 'Rejected',
      bg: 'bg-rose-50',
      textCol: 'text-rose-800',
      dot: 'bg-rose-500',
    },
    Cancelled: {
      text: 'Cancelled',
      bg: 'bg-rose-50',
      textCol: 'text-rose-800',
      dot: 'bg-rose-500',
    },
    ReassignNeeded: {
      text: 'Reassign Needed',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    Reopened: {
      text: 'Reopened',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    Pending: {
      text: 'Pending',
      bg: 'bg-amber-50',
      textCol: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    Paid: {
      text: 'Paid',
      bg: 'bg-green-50',
      textCol: 'text-green-800',
      dot: 'bg-green-500',
    },
    Approved: {
      text: 'Approved',
      bg: 'bg-emerald-50',
      textCol: 'text-emerald-800',
      dot: 'bg-emerald-500',
    },
  };

  const config = configs[status] || {
    text: status,
    bg: 'bg-slate-100',
    textCol: 'text-slate-700',
    dot: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.bg} ${config.textCol} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.text}</span>
    </span>
  );
};

export default StatusBadge;
