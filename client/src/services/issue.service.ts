import api, { ApiResponse } from './api';
import { AuthUser } from './auth.service';
import { Category } from './category.service';
import { FileAsset } from './user.service';

export interface FeeSnapshot {
  categoryBaseFeePaise: number;
  severityMultiplier: number;
  distanceKm: number;
  freeKm: number;
  perKmRatePaise: number;
  distanceFeePaise: number;
  totalPaise: number;
  advancePaise: number;
  balancePaise: number;
  commissionPercent: number;
  isManualQuote: boolean;
  manualQuoteSetBy?: string | null;
}

export interface IssueAiAssessment {
  severity: number;
  confidence: number;
  reason: string;
  source: 'ai' | 'rules';
  model?: string;
  assessedAt?: string;
}

export interface TimelineEvent {
  _id: string;
  issue: string;
  fromStatus: string;
  toStatus: string;
  action: string;
  actor?: {
    _id: string;
    name: string;
    role: string;
  } | null;
  actorRole: 'User' | 'Resolver' | 'Admin' | 'system';
  remarks?: string | null;
  createdAt: string;
}

export interface Issue {
  _id: string;
  issueCode: string;
  reporter: AuthUser;
  category: Category;
  title: string;
  description: string;
  suggestedPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  finalPriority?: 'Low' | 'Medium' | 'High' | 'Critical' | null;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: {
    street: string;
    city: string;
    pincode: string;
  };
  contactNumber: string;
  images: FileAsset[];
  status: string;
  source: 'form' | 'chatbot';
  assignedResolver?: {
    _id: string;
    user: AuthUser;
    serviceAddress: string;
    serviceRadiusKm: number;
  } | null;
  assignedAt?: string | null;
  acceptedAt?: string | null;
  startedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  rejectionReason?: string | null;
  reopenReason?: string | null;
  reopenCount?: number;
  payoutStatus?: 'None' | 'Pending' | 'Paid';
  feedback?: any;
  resolution?: {
    _id: string;
    beforeImages: FileAsset[];
    afterImages: FileAsset[];
    remarks: string;
    submittedAt: string;
  } | null;
  aiAssessment?: IssueAiAssessment | null;
  fee: FeeSnapshot;
  payments?: {
    advancePayment?: string | null;
    balancePayment?: string | null;
    advanceInvoice?: string | null;
    finalInvoice?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EstimateQuotePayload {
  category: string;
  lat: number;
  lng: number;
  suggestedPriority?: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
}

export interface EstimateQuoteResponse {
  hasEligibleResolver: boolean;
  fee: FeeSnapshot | null;
  aiAssessment: IssueAiAssessment | null;
  nearestResolver: {
    _id: string;
    serviceAddress: string;
    serviceRadiusKm: number;
  } | null;
}

export interface CitizenIssuesResponse {
  success: boolean;
  data: Issue[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const issueService = {
  // Citizen submits new issue with photos
  async create(formData: FormData): Promise<{ issue: Issue; quote: FeeSnapshot | null }> {
    const res = await api.post<ApiResponse<{ issue: Issue; quote: FeeSnapshot | null }>>(
      '/issues',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data.data!;
  },

  // Citizen calculates quote estimate before creating
  async estimateQuote(payload: EstimateQuotePayload): Promise<EstimateQuoteResponse> {
    const res = await api.post<ApiResponse<EstimateQuoteResponse>>(
      '/issues/estimate-quote',
      payload
    );
    return res.data.data!;
  },

  // Get single issue with populated timeline
  async getById(id: string): Promise<{ issue: Issue; timeline: TimelineEvent[] }> {
    const res = await api.get<ApiResponse<{ issue: Issue; timeline: TimelineEvent[] }>>(
      `/issues/${id}`
    );
    return res.data.data!;
  },

  // Citizen lists their own issues
  async list(params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CitizenIssuesResponse> {
    const res = await api.get<CitizenIssuesResponse>('/issues', { params });
    return res.data;
  },

  // Citizen cancels an issue awaiting advance or quote
  async cancel(id: string): Promise<Issue> {
    const res = await api.patch<ApiResponse<Issue>>(`/issues/${id}/cancel`);
    return res.data.data!;
  },
};

export default issueService;
