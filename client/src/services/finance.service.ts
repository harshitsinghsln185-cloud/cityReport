import { api, ApiResponse } from './api';

export interface FinanceMetrics {
  gmvPaise: number;
  gmvINR: string;
  advanceCollectedPaise: number;
  advanceCollectedINR: string;
  balanceCollectedPaise: number;
  balanceCollectedINR: string;
  commissionEarnedPaise: number;
  commissionEarnedINR: string;
  pendingPayoutsPaise: number;
  pendingPayoutsINR: string;
  paidPayoutsPaise: number;
  paidPayoutsINR: string;
  payoutCounts: {
    pending: number;
    paid: number;
    total: number;
  };
  paymentCounts: {
    total: number;
  };
  issueCounts: Record<string, number>;
}

export interface PayoutItem {
  _id: string;
  issue: {
    _id: string;
    issueCode: string;
    title: string;
    status: string;
    resolvedAt?: string;
    closedAt?: string;
  };
  resolver: {
    _id: string;
    user?: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  grossAmountPaise: number;
  commissionPercent: number;
  commissionPaise: number;
  netAmountPaise: number;
  status: 'Pending' | 'Paid';
  paidAt?: string | null;
  paidBy?: string | null;
  createdAt: string;
}

export interface ResolverEarningsSummary {
  totalEarningsPaise: number;
  totalEarningsINR: string;
  pendingPayoutPaise: number;
  pendingPayoutINR: string;
  completedTasksCount: number;
}

export interface FeedbackItem {
  _id: string;
  issue: string;
  resolver: string;
  citizen: string;
  rating: number;
  comments: string;
  createdAt: string;
}

export const financeService = {
  getFinanceOverview: async (params?: { startDate?: string; endDate?: string }): Promise<{ metrics: FinanceMetrics }> => {
    const res = await api.get<any, ApiResponse<{ metrics: FinanceMetrics }>>('/admin/finance/overview', { params });
    return res.data!;
  },

  exportFinanceCsvUrl: (params?: { startDate?: string; endDate?: string }): string => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const qs = query.toString();
    return `/api/admin/finance/export.csv${qs ? `?${qs}` : ''}`;
  },

  listPayments: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }) => {
    const res = await api.get<any, any>('/admin/finance/payments', { params });
    return {
      payments: res.data || [],
      pagination: res.pagination || res.meta || { total: 0, page: 1, limit: 20, pages: 1 },
    };
  },

  listPayouts: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await api.get<any, any>('/admin/finance/payouts', { params });
    return {
      payouts: (res.data || []) as PayoutItem[],
      pagination: res.pagination || res.meta || { total: 0, page: 1, limit: 20, pages: 1 },
    };
  },

  markPayoutPaid: async (payoutId: string): Promise<PayoutItem> => {
    const res = await api.patch<any, ApiResponse<PayoutItem>>(`/admin/payouts/${payoutId}/mark-paid`);
    return res.data!;
  },

  verifyResolutionProof: async (issueId: string) => {
    const res = await api.patch<any, ApiResponse<any>>(`/admin/issues/${issueId}/verify`);
    return res.data!;
  },

  requestTaskRework: async (issueId: string, remarks: string) => {
    const res = await api.patch<any, ApiResponse<any>>(`/admin/issues/${issueId}/request-rework`, { remarks });
    return res.data!;
  },

  getResolverEarnings: async (params?: { page?: number; limit?: number }) => {
    const res = await api.get<any, any>('/resolver/earnings', { params });
    return {
      summary: res.data as ResolverEarningsSummary,
      payouts: (res.payouts || []) as PayoutItem[],
      pagination: res.pagination || { total: 0, page: 1, limit: 10, pages: 1 },
    };
  },

  submitFeedback: async (issueId: string, data: { rating: number; comments?: string }): Promise<FeedbackItem> => {
    const res = await api.post<any, ApiResponse<FeedbackItem>>(`/issues/${issueId}/feedback`, data);
    return res.data!;
  },

  reopenIssue: async (issueId: string, reason: string) => {
    const res = await api.post<any, ApiResponse<any>>(`/issues/${issueId}/reopen`, { reason });
    return res.data!;
  },
};

export default financeService;
