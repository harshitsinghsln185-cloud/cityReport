import React, { useState, useEffect, useCallback } from 'react';
import resolverTaskService from '../../services/resolverTask.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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
  Camera,
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
      setTasks(Array.isArray(res?.tasks) ? res.tasks : []);
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
      setActionSuccess('Work marked as In Progress. You may now execute repairs and submit photographic proof.');
      fetchTasks();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to start task.');
    } finally {
      setStartingId(null);
    }
  };

  const tabs = [
    { label: 'All Active Tasks', value: 'Active' },
    { label: 'Accepted (Ready to Start)', value: 'Accepted' },
    { label: 'In Progress (Work Underway)', value: 'InProgress' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm" className="font-semibold uppercase tracking-wider">
              Active Job Execution
            </Badge>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 tabular-nums">
              {tasks.length} Assigned
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink tracking-tight">
            Repair Tasks Queue
          </h1>
          <p className="text-xs sm:text-sm text-secondaryText">
            Execute repairs within municipal SLA timelines, coordinate with citizens, and upload verifiable completion proof.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTasks}
          disabled={loading}
          className="self-start sm:self-auto"
          leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
        >
          Refresh Queue
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
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
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs text-red-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-2 py-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.value
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'text-secondaryText hover:text-ink hover:bg-canvas'
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
            <div key={i} className="h-44 bg-white rounded-card border border-border animate-pulse p-6" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-12 text-center border-border shadow-card">
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-primary" />}
            title="No Active Repair Tasks"
            description="You do not currently have any repairs in Accepted or In Progress status. Check the 'Job Offers' tab to accept incoming assignments."
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
                className="border-border hover:border-primary/40 transition-all p-6 relative overflow-hidden shadow-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {task.issueCode}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <Badge variant="neutral" size="sm" className="font-semibold">
                        {priority} Priority
                      </Badge>
                      <span className="text-xs text-secondaryText flex items-center gap-1 font-medium">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        {task.category?.name || 'Civic Defect'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
                      {task.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-secondaryText line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Unlocked Citizen Contact Card */}
                    <div className="p-3.5 rounded-card bg-canvas border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {citizen.name ? citizen.name.slice(0, 1).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-ink block">{citizen.name || 'Citizen Reporter'}</span>
                          <span className="text-xs text-muted">Citizen Contact</span>
                        </div>
                      </div>

                      {task.contactNumber || citizen.phone ? (
                        <a
                          href={`tel:${task.contactNumber || citizen.phone}`}
                          className="flex items-center gap-1.5 text-primary font-bold hover:underline bg-white px-2.5 py-1 rounded border border-border"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{task.contactNumber || citizen.phone}</span>
                        </a>
                      ) : (
                        <span className="text-muted italic">No phone provided</span>
                      )}

                      <div className="flex items-center gap-1.5 text-ink font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-xs">{task.address?.street}, {task.address?.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-muted block">Operational Stage</span>
                      <span className="text-sm font-bold text-ink block mt-0.5">
                        {task.status === 'Accepted' ? 'Ready to Start Work' : 'Work In Progress'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status === 'Accepted' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartWork(task._id)}
                          disabled={isStarting}
                          className="bg-indigo hover:bg-dark text-white text-xs font-semibold gap-1.5 shadow-xs"
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

                      <Button to={`/resolver/tasks/${task._id}`} variant={task.status === 'InProgress' ? 'primary' : 'outline'}
                          size="sm"
                          className="text-xs gap-1.5 shadow-xs"
                          leftIcon={task.status === 'InProgress' ? <Camera className="w-3.5 h-3.5" /> : undefined}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          <span>{task.status === 'InProgress' ? 'Upload Photo Proof' : 'View Task'}</span>
                        </Button>
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
