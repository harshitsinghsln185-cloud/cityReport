import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import resolverTaskService from '../../services/resolverTask.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
      setTasks(res.tasks);
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              New Dispatch Requests
            </span>
            <span className="text-xs text-[#64748B]">Offers: {tasks.length}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Job Offers & Assignments
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Evaluate dispatched repair assignments allocated to your service territory and confirm acceptance
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAssignments}
          disabled={loading}
          className="gap-2 text-[#475569] border-[#E2E8F0] self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Offers</span>
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
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
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-xl border border-[#E2E8F0] animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border border-[#E2E8F0]">
          <EmptyState
            icon={<Inbox className="w-8 h-8 text-[#7C3AED]" />}
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
                className="border border-[#E2E8F0] hover:border-[#A78BFA] transition-all p-6 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {priority} Priority
                      </span>
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#7C3AED]" />
                        {task.category?.name || 'Civic Issue'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                      {task.title}
                    </h3>

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                      <span className="flex items-center gap-1 text-[#1E293B] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{task.address?.city || 'Local area'} (Exact address unlocked upon accept)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Assigned {new Date(task.createdAt).toLocaleDateString('en-IN')}</span>
                      </span>
                    </div>

                    {/* Privacy notice banner */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F7FC] border border-[#E2E8F0] text-[11px] text-[#64748B] max-w-xl">
                      <Lock className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                      <span>Citizen contact number and full street address are protected and will unlock when accepted.</span>
                    </div>
                  </div>

                  {/* Right Column: Earnings & Action CTAs */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-[#64748B] block">Assessment Fee</span>
                      <span className="text-xl font-heading font-extrabold text-[#1E293B]">
                        {formatRupees(task.fee?.totalPaise)}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        Advance Paid: {formatRupees(task.fee?.advancePaise)}
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
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleAccept(task._id)}
                        disabled={isAccepting}
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold gap-1.5 shadow-sm"
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

                      <Link to={`/resolver/tasks/${task._id}`}>
                        <Button variant="ghost" size="sm" className="text-xs p-2 text-[#64748B]">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
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
          title={`Decline Assignment Offer: ${targetTask.issueCode}`}
        >
          <form onSubmit={handleDeclineSubmit} className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Declining this task will return it to operations triage so another contractor can be allocated. A reason is required for administrative tracking.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Reason for Declining (required)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Current workload capacity exceeded; Specialized heavy machinery unavailable this week..."
                className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-0.5 block">
                Minimum 5 characters ({declineReason.length} entered)
              </span>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {modalError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
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
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
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
