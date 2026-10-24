import api from './api';
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
    const response: any = await api.get('/admin/overview');
    return response?.data !== undefined ? response.data : response;
  },

  // Issue Management Queue
  async listIssues(params?: IssueListParams): Promise<{ issues: Issue[]; meta: any }> {
    const response: any = await api.get('/admin/issues', { params });
    const issues = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
    return {
      issues,
      meta: response?.meta,
    };
  },

  // Full administrative issue details with timeline & billing
  async getIssueDetails(id: string): Promise<IssueDetailData> {
    const response: any = await api.get(`/admin/issues/${id}`);
    return response?.data !== undefined ? response.data : response;
  },

  // Operational priority override
  async updatePriority(id: string, priority: 'Low' | 'Medium' | 'High' | 'Critical'): Promise<Issue> {
    const response: any = await api.patch(`/admin/issues/${id}/priority`, { priority });
    return response?.data !== undefined ? response.data : response;
  },

  // Candidate resolvers query ($geoNear based)
  async getCandidates(id: string): Promise<CandidateResolver[]> {
    const response: any = await api.get(`/admin/issues/${id}/candidates`);
    const candidates = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
    return candidates;
  },

  // Assign resolver to issue (concurrency safe)
  async assignResolver(id: string, resolverId: string): Promise<Issue> {
    const response: any = await api.patch(`/admin/issues/${id}/assign`, { resolverId });
    return response?.data !== undefined ? response.data : response;
  },

  // Reject issue with automated refund
  async rejectIssue(id: string, reason: string): Promise<any> {
    const response: any = await api.patch(`/admin/issues/${id}/reject`, { reason });
    return response?.data !== undefined ? response.data : response;
  },

  // Set manual quote for out-of-coverage issues
  async setManualQuote(id: string, quotePaise: number): Promise<Issue> {
    const response: any = await api.patch(`/admin/issues/${id}/manual-quote`, { quotePaise });
    return response?.data !== undefined ? response.data : response;
  },

  // User directory
  async listUsers(params?: UserListParams): Promise<{ users: UserProfile[]; meta: any }> {
    const response: any = await api.get('/admin/users', { params });
    const users = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
    return {
      users,
      meta: response?.meta,
    };
  },

  // Block / Unblock user account
  async toggleBlockUser(id: string, isBlocked: boolean, reason?: string): Promise<UserProfile> {
    const response: any = await api.patch(`/admin/users/${id}/block`, {
      isBlocked,
      reason,
    });
    return response?.data !== undefined ? response.data : response;
  },
};

export default adminService;
