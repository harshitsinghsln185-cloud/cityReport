import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import resolverTaskService from '../../services/resolverTask.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  Briefcase,
  Play,
  CheckCircle2,
  Phone,
  MapPin,
  Layers,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export const ResolverTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'Active' | 'Accepted' | 'InProgress'>('Active');
  const [startingId, setStartingId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await resolverTaskService.listTasks({ status: activeTab, limit: 50 });
      setTasks(res.tasks);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve active tasks');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStartWork = async (taskId: string) => {
    try {
      setStartingId(taskId);
      setActionSuccess(null);
      setError(null);
      await resolverTaskService.startTask(taskId);
      setActionSuccess('Work marked as In Progress. You may now execute repairs and submit completion proof.');
      fetchTasks();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to start task.');
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Active Jobs
            </span>
            <span className="text-xs text-[#64748B]">Count: {tasks.length}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Remediation Tasks Queue
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Active civic repairs under your execution; coordinate with citizens and submit photographic completion proof
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTasks}
          disabled={loading}
          className="gap-2 text-[#475569] border-[#E2E8F0] self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
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
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-rose-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex space-x-2 py-1">
          {[
            { label: 'All Active Tasks', value: 'Active' },
            { label: 'Accepted (Ready to Start)', value: 'Accepted' },
            { label: 'In Progress (Work Underway)', value: 'InProgress' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.value
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-xl border border-[#E2E8F0] animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border border-[#E2E8F0]">
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-[#7C3AED]" />}
            title="No Active Remediation Tasks"
            description="You do not currently have any repairs in Accepted or In Progress status. Check the 'New Assignments' tab to accept incoming offers."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isStarting = startingId === task._id;
            const priority = task.finalPriority || task.suggestedPriority || 'Medium';
            const citizen = task.reporter || {};

            return (
              <Card
                key={task._id}
                className="border border-[#E2E8F0] hover:border-[#A78BFA] transition-all p-6 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {priority} Priority
                      </span>
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#7C3AED]" />
                        {task.category?.name || 'Civic Issue'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[#1E293B]">
                      {task.title}
                    </h3>

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Unlocked Citizen Contact Card */}
                    <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#312E81] text-white flex items-center justify-center font-bold text-xs">
                          {citizen.name ? citizen.name.slice(0, 1).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="font-semibold text-[#1E293B] block">{citizen.name || 'Citizen'}</span>
                          <span className="text-[11px] text-[#64748B]">Citizen Contact</span>
                        </div>
                      </div>

                      {task.contactNumber || citizen.phone ? (
                        <a
                          href={`tel:${task.contactNumber || citizen.phone}`}
                          className="flex items-center gap-1 text-[#7C3AED] font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{task.contactNumber || citizen.phone}</span>
                        </a>
                      ) : (
                        <span className="text-[#64748B] italic">No phone provided</span>
                      )}

                      <div className="flex items-center gap-1 text-[#1E293B]">
                        <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                        <span className="truncate max-w-xs">{task.address?.street}, {task.address?.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-[#64748B] block">Current Stage</span>
                      <span className="text-sm font-bold text-[#1E293B]">
                        {task.status === 'Accepted' ? 'Ready to Start Work' : 'Work in Progress'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status === 'Accepted' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartWork(task._id)}
                          disabled={isStarting}
                          className="bg-[#312E81] hover:bg-[#1E1B4B] text-white text-xs font-semibold gap-1.5 shadow-sm"
                        >
                          {isStarting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Starting...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start Work</span>
                            </>
                          )}
                        </Button>
                      )}

                      <Link to={`/resolver/tasks/${task._id}`}>
                        <Button
                          variant={task.status === 'InProgress' ? 'primary' : 'outline'}
                          size="sm"
                          className={
                            task.status === 'InProgress'
                              ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold gap-1.5'
                              : 'text-xs gap-1 border-[#E2E8F0]'
                          }
                        >
                          <span>{task.status === 'InProgress' ? 'Upload Proof' : 'View Task'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
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

export default ResolverTasksPage;
