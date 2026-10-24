import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import resolverTaskService from '../../services/resolverTask.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  History,
  CheckCircle2,
  Layers,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const ResolverCompletedHistoryPage: React.FC = () => {
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await resolverTaskService.listTasks({ status: 'Completed', limit: 50 });
      setTasks(Array.isArray(res?.tasks) ? res.tasks : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve completed repair history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Work Archive
            </span>
            <span className="text-xs font-mono text-secondaryText">
              Repairs Logged: {tasks.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
            Completed Repairs History
          </h1>
          <p className="text-sm text-secondaryText mt-1">
            Historical ledger of successfully resolved civic issues, certified before/after photographic proof, and completion timestamps
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={fetchHistory} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* History List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-card rounded-card border border-border animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border border-border/80 bg-card rounded-card shadow-card">
          <EmptyState
            icon={<History className="w-8 h-8 text-primary" />}
            title="No Completed Repairs Yet"
            description="When you finish an assigned civic repair and upload photographic resolution proof, your verified records, supervisor approval stamps, and photo galleries will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const resolution = task.resolution as any;

            return (
              <Card
                key={task._id}
                className="border border-border/80 bg-card rounded-card shadow-card hover:border-primary/40 transition-all p-6 relative overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <span className="text-xs text-secondaryText flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        {task.category?.name || 'Civic Issue'}
                      </span>
                      <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolved {task.resolvedAt ? new Date(task.resolvedAt).toLocaleDateString('en-IN') : ''}</span>
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-ink group-hover:text-primary transition-colors">
                      {task.title}
                    </h2>

                    {resolution?.remarks && (
                      <div className="p-3 bg-canvas rounded-xl border border-border text-xs text-secondaryText leading-relaxed">
                        <strong className="text-ink">Completion Remarks: </strong>
                        {resolution.remarks}
                      </div>
                    )}

                    {/* Photo Thumbnails */}
                    {resolution && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="text-xs font-semibold text-ink flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-primary" />
                          <span>Proof Gallery:</span>
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {resolution.afterImages?.map((img: any, idx: number) => (
                            <a
                              key={idx}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-16 h-12 rounded-xl overflow-hidden border border-emerald-300 block hover:opacity-90 hover:scale-105 transition-all shrink-0 shadow-xs"
                            >
                              <img src={img.url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-secondaryText pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Logged: {new Date(task.createdAt).toLocaleDateString('en-IN')}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Inspection Certified</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Link CTA */}
                  <div className="shrink-0 pt-2 lg:pt-0">
                    <Link to={`/resolver/tasks/${task._id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5 shadow-xs">
                        <span>Inspect Full Proof</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResolverCompletedHistoryPage;
