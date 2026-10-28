import React, { useState, useEffect, useCallback } from 'react';
import resolverTaskService from '../../services/resolverTask.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Layers,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Loader2,
  Lock,
} from 'lucide-react';

export const ResolverAssignmentsPage: React.FC = () => {
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Decline Modal State
  const [targetTask, setTargetTask] = useState<Issue | null>(null);
  const [declineReason, setDeclineReason] = useState<string>('');
  const [declineSubmitting, setDeclineSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Accept Loading State
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await resolverTaskService.listTasks({ status: 'Assigned', limit: 50 });
      setTasks(Array.isArray(res?.tasks) ? res.tasks : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve assignment offers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAccept = async (taskId: string) => {
    try {
      setAcceptingId(taskId);
      setActionSuccess(null);
      setError(null);
      await resolverTaskService.acceptTask(taskId);
      setActionSuccess('Task successfully accepted! Citizen contact details and exact address unlocked.');
      fetchAssignments();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to accept task assignment.');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTask) return;

    if (!declineReason.trim() || declineReason.trim().length < 5) {
      setModalError('Please state a valid reason (at least 5 characters) for declining this assignment.');
      return;
    }

    try {
      setDeclineSubmitting(true);
      setModalError(null);
      await resolverTaskService.rejectTask(targetTask._id, declineReason.trim());
      setActionSuccess(`Assignment ${targetTask.issueCode} declined and returned to operations triage.`);
      setTargetTask(null);
      setDeclineReason('');
      fetchAssignments();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to decline assignment.');
    } finally {
      setDeclineSubmitting(false);
    }
  };

  const formatRupees = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm" className="font-semibold uppercase tracking-wider">
              New Dispatch Requests
            </Badge>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 tabular-nums">
              {tasks.length} Offers Available
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
            Job Offers & Assignments
          </h1>
          <p className="text-xs sm:text-sm text-secondaryText">
            Evaluate dispatched repair assignments allocated to your service territory and confirm acceptance.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAssignments}
          disabled={loading}
          className="self-start sm:self-auto"
          leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
        >
          Refresh Offers
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-red-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-card border border-border animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border-border shadow-card">
          <EmptyState
            icon={<Inbox className="w-8 h-8 text-primary" />}
            title="No Pending Assignment Offers"
            description="You currently have no unreviewed job offers. As soon as an administrator assigns a civic repair in your territory, it will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isAccepting = acceptingId === task._id;
            const priority = task.finalPriority || task.suggestedPriority || 'Medium';

            return (
              <Card
                key={task._id}
                className="border-border hover:border-primary/40 transition-all p-6 relative overflow-hidden shadow-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <Badge variant="neutral" size="sm" className="font-semibold">
                        {priority} Priority
                      </Badge>
                      <span className="text-xs text-secondaryText flex items-center gap-1 font-medium">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        {task.category?.name || 'Civic Defect'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
                      {task.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-secondaryText line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondaryText pt-1">
                      <span className="flex items-center gap-1 text-ink font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{task.address?.city || 'Local area'} (Exact street unlocked on acceptance)</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Assigned {new Date(task.createdAt).toLocaleDateString('en-IN')}</span>
                      </span>
                    </div>

                    {/* Privacy notice banner */}
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-canvas border border-border text-[11px] text-secondaryText max-w-xl">
                      <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Citizen contact number and full street address are protected and will unlock when accepted.</span>
                    </div>
                  </div>

                  {/* Right Column: Earnings & Action CTAs */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-muted block">Contractor Service Fee</span>
                      <span className="text-2xl font-heading font-black text-ink tabular-nums block mt-0.5">
                        {formatRupees(task.fee?.totalPaise)}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                        50% Advance Paid: {formatRupees(task.fee?.advancePaise)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTargetTask(task);
                          setDeclineReason('');
                          setModalError(null);
                        }}
                        className="text-red-700 border-red-200 hover:bg-red-50 text-xs gap-1"
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Decline
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAccept(task._id)}
                        disabled={isAccepting}
                        className="text-xs font-semibold gap-1.5 shadow-xs"
                      >
                        {isAccepting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Accepting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Job</span>
                          </>
                        )}
                      </Button>

                      <Button to={`/resolver/tasks/${task._id}`} variant="ghost" size="sm" className="text-xs p-2 text-muted hover:text-ink">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Decline Assignment Modal */}
      {targetTask && (
        <Modal
          isOpen={!!targetTask}
          onClose={() => setTargetTask(null)}
          title={`Decline Job Offer: ${targetTask.issueCode}`}
        >
          <form onSubmit={handleDeclineSubmit} className="space-y-4">
            <p className="text-xs text-secondaryText leading-relaxed">
              Declining this task returns it to operations triage so another contractor can be allocated without delay. A reason is required for administrative audit tracking.
            </p>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Reason for Declining <span className="text-red-700">*</span>
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Current workload capacity exceeded; Specialized heavy equipment unavailable this week..."
                className="w-full p-3 text-xs rounded-lg border border-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
                required
              />
              <span className="text-[11px] text-muted mt-1 block">
                Minimum 5 characters ({declineReason.length} entered)
              </span>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                {modalError}
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTargetTask(null)}
                disabled={declineSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="danger"
                disabled={declineSubmitting || declineReason.trim().length < 5}
              >
                {declineSubmitting ? 'Declining...' : 'Confirm Decline'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ResolverAssignmentsPage;
