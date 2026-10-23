import api, { ApiResponse } from './api';
import { AuthUser } from './auth.service';
import { Issue, TimelineEvent } from './issue.service';
import { PaymentItem } from './payment.service';
import { InvoiceItem } from './invoice.service';
import { UserProfile } from './user.service';

export interface AdminOverviewMetrics {
  totalIssues: number;
  activeIssues: number;
  resolvedIssues: number;
  needsAssignment: number;
  pendingResolvers: number;
  approvedResolvers: number;
  totalCitizens: number;
  totalGrossVolumePaise: number;
}

export interface AdminOverviewData {
  metrics: AdminOverviewMetrics;
  statusBreakdown: Record<string, number>;
  recentIssues: Issue[];
}

export interface CandidateResolver {
  resolver: {
    _id: string;
    user: AuthUser;
    skills: string[];
    serviceAddress: string;
    serviceRadiusKm: number;
    approvalStatus: string;
    isAvailable: boolean;
    rating?: number;
    completedTasksCount?: number;
  };
  distanceKm: number;
  activeTasksCount: number;
}

export interface IssueListParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserListParams {
  role?: string;
  isBlocked?: boolean | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IssueDetailData {
  issue: Issue;
  timeline: TimelineEvent[];
  payments: PaymentItem[];
  invoices: InvoiceItem[];
}

export const adminService = {
  // Executive Dashboard KPIs and overview
  async getOverview(): Promise<AdminOverviewData> {
    const response = await api.get<ApiResponse<AdminOverviewData>>('/admin/overview');
    return response.data.data!;
  },

  // Issue Management Queue
  async listIssues(params?: IssueListParams): Promise<{ issues: Issue[]; meta: any }> {
    const response = await api.get<ApiResponse<Issue[]>>('/admin/issues', { params });
    return {
      issues: response.data.data || [],
      meta: response.data.meta,
    };
  },

  // Full administrative issue details with timeline & billing
  async getIssueDetails(id: string): Promise<IssueDetailData> {
    const response = await api.get<ApiResponse<IssueDetailData>>(`/admin/issues/${id}`);
    return response.data.data!;
  },

  // Operational priority override
  async updatePriority(id: string, priority: 'Low' | 'Medium' | 'High' | 'Critical'): Promise<Issue> {
    const response = await api.patch<ApiResponse<Issue>>(`/admin/issues/${id}/priority`, { priority });
    return response.data.data!;
  },

  // Candidate resolvers query ($geoNear based)
  async getCandidates(id: string): Promise<CandidateResolver[]> {
    const response = await api.get<ApiResponse<CandidateResolver[]>>(`/admin/issues/${id}/candidates`);
    return response.data.data || [];
  },

  // Assign resolver to issue (concurrency safe)
  async assignResolver(id: string, resolverId: string): Promise<Issue> {
    const response = await api.patch<ApiResponse<Issue>>(`/admin/issues/${id}/assign`, { resolverId });
    return response.data.data!;
  },

  // Reject issue with automated refund
  async rejectIssue(id: string, reason: string): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/admin/issues/${id}/reject`, { reason });
    return response.data.data;
  },

  // Set manual quote for out-of-coverage issues
  async setManualQuote(id: string, quotePaise: number): Promise<Issue> {
    const response = await api.patch<ApiResponse<Issue>>(`/admin/issues/${id}/manual-quote`, { quotePaise });
    return response.data.data!;
  },

  // User directory
  async listUsers(params?: UserListParams): Promise<{ users: UserProfile[]; meta: any }> {
    const response = await api.get<ApiResponse<UserProfile[]>>('/admin/users', { params });
    return {
      users: response.data.data || [],
      meta: response.data.meta,
    };
  },

  // Block / Unblock user account
  async toggleBlockUser(id: string, isBlocked: boolean, reason?: string): Promise<UserProfile> {
    const response = await api.patch<ApiResponse<UserProfile>>(`/admin/users/${id}/block`, {
      isBlocked,
      reason,
    });
    return response.data.data!;
  },
};

export default adminService;
