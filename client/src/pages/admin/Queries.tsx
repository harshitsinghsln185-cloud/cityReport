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
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Citizen Inquiries & Queries
          </h1>
          <p className="text-sm text-secondaryText">
            Review public inquiries sent via "Write a Query" and dispatch email responses directly to citizens.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-card rounded-card border border-border/80 shadow-subtle">
          {(['ALL', 'Pending', 'Replied'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-card text-xs font-semibold transition-all font-mono ${
                statusFilter === tab
                  ? 'bg-primary text-white shadow-card'
                  : 'text-secondaryText hover:text-ink hover:bg-canvas'
              }`}
            >
              {tab === 'ALL' ? 'All Inquiries' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border/80 p-0 overflow-hidden shadow-card rounded-card bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border/80 text-secondaryText uppercase font-semibold tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-5">Citizen</th>
                <th className="py-3.5 px-5">Subject & Message</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondaryText">
                    Loading inquiries...
                  </td>
                </tr>
              ) : queries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondaryText">
                    No inquiries found matching current filter.
                  </td>
                </tr>
              ) : (
                queries.map((q) => (
                  <tr key={q._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-ink">{q.name}</div>
                      <div className="text-xs text-secondaryText font-mono">{q.email}</div>
                    </td>
                    <td className="py-3.5 px-5 max-w-sm">
                      <div className="font-semibold text-ink truncate">{q.subject}</div>
                      <p className="text-xs text-secondaryText line-clamp-2 mt-0.5">{q.message}</p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-secondaryText font-mono">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${
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
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
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
          <div className="p-4 border-t border-border/60 bg-canvas/30">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-card rounded-card shadow-modal border border-border/80 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-canvas">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-ink">
                    {activeReplyQuery.status === 'Replied' ? 'Inquiry Details' : 'Reply to Citizen'}
                  </h3>
                  <p className="text-xs text-secondaryText font-mono">{activeReplyQuery.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReplyQuery(null)}
                className="p-1.5 rounded-card text-secondaryText hover:bg-canvas hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Original Message Card */}
              <div className="p-4 rounded-card bg-canvas border border-border/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{activeReplyQuery.subject}</span>
                  <span className="text-xs text-secondaryText font-mono">
                    {formatDate(activeReplyQuery.createdAt)}
                  </span>
                </div>
                <p className="text-secondaryText leading-relaxed">{activeReplyQuery.message}</p>
              </div>

              {/* Already Replied View */}
              {activeReplyQuery.status === 'Replied' && (
                <div className="p-4 rounded-card bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-emerald-900 font-mono">
                    <span>Dispatched Administrator Reply:</span>
                    <span className="text-xs text-emerald-700">
                      {formatDate(activeReplyQuery.repliedAt || undefined)}
                    </span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                    {activeReplyQuery.reply}
                  </p>
                  {activeReplyQuery.repliedBy && (
                    <div className="pt-2 text-xs text-emerald-700 border-t border-emerald-200/60 font-mono">
                      Replied by: {activeReplyQuery.repliedBy.name} ({activeReplyQuery.repliedBy.email})
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form (if pending or editing) */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  {activeReplyQuery.status === 'Replied' ? 'Update Response:' : 'Your Response (sent via email):'}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Draft your administrative response to the citizen..."
                  className="w-full p-3 rounded-card border border-border/80 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-ink leading-relaxed"
                />
              </div>

              {replyError && (
                <div className="p-2.5 rounded-card bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{replyError}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-border/60 flex items-center justify-end gap-2 bg-canvas">
              <Button variant="outline" size="sm" onClick={() => setActiveReplyQuery(null)} className="border-border">
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
