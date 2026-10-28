import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import adminService from '../../services/admin.service';
import { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import {
  AlertOctagon,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  MapPin,
  Wrench,
  Layers,
} from 'lucide-react';

export const AdminIssuesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');
  const [priorityFilter, setPriorityFilter] = useState<string>(searchParams.get('priority') || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.listIssues({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        page: meta.page,
        limit: meta.limit,
      });
      setIssues(Array.isArray(res?.issues) ? res.issues : []);
      if (res.meta) {
        setMeta((prev) => ({
          ...prev,
          total: res.meta.total,
          totalPages: res.meta.totalPages,
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve administrative issue list');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, meta.page, meta.limit]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setMeta((prev) => ({ ...prev, page: 1 }));
    const p = new URLSearchParams(searchParams);
    if (newStatus === 'All') p.delete('status');
    else p.set('status', newStatus);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPriorityFilter(val);
    setMeta((prev) => ({ ...prev, page: 1 }));
    const p = new URLSearchParams(searchParams);
    if (val === 'All') p.delete('priority');
    else p.set('priority', val);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 }));
    const p = new URLSearchParams(searchParams);
    if (searchQuery.trim()) p.set('search', searchQuery.trim());
    else p.delete('search');
    p.set('page', '1');
    setSearchParams(p);
    fetchIssues();
  };

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
    const p = new URLSearchParams(searchParams);
    p.set('page', newPage.toString());
    setSearchParams(p);
  };

  const statusTabs = [
    { label: 'All Issues', value: 'All' },
    { label: 'Needs Assignment', value: 'Submitted' },
    { label: 'Reassign Needed', value: 'ReassignNeeded' },
    { label: 'Awaiting Quote', value: 'AwaitingQuote' },
    { label: 'Awaiting Advance', value: 'AwaitingAdvance' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Resolved / Due', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Operations Triage
            </span>
            <span className="text-xs font-mono text-secondaryText">Total: {meta.total} reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
            Master Civic Issues Queue
          </h1>
          <p className="text-sm text-secondaryText mt-0.5">
            Evaluate civic reports, override priority levels, assign local certified contractors, and inspect photographic proof
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchIssues}
          disabled={loading}
          className="gap-2 self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex space-x-2 py-1 min-w-max">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-secondaryText hover:text-ink hover:bg-canvas'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Secondary Filters Bar */}
      <Card className="border border-border/80 bg-card rounded-card shadow-card p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input
              type="text"
              placeholder="Search by code (e.g. CR-), title, street, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded-xl bg-canvas text-ink placeholder:text-secondaryText focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-secondaryText whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Priority:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={handlePriorityChange}
              className="px-3 py-2 text-xs border border-border rounded-xl bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <Button type="submit" size="sm" className="text-xs px-4 shadow-xs">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Issues Table */}
      <Card className="border border-border/80 bg-card rounded-card shadow-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-canvas animate-pulse rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-700 text-sm">
            {error}
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={<AlertOctagon className="w-8 h-8 text-primary" />}
              title="No Issues Match Your Filter"
              description="Adjust the status tabs, priority filters, or search terms to inspect other records in the registry."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-xs font-mono uppercase tracking-wider text-secondaryText border-b border-border">
                <tr>
                  <th className="py-3 px-4">Issue Code & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Citizen Reporter</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Contractor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issues.map((issue) => {
                  const effectivePriority = issue.finalPriority || issue.suggestedPriority || 'Medium';
                  const resolverUser = issue.assignedResolver?.user;

                  return (
                    <tr key={issue._id} className="hover:bg-canvas/50 transition-colors">
                      {/* Code & Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-xs text-primary">
                          {issue.issueCode}
                        </div>
                        <div className="text-xs font-medium text-ink max-w-xs truncate" title={issue.title}>
                          {issue.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-xs text-secondaryText">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-primary" />
                          {issue.category?.name || 'General Civic'}
                        </span>
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-ink">{issue.reporter?.name || 'Citizen'}</div>
                        <div className="text-xs font-mono text-secondaryText">{issue.reporter?.phone || issue.reporter?.email}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-xs text-secondaryText max-w-xs">
                        <div className="flex items-center gap-1 truncate" title={`${issue.address?.street}, ${issue.address?.city}`}>
                          <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate">{issue.address?.city || 'City'}, {issue.address?.street}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={issue.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold ${
                            effectivePriority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : effectivePriority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-canvas text-secondaryText border border-border'
                          }`}
                        >
                          {effectivePriority}
                          {issue.finalPriority && (
                            <span className="ml-1 text-xs uppercase font-bold text-primary">(Override)</span>
                          )}
                        </span>
                      </td>

                      {/* Assigned Contractor */}
                      <td className="py-3.5 px-4 text-xs">
                        {resolverUser ? (
                          <div className="flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium text-ink truncate max-w-[120px]">
                              {resolverUser.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-secondaryText italic text-xs">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Button to={`/admin/issues/${issue._id}`} variant="outline"
                            size="sm"
                            className="text-xs gap-1 shadow-xs">
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-border bg-canvas/30">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              pageSize={meta.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminIssuesPage;
