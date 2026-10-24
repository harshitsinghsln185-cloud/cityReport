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
} from 'lucide-react';
import publicService, { PublicTrackData } from '../../services/public.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

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
      setErrorMessage('Please enter a valid issue tracking code (e.g. CR-2026-XXXXXX).');
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

  return (
    <div className="py-14 bg-[#F8F7FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
            Public Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1E293B] mt-3 mb-2">
            Track Issue Status
          </h1>
          <p className="text-sm text-[#64748B]">
            Enter your unique reference tracking code to view live milestone progression, contractor dispatch status, and verification audits.
          </p>
        </div>

        {/* Search Console */}
        <Card className="border-[#E2E8F0] p-4 sm:p-6 mb-8 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={issueCode}
                onChange={(e) => setIssueCode(e.target.value)}
                placeholder="Enter Issue Code (e.g. CR-2026-000001)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] font-mono tracking-wider focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all uppercase"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !issueCode.trim()}
              className="sm:w-auto flex items-center justify-center gap-2 shadow-sm shadow-[#7C3AED]/20"
            >
              <span>{loading ? 'Searching...' : 'Track Issue'}</span>
            </Button>
          </form>
        </Card>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tracking Details View */}
        {trackResult && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Overview Card */}
            <Card className="border-[#E2E8F0] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-[#1E293B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                      {trackResult.issueCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-1 rounded text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors"
                      title="Copy issue code"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <StatusBadge status={trackResult.status} size="sm" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#1E293B]">
                    {trackResult.title}
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-[#64748B] space-y-1">
                  <div>
                    <span className="font-medium">Category:</span>{' '}
                    <span className="text-[#1E293B] font-semibold">{trackResult.category?.name}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>{trackResult.city} ({trackResult.pincode})</span>
                  </div>
                  <div>
                    <span className="font-medium">Reported:</span> {formatDate(trackResult.createdAt)}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                  Issue Description
                </h4>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {trackResult.description}
                </p>
              </div>
            </Card>

            {/* Timeline Milestones Card */}
            <Card className="border-[#E2E8F0] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                    Milestone Progression Audit
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Chronological immutable state transitions and remediation events
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* Vertical Stepper Feed */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0] ml-3 sm:ml-4 space-y-8">
                {trackResult.timeline?.map((item, index) => {
                  const isLatest = index === trackResult.timeline.length - 1;
                  return (
                    <div key={index} className="relative group">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isLatest
                            ? 'bg-[#7C3AED] border-white text-white shadow-md shadow-[#7C3AED]/30 ring-4 ring-[#EDE9FE]'
                            : 'bg-white border-[#7C3AED] text-[#7C3AED]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Content */}
                      <div className="bg-[#F8F7FC] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                            {item.action?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {item.remarks && (
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {item.remarks}
                          </p>
                        )}

                        <div className="mt-2 text-[10px] text-[#64748B]">
                          Transition: <span className="font-semibold">{item.fromStatus}</span> &rarr;{' '}
                          <span className="font-semibold text-[#7C3AED]">{item.toStatus}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Privacy Invariant Assurance Notice */}
              <div className="mt-10 p-3.5 rounded-xl bg-[#EDE9FE]/50 border border-[#DDD6FE]/70 text-xs text-[#312E81] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#7C3AED] shrink-0" />
                <span>
                  <strong>Zero-PII Assurance:</strong> In compliance with municipal privacy standards, reporter identities, telephone numbers, and residential street coordinates are strictly redacted from public tracking displays.
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;
