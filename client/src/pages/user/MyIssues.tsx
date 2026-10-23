import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Eye,
  AlertCircle,
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

      setIssues(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
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
        <span className="font-mono font-bold text-xs text-[#7C3AED] bg-[#EDE9FE] px-2 py-1 rounded-md border border-[#DDD6FE]">
          {row.issueCode}
        </span>
      ),
    },
    {
      header: 'Title & Category',
      render: (row) => (
        <div className="max-w-[260px]">
          <div className="font-semibold text-sm text-[#1E293B] truncate" title={row.title}>
            {row.title}
          </div>
          <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
            <span className="font-medium text-[#7C3AED]">{row.category?.name || 'General'}</span>
            <span>&bull;</span>
            <span className="text-[11px]">{row.suggestedPriority} Priority</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      render: (row) => (
        <div className="text-xs text-[#475569] max-w-[200px] truncate" title={row.address?.street}>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="truncate">{row.address?.street || 'N/A'}</span>
          </div>
          <div className="text-[11px] text-[#64748B] pl-4.5">{row.address?.city}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Fee Quote',
      render: (row) => (
        <div className="text-xs font-semibold text-[#1E293B]">
          {row.fee?.totalPaise ? `₹${(row.fee.totalPaise / 100).toLocaleString('en-IN')}` : 'Pending Quote'}
        </div>
      ),
    },
    {
      header: 'Reported',
      render: (row) => (
        <div className="text-xs text-[#64748B] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
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
            View
          </Button>
        </Link>
      ),
    },
  ];

  const statusTabs = [
    'All',
    'AwaitingAdvance',
    'AwaitingQuote',
    'Submitted',
    'Assigned',
    'InProgress',
    'Resolved',
    'Closed',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
              My Reported Civic Issues
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-[#64748B]">
            Track resolution status, inspect quotes, and review photo proof for all your reported defects.
          </p>
        </div>

        <Link to="/user/report-issue">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Card */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#F8F7FC] p-1 rounded-xl border border-[#E2E8F0] overflow-x-auto max-w-full">
            {statusTabs.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {st.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title or issue code..."
              leftIcon={<Search className="w-4 h-4 text-[#64748B]" />}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table<Issue>
        columns={columns}
        data={issues}
        isLoading={loading}
        onRowClick={(row) => navigate(`/user/issues/${row._id}`)}
        emptyMessage="No civic issues found matching the selected filter."
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
