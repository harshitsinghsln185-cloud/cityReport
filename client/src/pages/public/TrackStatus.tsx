import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  Calendar,
} from 'lucide-react';
import publicService, { PublicTrackData } from '../../services/public.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Reveal from '../../components/ui/Reveal';
import SEO from '../../components/SEO';
import PageHero from '../../components/ui/PageHero';

export const TrackStatus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [issueCode, setIssueCode] = useState<string>(initialCode);
  const [trackResult, setTrackResult] = useState<PublicTrackData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const performLookup = async (code: string) => {
    if (!code.trim()) {
      setErrorMessage('Please enter a valid issue tracking code (e.g. CR-2026-000001).');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await publicService.trackIssue(code.trim());
      setTrackResult(data);
      setSearchParams({ code: code.trim() });
    } catch (err: any) {
      setTrackResult(null);
      setErrorMessage(
        err?.response?.data?.message || 'No civic issue found with this code. Please check your reference number.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      performLookup(initialCode);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(issueCode);
  };

  const handleCopyCode = () => {
    if (trackResult?.issueCode) {
      navigator.clipboard.writeText(trackResult.issueCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // 5 Canonical Visual Milestones: Reported > Quoted > In Progress > Resolved > Verified
  const getMilestoneIndex = (status?: string): number => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s.includes('closed') || s.includes('paid') || s.includes('approved')) return 4;
    if (s.includes('resolved') || s.includes('balancedue')) return 3;
    if (s.includes('progress') || s.includes('accepted') || s.includes('assigned')) return 2;
    if (s.includes('quote') || s.includes('advance')) return 1;
    return 0; // Submitted / UnderReview / Reported
  };

  const currentMilestoneIndex = getMilestoneIndex(trackResult?.status);

  const milestones = [
    { label: 'Reported', desc: 'GPS Pin & Photos' },
    { label: 'Quoted', desc: '50% Advance Due' },
    { label: 'In Progress', desc: 'Contractor On-Site' },
    { label: 'Resolved', desc: 'Before/After Proof' },
    { label: 'Verified', desc: 'Closed & Audited' },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title="Track Civic Issue Resolution Status"
        description="Lookup real-time municipal remediation progress, contractor milestone updates, photographic resolution proof, and tax receipts using your unique issue code."
        keywords={[
          'track civic issue',
          'municipal ticket tracking',
          'pothole fix status',
          'civic status check',
        ]}
      />

      {/* Institutional Split Page Hero */}
      <PageHero
        variant="split"
        theme="navy"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Track Issue Status' }]}
        eyebrow="Public Verification Ledger"
        eyebrowIcon={<Clock className="w-3.5 h-3.5" />}
        title="Inspect Live Remediation & Milestone Progress"
        description="Enter your unique tracking reference code to audit contractor dispatch timestamps, before/after photographic proof, and milestone completion receipts in real time."
        visual={
          <div className="w-full max-w-sm rounded-[20px] bg-white/5 border border-white/15 p-6 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Public Ledger Standards</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">Live SLA</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Standard Dispatch SLA:</span>
                <span className="font-semibold text-white">Within 48 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification Method:</span>
                <span className="font-semibold text-white">Geotagged Camera EXIF</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Balance Release:</span>
                <span className="font-semibold text-white">Citizen / Admin Sign-off</span>
              </div>
            </div>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Search Console Card */}
        <Reveal delay={0.1}>
          <Card variant="base" className="p-4 sm:p-6 mb-8 bg-white border-border shadow-subtle">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={issueCode}
                  onChange={(e) => setIssueCode(e.target.value.toUpperCase())}
                  placeholder="Enter Tracking Code (e.g. CR-2026-000001)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas/40 border border-border rounded-xl text-xs sm:text-sm text-ink font-mono tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-primary uppercase transition-all"
                />
                {issueCode && (
                  <button
                    type="button"
                    onClick={() => setIssueCode('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !issueCode.trim()}
                isLoading={loading}
                className="sm:w-auto shadow-sm"
              >
                Track Hazard
              </Button>
            </form>

            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>Format: <code className="text-primary font-mono font-semibold">CR-YYYY-XXXXXX</code></span>
              <span className="hidden sm:inline">Updated automatically upon admin verification sign-off</span>
            </div>
          </Card>
        </Reveal>

        {/* Error Notice */}
        {errorMessage && (
          <Reveal>
            <div className="mb-8 p-4 rounded-card bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          </Reveal>
        )}

        {/* Tracking Details View */}
        {trackResult && (
          <div className="space-y-6">
            {/* Visual 5-Step Progress Stepper Card */}
            <Reveal delay={0.15}>
              <Card variant="base" className="p-6 sm:p-8 bg-white border-border shadow-subtle">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg text-ink">
                      Remediation Milestone Status
                    </h3>
                    <p className="text-xs text-muted">
                      Current State: <strong className="text-primary">{trackResult.status}</strong>
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintSummary}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                  >
                    Print Summary
                  </Button>
                </div>

                {/* Horizontal Stepper */}
                <div className="relative mb-6">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0 hidden sm:block" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-primary z-0 hidden sm:block transition-all duration-500"
                    style={{
                      width: `${(currentMilestoneIndex / (milestones.length - 1)) * 90}%`,
                    }}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                    {milestones.map((m, idx) => {
                      const isComplete = idx <= currentMilestoneIndex;
                      const isCurrent = idx === currentMilestoneIndex;

                      return (
                        <div key={m.label} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all mb-2 ${
                              isComplete
                                ? 'bg-primary text-white shadow-sm ring-4 ring-lavender'
                                : 'bg-canvas text-muted border border-border'
                            }`}
                          >
                            {isComplete ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isCurrent ? 'text-primary' : isComplete ? 'text-ink' : 'text-muted'
                            }`}
                          >
                            {m.label}
                          </span>
                          <span className="text-[10px] text-muted hidden sm:inline mt-0.5">
                            {m.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Overview Card */}
            <Reveal delay={0.2}>
              <Card variant="base" className="p-6 sm:p-8 bg-white border-border shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-ink bg-canvas px-2.5 py-1 rounded-lg border border-border">
                        {trackResult.issueCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-lavender transition-colors"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <StatusBadge status={trackResult.status} size="sm" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-heading font-semibold text-ink">
                      {trackResult.title}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right text-xs text-muted space-y-1">
                    <div>
                      <span className="text-muted">Category:</span>{' '}
                      <span className="text-ink font-semibold">{trackResult.category?.name}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{trackResult.city} ({trackResult.pincode})</span>
                    </div>
                    <div>
                      <span className="text-muted">Logged:</span> {formatDate(trackResult.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                    Verified Description
                  </h4>
                  <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                    {trackResult.description}
                  </p>
                </div>
              </Card>
            </Reveal>

            {/* Timeline Milestones Audit Card */}
            <Reveal delay={0.25}>
              <Card variant="base" className="p-6 sm:p-8 bg-white border-border shadow-subtle">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-ink">
                      Audit Trail & Status Transitions
                    </h3>
                    <p className="text-xs text-muted">
                      Immutable timestamped event records logged by citizens, contractors, and platform administrators.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-lavender text-primary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                {/* Vertical Stepper Feed */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 ml-3 sm:ml-4 space-y-6">
                  {trackResult.timeline?.map((item, index) => {
                    const isLatest = index === trackResult.timeline.length - 1;
                    return (
                      <div key={index} className="relative">
                        {/* Step Dot */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isLatest
                              ? 'bg-primary border-white text-white shadow-sm ring-4 ring-lavender'
                              : 'bg-white border-primary text-primary'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>

                        {/* Content Box */}
                        <div className="bg-canvas p-4 rounded-xl border border-border hover:border-slate-300 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <span className="text-xs font-bold text-ink uppercase tracking-wider">
                              {item.action?.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-muted flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>

                          {item.remarks && (
                            <p className="text-xs text-secondaryText leading-relaxed">
                              {item.remarks}
                            </p>
                          )}

                          <div className="mt-2 text-[10px] text-muted flex items-center gap-1">
                            <span>Status Transition:</span>
                            <span className="font-semibold text-slate-700">{item.fromStatus}</span>
                            <span>&rarr;</span>
                            <span className="font-semibold text-primary">{item.toStatus}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Privacy & Zero-PII Guarantee */}
                <div className="mt-10 p-4 rounded-xl bg-indigo/5 border border-indigo/20 text-xs text-indigo flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Zero-PII Public Invariant:</span> In strict accordance with municipal data security guidelines, public tracking views redact citizen names, direct telephone contact details, and precise house-number addresses to protect reporter safety.
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        )}

        {/* Empty Search Prompt */}
        {!trackResult && !loading && (
          <Reveal delay={0.15}>
            <div className="text-center p-8 sm:p-12 rounded-card bg-white border border-border border-dashed">
              <div className="w-14 h-14 rounded-full bg-lavender text-primary flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                Have an Issue Tracking Reference?
              </h3>
              <p className="text-xs sm:text-sm text-secondaryText max-w-md mx-auto mb-6 leading-relaxed">
                When an issue is reported, our system generates an immutable tracking code starting with <code className="bg-canvas px-1.5 py-0.5 rounded text-primary font-mono font-semibold">CR-2026-</code>. Paste it into the tracker above.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <Button to="/user/report-issue" variant="primary" size="sm">
                    Report a New Hazard
                  </Button>
                <Button to="/services" variant="outline" size="sm">
                    View Supported Services
                  </Button>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;
