import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin.service';
import { UserProfile } from '../../services/user.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Ban,
  CheckCircle2,
  RefreshCw,
  Mail,
  Phone,
  Unlock,
} from 'lucide-react';

const getUserId = (u?: { _id?: string; id?: string } | null): string => {
  return u?._id || u?.id || '';
};

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [blockedFilter, setBlockedFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Block / Unblock Modal State
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [blockReason, setBlockReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.listUsers({
        role: roleFilter,
        isBlocked: blockedFilter,
        search: searchQuery,
        page: meta.page,
        limit: meta.limit,
      });
      setUsers(res.users);
      if (res.meta) {
        setMeta((prev) => ({
          ...prev,
          total: res.meta.total,
          totalPages: res.meta.totalPages,
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to retrieve user directory');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, blockedFilter, searchQuery, meta.page, meta.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleTab = (r: string) => {
    setRoleFilter(r);
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const openBlockModal = (u: UserProfile) => {
    setTargetUser(u);
    setBlockReason('');
    setModalError(null);
  };

  const handleBlockToggleConfirm = async () => {
    if (!targetUser) return;
    const isBlocking = !targetUser.isBlocked;

    if (isBlocking && !blockReason.trim()) {
      setModalError('Please state a reason for suspending this user account.');
      return;
    }

    try {
      setActionLoading(true);
      setModalError(null);
      await adminService.toggleBlockUser(getUserId(targetUser), isBlocking, blockReason.trim());
      setSuccessMessage(
        isBlocking
          ? `Account for ${targetUser.name} has been suspended.`
          : `Account for ${targetUser.name} has been reinstated.`
      );
      setTargetUser(null);
      fetchUsers();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to update user account status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#A78BFA]/30">
              Access Governance
            </span>
            <span className="text-xs text-[#64748B]">Total: {meta.total} registered users</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B]">
            User & Account Directory
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Supervise registered citizens, contractors, and platform operators; manage account standing and access suspensions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="gap-2 text-[#475569] border-[#E2E8F0] self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Role Filter Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex space-x-2 py-1">
          {[
            { label: 'All Accounts', value: 'All' },
            { label: 'Citizens', value: 'User' },
            { label: 'Contractors', value: 'Resolver' },
            { label: 'Administrators', value: 'Admin' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleRoleTab(tab.value)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === tab.value
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F7FC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Standing Filter */}
      <Card className="border border-[#E2E8F0] p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by name, email, or telephone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={blockedFilter}
              onChange={(e) => {
                setBlockedFilter(e.target.value);
                setMeta((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
            >
              <option value="">All Account Statuses</option>
              <option value="false">Active Only</option>
              <option value="true">Suspended / Blocked Only</option>
            </select>

            <Button type="submit" size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-4">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Users Table */}
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
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={<Users className="w-8 h-8 text-[#7C3AED]" />}
              title="No Users Located"
              description="No user accounts matched the given search query or active filter settings."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F7FC] text-xs font-semibold text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Account Standing</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {users.map((u) => {
                  const uid = getUserId(u);
                  const isCurrent = getUserId(currentAdmin) === uid;
                  const isAdminRole = u.role === 'Admin';

                  return (
                    <tr key={uid || u.email} className="hover:bg-[#F8F7FC]/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.photo?.url ? (
                            <img
                              src={u.photo.url}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0]"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#312E81] text-white flex items-center justify-center font-bold text-xs">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <div className="font-heading font-bold text-xs text-[#1E293B] flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-100 text-[#7C3AED]">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#64748B] font-mono">{uid}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-1 text-[#1E293B]">
                          <Mail className="w-3 h-3 text-[#7C3AED]" />
                          <span>{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#64748B] mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{u.phone || 'No phone'}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'Admin'
                              ? 'bg-[#171A3B] text-white'
                              : u.role === 'Resolver'
                              ? 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.role === 'Admin' ? 'Administrator' : u.role === 'Resolver' ? 'Contractor' : 'Citizen'}
                        </span>
                      </td>

                      {/* Standing */}
                      <td className="py-3.5 px-4">
                        {u.isBlocked ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                            <Ban className="w-3 h-3" />
                            <span>Suspended</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        )}
                        {u.blockReason && (
                          <div className="text-[10px] text-rose-600 truncate max-w-xs mt-0.5 italic" title={u.blockReason}>
                            Reason: {u.blockReason}
                          </div>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-xs text-[#64748B]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isAdminRole ? (
                          <span className="text-xs text-slate-400 italic">Protected</span>
                        ) : isCurrent ? (
                          <span className="text-xs text-slate-400 italic">Current Session</span>
                        ) : (
                          <Button
                            variant={u.isBlocked ? 'outline' : 'outline'}
                            size="sm"
                            onClick={() => openBlockModal(u)}
                            className={`text-xs gap-1.5 ${
                              u.isBlocked
                                ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                : 'text-rose-600 border-rose-200 hover:bg-rose-50'
                            }`}
                          >
                            {u.isBlocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3.5 h-3.5" />
                                <span>Block User</span>
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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

      {/* Block / Unblock Confirmation Modal */}
      {targetUser && (
        <Modal
          isOpen={!!targetUser}
          onClose={() => setTargetUser(null)}
          title={targetUser.isBlocked ? 'Reinstate User Account' : 'Suspend User Account'}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">
              {targetUser.isBlocked ? (
                <>
                  Are you sure you wish to unblock <strong className="text-[#1E293B]">{targetUser.name}</strong> ({targetUser.email})? They will immediately regain access to platform services.
                </>
              ) : (
                <>
                  Are you sure you wish to suspend <strong className="text-[#1E293B]">{targetUser.name}</strong> ({targetUser.email})? Their active sessions will be terminated and subsequent logins blocked.
                </>
              )}
            </p>

            {!targetUser.isBlocked && (
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Reason for Suspension (required)
                </label>
                <textarea
                  rows={3}
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Terms of service violation, fraudulent report spam, abusive conduct..."
                  className="w-full p-2.5 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />
              </div>
            )}

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {modalError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTargetUser(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className={targetUser.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}
                onClick={handleBlockToggleConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : targetUser.isBlocked ? 'Reinstate Account' : 'Confirm Suspension'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;
