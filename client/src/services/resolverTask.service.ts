import api, { ApiResponse } from './api';
import { Issue, TimelineEvent } from './issue.service';
import { FileAsset } from './user.service';

export interface ResolutionProof {
  _id: string;
  issue: string;
  resolver: string;
  beforeImages: FileAsset[];
  afterImages: FileAsset[];
  remarks: string;
  submittedAt: string;
}

export interface TaskSummaryMetrics {
  assignedOffersCount: number;
  activeTasksCount: number;
  completedTasksCount: number;
  totalEarningsPaise: number;
  pendingPayoutPaise: number;
}

export interface ResolverDashboardData {
  metrics: TaskSummaryMetrics;
  recentTasks: Issue[];
}

export interface TaskDetailsResponse {
  task: Issue;
  timeline: TimelineEvent[];
}

export interface TaskListParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const resolverTaskService = {
  // Get contractor dashboard summary and overview metrics
  async getDashboardSummary(): Promise<ResolverDashboardData> {
    const res = await api.get<ApiResponse<ResolverDashboardData>>('/resolver/tasks/summary');
    return res.data.data!;
  },

  // List assigned tasks with status filter and pagination
  async listTasks(params?: TaskListParams): Promise<{ tasks: Issue[]; meta: any }> {
    const res = await api.get<ApiResponse<Issue[]>>('/resolver/tasks', { params });
    return {
      tasks: res.data.data || [],
      meta: res.data.meta,
    };
  },

  // Get single task details (contact masked if Assigned)
  async getTaskDetails(taskId: string): Promise<TaskDetailsResponse> {
    const res = await api.get<ApiResponse<TaskDetailsResponse>>(`/resolver/tasks/${taskId}`);
    return res.data.data!;
  },

  // Accept assigned task
  async acceptTask(taskId: string): Promise<Issue> {
    const res = await api.patch<ApiResponse<Issue>>(`/resolver/tasks/${taskId}/accept`);
    return res.data.data!;
  },

  // Decline assigned task with mandatory reason
  async rejectTask(taskId: string, reason: string): Promise<Issue> {
    const res = await api.patch<ApiResponse<Issue>>(`/resolver/tasks/${taskId}/reject`, { reason });
    return res.data.data!;
  },

  // Mark task work started (Accepted -> InProgress)
  async startTask(taskId: string): Promise<Issue> {
    const res = await api.patch<ApiResponse<Issue>>(`/resolver/tasks/${taskId}/start`);
    return res.data.data!;
  },

  // Submit photographic resolution proof (multipart)
  async submitResolutionProof(
    taskId: string,
    formData: FormData
  ): Promise<{ issue: Issue; resolution: ResolutionProof }> {
    const res = await api.post<ApiResponse<{ issue: Issue; resolution: ResolutionProof }>>(
      `/resolver/tasks/${taskId}/resolve`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data!;
  },
};

export default resolverTaskService;
