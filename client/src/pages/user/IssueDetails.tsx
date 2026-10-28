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
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import QuoteCard from '../../components/QuoteCard';
import IssueTimeline from '../../components/IssueTimeline';
import MapPicker from '../../components/MapPicker';
import InvoiceButton from '../../components/InvoiceButton';
import FeedbackForm from '../../components/FeedbackForm';
import ReopenModal from '../../components/ReopenModal';
import BeforeAfterSlider from '../../components/public/BeforeAfterSlider';

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
      <div className="max-w-5xl mx-auto py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-xs sm:text-sm text-secondaryText">Loading incident tracking records and verified evidence...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-heading font-bold text-ink">Incident Record Not Found</h2>
        <p className="text-xs sm:text-sm text-secondaryText max-w-md mx-auto leading-relaxed">
          {error || 'The requested civic issue could not be located or you lack permissions to view this dossier.'}
        </p>
        <Button to="/user/issues" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to My Reported Issues
          </Button>
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

  // Resolve before and after images for citizen inspection
  const beforePhotoUrl =
    issue.resolution?.beforeImages?.[0]?.url ||
    issue.images?.[0]?.url ||
    '/images/showcase/before-pothole.jpg';

  const afterPhotoUrl =
    issue.resolution?.afterImages?.[0]?.url ||
    '/images/showcase/after-pothole.jpg';

  const hasResolutionProof = Boolean(
    issue.resolution && (issue.resolution.afterImages?.length || issue.status === 'Resolved' || issue.status === 'BalanceDue' || issue.status === 'Closed')
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Back Link & Cancellation Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/user/issues"
          className="text-xs font-semibold text-primary hover:text-primaryDark flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reported Issues</span>
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
            Cancel Request
          </Button>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Awaiting Advance Action Banner */}
      {issue.status === 'AwaitingAdvance' && issue.fee && (
        <div className="p-5 bg-gradient-to-r from-primary to-indigo text-white rounded-cardLg shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider">
                Action Required
              </span>
              <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                50% Advance Payment Pending
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              To dispatch a certified contractor to your location, please pay the 50% advance of ₹{(issue.fee.advancePaise / 100).toLocaleString('en-IN')}. The balance is payable upon completed and inspected work.
            </p>
          </div>
          <Button to={`/user/checkout/${issue._id}`} className="shrink-0 bg-white text-primary hover:bg-slate-50 font-bold shadow-xs w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}>
              Pay 50% Advance (₹{(issue.fee.advancePaise / 100).toLocaleString('en-IN')})
            </Button>
        </div>
      )}

      {/* Balance Due Action Banner */}
      {issue.status === 'BalanceDue' && issue.fee && (
        <div className="p-5 bg-gradient-to-r from-indigo to-primary text-white rounded-cardLg shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider">
                Inspection & Settlement
              </span>
              <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                Repair Complete — Balance Due
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Contractor repair proof has been verified by municipal supervisors. Inspect the Before/After photos below and pay the remaining balance of ₹{(issue.fee.balancePaise / 100).toLocaleString('en-IN')} to close this ticket and download your GST Settlement Invoice.
            </p>
          </div>
          <Button to={`/user/checkout/${issue._id}`} className="shrink-0 bg-white text-primary hover:bg-slate-50 font-bold shadow-xs w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}>
              Pay Balance (₹{(issue.fee.balancePaise / 100).toLocaleString('en-IN')})
            </Button>
        </div>
      )}

      {/* Reopened Banner */}
      {issue.status === 'Reopened' && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-card text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Issue Reopened for Contractor Rework (Cycle #{issue.reopenCount || 1})</span>
          </div>
          <p className="text-xs text-amber-800 pl-6">
            <strong>Citizen Review Note:</strong> {issue.reopenReason || 'Remediation quality requires contractor follow-up.'}
          </p>
        </div>
      )}

      {/* Header Card */}
      <Card className="p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {issue.issueCode}
              </span>
              <StatusBadge status={issue.status} size="sm" />
              <Badge variant="neutral" size="sm" className="font-semibold">
                {issue.suggestedPriority} Priority
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink tracking-tight">
              {issue.title}
            </h1>

            <div className="text-xs text-secondaryText flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Layers className="w-3.5 h-3.5 text-primary" />
                {issue.category?.name || 'Civic Defect'}
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <Calendar className="w-3.5 h-3.5" />
                Reported {new Date(issue.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-border sm:pl-6 shrink-0 pt-2 sm:pt-0">
            <div className="text-xs text-muted uppercase font-bold tracking-wider">Total Quote</div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-primary tabular-nums mt-0.5">
              {issue.fee?.totalPaise ? `₹${(issue.fee.totalPaise / 100).toLocaleString('en-IN')}` : 'Pending Quote'}
            </div>
            {issue.status === 'AwaitingAdvance' && issue.fee && (
              <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-amber-200 inline-block">
                Advance: ₹{(issue.fee.advancePaise / 100).toLocaleString('en-IN')} Due
              </div>
            )}
            {issue.status === 'BalanceDue' && issue.fee && (
              <div className="text-xs font-bold text-indigo bg-primary/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-primary/20 inline-block">
                Balance: ₹{(issue.fee.balancePaise / 100).toLocaleString('en-IN')} Due
              </div>
            )}
            {issue.status === 'Closed' && (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200 inline-block">
                100% Settled & Closed
              </div>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {progressSteps.map((step) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="space-y-2">
                  <div className="flex items-center">
                    <div
                      className={`w-full h-1.5 rounded-full transition-colors ${
                        status === 'complete'
                          ? 'bg-primary'
                          : status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-border'
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold text-xs block truncate ${
                      status === 'complete'
                        ? 'text-primary'
                        : status === 'cancelled'
                        ? 'text-red-700'
                        : 'text-muted'
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

      {/* BEFORE / AFTER CITIZEN INSPECTION SECTION */}
      {hasResolutionProof && (
        <Card className="p-6 sm:p-8 border-primary/30 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-lg text-ink">
                  Citizen Workmanship Inspection (Before / After)
                </h2>
              </div>
              <p className="text-xs text-secondaryText mt-1">
                Drag the interactive slider handle below to inspect contractor repair quality against the initial defect.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Municipal Geo-Verified</span>
              </span>
            </div>
          </div>

          {/* Interactive Inspection Slider */}
          <div className="rounded-card overflow-hidden border border-border shadow-xs">
            <BeforeAfterSlider
              beforeImage={beforePhotoUrl}
              afterImage={afterPhotoUrl}
              beforeLabel="Reported Defect"
              afterLabel="Contractor Repair"
              title={issue.title}
              location={`${issue.address?.street}, ${issue.address?.city}`}
              date={
                issue.resolution?.submittedAt
                  ? `Completed on ${new Date(issue.resolution.submittedAt).toLocaleDateString('en-IN')}`
                  : 'Completed & Certified'
              }
              inspectorId={issue.assignedResolver?.user?.name ? `Resolver: ${issue.assignedResolver.user.name}` : 'Admin Verified'}
            />
          </div>

          {/* Contractor Remarks */}
          {issue.resolution?.remarks && (
            <div className="p-4 bg-canvas rounded-card border border-border text-xs text-ink space-y-1">
              <div className="font-bold text-secondaryText uppercase tracking-wider text-xs">
                Contractor Completion Statement
              </div>
              <p className="italic text-xs sm:text-sm text-ink leading-relaxed">
                "{issue.resolution.remarks}"
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Main Grid: Details Left, Quote Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Location, Evidence Photos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description */}
          <Card className="p-6 space-y-3 shadow-card">
            <h2 className="font-heading font-bold text-base text-ink">
              Defect Description & Citizen Report
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </p>
          </Card>

          {/* Location & Map Pin */}
          <Card className="p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-ink">
                Defect Location Pin
              </h2>
              <div className="text-xs text-secondaryText flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{issue.address?.city}, {issue.address?.pincode}</span>
              </div>
            </div>

            <p className="text-xs text-ink font-semibold">
              {issue.address?.street}
            </p>

            <MapPicker
              lat={lat}
              lng={lng}
              height="260px"
              isReadOnly
            />
          </Card>

          {/* Evidence Photos Gallery */}
          {issue.images && issue.images.length > 0 && (
            <Card className="p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base text-ink">
                  Initial Evidence Photos ({issue.images.length})
                </h2>
                <span className="text-xs text-muted">Uploaded on reporting</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {issue.images.map((img, idx) => (
                  <a
                    key={img.publicId || idx}
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-card overflow-hidden border border-border h-36 bg-canvas group relative shadow-xs"
                  >
                    <img
                      src={img.url}
                      alt={`Issue evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                      Open Full Image
                    </div>
                  </a>
                ))}
              </div>
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
          <Card className="p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-ink">
                Activity & Milestone Audit Log
              </h2>
              <span className="text-xs text-muted">Immutable cryptographic record</span>
            </div>
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
            <Card className="p-5 space-y-3 border-primary/20 bg-primary/5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-ink">
                      Advance Tax Receipt
                    </h3>
                    <p className="text-xs text-secondaryText">
                      Invoice 1 (50% Advance Paid)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
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
                className="w-full justify-center shadow-xs"
              />
            </Card>
          )}

          {/* Final Settlement Invoice Card (Invoice 2) */}
          {issue.payments?.finalInvoice && (
            <Card className="p-5 space-y-3 border-emerald-200 bg-emerald-50/50 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-ink">
                      Final Settlement Invoice
                    </h3>
                    <p className="text-xs text-secondaryText">
                      Invoice 2 (Full Balance Settled)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Settled
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
                className="w-full justify-center shadow-xs"
              />
            </Card>
          )}

          {/* Assigned Resolver Card if available */}
          {issue.assignedResolver && (
            <Card className="p-5 space-y-3 border-emerald-200 bg-emerald-50/30 shadow-card">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-ink">
                    Assigned Certified Contractor
                  </h3>
                  <div className="text-xs text-secondaryText">
                    {issue.assignedResolver.user?.name}
                  </div>
                </div>
              </div>

              {issue.status !== 'AwaitingAdvance' && issue.status !== 'Submitted' && (
                <div className="pt-2 border-t border-emerald-200 text-xs text-secondaryText space-y-1.5">
                  <div className="flex items-center gap-1.5 text-ink">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{issue.assignedResolver.user?.phone || 'Contact Active on Dispatch'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondaryText">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{issue.assignedResolver.serviceAddress}</span>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Issue Reopening Card for Closed Issues */}
          {issue.status === 'Closed' && (
            <Card className="p-5 space-y-3 border-border shadow-card">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-ink">
                    Resolution Quality Guarantee
                  </h3>
                  <p className="text-xs text-secondaryText mt-0.5 leading-relaxed">
                    Has the defect re-emerged or failed inspection? Citizen reopen requests trigger immediate supervisor audit.
                  </p>
                </div>
              </div>

              {issue.payoutStatus === 'Paid' ? (
                <div className="p-2.5 bg-canvas border border-border rounded-lg text-xs text-muted text-center font-medium">
                  🔒 Contractor payout settled. This incident is permanently archived.
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReopenModalOpen(true)}
                  className="w-full justify-center text-amber-800 border-amber-300 hover:bg-amber-50"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Request Issue Reopen
                </Button>
              )}
            </Card>
          )}

          {/* Help & Support Card */}
          <Card className="p-5 space-y-2 text-xs text-secondaryText shadow-card">
            <div className="font-bold text-ink flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Municipal Support & Helpdesk</span>
            </div>
            <p className="leading-relaxed">
              Need assistance or clarifications regarding this report? Our civic grievance desk operates 24/7.
            </p>
            <div className="pt-1 font-bold text-primary">
              Toll-Free Helpline: 1800-CIVIC-REP
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
