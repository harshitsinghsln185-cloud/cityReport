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
      setTasks(res.tasks);
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Resolved Work Archive
            </span>
            <span className="text-xs text-[#64748B]">Repairs: {tasks.length}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Completed Repairs History
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Archive of successfully resolved civic issues, before/after photographic proof, and completion timestamps
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="gap-2 text-[#475569] border-[#E2E8F0] self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
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
            <div key={i} className="h-44 bg-white rounded-xl border border-[#E2E8F0] animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border border-[#E2E8F0]">
          <EmptyState
            icon={<History className="w-8 h-8 text-[#7C3AED]" />}
            title="No Completed Repairs Yet"
            description="When you finish a repair and upload photographic resolution proof, your completed records and photo galleries will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const resolution = task.resolution as any;

            return (
              <Card
                key={task._id}
                className="border border-[#E2E8F0] hover:border-[#A78BFA] transition-all p-6 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#7C3AED]" />
                        {task.category?.name || 'Civic Issue'}
                      </span>
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved {task.resolvedAt ? new Date(task.resolvedAt).toLocaleDateString('en-IN') : ''}</span>
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                      {task.title}
                    </h3>

                    {resolution?.remarks && (
                      <div className="p-3 bg-[#F8F7FC] rounded-lg border border-[#E2E8F0] text-xs text-[#475569]">
                        <strong>Completion Remarks:</strong> {resolution.remarks}
                      </div>
                    )}

                    {/* Photo Thumbnails */}
                    {resolution && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-semibold text-[#1E293B] mr-1 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                          Proof Gallery:
                        </span>
                        {resolution.afterImages?.map((img: any, idx: number) => (
                          <a
                            key={idx}
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-16 h-12 rounded-lg overflow-hidden border border-emerald-300 block hover:opacity-90 transition-opacity"
                          >
                            <img src={img.url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Link CTA */}
                  <div className="shrink-0 pt-2 lg:pt-0">
                    <Link to={`/resolver/tasks/${task._id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1 border-[#E2E8F0] hover:border-[#7C3AED]">
                        <span>Inspect Full Proof</span>
                        <ArrowRight className="w-3 h-3 text-[#7C3AED]" />
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
