import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import resolverTaskService, { TaskDetailsResponse } from '../../services/resolverTask.service';
import ProofUploader from '../../components/ProofUploader';
import IssueTimeline from '../../components/IssueTimeline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Play,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  RefreshCw,
  Image as ImageIcon,
  Lock,
  Unlock,
  Loader2,
} from 'lucide-react';

export const ResolverTaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<TaskDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Decline Modal State
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState<boolean>(false);
  const [declineReason, setDeclineReason] = useState<string>('');
  const [declineSubmitting, setDeclineSubmitting] = useState<boolean>(false);
  const [declineError, setDeclineError] = useState<string | null>(null);

  // Status Action Loading States
  const [accepting, setAccepting] = useState<boolean>(false);
  const [starting, setStarting] = useState<boolean>(false);
  const [submittingProof, setSubmittingProof] = useState<boolean>(false);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await resolverTaskService.getTaskDetails(id);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve task details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAcceptTask = async () => {
    if (!id) return;
    try {
      setAccepting(true);
      setActionSuccess(null);
      setError(null);
      await resolverTaskService.acceptTask(id);
      setActionSuccess('Task accepted successfully! Citizen contact details unlocked.');
      fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to accept task');
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!declineReason.trim() || declineReason.trim().length < 5) {
      setDeclineError('A valid explanation of at least 5 characters is required.');
      return;
    }

    try {
      setDeclineSubmitting(true);
      setDeclineError(null);
      await resolverTaskService.rejectTask(id, declineReason.trim());
      setIsDeclineModalOpen(false);
      navigate('/resolver/assignments');
    } catch (err: any) {
      setDeclineError(err?.response?.data?.message || 'Failed to decline task');
    } finally {
      setDeclineSubmitting(false);
    }
  };

  const handleStartTask = async () => {
    if (!id) return;
    try {
      setStarting(true);
      setActionSuccess(null);
      setError(null);
      await resolverTaskService.startTask(id);
      setActionSuccess('Work marked as In Progress. You can now execute repairs and submit completion proof.');
      fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to start task');
    } finally {
      setStarting(false);
    }
  };

  const handleProofSubmit = async (proofData: {
    beforeFiles: File[];
    afterFiles: File[];
    remarks: string;
  }) => {
    if (!id) return;
    try {
      setSubmittingProof(true);
      setActionSuccess(null);
      setError(null);

      const formData = new FormData();
      formData.append('remarks', proofData.remarks);
      proofData.beforeFiles.forEach((file) => formData.append('beforeImages', file));
      proofData.afterFiles.forEach((file) => formData.append('afterImages', file));

      await resolverTaskService.submitResolutionProof(id, formData);
      setActionSuccess('Resolution proof successfully uploaded! Task transitioned to Resolved.');
      fetchDetails();
    } catch (err: any) {
      throw err;
    } finally {
      setSubmittingProof(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-64 bg-white rounded-xl border border-[#E2E8F0] animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Task Not Found</h2>
        <p className="text-sm text-[#64748B] mb-6">
          The requested task could not be located, or is not assigned to your contractor account.
        </p>
        <Link to="/resolver/tasks">
          <Button variant="outline">Return to Task Queue</Button>
        </Link>
      </div>
    );
  }

  const { task, timeline } = data;
  const isAssigned = task.status === 'Assigned';
  const isAccepted = task.status === 'Accepted';
  const isInProgress = task.status === 'InProgress';
  const isResolvedOrLater = ['Resolved', 'BalanceDue', 'Closed'].includes(task.status);
  const priority = task.finalPriority || task.suggestedPriority || 'Medium';
  const resolution = task.resolution as any;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/resolver" className="hover:text-[#7C3AED] transition-colors">Workspace</Link>
        <span>/</span>
        <Link to="/resolver/tasks" className="hover:text-[#7C3AED] transition-colors">Tasks</Link>
        <span>/</span>
        <span className="font-semibold text-[#1E293B]">{task.issueCode}</span>
      </div>

      {/* Action Banner / Feedback */}
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

      {/* Privacy Notice Banner when Assigned */}
      {isAssigned && (
        <div className="p-4 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#312E81] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#7C3AED] shrink-0" />
            <span>
              <strong>New Task Assignment:</strong> Accept this task to unlock the citizen's contact telephone number and complete building address.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeclineModalOpen(true)}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptTask}
              disabled={accepting}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              {accepting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Accepting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Task</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Ready to Start Banner when Accepted */}
      {isAccepted && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Unlock className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              <strong>Citizen Details Unlocked:</strong> You have accepted this task. When you arrive on-site, click "Start Work" to begin physical remediation.
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleStartTask}
            disabled={starting}
            className="bg-[#312E81] hover:bg-[#1E1B4B] text-white text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
          >
            {starting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Starting Work...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Work On-Site</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Header Banner */}
      <Card className="border border-[#E2E8F0] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                {task.issueCode}
              </span>
              <StatusBadge status={task.status} />
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
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
                <Calendar className="w-3.5 h-3.5" />
                {new Date(task.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#1E293B]">
              {task.title}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
              Category: <span className="font-semibold text-[#1E293B]">{task.category?.name || 'Civic Issue'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDetails}
              className="text-[#475569] border-[#E2E8F0] text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Description, Proof Uploader or Resolved Proof, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description & Citizen Uploaded Evidence */}
          <Card className="border border-[#E2E8F0]">
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">Description & Initial Evidence</h3>
            <p className="text-sm text-[#475569] whitespace-pre-line leading-relaxed mb-6">
              {task.description}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                Citizen Uploaded Evidence ({task.images?.length || 0})
              </h4>

              {task.images && task.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {task.images.map((img, idx) => (
                    <a
                      key={img.publicId || idx}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block rounded-xl overflow-hidden border border-[#E2E8F0] aspect-video bg-slate-100 hover:shadow-md transition-all"
                    >
                      <img
                        src={img.url}
                        alt={`Evidence photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-[#171A3B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No initial evidence photos attached.</p>
              )}
            </div>
          </Card>

          {/* Proof Uploader Widget (when InProgress) */}
          {isInProgress && (
            <ProofUploader onSubmit={handleProofSubmit} isSubmitting={submittingProof} />
          )}

          {/* Display Resolution Proof (when Resolved or later) */}
          {isResolvedOrLater && resolution && (
            <Card className="border border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-bold text-base text-[#1E293B]">Submitted Completion Proof</h3>
              </div>

              <p className="text-xs text-[#475569] mb-4 bg-white p-3 rounded-lg border border-[#E2E8F0] leading-relaxed">
                <strong>Remarks:</strong> {resolution.remarks}
              </p>

              {/* Before and After Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Photos */}
                <div>
                  <h4 className="text-xs font-semibold text-[#1E293B] mb-2">Before Repair</h4>
                  {resolution.beforeImages && resolution.beforeImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {resolution.beforeImages.map((img: any, i: number) => (
                        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="rounded-lg overflow-hidden border border-[#E2E8F0] aspect-video block">
                          <img src={img.url} alt={`Before ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No before photos attached.</p>
                  )}
                </div>

                {/* After Photos */}
                <div>
                  <h4 className="text-xs font-semibold text-emerald-700 mb-2">After Repair (Completion Proof)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {resolution.afterImages?.map((img: any, i: number) => (
                      <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="rounded-lg overflow-hidden border border-emerald-300 aspect-video block">
                        <img src={img.url} alt={`After ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Audit Timeline */}
          <Card className="border border-[#E2E8F0]">
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1">
              Task Execution History
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Historical log of job transitions and milestones
            </p>
            <IssueTimeline timeline={timeline} />
          </Card>
        </div>

        {/* Right Column (1/3): Citizen Info, Location & Navigation */}
        <div className="space-y-6">
          {/* Citizen Reporter Card */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Citizen Contact</h3>
            </div>

            {isAssigned ? (
              <div className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E2E8F0] text-center space-y-2">
                <Lock className="w-6 h-6 text-[#64748B] mx-auto" />
                <p className="text-xs font-semibold text-[#1E293B]">Contact Details Protected</p>
                <p className="text-[11px] text-[#64748B]">
                  Citizen telephone number and full address are hidden until you accept this assignment.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Reporter Name</span>
                  <span className="font-semibold text-[#1E293B]">{task.reporter?.name || 'Citizen'}</span>
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px]">Contact Telephone</span>
                  {task.contactNumber || task.reporter?.phone ? (
                    <a
                      href={`tel:${task.contactNumber || task.reporter?.phone}`}
                      className="text-[#7C3AED] font-bold hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{task.contactNumber || task.reporter?.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic">No phone provided</span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px]">Email</span>
                  <span className="text-[#1E293B]">{task.reporter?.email || 'N/A'}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Location & Navigation */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Site Location</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="text-[#1E293B] font-medium leading-relaxed">
                {isAssigned ? (
                  <span>{task.address?.city} (Full street address unlocked upon accept)</span>
                ) : (
                  <span>{task.address?.street}, {task.address?.city} - {task.address?.pincode}</span>
                )}
              </p>

              {task.location?.coordinates && (
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[#64748B] font-mono text-[11px]">
                    {task.location.coordinates[1]?.toFixed(5)}, {task.location.coordinates[0]?.toFixed(5)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${task.location.coordinates[1]},${task.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7C3AED] hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Decline Assignment Modal */}
      {isDeclineModalOpen && (
        <Modal
          isOpen={isDeclineModalOpen}
          onClose={() => setIsDeclineModalOpen(false)}
          title={`Decline Task: ${task.issueCode}`}
        >
          <form onSubmit={handleDeclineSubmit} className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Declining will return this task to operations administration for re-assignment. Please explain why you cannot undertake this repair.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Reason for Declining (required)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Beyond workload capacity; Specialized tools currently in repair..."
                className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                required
              />
              <span className="text-[11px] text-[#64748B] mt-0.5 block">
                Minimum 5 characters ({declineReason.length} entered)
              </span>
            </div>

            {declineError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {declineError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDeclineModalOpen(false)}
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

export default ResolverTaskDetailsPage;
