import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import publicService, { QueryItem, PaginationMeta } from '../../services/public.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';

export const Queries: React.FC = () => {
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Replied'>('ALL');
  const [activeReplyQuery, setActiveReplyQuery] = useState<QueryItem | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const fetchQueries = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const data = await publicService.getAdminQueries(params);
      setQueries(data.queries);
      setMeta(data.meta);
    } catch (err) {
      console.error('Failed to load admin queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries(1);
  }, [statusFilter]);

  const handleOpenReply = (q: QueryItem) => {
    setActiveReplyQuery(q);
    setReplyText(q.reply || '');
    setReplyError(null);
  };

  const handleSendReply = async () => {
    if (!activeReplyQuery) return;
    if (!replyText.trim() || replyText.trim().length < 5) {
      setReplyError('Reply message must be at least 5 characters long.');
      return;
    }

    try {
      setIsSendingReply(true);
      setReplyError(null);
      await publicService.replyAdminQuery(activeReplyQuery._id, replyText.trim());
      setActiveReplyQuery(null);
      setReplyText('');
      await fetchQueries(meta.page);
    } catch (err: any) {
      setReplyError(err?.response?.data?.message || 'Failed to dispatch reply email.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#1E293B]">
            Citizen Inquiries & Queries
          </h1>
          <p className="text-sm text-[#64748B]">
            Review public inquiries sent via "Write a Query" and dispatch email responses directly to citizens.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EDE9FE]/50 rounded-xl border border-[#DDD6FE]/60">
          {(['ALL', 'Pending', 'Replied'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#1E293B]'
              }`}
            >
              {tab === 'ALL' ? 'All Inquiries' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-[#E2E8F0] p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7FC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#64748B]">
                    Loading inquiries...
                  </td>
                </tr>
              ) : queries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#64748B]">
                    No inquiries found matching current filter.
                  </td>
                </tr>
              ) : (
                queries.map((q) => (
                  <tr key={q._id} className="hover:bg-[#F8F7FC]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1E293B]">{q.name}</div>
                      <div className="text-[11px] text-[#64748B]">{q.email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-[#1E293B] truncate">{q.subject}</div>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">{q.message}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#64748B]">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          q.status === 'Replied'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {q.status === 'Replied' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{q.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant={q.status === 'Replied' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleOpenReply(q)}
                        className="text-xs"
                      >
                        {q.status === 'Replied' ? 'View Thread' : 'Send Reply'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-[#E2E8F0]">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(p) => fetchQueries(p)}
            />
          </div>
        )}
      </Card>

      {/* Reply Modal */}
      {activeReplyQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F7FC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                    {activeReplyQuery.status === 'Replied' ? 'Inquiry Details' : 'Reply to Citizen'}
                  </h3>
                  <p className="text-xs text-[#64748B]">{activeReplyQuery.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReplyQuery(null)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Original Message Card */}
              <div className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E2E8F0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">{activeReplyQuery.subject}</span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {formatDate(activeReplyQuery.createdAt)}
                  </span>
                </div>
                <p className="text-[#475569] leading-relaxed">{activeReplyQuery.message}</p>
              </div>

              {/* Already Replied View */}
              {activeReplyQuery.status === 'Replied' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span>Dispatched Administrator Reply:</span>
                    <span className="text-[10px] text-emerald-700">
                      {formatDate(activeReplyQuery.repliedAt || undefined)}
                    </span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                    {activeReplyQuery.reply}
                  </p>
                  {activeReplyQuery.repliedBy && (
                    <div className="pt-2 text-[10px] text-emerald-700 border-t border-emerald-200/60">
                      Replied by: {activeReplyQuery.repliedBy.name} ({activeReplyQuery.repliedBy.email})
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form (if pending or editing) */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  {activeReplyQuery.status === 'Replied' ? 'Update Response:' : 'Your Response (sent via email):'}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Draft your administrative response to the citizen..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-[#1E293B] leading-relaxed"
                />
              </div>

              {replyError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{replyError}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2 bg-[#F8F7FC]">
              <Button variant="outline" size="sm" onClick={() => setActiveReplyQuery(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSendingReply || !replyText.trim()}
                onClick={handleSendReply}
                className="flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingReply ? 'Dispatching...' : 'Dispatch Reply Email'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
