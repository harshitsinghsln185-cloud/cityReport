import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService, { AdminOverviewData } from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import {
  AlertOctagon,
  UserCheck2,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Sliders,
  AlertTriangle,
  Building2,
  TrendingUp,
  ShieldCheck,
  Activity,
  Sparkles,
  MapPin,
  ChevronRight,
  FileText,
  DollarSign,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getOverview();
      setData(res);
      setLastRefreshedAt(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load executive dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metrics = data?.metrics || {
    totalIssues: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    needsAssignment: 0,
    pendingResolvers: 0,
    approvedResolvers: 0,
    totalCitizens: 0,
    totalGrossVolumePaise: 0,
  };

  const statusBreakdown = data?.statusBreakdown || {};

  // 4-Phase Municipal Operations Pipeline definition
  const pipelineStages = [
    {
      id: 1,
      name: 'Citizen Intake & Quoting',
      phaseNumber: '01',
      description: 'Public grievance logging, AI diagnosis & advance milestone authorization',
      headerColor: 'text-sky-700 bg-sky-50 border-sky-200',
      barColor: 'bg-sky-500',
      accentBorder: 'border-l-sky-500',
      statuses: [
        { key: 'Submitted', label: 'Submitted', hint: 'Fresh citizen submission' },
        { key: 'AwaitingQuote', label: 'Awaiting Quote', hint: 'Tariff calculation in progress' },
        { key: 'AwaitingAdvance', label: 'Awaiting Advance', hint: 'Citizen milestone 1 pending' },
      ],
    },
    {
      id: 2,
      name: 'Triage & Allocation',
      phaseNumber: '02',
      description: 'Supervisory verification, geospatial matching & contractor dispatch',
      headerColor: 'text-amber-800 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      accentBorder: 'border-l-amber-500',
      statuses: [
        { key: 'UnderReview', label: 'Under Review', hint: 'Admin manual scrutiny' },
        { key: 'Assigned', label: 'Assigned', hint: 'Dispatched to contractor' },
        { key: 'Accepted', label: 'Accepted', hint: 'Contractor mobilization' },
        { key: 'ReassignNeeded', label: 'Reassign Needed', hint: 'Contractor reassignment alert', isAlert: true },
      ],
    },
    {
      id: 3,
      name: 'Field Remediation',
      phaseNumber: '03',
      description: 'On-site civic restoration, materials deployment & repair proof verification',
      headerColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      barColor: 'bg-indigo-500',
      accentBorder: 'border-l-indigo-500',
      statuses: [
        { key: 'InProgress', label: 'In Progress', hint: 'Active on-site field work' },
        { key: 'Resolved', label: 'Resolved', hint: 'Repair complete & proof filed' },
      ],
    },
    {
      id: 4,
      name: 'Settlement & Audit',
      phaseNumber: '04',
      description: 'Milestone balance clearance, SLA auditing & municipal archive',
      headerColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-500',
      accentBorder: 'border-l-emerald-500',
      statuses: [
        { key: 'BalanceDue', label: 'Balance Due', hint: 'Citizen invoice milestone 2' },
        { key: 'Closed', label: 'Closed', hint: 'Audit certified & completed' },
        { key: 'Rejected', label: 'Rejected', hint: 'Out of municipal scope' },
      ],
    },
  ];

  const totalIssuesCount = metrics.totalIssues || 1;

  // Compute subtotal counts per stage
  const stageStats = pipelineStages.map((stage) => {
    const stageCount = stage.statuses.reduce(
      (acc, s) => acc + (statusBreakdown[s.key] || 0),
      0
    );
    const percentage = Math.round((stageCount / totalIssuesCount) * 100);
    return { ...stage, count: stageCount, percentage };
  });

  // Calculate Priority summary from recent issues
  const prioritySummary = (data?.recentIssues || []).reduce(
    (acc, issue) => {
      const p = issue.finalPriority || issue.suggestedPriority || 'Medium';
      if (p === 'Critical') acc.critical += 1;
      else if (p === 'High') acc.high += 1;
      else if (p === 'Medium') acc.medium += 1;
      else acc.low += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-card bg-surface border border-border">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-slate-200 rounded-full" />
            <div className="h-9 w-80 bg-slate-200 rounded-lg" />
            <div className="h-4 w-96 bg-slate-100 rounded-md" />
          </div>
          <div className="h-10 w-44 bg-slate-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-surface rounded-card border border-border p-6 space-y-4">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg" />
              <div className="h-4 w-36 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        <div className="h-96 bg-surface rounded-card border border-border" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn font-sans">
      {/* 1. Executive Secretariat Banner */}
      <div className="relative overflow-hidden rounded-cardLg bg-gradient-to-br from-[#06132B] via-[#0A1F44] to-[#0D295A] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
        {/* Subtle decorative glow & grid */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/40 shadow-xs backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Municipal Secretariat Operations HQ</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Civic Telemetry</span>
                {lastRefreshedAt && <span className="text-slate-400">• {lastRefreshedAt}</span>}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-white">
              Command & Operations Center
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Real-time civic operations triage, geospatial contractor allocation, multi-phase SLA monitoring, and financial settlement governance across all 16 municipal sectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOverview}
              disabled={loading}
              className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </Button>

            <Button
              to="/admin/issues"
              size="sm"
              variant="accent"
              className="gap-2 font-bold shadow-md hover:shadow-accent/20"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Master Queue</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error notification banner if any */}
      {error && (
        <div className="p-4 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={fetchOverview}
            className="text-xs underline font-semibold text-rose-700 hover:text-rose-900 transition-colors"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* 2. Primary KPI Grid (4 High-Impact Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Needs Assignment */}
        <Card className="relative overflow-hidden border border-border/80 bg-surface rounded-card shadow-card hover:border-accent/60 hover:shadow-lg transition-all duration-300 p-6 group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
          <div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                Triage / Allocation
              </span>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AlertOctagon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-ink font-mono tabular-nums">
                <AnimatedCounter value={metrics.needsAssignment} duration={1.2} />
              </span>
              {metrics.needsAssignment > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Action Req
                </span>
              )}
            </div>

            <p className="text-xs text-secondaryText font-medium mt-1">
              Awaiting supervisory dispatch or re-route
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
            <Link
              to="/admin/issues?status=Submitted"
              className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 transition-colors"
            >
              <span>Dispatch queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-[11px] font-mono text-secondaryText">SLA: 2h Max</span>
          </div>
        </Card>

        {/* KPI 2: Active Field Operations */}
        <Card className="relative overflow-hidden border border-border/80 bg-surface rounded-card shadow-card hover:border-sky-500/60 hover:shadow-lg transition-all duration-300 p-6 group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600" />
          <div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                Active Field Operations
              </span>
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-ink font-mono tabular-nums">
                <AnimatedCounter value={metrics.activeIssues} duration={1.3} />
              </span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                On-Site
              </span>
            </div>

            <p className="text-xs text-secondaryText font-medium mt-1">
              Assigned contractors & active field repairs
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.resolvedIssues} Resolved</span>
            </span>
            <span className="font-mono text-secondaryText text-[11px]">
              of {metrics.totalIssues} total
            </span>
          </div>
        </Card>

        {/* KPI 3: Accredited Contractors */}
        <Card className="relative overflow-hidden border border-border/80 bg-surface rounded-card shadow-card hover:border-emerald-500/60 hover:shadow-lg transition-all duration-300 p-6 group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                Accredited Contractors
              </span>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck2 className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-ink font-mono tabular-nums">
                <AnimatedCounter value={metrics.approvedResolvers} duration={1.4} />
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Vetted
              </span>
            </div>

            <p className="text-xs text-secondaryText font-medium mt-1">
              Active verified resolver network
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
            {metrics.pendingResolvers > 0 ? (
              <Link
                to="/admin/resolvers"
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{metrics.pendingResolvers} pending KYC</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All contractors vetted</span>
              </span>
            )}
            <Link
              to="/admin/resolvers"
              className="text-xs font-semibold text-primary hover:text-accent transition-colors"
            >
              Roster →
            </Link>
          </div>
        </Card>

        {/* KPI 4: Gross Municipal Turnover */}
        <Card className="relative overflow-hidden border border-border/80 bg-surface rounded-card shadow-card hover:border-accent/60 hover:shadow-lg transition-all duration-300 p-6 group flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-amber-500" />
          <div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                Gross Financial Volume
              </span>
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent-text border border-accent/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-accent-text" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-ink font-mono tabular-nums">
                <AnimatedCounter
                  value={Math.round(metrics.totalGrossVolumePaise / 100)}
                  prefix="₹"
                  duration={1.6}
                  separator={true}
                />
              </span>
            </div>

            <p className="text-xs text-secondaryText font-medium mt-1">
              Escrow advances & completed settlements
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-secondaryText font-mono">
              {metrics.totalCitizens} Citizens
            </span>
            <Link
              to="/admin/finance"
              className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 transition-colors"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Interactive 4-Stage Municipal Workflow Pipeline */}
      <Card className="border border-border/80 bg-surface rounded-card shadow-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h2 className="text-lg font-heading font-extrabold text-ink tracking-tight">
                Civic Operations Workflow Pipeline
              </h2>
            </div>
            <p className="text-xs text-secondaryText mt-0.5">
              Multi-phase municipal resolution architecture: from intake to on-site execution and financial audit
            </p>
          </div>

          <Link
            to="/admin/issues"
            className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Inspect Full Status Matrix ({metrics.totalIssues})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Global Progress Strip across the 4 stages */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-secondaryText">
            <span>Operational Pipeline Load Distribution</span>
            <span>{metrics.totalIssues} Total Issues Tracked</span>
          </div>
          <div className="h-2.5 w-full bg-canvas rounded-full overflow-hidden flex shadow-inner">
            {stageStats.map((st) => (
              <div
                key={st.id}
                style={{ width: `${Math.max(st.percentage, st.count > 0 ? 4 : 0)}%` }}
                className={`${st.barColor} transition-all duration-500`}
                title={`${st.name}: ${st.count} issues (${st.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* 4 Stage Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {stageStats.map((stage) => (
            <div
              key={stage.id}
              className={`rounded-xl border border-border/80 bg-card p-4 flex flex-col justify-between hover:border-accent/40 hover:shadow-md transition-all border-l-4 ${stage.accentBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-secondaryText uppercase tracking-wider">
                    Phase {stage.phaseNumber}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${stage.headerColor}`}
                  >
                    {stage.count} jobs
                  </span>
                </div>

                <h3 className="text-sm font-heading font-extrabold text-ink mb-1">
                  {stage.name}
                </h3>
                <p className="text-[11px] text-secondaryText leading-tight mb-4 min-h-[32px]">
                  {stage.description}
                </p>

                {/* Sub-status pills in this stage */}
                <div className="space-y-2">
                  {stage.statuses.map((st) => {
                    const count = statusBreakdown[st.key] || 0;
                    return (
                      <Link
                        key={st.key}
                        to={`/admin/issues?status=${st.key}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-canvas border border-border/60 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-ink truncate group-hover:text-primary transition-colors">
                              {st.label}
                            </span>
                            {st.isAlert && count > 0 && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-secondaryText truncate">
                            {st.hint}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-mono tabular-nums px-2 py-0.5 rounded bg-canvas group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-secondaryText font-mono">{stage.percentage}% of workload</span>
                <Link
                  to={`/admin/issues?status=${stage.statuses[0].key}`}
                  className="font-bold text-primary hover:text-accent flex items-center gap-1"
                >
                  <span>Filter</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Priority Risk Radar & Administrative Command Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / 2 cols: Priority & SLA Risk Radar */}
        <Card className="lg:col-span-2 border border-border/80 bg-surface rounded-card shadow-card p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="font-heading font-extrabold text-lg text-ink tracking-tight">
                    Priority & SLA Risk Radar
                  </h3>
                </div>
                <p className="text-xs text-secondaryText mt-0.5">
                  Severity distribution of active civic defects and standard municipal resolution benchmarks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>SLA Compliance: 98.4%</span>
                </span>
              </div>
            </div>

            {/* Urgency Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Link
                to="/admin/issues?priority=Critical"
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 hover:border-rose-300 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-800">Critical</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="text-2xl font-heading font-black text-rose-900 font-mono tabular-nums">
                  {prioritySummary.critical}
                </div>
                <span className="text-[10px] text-rose-700 font-medium mt-1">2h SLA Target</span>
              </Link>

              <Link
                to="/admin/issues?priority=High"
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-800">High</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-2xl font-heading font-black text-amber-900 font-mono tabular-nums">
                  {prioritySummary.high}
                </div>
                <span className="text-[10px] text-amber-700 font-medium mt-1">12h SLA Target</span>
              </Link>

              <Link
                to="/admin/issues?priority=Medium"
                className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-50 hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-800">Medium</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
                <div className="text-2xl font-heading font-black text-sky-900 font-mono tabular-nums">
                  {prioritySummary.medium}
                </div>
                <span className="text-[10px] text-sky-700 font-medium mt-1">24h SLA Target</span>
              </Link>

              <Link
                to="/admin/issues?priority=Low"
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Standard</span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="text-2xl font-heading font-black text-slate-900 font-mono tabular-nums">
                  {prioritySummary.low}
                </div>
                <span className="text-[10px] text-slate-600 font-medium mt-1">48h SLA Target</span>
              </Link>
            </div>

            {/* SLA Governance Banner */}
            <div className="p-4 rounded-xl bg-canvas border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">16 Municipal Civic Sectors Active</h4>
                  <p className="text-[11px] text-secondaryText">
                    Roads, Water Supply, Sanitation, Power, Drainage, Environment & Public Infrastructure all live.
                  </p>
                </div>
              </div>

              <Button to="/admin/categories" size="xs" variant="outline" className="shrink-0 self-start sm:self-auto gap-1">
                <span>Configure Tariffs</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-secondaryText">
            <span>Automated AI defect triage active</span>
            <Link to="/admin/issues" className="text-primary font-bold hover:underline flex items-center gap-1">
              <span>Inspect active SLA timers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Right / 1 col: Administrative Command Deck */}
        <Card className="border border-border/80 bg-surface rounded-card shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-heading font-extrabold text-lg text-ink tracking-tight">
                Command Deck
              </h3>
            </div>
            <p className="text-xs text-secondaryText mb-4">
              Quick access controls & configuration registries
            </p>

            <div className="space-y-2.5">
              <Link
                to="/admin/issues"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                      Triage Queue Desk
                    </h4>
                    <p className="text-[11px] text-secondaryText truncate">
                      Candidate match & quote approval
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors shrink-0 ml-2" />
              </Link>

              <Link
                to="/admin/resolvers"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                      Contractor Accreditation
                    </h4>
                    <p className="text-[11px] text-secondaryText truncate">
                      Inspect KYC & govt certifications
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors shrink-0 ml-2" />
              </Link>

              <Link
                to="/admin/finance"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent-text flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-accent-text" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                      Financial Governance
                    </h4>
                    <p className="text-[11px] text-secondaryText truncate">
                      Escrow milestones & contractor payouts
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors shrink-0 ml-2" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                      16 Civic Categories
                    </h4>
                    <p className="text-[11px] text-secondaryText truncate">
                      Base fees, icons & SLA targets
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors shrink-0 ml-2" />
              </Link>

              <Link
                to="/admin/fee-settings"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-canvas hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                      Fee Engine & SOR
                    </h4>
                    <p className="text-[11px] text-secondaryText truncate">
                      Per-km rates & severity multipliers
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondaryText group-hover:text-primary transition-colors shrink-0 ml-2" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-secondaryText hover:text-primary flex items-center justify-between transition-colors"
            >
              <span>User Directory & Citizen Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 5. Live Citizen Submissions Feed */}
      <Card className="border border-border/80 bg-surface rounded-card shadow-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-extrabold text-lg text-ink tracking-tight">
                Live Civic Issues Stream
              </h3>
            </div>
            <p className="text-xs text-secondaryText mt-0.5">
              Latest municipal incidents submitted by citizens across verified administrative zones
            </p>
          </div>

          <Link
            to="/admin/issues"
            className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Explore all issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data?.recentIssues || data.recentIssues.length === 0) ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-canvas text-secondaryText mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-ink">No recent civic reports logged</div>
            <p className="text-xs text-secondaryText max-w-sm mx-auto">
              Citizen grievance telemetry will populate here as new reports are filed through portal forms or AI chat.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left text-sm min-w-[760px]">
              <thead className="bg-canvas text-xs font-mono uppercase tracking-wider text-secondaryText border-b border-border/80">
                <tr>
                  <th className="py-3 px-4">Tracking Code & Title</th>
                  <th className="py-3 px-4">Civic Sector</th>
                  <th className="py-3 px-4">Citizen Reporter</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Priority SLA</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.recentIssues.map((issue) => {
                  const priority = issue.finalPriority || issue.suggestedPriority || 'Medium';
                  const address = issue.address
                    ? `${issue.address.city || ''}${issue.address.city && issue.address.street ? ', ' : ''}${issue.address.street || ''}`
                    : '';

                  return (
                    <tr
                      key={issue._id}
                      className="hover:bg-canvas/50 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {issue.issueCode}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-ink truncate max-w-xs mt-1 group-hover:text-primary transition-colors">
                          {issue.title}
                        </div>
                        {address && (
                          <div className="text-[11px] text-secondaryText flex items-center gap-1 mt-0.5 truncate max-w-xs">
                            <MapPin className="w-3 h-3 text-secondaryText/70 shrink-0" />
                            <span className="truncate">{address}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surfaceSubtle text-ink border border-border">
                          {issue.category?.name || 'General Municipal'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-ink">
                          {issue.reporter?.name || 'Citizen User'}
                        </div>
                        <div className="text-[11px] font-mono text-secondaryText truncate max-w-[180px]">
                          {issue.reporter?.email || '—'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={issue.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : priority === 'Medium'
                              ? 'bg-sky-100 text-sky-800 border border-sky-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {priority === 'Critical' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          )}
                          <span>{priority}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          to={`/admin/issues/${issue._id}`}
                          variant="outline"
                          size="xs"
                          className="font-bold text-xs gap-1 group-hover:border-primary/50 shadow-xs"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
