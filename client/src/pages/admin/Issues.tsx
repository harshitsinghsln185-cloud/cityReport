import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
      setIssues(res.issues);
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Operations Triage
            </span>
            <span className="text-xs text-[#64748B]">Total: {meta.total} reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            Master Civic Issues Queue
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Evaluate civic reports, override priority levels, assign local certified contractors, and review fees
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchIssues}
          disabled={loading}
          className="gap-2 text-[#475569] border-[#E2E8F0] self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-[#E2E8F0] overflow-x-auto">
        <div className="flex space-x-2 py-1 min-w-max">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Secondary Filters Bar */}
      <Card className="border border-[#E2E8F0] p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by code (e.g. CR-), title, street, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Priority:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={handlePriorityChange}
              className="px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <Button type="submit" size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-4">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Issues Table */}
      <Card className="border border-[#E2E8F0] p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-sm">
            {error}
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={<AlertOctagon className="w-8 h-8 text-[#7C3AED]" />}
              title="No Issues Match Your Filter"
              description="Adjust the status tabs, priority filters, or search terms to inspect other records in the registry."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F7FC] text-xs font-semibold text-[#64748B] border-b border-[#E2E8F0]">
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {issues.map((issue) => {
                  const effectivePriority = issue.finalPriority || issue.suggestedPriority || 'Medium';
                  const resolverUser = issue.assignedResolver?.user;

                  return (
                    <tr key={issue._id} className="hover:bg-[#F8F7FC]/80 transition-colors">
                      {/* Code & Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-xs text-[#7C3AED]">
                          {issue.issueCode}
                        </div>
                        <div className="text-xs font-medium text-[#1E293B] max-w-xs truncate" title={issue.title}>
                          {issue.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-xs text-[#475569]">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#7C3AED]" />
                          {issue.category?.name || 'General Civic'}
                        </span>
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-[#1E293B]">{issue.reporter?.name || 'Citizen'}</div>
                        <div className="text-[11px] text-[#64748B]">{issue.reporter?.phone || issue.reporter?.email}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-xs text-[#475569] max-w-xs">
                        <div className="flex items-center gap-1 truncate" title={`${issue.address?.street}, ${issue.address?.city}`}>
                          <MapPin className="w-3 h-3 text-[#7C3AED] flex-shrink-0" />
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
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            effectivePriority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : effectivePriority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {effectivePriority}
                          {issue.finalPriority && (
                            <span className="ml-1 text-[9px] uppercase font-bold text-[#7C3AED]">(Override)</span>
                          )}
                        </span>
                      </td>

                      {/* Assigned Contractor */}
                      <td className="py-3.5 px-4 text-xs">
                        {resolverUser ? (
                          <div className="flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-[#7C3AED]" />
                            <span className="font-medium text-[#1E293B] truncate max-w-[120px]">
                              {resolverUser.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/admin/issues/${issue._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 border-[#E2E8F0] hover:border-[#7C3AED] hover:text-[#7C3AED]"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
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
          <div className="p-4 border-t border-[#E2E8F0]">
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
