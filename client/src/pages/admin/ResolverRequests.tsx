import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Layers,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react';
import resolverService, { ResolverProfile } from '../../services/resolver.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Table, { TableColumn } from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';

export const ResolverRequestsPage: React.FC = () => {
  const [resolvers, setResolvers] = useState<ResolverProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inspection Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [selectedResolver, setSelectedResolver] = useState<ResolverProfile | null>(null);
  const [inspectLoading, setInspectLoading] = useState<boolean>(false);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [resolverToReject, setResolverToReject] = useState<ResolverProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Action Loading
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchResolvers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await resolverService.adminListResolvers({
        status: statusFilter === 'All' ? undefined : statusFilter,
        search: search.trim() || undefined,
        page,
        limit: 10,
      });

      setResolvers(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load resolver applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResolvers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchResolvers]);

  // Handle Inspect
  const handleInspect = async (resolver: ResolverProfile) => {
    try {
      setInspectModalOpen(true);
      setInspectLoading(true);
      // Fetch fresh details with short-lived signed ID proof URL
      const fullProfile = await resolverService.adminGetResolver(resolver._id);
      setSelectedResolver(fullProfile);
    } catch (err: any) {
      setError('Failed to load signed ID proof document.');
      setSelectedResolver(resolver);
    } finally {
      setInspectLoading(false);
    }
  };

  // Handle Approve
  const handleApprove = async (resolver: ResolverProfile) => {
    try {
      setActionLoadingId(resolver._id);
      await resolverService.adminApprove(resolver._id);
      setSuccessMessage(`Contractor ${resolver.user?.name} approved successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setInspectModalOpen(false);
      await fetchResolvers();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to approve resolver');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Reject Dialog
  const handleOpenReject = (resolver: ResolverProfile) => {
    setResolverToReject(resolver);
    setRejectionReason('');
    setRejectError(null);
    setRejectModalOpen(true);
  };

  // Submit Rejection
  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolverToReject) return;
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      setRejectError('Please provide a substantive rejection reason (at least 10 characters).');
      return;
    }

    try {
      setRejectLoading(true);
      setRejectError(null);
      await resolverService.adminReject(resolverToReject._id, rejectionReason.trim());
      setSuccessMessage(`Application for ${resolverToReject.user?.name} rejected.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setRejectModalOpen(false);
      setInspectModalOpen(false);
      await fetchResolvers();
    } catch (err: any) {
      setRejectError(err?.response?.data?.message || 'Failed to reject resolver application');
    } finally {
      setRejectLoading(false);
    }
  };

  const columns: TableColumn<ResolverProfile>[] = [
    {
      header: 'Contractor',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center font-bold text-sm shrink-0">
            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div>
            <div className="font-semibold text-sm text-[#1E293B]">
              {row.user?.name || 'Unknown Candidate'}
            </div>
            <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#7C3AED]" />
                {row.user?.email}
              </span>
              {row.user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#7C3AED]" />
                  {row.user?.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Trades / Skills',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.skills?.length > 0 ? (
            row.skills.map((s, idx) => (
              <span
                key={typeof s === 'string' ? s : s._id || idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EDE9FE]/70 text-[#312E81] border border-[#DDD6FE]"
              >
                {typeof s === 'string' ? 'Trade' : s.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#64748B] italic">No skills listed</span>
          )}
        </div>
      ),
    },
    {
      header: 'Territory Base',
      render: (row) => (
        <div className="text-xs max-w-[220px]">
          <div className="font-medium text-[#1E293B] truncate" title={row.serviceAddress}>
            {row.serviceAddress || 'Address on file'}
          </div>
          <div className="text-[#64748B] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#7C3AED] shrink-0" />
            <span>{row.serviceRadiusKm} km coverage</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Applied On',
      render: (row) => (
        <div className="text-xs text-[#64748B] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInspect(row)}
            title="Inspect ID proof and application"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Inspect
          </Button>

          {row.status === 'Pending' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row)}
                isLoading={actionLoadingId === row._id}
                title="Approve Contractor"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleOpenReject(row)}
                title="Reject with reason"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
              Resolver Verification Queue
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-[#64748B]">
            Inspect contractor government ID proofs and approve civic trade applications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchResolvers}
          isLoading={loading}
          leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
        >
          Refresh Queue
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Tabs */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#F8F7FC] p-1 rounded-xl border border-[#E2E8F0] w-fit">
            {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {st}
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
              placeholder="Search by name or email..."
              leftIcon={<Search className="w-4 h-4 text-[#64748B]" />}
            />
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Table<ResolverProfile>
        columns={columns}
        data={resolvers}
        isLoading={loading}
        emptyMessage="No resolver applications found matching current criteria."
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

      {/* Inspection Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title="Contractor Application & Government ID"
        description="Verify contractor identity proof against submitted municipal trade skills."
        maxWidth="max-w-3xl"
        footer={
          selectedResolver?.status === 'Pending' ? (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="danger"
                size="sm"
                onClick={() => selectedResolver && handleOpenReject(selectedResolver)}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject Application
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => selectedResolver && handleApprove(selectedResolver)}
                isLoading={actionLoadingId === selectedResolver._id}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve Contractor
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setInspectModalOpen(false)}>
              Close
            </Button>
          )
        }
      >
        {inspectLoading ? (
          <div className="py-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#64748B]">Generating authenticated signed URL for ID proof...</p>
          </div>
        ) : selectedResolver ? (
          <div className="space-y-6 text-sm">
            {/* Candidate Header Snapshot */}
            <div className="flex items-start justify-between p-4 bg-[#F8F7FC] rounded-xl border border-[#E2E8F0]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-base text-[#1E293B]">
                    {selectedResolver.user?.name}
                  </span>
                  <StatusBadge status={selectedResolver.status} size="sm" />
                </div>
                <div className="text-xs text-[#64748B] flex flex-wrap gap-4">
                  <span>Email: {selectedResolver.user?.email}</span>
                  <span>Phone: {selectedResolver.user?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="text-right text-xs text-[#64748B]">
                <div>Applied: {selectedResolver.createdAt ? new Date(selectedResolver.createdAt).toLocaleString('en-IN') : 'N/A'}</div>
                <div className="text-[#7C3AED] font-semibold mt-1">
                  Radius: {selectedResolver.serviceRadiusKm} km
                </div>
              </div>
            </div>

            {/* Rejection Note if Rejected */}
            {selectedResolver.status === 'Rejected' && selectedResolver.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <strong className="block text-rose-900 mb-1">Administrative Rejection Reason:</strong>
                {selectedResolver.rejectionReason}
              </div>
            )}

            {/* Grid: Territory & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="font-semibold text-xs text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#7C3AED]" />
                  <span>Headquarters & Territory</span>
                </div>
                <div className="text-xs text-[#475569]">
                  <p className="font-medium text-[#1E293B]">{selectedResolver.serviceAddress}</p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Coordinates: [lng: {selectedResolver.serviceLocation?.coordinates?.[0]?.toFixed(4)}, lat: {selectedResolver.serviceLocation?.coordinates?.[1]?.toFixed(4)}]
                  </p>
                  <p className="text-[11px] text-[#7C3AED] font-semibold mt-1">
                    Operating Coverage: {selectedResolver.serviceRadiusKm} km
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="font-semibold text-xs text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#7C3AED]" />
                  <span>Qualified Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResolver.skills?.map((cat, idx) => (
                    <span
                      key={typeof cat === 'string' ? cat : cat._id || idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#7C3AED] font-medium border border-[#DDD6FE]"
                    >
                      {typeof cat === 'string' ? 'Trade' : cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Government ID Document Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1E293B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                  <span>Government Identification Document</span>
                </label>
                {selectedResolver.idProofSignedUrl && (
                  <a
                    href={selectedResolver.idProofSignedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    <span>Open Full Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-3">
                {selectedResolver.idProofSignedUrl ? (
                  <img
                    src={selectedResolver.idProofSignedUrl}
                    alt="Resolver Government ID Proof"
                    className="max-h-80 w-auto object-contain rounded-lg shadow-xs"
                  />
                ) : (
                  <div className="py-12 text-center text-xs text-[#64748B]">
                    No ID proof file attached or authenticated URL generation failed.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#64748B]">
                Security Notice: Stored in an authenticated Cloudinary vault. The above document link is cryptographically signed and expires in 10 minutes.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Reject Reason Dialog Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Contractor Application"
        description="Provide a clear, substantive reason explaining why this application cannot be accepted."
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleSubmitReject}
              isLoading={rejectLoading}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitReject} className="space-y-4 text-sm">
          {rejectError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {rejectError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Rejection Reason (Visible to candidate, min 10 chars)
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. The uploaded government ID proof image is blurry and unreadable. Please upload a clear color photo or scan of your Aadhaar card or Voter ID."
              className="w-full text-xs p-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] text-[#1E293B]"
              required
            />
          </div>

          <p className="text-[11px] text-[#64748B]">
            This explanation will be permanently recorded and sent via transactional email to <span className="font-semibold text-[#1E293B]">{resolverToReject?.user?.email}</span>.
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default ResolverRequestsPage;
