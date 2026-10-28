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
  Navigation,
  ShieldCheck,
  ChevronRight,
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-pulse">
        <div className="h-6 w-52 bg-slate-200 rounded-lg" />
        <div className="h-44 bg-card rounded-card border border-border" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-card rounded-card border border-border" />
          <div className="h-96 bg-card rounded-card border border-border" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-ink mb-2">Task Not Found</h2>
        <p className="text-sm text-secondaryText mb-6 max-w-md mx-auto">
          The requested task could not be located, or is not allocated to your certified contractor account.
        </p>
        <Button to="/resolver/tasks" variant="outline">Return to Task Queue</Button>
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
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-secondaryText">
        <Link to="/resolver" className="hover:text-primary transition-colors">Workspace</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link to="/resolver/tasks" className="hover:text-primary transition-colors">Tasks</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <span className="font-mono font-semibold text-ink">{task.issueCode}</span>
      </nav>

      {/* Action Banner / Feedback */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Privacy Notice Banner when Assigned */}
      {isAssigned && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-ink text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-ink">New Task Assignment Pending Acceptance</p>
              <p className="text-secondaryText text-[11px] mt-0.5">
                Accept this task to unlock the citizen's telephone contact and complete building address for on-site inspection.
              </p>
            </div>
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
              className="text-xs font-semibold gap-1.5 shadow-xs"
            >
              {accepting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Accepting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Assignment</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Ready to Start Banner when Accepted */}
      {isAccepted && (
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Unlock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sky-950">Citizen Contact & Address Unlocked</p>
              <p className="text-sky-800 text-[11px] mt-0.5">
                You have accepted this task. Coordinate with the citizen and click &quot;Start Work On-Site&quot; upon arrival.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleStartTask}
            disabled={starting}
            className="text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
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
      <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                {task.issueCode}
              </span>
              <StatusBadge status={task.status} />
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${
                  priority === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : priority === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-canvas text-secondaryText border border-border'
                }`}
              >
                {priority} Priority
              </span>
              <span className="text-xs text-secondaryText flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-secondaryText" />
                {new Date(task.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              {task.title}
            </h1>
            <p className="text-xs text-secondaryText mt-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Category: <span className="font-semibold text-ink">{task.category?.name || 'Civic Issue'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDetails}
              className="text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Task</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Description, Proof Uploader or Resolved Proof, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description & Citizen Uploaded Evidence */}
          <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
            <h3 className="font-serif font-bold text-lg text-ink mb-2">Description & Incident Context</h3>
            <p className="text-sm text-secondaryText whitespace-pre-line leading-relaxed mb-6">
              {task.description}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-secondaryText mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
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
                      className="group relative block rounded-xl overflow-hidden border border-border aspect-video bg-canvas hover:shadow-md transition-all"
                    >
                      <img
                        src={img.url}
                        alt={`Evidence photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondaryText italic">No initial evidence photos attached.</p>
              )}
            </div>
          </Card>

          {/* Proof Uploader Widget (when InProgress) */}
          {isInProgress && (
            <ProofUploader onSubmit={handleProofSubmit} isSubmitting={submittingProof} />
          )}

          {/* Display Resolution Proof (when Resolved or later) */}
          {isResolvedOrLater && resolution && (
            <Card className="border border-emerald-300/80 bg-emerald-50/20 rounded-card shadow-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-ink">Verified Completion Proof</h3>
                    <p className="text-xs text-secondaryText">Submitted photographic evidence of on-site remediation</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Resolution Approved
                </span>
              </div>

              <div className="p-3 bg-card rounded-xl border border-border text-xs text-ink mb-5 leading-relaxed">
                <span className="font-bold text-ink">Contractor Remarks: </span>
                <span className="text-secondaryText">{resolution.remarks}</span>
              </div>

              {/* Before and After Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Photos */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <span>Before Repair</span>
                    <span className="text-[11px] text-secondaryText">({resolution.beforeImages?.length || 0})</span>
                  </h4>
                  {resolution.beforeImages && resolution.beforeImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {resolution.beforeImages.map((img: any, i: number) => (
                        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden border border-border aspect-video block group relative">
                          <img src={img.url} alt={`Before ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-secondaryText italic bg-canvas p-3 rounded-lg border border-border">No before photos recorded.</p>
                  )}
                </div>

                {/* After Photos */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <span>After Repair (Proof)</span>
                    <span className="text-[11px] text-emerald-700">({resolution.afterImages?.length || 0})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {resolution.afterImages?.map((img: any, i: number) => (
                      <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden border border-emerald-300 aspect-video block group relative">
                        <img src={img.url} alt={`After ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Proof</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Audit Timeline */}
          <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
            <h3 className="font-serif font-bold text-lg text-ink mb-1">
              Task Execution History & Audit Trail
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              Immutable sequence of status transitions, dispatches, and verification milestones
            </p>
            <IssueTimeline timeline={timeline} />
          </Card>
        </div>

        {/* Right Column (1/3): Citizen Info, Location & Navigation */}
        <div className="space-y-6">
          {/* Citizen Reporter Card */}
          <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-ink">Citizen Contact</h3>
                <p className="text-[11px] text-secondaryText">Reporter identification & coordinate details</p>
              </div>
            </div>

            {isAssigned ? (
              <div className="p-4 rounded-xl bg-canvas border border-border text-center space-y-2">
                <Lock className="w-6 h-6 text-secondaryText mx-auto" />
                <p className="text-xs font-semibold text-ink">Contact Details Protected</p>
                <p className="text-[11px] text-secondaryText leading-relaxed">
                  Citizen telephone number and full street address are shielded until you formally accept this dispatch offer.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-canvas border border-border">
                  <span className="text-secondaryText block text-[11px]">Reporter Name</span>
                  <span className="font-semibold text-ink text-sm">{task.reporter?.name || 'Citizen'}</span>
                </div>

                <div className="p-3 rounded-xl bg-canvas border border-border">
                  <span className="text-secondaryText block text-[11px] mb-1">Telephone Dialer</span>
                  {task.contactNumber || task.reporter?.phone ? (
                    <a
                      href={`tel:${task.contactNumber || task.reporter?.phone}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white font-mono font-semibold text-xs hover:bg-primaryHover transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{task.contactNumber || task.reporter?.phone}</span>
                    </a>
                  ) : (
                    <span className="text-secondaryText italic text-[11px]">No contact number attached</span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-canvas border border-border">
                  <span className="text-secondaryText block text-[11px]">Email Address</span>
                  <span className="font-mono text-ink text-xs">{task.reporter?.email || 'N/A'}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Location & Navigation */}
          <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-ink">Site Location</h3>
                <p className="text-[11px] text-secondaryText">Dispatch destination & GPS routing</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-border">
                <span className="text-secondaryText block text-[11px] mb-1">Street Address</span>
                <p className="text-ink font-medium leading-relaxed">
                  {isAssigned ? (
                    <span>{task.address?.city || 'Local Territory'} (Full street address unlocked upon acceptance)</span>
                  ) : (
                    <span>{task.address?.street}, {task.address?.city} - {task.address?.pincode}</span>
                  )}
                </p>
              </div>

              {task.location?.coordinates && (
                <div className="p-3 rounded-xl bg-canvas border border-border flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-secondaryText">GPS Coordinates</span>
                    <span className="font-mono text-ink">
                      {task.location.coordinates[1]?.toFixed(5)}, {task.location.coordinates[0]?.toFixed(5)}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${task.location.coordinates[1]},${task.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold text-xs border border-primary/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
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
            <p className="text-xs text-secondaryText leading-relaxed">
              Declining will return this task to municipal dispatch administration for re-assignment. Please provide a formal explanation for audit records.
            </p>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Reason for Declining (required)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Beyond current tool capability; Scheduled capacity limit reached..."
                className="w-full p-3 text-xs border border-border rounded-xl bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all leading-relaxed"
                required
              />
              <span className="text-[11px] font-mono text-secondaryText mt-1 block">
                Minimum 5 characters ({declineReason.length} entered)
              </span>
            </div>

            {declineError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {declineError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
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
