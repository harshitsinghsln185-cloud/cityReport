import axios from 'axios';
import { api, ApiResponse } from './api';

export interface InvoiceItem {
  _id: string;
  invoiceNumber: string;
  issue: {
    _id: string;
    issueCode: string;
    title: string;
    status: string;
  };
  user: string;
  type: 'Advance' | 'Final';
  customerSnapshot: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      pincode: string;
    };
  };
  feeBreakdown: {
    categoryName: string;
    categoryBaseFeePaise: number;
    severityMultiplier: number;
    assessedSeverity: string;
    distanceKm: number;
    freeKm: number;
    perKmRatePaise: number;
    distanceFeePaise: number;
    totalPaise: number;
  };
  amountPaidPaise: number;
  advancePaidPaise: number;
  balanceDuePaise: number;
  createdAt: string;
}

export const invoiceService = {
  listMyInvoices: async (
    params: { page?: number; limit?: number } = {}
  ): Promise<{ invoices: InvoiceItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const res = await api.get<any, ApiResponse<InvoiceItem[]>>('/invoices/mine', { params });
    return {
      invoices: res.data || [],
      meta: res.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  },

  getInvoice: async (id: string): Promise<InvoiceItem> => {
    const res = await api.get<any, ApiResponse<InvoiceItem>>(`/invoices/${id}`);
    return res.data!;
  },

  downloadPdf: async (invoiceId: string, invoiceNumber?: string): Promise<void> => {
    // Authenticated blob request
    const response = await axios.get(`/api/invoices/${invoiceId}/pdf`, {
      responseType: 'blob',
      withCredentials: true,
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceNumber || invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default invoiceService;
