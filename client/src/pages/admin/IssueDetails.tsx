import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService, { CandidateResolver, IssueDetailData } from '../../services/admin.service';
import financeService from '../../services/finance.service';
import ResolverPicker from '../../components/ResolverPicker';
import IssueTimeline from '../../components/IssueTimeline';
import InvoiceButton from '../../components/InvoiceButton';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import {
  AlertOctagon,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Wrench,
  DollarSign,
  Receipt,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Layers,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminIssueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<IssueDetailData | null>(null);
  const [candidates, setCandidates] = useState<CandidateResolver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [candidatesLoading, setCandidatesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Priority Override State
  const [selectedPriority, setSelectedPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [prioritySaving, setPrioritySaving] = useState<boolean>(false);

  // Manual Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteRupees, setQuoteRupees] = useState<string>('1200');
  const [quoteSubmitting, setQuoteSubmitting] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Reject Issue Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectSubmitting, setRejectSubmitting] = useState<boolean>(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // M9 Verification and Rework States
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isReworkModalOpen, setIsReworkModalOpen] = useState<boolean>(false);
  const [reworkRemarks, setReworkRemarks] = useState<string>('');
  const [reworkSubmitting, setReworkSubmitting] = useState<boolean>(false);
  const [reworkError, setReworkError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getIssueDetails(id);
      setData(res);
      setSelectedPriority(res.issue.finalPriority || res.issue.suggestedPriority || 'Medium');

      // If eligible for assignment, fetch candidate resolvers
      const assignableStatuses = ['Submitted', 'UnderReview', 'ReassignNeeded', 'Reopened'];
      if (assignableStatuses.includes(res.issue.status)) {
        fetchCandidates(id);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve issue details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCandidates = async (issueId: string) => {
    try {
      setCandidatesLoading(true);
      const res = await adminService.getCandidates(issueId);
      setCandidates(res);
    } catch (err: any) {
      console.error('Candidate fetch error:', err);
    } finally {
      setCandidatesLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Handle Priority Override
  const handlePriorityUpdate = async () => {
    if (!id || !data) return;
    try {
      setPrioritySaving(true);
      setActionSuccess(null);
      const updated = await adminService.updatePriority(id, selectedPriority);
      setData((prev) => (prev ? { ...prev, issue: updated } : null));
      setActionSuccess(`Operational priority overridden to ${selectedPriority}`);
      fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update issue priority');
    } finally {
      setPrioritySaving(false);
    }
  };

  // Handle Assign Resolver
  const handleAssignResolver = async (resolverId: string) => {
    if (!id) return;
    try {
      setActionSuccess(null);
      setError(null);
      await adminService.assignResolver(id, resolverId);
      setActionSuccess('Certified contractor successfully assigned to this civic issue.');
      await fetchDetails();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError('Concurrency Conflict (409): Another administrator has already assigned or updated this issue. Refreshing live state...');
        setTimeout(() => fetchDetails(), 1500);
      } else {
        setError(err?.response?.data?.message || 'Failed to assign contractor');
      }
    }
  };

  // Handle Manual Quote Submission
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const val = parseFloat(quoteRupees);
    if (isNaN(val) || val <= 0) {
      setQuoteError('Please enter a valid positive quote in Rupees.');
      return;
    }

    try {
      setQuoteSubmitting(true);
      setQuoteError(null);
      const quotePaise = Math.round(val * 100);
      await adminService.setManualQuote(id, quotePaise);
      setIsQuoteModalOpen(false);
      setActionSuccess(`Manual fee quote of ₹${val.toFixed(2)} established. Issue moved to AwaitingAdvance.`);
      fetchDetails();
    } catch (err: any) {
      setQuoteError(err?.response?.data?.message || 'Failed to set manual quote.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Handle Reject Issue
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!rejectReason.trim()) {
      setRejectError('A clear explanation for rejection is required.');
      return;
    }

    try {
      setRejectSubmitting(true);
      setRejectError(null);
      await adminService.rejectIssue(id, rejectReason.trim());
      setIsRejectModalOpen(false);
      setActionSuccess('Issue rejected and advance payment marked for automated refund.');
      fetchDetails();
    } catch (err: any) {
      setRejectError(err?.response?.data?.message || 'Failed to reject issue.');
    } finally {
      setRejectSubmitting(false);
    }
  };

  // Handle Proof Verification
  const handleVerifyProof = async () => {
    if (!id || !window.confirm('Confirm and verify completion proof? This will approve invoicing and transition issue to BalanceDue.')) {
      return;
    }
    try {
      setVerifying(true);
      setError(null);
      await financeService.verifyResolutionProof(id);
      setActionSuccess('Resolution proof verified successfully! Issue transitioned to BalanceDue.');
      fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to verify resolution proof.');
    } finally {
      setVerifying(false);
    }
  };

  // Handle Request Rework
  const handleRequestRework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!reworkRemarks.trim() || reworkRemarks.trim().length < 5) {
      setReworkError('Rework remarks must be at least 5 characters long explaining why proof was rejected.');
      return;
    }

    try {
      setReworkSubmitting(true);
      setReworkError(null);
      await financeService.requestTaskRework(id, reworkRemarks.trim());
      setIsReworkModalOpen(false);
      setReworkRemarks('');
      setActionSuccess('Task rework requested successfully. Issue returned to InProgress.');
      fetchDetails();
    } catch (err: any) {
      setReworkError(err?.response?.data?.message || 'Failed to request rework.');
    } finally {
      setReworkSubmitting(false);
    }
  };

  const formatRupees = (paise: number = 0) => {
    return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-heading font-bold text-[#1E293B] mb-2">Issue Not Found</h2>
        <p className="text-sm text-[#64748B] mb-6">The requested civic issue record could not be loaded.</p>
        <Link to="/admin/issues">
          <Button variant="outline">Return to Master Queue</Button>
        </Link>
      </div>
    );
  }

  const { issue, timeline, payments, invoices } = data;
  const effectivePriority = issue.finalPriority || issue.suggestedPriority || 'Medium';
  const isAssignable = ['Submitted', 'UnderReview', 'ReassignNeeded', 'Reopened'].includes(issue.status);
  const isAwaitingQuote = issue.status === 'AwaitingQuote';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/admin" className="hover:text-[#7C3AED] transition-colors">Command Center</Link>
        <span>/</span>
        <Link to="/admin/issues" className="hover:text-[#7C3AED] transition-colors">Master Issues</Link>
        <span>/</span>
        <span className="font-semibold text-[#1E293B]">{issue.issueCode}</span>
      </div>

      {/* Action Banner / Feedback */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
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
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <Card className="border border-[#E2E8F0] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                {issue.issueCode}
              </span>
              <StatusBadge status={issue.status} />
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  effectivePriority === 'Critical'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : effectivePriority === 'High'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {effectivePriority} Priority {issue.finalPriority && '(Admin Override)'}
              </span>
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(issue.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#1E293B]">
              {issue.title}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
              Category: <span className="font-semibold text-[#1E293B]">{issue.category?.name || 'General Civic'}</span>
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {isAwaitingQuote && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsQuoteModalOpen(true)}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white gap-2 text-xs font-semibold"
              >
                <DollarSign className="w-4 h-4" />
                <span>Establish Manual Quote</span>
              </Button>
            )}

            {issue.status === 'Resolved' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={verifying}
                  onClick={handleVerifyProof}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{verifying ? 'Verifying...' : 'Verify Resolution Proof'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReworkModalOpen(true)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-2 text-xs font-semibold"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Task Rework</span>
                </Button>
              </>
            )}

            {!['Rejected', 'Closed', 'Resolved'].includes(issue.status) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject & Refund</span>
              </Button>
            )}

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
        {/* Left Column (2/3): Content, Candidates, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description & Evidence Photos */}
          <Card className="border border-[#E2E8F0]">
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-2">Description & Incident Evidence</h3>
            <p className="text-sm text-[#475569] whitespace-pre-line leading-relaxed mb-6">
              {issue.description}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                Citizen Uploaded Evidence ({issue.images?.length || 0})
              </h4>

              {issue.images && issue.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {issue.images.map((img, idx) => (
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
                        <span>View Full</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No photographic evidence attached to this report.</p>
              )}
            </div>
          </Card>

          {/* Contractor Completion Proof Card */}
          {issue.resolution && (
            <Card className="border-2 border-violet-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      Contractor Completion Proof
                    </h3>
                    <p className="text-xs text-slate-500">
                      Submitted on {new Date((issue.resolution as any).submittedAt || issue.resolvedAt || '').toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <StatusBadge status={issue.status} size="sm" />
              </div>

              {/* Completion Remarks */}
              <div className="mb-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">Contractor Remediation Remarks:</span>
                <p className="text-slate-600 italic">"{(issue.resolution as any).remarks}"</p>
              </div>

              {/* Photos Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Images */}
                {(issue.resolution as any).beforeImages?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Before Repair Photos ({(issue.resolution as any).beforeImages.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(issue.resolution as any).beforeImages.map((img: any, i: number) => (
                        <a key={i} href={img.url} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                          <img src={img.url} alt={`Before ${i+1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* After Images */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    After Repair Photos ({(issue.resolution as any).afterImages?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(issue.resolution as any).afterImages?.map((img: any, i: number) => (
                      <a key={i} href={img.url} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        <img src={img.url} alt={`After ${i+1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rework History if any */}
              {(issue.resolution as any).reworkHistory?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <h5 className="font-semibold text-amber-800 mb-2">Previous Rework Requests:</h5>
                  <div className="space-y-1.5">
                    {(issue.resolution as any).reworkHistory.map((rh: any, idx: number) => (
                      <div key={idx} className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                        <div className="text-[10px] text-amber-700">
                          Requested on {new Date(rh.requestedAt).toLocaleString('en-IN')}:
                        </div>
                        <p className="mt-0.5 font-medium">{rh.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Assigned Resolver Information Card (If assigned) */}
          {issue.assignedResolver && (
            <Card className="border border-[#7C3AED]/30 bg-[#EDE9FE]/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#1E293B]">Active Certified Contractor</h3>
                    <p className="text-xs text-[#64748B]">Assigned to resolve this civic incident</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Assigned
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#312E81] text-white flex items-center justify-center font-bold text-sm">
                    {issue.assignedResolver.user?.name ? issue.assignedResolver.user.name.slice(0, 2).toUpperCase() : 'RC'}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                      {issue.assignedResolver.user?.name || 'Contractor'}
                    </h4>
                    <p className="text-xs text-[#64748B]">{issue.assignedResolver.user?.email}</p>
                    <p className="text-xs text-[#475569]">{issue.assignedResolver.user?.phone}</p>
                  </div>
                </div>

                <div className="text-xs text-[#64748B] text-right">
                  <div>Assigned: {issue.assignedAt ? new Date(issue.assignedAt).toLocaleDateString() : 'Active'}</div>
                  <div className="font-medium text-[#1E293B]">Territory: {issue.assignedResolver.serviceAddress || 'Local Area'}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Candidate Resolvers Picker (Proximity Aggregation) */}
          {isAssignable && (
            <Card className="border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#1E293B]">
                      Territory Contractor Assignment
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Select an available contractor within service territory matching Category qualifications
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => id && fetchCandidates(id)}
                  disabled={candidatesLoading}
                  className="text-xs gap-1 border-[#E2E8F0]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${candidatesLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Proximity</span>
                </Button>
              </div>

              <ResolverPicker
                candidates={candidates}
                isLoading={candidatesLoading}
                onAssign={handleAssignResolver}
                currentlyAssignedId={issue.assignedResolver?._id}
              />
            </Card>
          )}

          {/* Issue Audit Timeline */}
          <Card className="border border-[#E2E8F0]">
            <h3 className="font-heading font-bold text-base text-[#1E293B] mb-1">
              Operational Audit Timeline
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Immutable log of status transitions, financial triggers, and operator actions
            </p>

            <IssueTimeline timeline={timeline} />
          </Card>
        </div>

        {/* Right Column (1/3): Controls, Citizen, Location, Billing */}
        <div className="space-y-6">
          {/* Priority Override Control */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Priority Override</h3>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Override machine suggested severity with operational administrative priority.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Assigned Operational Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                >
                  <option value="Low">Low - Standard neighborhood repairs</option>
                  <option value="Medium">Medium - Regular civic maintenance</option>
                  <option value="High">High - Impaired utility or transit</option>
                  <option value="Critical">Critical - Urgent hazard or structural threat</option>
                </select>
              </div>

              <Button
                size="sm"
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold"
                onClick={handlePriorityUpdate}
                disabled={prioritySaving || selectedPriority === effectivePriority}
              >
                {prioritySaving ? 'Overriding...' : 'Save Priority Override'}
              </Button>
            </div>
          </Card>

          {/* Reporter Citizen Details */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Citizen Reporter</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">Full Name</span>
                <span className="font-semibold text-[#1E293B]">{issue.reporter?.name || 'Anonymous Citizen'}</span>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Email Address</span>
                <a href={`mailto:${issue.reporter?.email}`} className="text-[#7C3AED] hover:underline flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{issue.reporter?.email || 'N/A'}</span>
                </a>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Contact Phone</span>
                <a href={`tel:${issue.contactNumber || issue.reporter?.phone}`} className="text-[#1E293B] font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#7C3AED]" />
                  <span>{issue.contactNumber || issue.reporter?.phone || 'N/A'}</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Location & Coordinates */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">Incident Location</h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#1E293B] font-medium leading-relaxed">
                {issue.address?.street}, {issue.address?.city} - {issue.address?.pincode}
              </p>

              {issue.location?.coordinates && (
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[#64748B] font-mono text-[11px]">
                    {issue.location.coordinates[1]?.toFixed(5)}, {issue.location.coordinates[0]?.toFixed(5)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${issue.location.coordinates[1]},${issue.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7C3AED] hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Financial Breakdown & Invoices */}
          <Card className="border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="font-heading font-bold text-sm text-[#1E293B]">Financial Ledger</h3>
              </div>
              {issue.fee?.isManualQuote && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-[#7C3AED]">
                  Manual Quote
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs border-b border-[#E2E8F0] pb-3 mb-3">
              <div className="flex justify-between text-[#64748B]">
                <span>Base Incident Fee</span>
                <span className="font-medium text-[#1E293B]">{formatRupees(issue.fee?.categoryBaseFeePaise)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Distance Surcharge ({issue.fee?.distanceKm || 0} km)</span>
                <span className="font-medium text-[#1E293B]">{formatRupees(issue.fee?.distanceFeePaise)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#1E293B] pt-1 border-t border-slate-100 text-sm">
                <span>Total Assessment</span>
                <span>{formatRupees(issue.fee?.totalPaise)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#7C3AED] font-medium">
                <span>50% Advance</span>
                <span>{formatRupees(issue.fee?.advancePaise)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>50% Balance on Completion</span>
                <span>{formatRupees(issue.fee?.balancePaise)}</span>
              </div>
            </div>

            {/* Invoices List */}
            <div>
              <h4 className="text-xs font-semibold text-[#1E293B] mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#7C3AED]" />
                Invoices & Tax Receipts ({invoices?.length || 0})
              </h4>
              {invoices && invoices.length > 0 ? (
                <div className="space-y-2">
                  {invoices.map((inv) => (
                    <div key={inv._id} className="p-2.5 rounded-lg border border-[#E2E8F0] flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-mono font-bold text-[#1E293B]">{inv.invoiceNumber}</div>
                        <div className="text-[11px] text-[#64748B]">{inv.type} Invoice • {formatRupees(inv.feeBreakdown?.totalPaise || inv.amountPaidPaise)}</div>
                      </div>
                      <InvoiceButton invoiceId={inv._id} invoiceNumber={inv.invoiceNumber} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No invoices generated yet.</p>
              )}
            </div>

            {/* Payments List */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-semibold text-[#1E293B] mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#7C3AED]" />
                Transactions & Settlement ({payments?.length || 0})
              </h4>
              {payments && payments.length > 0 ? (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p._id} className="p-2.5 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#1E293B]">{p.type} • {formatRupees(p.amountPaise)}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">{p.paymentId}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Refunded'
                            ? 'bg-violet-100 text-[#7C3AED]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No payment transactions recorded.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Manual Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Establish Custom Fee Quote"
      >
        <form onSubmit={handleQuoteSubmit} className="space-y-4">
          <p className="text-xs text-[#64748B]">
            This issue is marked <strong className="text-[#1E293B]">AwaitingQuote</strong> because the location is outside standard municipal coverage or requires custom inspection. Setting this fee automatically notifies the citizen to pay the 50% advance.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Total Fee Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">₹</span>
              <input
                type="number"
                step="1"
                min="100"
                value={quoteRupees}
                onChange={(e) => setQuoteRupees(e.target.value)}
                placeholder="1500"
                className="w-full pl-8 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                required
              />
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Advance (50%): ₹{(parseFloat(quoteRupees || '0') * 0.5).toFixed(2)} | Balance (50%): ₹{(parseFloat(quoteRupees || '0') * 0.5).toFixed(2)}
            </p>
          </div>

          {quoteError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {quoteError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsQuoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              disabled={quoteSubmitting}
            >
              {quoteSubmitting ? 'Submitting Quote...' : 'Confirm & Send to Citizen'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Issue Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Civic Issue Report"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <p className="font-semibold mb-1">Notice of Automated Refund</p>
            <p>
              Rejecting this report will set its status to <strong>Rejected</strong> and automatically create a <strong>Refund</strong> payment record for the citizen's advance fee.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Rejection Reason (will be emailed to citizen)
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate report already under remediation; Private property not covered by municipal bylaws..."
              className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              required
            />
          </div>

          {rejectError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {rejectError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={rejectSubmitting}
            >
              {rejectSubmitting ? 'Rejecting...' : 'Confirm Rejection & Refund'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rework Request Modal */}
      <Modal
        isOpen={isReworkModalOpen}
        onClose={() => setIsReworkModalOpen(false)}
        title="Request Remediation Task Rework"
      >
        <form onSubmit={handleRequestRework} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <p className="font-semibold mb-1">Contractor Rework Dispatch</p>
            <p>
              Requesting rework will return this issue to <strong>InProgress</strong> and notify the assigned contractor with your specific punch-list remarks.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Rework Instructions / Deficiencies <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reworkRemarks}
              onChange={(e) => setReworkRemarks(e.target.value)}
              placeholder="e.g. Curb joints require additional asphalt smoothing; Pothole perimeter needs cold pour tar sealing..."
              className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              required
            />
          </div>

          {reworkError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {reworkError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReworkModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={reworkSubmitting}
            >
              {reworkSubmitting ? 'Dispatching...' : 'Dispatch Rework Order'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminIssueDetailsPage;
