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

      setResolvers(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setTotalPages(res?.meta?.totalPages || 1);
      setTotalCount(res?.meta?.total || 0);
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
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 font-serif">
            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div>
            <div className="font-semibold text-sm text-ink">
              {row.user?.name || 'Unknown Candidate'}
            </div>
            <div className="text-xs text-secondaryText flex items-center gap-2 mt-0.5 font-mono">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-primary" />
                {row.user?.email}
              </span>
              {row.user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-primary" />
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
                className="text-xs font-medium px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
              >
                {typeof s === 'string' ? 'Trade' : s.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-secondaryText italic">No skills listed</span>
          )}
        </div>
      ),
    },
    {
      header: 'Territory Base',
      render: (row) => (
        <div className="text-xs max-w-[220px]">
          <div className="font-medium text-ink truncate" title={row.serviceAddress}>
            {row.serviceAddress || 'Address on file'}
          </div>
          <div className="text-secondaryText flex items-center gap-1 mt-0.5 font-mono">
            <MapPin className="w-3 h-3 text-primary shrink-0" />
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
        <div className="text-xs text-secondaryText flex items-center gap-1 font-mono">
          <Calendar className="w-3.5 h-3.5 text-secondaryText" />
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
            className="text-xs shadow-xs"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-xs"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleOpenReject(row)}
                title="Reject with reason"
                className="text-xs shadow-xs"
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
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              Resolver Accreditation Queue
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-secondaryText">
            Inspect contractor government ID proofs, evaluate trade skills, and manage municipal service accreditation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchResolvers}
          isLoading={loading}
          leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          className="shadow-xs"
        >
          Refresh Queue
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-sm flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Filters & Tabs */}
      <Card className="p-4 space-y-4 border border-border/80 bg-card rounded-card shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-canvas p-1 rounded-xl border border-border w-fit">
            {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-secondaryText hover:text-ink'
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
              leftIcon={<Search className="w-4 h-4 text-secondaryText" />}
            />
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <div className="border border-border/80 rounded-card overflow-hidden shadow-card">
        <Table<ResolverProfile>
          columns={columns}
          data={resolvers}
          isLoading={loading}
          emptyMessage="No resolver applications found matching current criteria."
        />
      </div>

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
                className="text-xs"
              >
                Reject Application
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => selectedResolver && handleApprove(selectedResolver)}
                isLoading={actionLoadingId === selectedResolver._id}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-xs"
              >
                Approve Contractor
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setInspectModalOpen(false)} className="text-xs">
              Close
            </Button>
          )
        }
      >
        {inspectLoading ? (
          <div className="py-12 text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs text-secondaryText">Generating authenticated signed URL for ID proof...</p>
          </div>
        ) : selectedResolver ? (
          <div className="space-y-6 text-sm">
            {/* Candidate Header Snapshot */}
            <div className="flex items-start justify-between p-4 bg-canvas rounded-xl border border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-ink">
                    {selectedResolver.user?.name}
                  </span>
                  <StatusBadge status={selectedResolver.status} size="sm" />
                </div>
                <div className="text-xs text-secondaryText flex flex-wrap gap-4 font-mono">
                  <span>Email: {selectedResolver.user?.email}</span>
                  <span>Phone: {selectedResolver.user?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="text-right text-xs text-secondaryText font-mono">
                <div>Applied: {selectedResolver.createdAt ? new Date(selectedResolver.createdAt).toLocaleString('en-IN') : 'N/A'}</div>
                <div className="text-primary font-semibold mt-1">
                  Radius: {selectedResolver.serviceRadiusKm} km
                </div>
              </div>
            </div>

            {/* Rejection Note if Rejected */}
            {selectedResolver.status === 'Rejected' && selectedResolver.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <strong className="block text-rose-950 mb-1">Administrative Rejection Reason:</strong>
                <span className="font-mono">{selectedResolver.rejectionReason}</span>
              </div>
            )}

            {/* Grid: Territory & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="font-semibold text-xs text-ink uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Headquarters & Territory</span>
                </div>
                <div className="text-xs text-secondaryText">
                  <p className="font-medium text-ink">{selectedResolver.serviceAddress}</p>
                  <p className="text-xs font-mono text-secondaryText mt-1">
                    Coordinates: [{selectedResolver.serviceLocation?.coordinates?.[0]?.toFixed(4)}, {selectedResolver.serviceLocation?.coordinates?.[1]?.toFixed(4)}]
                  </p>
                  <p className="text-xs text-primary font-semibold mt-1 font-mono">
                    Operating Coverage: {selectedResolver.serviceRadiusKm} km
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="font-semibold text-xs text-ink uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Qualified Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResolver.skills?.map((cat, idx) => (
                    <span
                      key={typeof cat === 'string' ? cat : cat._id || idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20"
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
                <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Government Identification Document</span>
                </label>
                {selectedResolver.idProofSignedUrl && (
                  <a
                    href={selectedResolver.idProofSignedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Open Full Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="border border-border rounded-xl overflow-hidden bg-canvas flex items-center justify-center p-3">
                {selectedResolver.idProofSignedUrl ? (
                  <img
                    src={selectedResolver.idProofSignedUrl}
                    alt="Resolver Government ID Proof"
                    className="max-h-80 w-auto object-contain rounded-lg shadow-xs"
                  />
                ) : (
                  <div className="py-12 text-center text-xs text-secondaryText">
                    No ID proof file attached or authenticated URL generation failed.
                  </div>
                )}
              </div>

              <p className="text-xs text-secondaryText">
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
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleSubmitReject}
              isLoading={rejectLoading}
              leftIcon={<XCircle className="w-4 h-4" />}
              className="text-xs shadow-xs"
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitReject} className="space-y-4 text-sm">
          {rejectError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {rejectError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Rejection Reason (Visible to candidate, min 10 chars)
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. The uploaded government ID proof image is blurry and unreadable. Please upload a clear color photo or scan of your Aadhaar card or Voter ID."
              className="w-full text-xs p-3 rounded-xl border border-border bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary leading-relaxed"
              required
            />
          </div>

          <p className="text-xs text-secondaryText">
            This explanation will be permanently recorded and sent via transactional email to <span className="font-semibold text-ink font-mono">{resolverToReject?.user?.email}</span>.
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default ResolverRequestsPage;
