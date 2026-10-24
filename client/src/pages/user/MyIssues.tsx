import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Eye,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';
import issueService, { Issue } from '../../services/issue.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import Table, { TableColumn } from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';

export const MyIssues: React.FC = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.list({
        status: statusFilter === 'All' ? undefined : statusFilter,
        search: search.trim() || undefined,
        page,
        limit: 10,
      });

      setIssues(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setTotalPages(res?.meta?.totalPages || 1);
      setTotalCount(res?.meta?.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load your issues.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchIssues]);

  const columns: TableColumn<Issue>[] = [
    {
      header: 'Issue Code',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
          {row.issueCode}
        </span>
      ),
    },
    {
      header: 'Title & Category',
      render: (row) => (
        <div className="max-w-[260px]">
          <div className="font-semibold text-xs sm:text-sm text-ink truncate" title={row.title}>
            {row.title}
          </div>
          <div className="text-xs text-secondaryText flex items-center gap-1.5 mt-0.5">
            <span className="font-medium text-primary">{row.category?.name || 'General'}</span>
            <span>&bull;</span>
            <span className="text-[11px] text-muted">{row.suggestedPriority} Priority</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Ward / Street',
      render: (row) => (
        <div className="text-xs text-secondaryText max-w-[200px] truncate" title={row.address?.street}>
          <div className="flex items-center gap-1 text-ink">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{row.address?.street || 'N/A'}</span>
          </div>
          <div className="text-[11px] text-muted pl-4.5">{row.address?.city}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Quote (₹)',
      render: (row) => (
        <div className="text-xs font-bold text-ink tabular-nums">
          {row.fee?.totalPaise ? `₹${(row.fee.totalPaise / 100).toLocaleString('en-IN')}` : 'Pending Quote'}
        </div>
      ),
    },
    {
      header: 'Reported',
      render: (row) => (
        <div className="text-xs text-secondaryText flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-muted" />
          <span>{new Date(row.createdAt).toLocaleDateString('en-IN')}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      className: 'text-right',
      render: (row) => (
        <Link to={`/user/issues/${row._id}`}>
          <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
            Inspect
          </Button>
        </Link>
      ),
    },
  ];

  const statusTabs = [
    { key: 'All', label: 'All Issues' },
    { key: 'AwaitingAdvance', label: 'Awaiting Advance' },
    { key: 'Submitted', label: 'Triage' },
    { key: 'Assigned', label: 'Assigned' },
    { key: 'InProgress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' },
    { key: 'BalanceDue', label: 'Balance Due' },
    { key: 'Closed', label: 'Closed' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-heading font-bold text-ink tracking-tight">
              My Reported Civic Issues
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 tabular-nums">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondaryText">
            Track resolution milestones, inspect contractor quotes, and verify Before/After photo proof for your neighborhood defects.
          </p>
        </div>

        <Link to="/user/report-issue">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} className="shadow-xs">
            Report New Defect
          </Button>
        </Link>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-card text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Card */}
      <Card className="p-4 space-y-4 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs with Horizontal Scroll */}
          <div className="flex items-center gap-1.5 bg-canvas p-1 rounded-xl border border-border overflow-x-auto max-w-full">
            <Filter className="w-3.5 h-3.5 text-muted ml-2 shrink-0 hidden sm:block" />
            {statusTabs.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => {
                  setStatusFilter(st.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st.key
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-secondaryText hover:text-ink'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full lg:w-72 relative">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title or issue code..."
              leftIcon={<Search className="w-4 h-4 text-muted" />}
              rightIcon={
                search ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="text-muted hover:text-ink pointer-events-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
            />
          </div>
        </div>
      </Card>

      {/* Table (Desktop) / Cards (Mobile) */}
      <Table<Issue>
        columns={columns}
        data={issues}
        isLoading={loading}
        onRowClick={(row) => navigate(`/user/issues/${row._id}`)}
        emptyMessage="No civic issues found matching the selected filter criteria."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};

export default MyIssues;
