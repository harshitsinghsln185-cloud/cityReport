import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Layers,
  FileText,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import issueService, { Issue, TimelineEvent } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import QuoteCard from '../../components/QuoteCard';
import IssueTimeline from '../../components/IssueTimeline';
import MapPicker from '../../components/MapPicker';
import InvoiceButton from '../../components/InvoiceButton';
import FeedbackForm from '../../components/FeedbackForm';
import ReopenModal from '../../components/ReopenModal';

export const IssueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState<boolean>(false);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getById(id);
      setIssue(res.issue);
      setTimeline(res.timeline);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Civic issue not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancelIssue = async () => {
    if (!issue || !window.confirm('Are you sure you want to cancel this civic issue request?')) {
      return;
    }
    try {
      setCancelling(true);
      setError(null);
      await issueService.cancel(issue._id);
      setSuccessMessage('Issue has been cancelled.');
      await fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to cancel issue.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#64748B]">Loading issue details and tracking history...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-heading font-bold text-[#1E293B]">Issue Not Found</h2>
        <p className="text-sm text-[#64748B] max-w-md mx-auto">
          {error || 'The requested civic issue could not be found or you do not have permission to view it.'}
        </p>
        <Link to="/user/issues">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to My Issues
          </Button>
        </Link>
      </div>
    );
  }

  // Progress Bar Steps Definition
  const progressSteps = [
    { key: 'AwaitingAdvance', label: 'Reported' },
    { key: 'Assigned', label: 'Assigned' },
    { key: 'InProgress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' },
    { key: 'Closed', label: 'Closed' },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ['AwaitingAdvance', 'Submitted', 'Assigned', 'Accepted', 'InProgress', 'Resolved', 'BalanceDue', 'Closed'];
    const currentIdx = order.indexOf(issue.status);
    const stepIdx = order.indexOf(stepKey);

    if (issue.status === 'Cancelled' || issue.status === 'Rejected') {
      return 'cancelled';
    }
    if (currentIdx >= stepIdx) return 'complete';
    return 'pending';
  };

  const coordinates = issue.location?.coordinates || [77.209, 28.6139];
  const lng = coordinates[0];
  const lat = coordinates[1];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/user/issues"
          className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Issues</span>
        </Link>

        {/* Cancellation Button if eligible */}
        {(issue.status === 'AwaitingAdvance' || issue.status === 'AwaitingQuote') && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancelIssue}
            isLoading={cancelling}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Cancel Issue
          </Button>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Balance Due Action Banner */}
      {issue.status === 'BalanceDue' && (
        <div className="p-5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 uppercase tracking-wide">
                Action Required
              </span>
              <h2 className="text-lg font-bold">Repair Complete — Balance Due</h2>
            </div>
            <p className="text-sm text-violet-100 max-w-2xl">
              Contractor repair proof has been verified by municipal supervisors. Please pay the remaining balance of ₹{(issue.fee.balancePaise / 100).toLocaleString('en-IN')} to close this issue and receive your official Final Settlement Tax Invoice.
            </p>
          </div>
          <Link to={`/user/checkout/${issue._id}`} className="shrink-0">
            <Button
              className="bg-white text-[#7C3AED] hover:bg-violet-50 font-bold shadow-md w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Pay Balance (₹{(issue.fee.balancePaise / 100).toLocaleString('en-IN')})
            </Button>
          </Link>
        </div>
      )}

      {/* Reopened Banner */}
      {issue.status === 'Reopened' && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Issue Reopened for Contractor Rework (Cycle #{issue.reopenCount || 1})</span>
          </div>
          <p className="text-xs text-amber-800 pl-7">
            <strong>Reason:</strong> {issue.reopenReason || 'Repair quality requires additional remediation work.'}
          </p>
        </div>
      )}

      {/* Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-black text-sm text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-1 rounded-lg border border-[#DDD6FE]">
                {issue.issueCode}
              </span>
              <StatusBadge status={issue.status} size="sm" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#475569] border border-slate-200">
                {issue.suggestedPriority} Priority
              </span>
            </div>

            <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
              {issue.title}
            </h1>

            <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
                {issue.category?.name || 'Civic Issue'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                Reported on {new Date(issue.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-[#E2E8F0] sm:pl-6 shrink-0">
            <div className="text-xs text-[#64748B]">Total Quote</div>
            <div className="text-2xl font-heading font-black text-[#7C3AED]">
              {issue.fee?.totalPaise ? `₹${(issue.fee.totalPaise / 100).toLocaleString('en-IN')}` : 'Pending'}
            </div>
            {issue.status === 'AwaitingAdvance' && (
              <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200">
                Advance: ₹{issue.fee.advancePaise / 100} Due
              </div>
            )}
            {issue.status === 'BalanceDue' && (
              <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded mt-1 border border-purple-200">
                Balance: ₹{issue.fee.balancePaise / 100} Due
              </div>
            )}
            {issue.status === 'Closed' && (
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200">
                Fully Settled & Closed
              </div>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {progressSteps.map((step) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="space-y-2">
                  <div className="flex items-center">
                    <div
                      className={`w-full h-1.5 rounded-full ${
                        status === 'complete'
                          ? 'bg-[#7C3AED]'
                          : status === 'cancelled'
                          ? 'bg-rose-500'
                          : 'bg-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold text-[11px] block truncate ${
                      status === 'complete'
                        ? 'text-[#7C3AED]'
                        : status === 'cancelled'
                        ? 'text-rose-600'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main Grid: Details Left, Quote Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Location, Photos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description */}
          <Card className="p-6 space-y-3">
            <h2 className="font-heading font-bold text-base text-[#1E293B]">
              Detailed Description
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </p>
          </Card>

          {/* Location & Map Pin */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-[#1E293B]">
                Issue Location & Landmark
              </h2>
              <div className="text-xs text-[#64748B] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>{issue.address?.city}, {issue.address?.pincode}</span>
              </div>
            </div>

            <p className="text-xs text-[#475569] font-medium">
              {issue.address?.street}
            </p>

            <MapPicker
              lat={lat}
              lng={lng}
              height="260px"
              onChange={() => {}} // Read-only
            />
          </Card>

          {/* Evidence Photos */}
          {issue.images && issue.images.length > 0 && (
            <Card className="p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-[#1E293B]">
                Attached Evidence Photos ({issue.images.length})
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {issue.images.map((img, idx) => (
                  <a
                    key={img.publicId || idx}
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl overflow-hidden border border-[#E2E8F0] h-36 bg-slate-50 group relative"
                  >
                    <img
                      src={img.url}
                      alt={`Issue evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                      View Full Photo
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Resolution Proof Photos & Contractor Remarks */}
          {issue.resolution && (
            <Card className="p-6 space-y-4 border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base text-[#1E293B]">
                      Resolution Proof & Remediation
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Submitted on {new Date(issue.resolution.submittedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                {(issue.status === 'BalanceDue' || issue.status === 'Closed') && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Municipal Verified
                  </span>
                )}
              </div>

              {issue.resolution.remarks && (
                <div className="p-3.5 bg-white rounded-xl border border-emerald-100 text-sm text-[#334155]">
                  <div className="text-xs font-semibold text-[#64748B] mb-1">Contractor Remarks:</div>
                  <p className="italic">"{issue.resolution.remarks}"</p>
                </div>
              )}

              {/* After repair photos */}
              {issue.resolution.afterImages && issue.resolution.afterImages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Verified Completion Photos:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {issue.resolution.afterImages.map((img, idx) => (
                      <a
                        key={img.publicId || idx}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl overflow-hidden border border-emerald-200 h-36 bg-slate-50 group relative"
                      >
                        <img
                          src={img.url}
                          alt={`Resolution photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                          View Full Photo
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Before repair photos if available */}
              {issue.resolution.beforeImages && issue.resolution.beforeImages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-100">
                  <div className="text-xs font-bold text-slate-700">Before-Repair Photos:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {issue.resolution.beforeImages.map((img, idx) => (
                      <a
                        key={img.publicId || idx}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-50 group relative"
                      >
                        <img
                          src={img.url}
                          alt={`Before repair photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                          View Full Photo
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Feedback Form for Closed Issues */}
          {issue.status === 'Closed' && (
            <FeedbackForm
              issueId={issue._id}
              existingFeedback={issue.feedback}
              onSuccess={() => fetchDetails()}
            />
          )}

          {/* Vertical Audit Timeline */}
          <Card className="p-6 space-y-4">
            <h2 className="font-heading font-bold text-base text-[#1E293B]">
              Activity & State Audit Timeline
            </h2>
            <IssueTimeline timeline={timeline} />
          </Card>
        </div>

        {/* Right Column: Quote Card, Invoices, Contractor Info, Reopen */}
        <div className="space-y-6">
          {/* Quote Card */}
          {issue.fee && (
            <QuoteCard
              fee={issue.fee}
              aiAssessment={issue.aiAssessment}
              showPayCta={issue.status === 'AwaitingAdvance'}
              onPayAdvance={() => {
                navigate(`/user/checkout/${issue._id}`);
              }}
            />
          )}

          {/* Advance Invoice Download Card (if advance is paid) */}
          {issue.payments?.advanceInvoice && (
            <Card className="p-5 space-y-3 border-[#EDE9FE] bg-[#F8F7FC]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#1E293B]">
                      Official Advance Receipt
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Invoice 1 (50% Advance Paid)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Paid
                </span>
              </div>
              <InvoiceButton
                invoiceId={
                  typeof issue.payments.advanceInvoice === 'string'
                    ? issue.payments.advanceInvoice
                    : (issue.payments.advanceInvoice as any)._id
                }
                label="Download Invoice 1 (PDF)"
                variant="primary"
                size="sm"
                className="w-full justify-center"
              />
            </Card>
          )}

          {/* Final Settlement Invoice Card (Invoice 2) */}
          {issue.payments?.finalInvoice && (
            <Card className="p-5 space-y-3 border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#1E293B]">
                      Final Settlement Invoice
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Invoice 2 (Full Balance Settled)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Closed
                </span>
              </div>
              <InvoiceButton
                invoiceId={
                  typeof issue.payments.finalInvoice === 'string'
                    ? issue.payments.finalInvoice
                    : (issue.payments.finalInvoice as any)._id
                }
                label="Download Invoice 2 (PDF)"
                variant="primary"
                size="sm"
                className="w-full justify-center"
              />
            </Card>
          )}

          {/* Assigned Resolver Card if available */}
          {issue.assignedResolver && (
            <Card className="p-5 space-y-3 border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#1E293B]">
                    Assigned Certified Resolver
                  </h3>
                  <div className="text-xs text-[#64748B]">
                    {issue.assignedResolver.user?.name}
                  </div>
                </div>
              </div>

              {issue.status !== 'AwaitingAdvance' && issue.status !== 'Submitted' && (
                <div className="pt-2 border-t border-emerald-200 text-xs text-[#475569] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{issue.assignedResolver.user?.phone || 'Contact Available on Dispatch'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{issue.assignedResolver.serviceAddress}</span>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Issue Reopening Card for Closed Issues */}
          {issue.status === 'Closed' && (
            <Card className="p-5 space-y-3 border-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#1E293B]">
                    Issue Resolution Review
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Has the repair deteriorated or failed? Reopen requests are permitted while contractor payout is pending.
                  </p>
                </div>
              </div>

              {issue.payoutStatus === 'Paid' ? (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center font-medium">
                  🔒 Contractor payout disbursed. This ticket is permanently finalized.
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReopenModalOpen(true)}
                  className="w-full justify-center text-amber-700 border-amber-300 hover:bg-amber-50"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Request Issue Reopen
                </Button>
              )}
            </Card>
          )}

          {/* Help & Support Card */}
          <Card className="p-5 space-y-2 text-xs text-[#64748B]">
            <div className="font-semibold text-[#1E293B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <span>Municipal Support Assistance</span>
            </div>
            <p>
              Need updates or modifications to your civic report? Our operations center operates 24/7.
            </p>
            <div className="pt-1 font-semibold text-[#7C3AED]">
              Helpline: 1800-CROWD-REP
            </div>
          </Card>
        </div>
      </div>

      {/* Reopen Modal */}
      <ReopenModal
        issueId={issue._id}
        issueCode={issue.issueCode}
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        onSuccess={() => {
          setIsReopenModalOpen(false);
          setSuccessMessage('Civic issue has been successfully reopened for contractor rework.');
          fetchDetails();
        }}
      />
    </div>
  );
};

export default IssueDetails;
