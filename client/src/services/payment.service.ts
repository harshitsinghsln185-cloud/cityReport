import { api, ApiResponse } from './api';

export interface PaymentItem {
  _id: string;
  paymentId: string;
  idempotencyKey: string;
  issue: {
    _id: string;
    issueCode: string;
    title: string;
    status: string;
    fee: {
      totalPaise: number;
      advancePaise: number;
      balancePaise: number;
    };
  };
  user: string;
  type: 'Advance' | 'Balance' | 'Refund';
  amountPaise: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  failureReason?: string;
  completedAt?: string;
  createdAt: string;
}

export const paymentService = {
  createAdvanceOrder: async (issueId: string): Promise<{ paymentId: string; amountPaise: number; issueId: string }> => {
    const res = await api.post<any, ApiResponse<{ paymentId: string; amountPaise: number; issueId: string }>>(
      `/payments/advance/${issueId}/order`
    );
    return res.data!;
  },

  createBalanceOrder: async (issueId: string): Promise<{ paymentId: string; amountPaise: number; issueId: string }> => {
    const res = await api.post<any, ApiResponse<{ paymentId: string; amountPaise: number; issueId: string }>>(
      `/payments/balance/${issueId}/order`
    );
    return res.data!;
  },

  confirmPayment: async (
    paymentId: string,
    idempotencyKey: string
  ): Promise<{ paymentId: string; invoiceId: string; invoiceNumber: string; status: string; isReplay: boolean }> => {
    const res = await api.post<
      any,
      ApiResponse<{ paymentId: string; invoiceId: string; invoiceNumber: string; status: string; isReplay: boolean }>
    >(
      `/payments/${paymentId}/confirm`,
      {},
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    return res.data!;
  },

  failPayment: async (paymentId: string, reason: string): Promise<{ paymentId: string; status: string }> => {
    const res = await api.post<any, ApiResponse<{ paymentId: string; status: string }>>(
      `/payments/${paymentId}/fail`,
      { reason }
    );
    return res.data!;
  },

  getPayment: async (paymentId: string): Promise<PaymentItem> => {
    const res = await api.get<any, ApiResponse<PaymentItem>>(`/payments/${paymentId}`);
    return res.data!;
  },

  listMyPayments: async (
    params: { page?: number; limit?: number; status?: string } = {}
  ): Promise<{ payments: PaymentItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const res = await api.get<any, ApiResponse<PaymentItem[]>>('/payments/mine', { params });
    return {
      payments: res.data || [],
      meta: res.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  },
};

export default paymentService;
