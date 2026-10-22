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
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    AwaitingQuote: {
      text: 'Awaiting Quote',
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    Submitted: {
      text: 'Submitted',
      bg: 'bg-[#DBEAFE]',
      textCol: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    UnderReview: {
      text: 'Under Review',
      bg: 'bg-[#DBEAFE]',
      textCol: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    Assigned: {
      text: 'Assigned',
      bg: 'bg-[#DBEAFE]',
      textCol: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    Accepted: {
      text: 'Accepted',
      bg: 'bg-[#DBEAFE]',
      textCol: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    InProgress: {
      text: 'In Progress',
      bg: 'bg-[#DBEAFE]',
      textCol: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    Resolved: {
      text: 'Resolved',
      bg: 'bg-[#DCFCE7]',
      textCol: 'text-[#166534]',
      dot: 'bg-[#166534]',
    },
    BalanceDue: {
      text: 'Balance Due',
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    Closed: {
      text: 'Closed',
      bg: 'bg-[#DCFCE7]',
      textCol: 'text-[#166534]',
      dot: 'bg-[#166534]',
    },
    Rejected: {
      text: 'Rejected',
      bg: 'bg-[#FEE2E2]',
      textCol: 'text-[#991B1B]',
      dot: 'bg-[#991B1B]',
    },
    Cancelled: {
      text: 'Cancelled',
      bg: 'bg-[#FEE2E2]',
      textCol: 'text-[#991B1B]',
      dot: 'bg-[#991B1B]',
    },
    ReassignNeeded: {
      text: 'Reassign Needed',
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    Reopened: {
      text: 'Reopened',
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    Pending: {
      text: 'Pending',
      bg: 'bg-[#FEF3C7]',
      textCol: 'text-[#92400E]',
      dot: 'bg-[#92400E]',
    },
    Paid: {
      text: 'Paid',
      bg: 'bg-[#DCFCE7]',
      textCol: 'text-[#166534]',
      dot: 'bg-[#166534]',
    },
    Approved: {
      text: 'Approved',
      bg: 'bg-[#DCFCE7]',
      textCol: 'text-[#166534]',
      dot: 'bg-[#166534]',
    },
  };

  const config = configs[status] || {
    text: status,
    bg: 'bg-[#EDE9FE]',
    textCol: 'text-[#312E81]',
    dot: 'bg-[#7C3AED]',
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
