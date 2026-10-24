import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import issueService, { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MapPin,
  ArrowRight,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trackingInput, setTrackingInput] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const res = await issueService.list({ limit: 5 });
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (isMounted) setRecentIssues(list);
      } catch (err) {
        console.error('Failed to load citizen issues:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute metrics from issues
  const totalCount = recentIssues.length;
  const inProgressCount = recentIssues.filter(
    (i) => i.status === 'InProgress' || i.status === 'Assigned' || i.status === 'Accepted'
  ).length;
  const resolvedCount = recentIssues.filter(
    (i) => i.status === 'Resolved' || i.status === 'BalanceDue' || i.status === 'Closed'
  ).length;
  const awaitingAdvanceCount = recentIssues.filter(
    (i) => i.status === 'AwaitingAdvance' || i.status === 'AwaitingQuote'
  ).length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    navigate(`/track?code=${encodeURIComponent(trackingInput.trim().toUpperCase())}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-cardLg bg-gradient-to-r from-dark via-[#181C3F] to-indigo text-white p-6 sm:p-8 lg:p-10 shadow-modal">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-lavender border border-white/15 backdrop-blur-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Citizen Portal</span>
              </span>
              {user?.address?.city && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-lavender" />
                  <span>{user.address.city}, {user.address.state || 'India'}</span>
                </span>
              )}
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your municipal governance desk is active. Monitor neighborhood defect dispatches, review 50% advance escrow protections, and inspect Before/After photographic proof.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link to="/user/report-issue">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-lg shadow-primary/30"
              >
                Report New Defect
              </Button>
            </Link>
            <Link to="/user/issues">
              <Button
                variant="outline"
                size="md"
                className="border-white/20 text-white hover:bg-white/10"
              >
                My Reported Queue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 border-border hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-secondaryText">Total Reports</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-ink tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-muted mt-1">Logged civic incidents</div>
        </Card>

        <Card className="p-5 border-border hover:border-amber-400/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-secondaryText">Active Remediation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-amber-700 tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-muted mt-1">Under contractor repair</div>
        </Card>

        <Card className="p-5 border-border hover:border-emerald-400/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-secondaryText">Resolved & Verified</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-emerald-700 tabular-nums">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-muted mt-1">Verified with photo proof</div>
        </Card>

        <Card className="p-5 border-border hover:border-purple-400/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-secondaryText">Awaiting Advance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl sm:text-3xl text-purple-700 tabular-nums">
            {awaitingAdvanceCount}
          </div>
          <div className="text-[11px] text-muted mt-1">50% escrow pending</div>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Issues Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-xl text-ink">
                Recent Reported Issues
              </h2>
              <p className="text-xs text-secondaryText mt-0.5">
                Real-time status updates and inspection links for your active tickets.
              </p>
            </div>
            <Link
              to="/user/issues"
              className="text-xs font-semibold text-primary hover:text-primaryDark flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-secondaryText bg-white rounded-card border border-border">
              Loading recent issues...
            </div>
          ) : recentIssues.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-canvas border border-border text-muted flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-ink">
                  No Civic Issues Reported Yet
                </h3>
                <p className="text-xs text-secondaryText max-w-sm mx-auto leading-relaxed">
                  Notice a pothole, open manhole, broken streetlight, or garbage overflow in your ward? Submit a report now.
                </p>
              </div>
              <Link to="/user/report-issue" className="inline-block">
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Report Your First Issue
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <Card
                  key={issue._id}
                  className="p-4 sm:p-5 hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => navigate(`/user/issues/${issue._id}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {issue.issueCode}
                        </span>
                        <StatusBadge status={issue.status} size="sm" />
                        <span className="text-[11px] text-muted">
                          {issue.category?.name || 'General'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-ink truncate group-hover:text-primary transition-colors">
                        {issue.title}
                      </h3>

                      <div className="text-xs text-secondaryText flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{issue.address?.street}, {issue.address?.city}</span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                      <div className="text-xs font-bold text-ink tabular-nums">
                        {issue.fee?.totalPaise ? `₹${(issue.fee.totalPaise / 100).toLocaleString('en-IN')}` : 'Pending Quote'}
                      </div>
                      <div className="text-[11px] text-muted">
                        {new Date(issue.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Quick Track, Escrow Explainer & Support */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Track Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                <span>Track Public Incident</span>
              </h3>
              <p className="text-xs text-secondaryText">
                Enter any 8-character issue code to verify live SLA and public audit log.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                placeholder="e.g. CR-90214"
                maxLength={12}
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-lg border border-border bg-white text-ink placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Lookup Status
              </Button>
            </form>
          </Card>

          {/* 50% Escrow Guarantee Notice */}
          <Card className="p-5 sm:p-6 bg-gradient-to-br from-primary/5 via-canvas to-primary/10 border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-primary font-heading font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Paise-Exact Escrow Gate</span>
            </div>
            <p className="text-xs text-secondaryText leading-relaxed">
              <strong>50% Advance</strong> is safely locked in municipal escrow and only released to the certified resolver when on-site work begins. <strong>50% Balance</strong> is due only after you inspect and accept the verified Before/After completion photos.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero risk &bull; Guaranteed contractor SLA</span>
            </div>
          </Card>

          {/* Citizen Helpdesk Card */}
          <Card className="p-5 space-y-2 text-xs text-secondaryText">
            <h4 className="font-heading font-semibold text-ink flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>Ward Grievance Control Room</span>
            </h4>
            <p>
              Experiencing an urgent life-safety hazard (e.g. live wire or collapsed road)?
            </p>
            <div className="pt-1 font-bold text-primary text-xs">
              Toll-Free Emergency: 1800-CIVIC-REP (24/7)
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
