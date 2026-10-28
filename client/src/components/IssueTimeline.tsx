import React from 'react';
import {
  Clock,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  User,
  CreditCard,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { TimelineEvent } from '../services/issue.service';

export interface IssueTimelineProps {
  timeline: TimelineEvent[];
  className?: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATED':
      return <Clock className="w-4 h-4 text-primary" />;
    case 'ADVANCE_PAID':
    case 'BALANCE_PAID':
      return <CreditCard className="w-4 h-4 text-emerald-600" />;
    case 'ASSIGNED':
    case 'ACCEPTED':
      return <User className="w-4 h-4 text-primary" />;
    case 'IN_PROGRESS':
      return <Wrench className="w-4 h-4 text-amber-600" />;
    case 'RESOLVED':
    case 'CLOSED':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'REJECTED':
    case 'CANCELLED':
      return <XCircle className="w-4 h-4 text-rose-600" />;
    case 'REOPENED':
    case 'REASSIGN_NEEDED':
      return <RotateCcw className="w-4 h-4 text-amber-600" />;
    default:
      return <ShieldCheck className="w-4 h-4 text-primary" />;
  }
};

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-primary text-white';
    case 'Resolver':
      return 'bg-accent-light text-accent-text border border-accent-border';
    case 'User':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

export const IssueTimeline: React.FC<IssueTimelineProps> = ({ timeline = [], className = '' }) => {
  if (timeline.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted">
        No audit activity recorded yet.
      </div>
    );
  }

  return (
    <div className={`space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border ${className}`}>
      {timeline.map((event, idx) => {
        const isLatest = idx === timeline.length - 1;

        return (
          <div key={event._id || idx} className="relative flex items-start gap-4 pl-1">
            {/* Dot / Icon */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border shadow-xs ${
                isLatest
                  ? 'bg-white border-primary ring-4 ring-primary-light'
                  : 'bg-white border-border'
              }`}
            >
              {getActionIcon(event.action)}
            </div>

            {/* Event Content Card */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-border shadow-2xs space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">
                    {event.action.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadgeStyle(event.actorRole)}`}>
                    {event.actor?.name || event.actorRole}
                  </span>
                </div>

                <time className="text-xs text-muted">
                  {new Date(event.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
              </div>

              {/* Status Transition */}
              <div className="text-xs text-muted flex items-center gap-1.5">
                <span>Status transition:</span>
                <span className="font-medium text-secondaryText">{event.fromStatus}</span>
                <span>&rarr;</span>
                <span className="font-semibold text-primary">{event.toStatus}</span>
              </div>

              {/* Remarks */}
              {event.remarks && (
                <div className="p-2.5 rounded-lg bg-canvas border border-border text-secondaryText mt-1 whitespace-pre-wrap">
                  {event.remarks}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IssueTimeline;
