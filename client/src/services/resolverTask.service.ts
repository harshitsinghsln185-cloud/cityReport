import api from './api';
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
    const res: any = await api.get('/resolver/tasks/summary');
    return res?.data !== undefined ? res.data : res;
  },

  // List assigned tasks with status filter and pagination
  async listTasks(params?: TaskListParams): Promise<{ tasks: Issue[]; meta: any }> {
    const res: any = await api.get('/resolver/tasks', { params });
    const tasks = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];
    return {
      tasks,
      meta: res?.meta,
    };
  },

  // Get single task details (contact masked if Assigned)
  async getTaskDetails(taskId: string): Promise<TaskDetailsResponse> {
    const res: any = await api.get(`/resolver/tasks/${taskId}`);
    return res?.data !== undefined ? res.data : res;
  },

  // Accept assigned task
  async acceptTask(taskId: string): Promise<Issue> {
    const res: any = await api.patch(`/resolver/tasks/${taskId}/accept`);
    return res?.data !== undefined ? res.data : res;
  },

  // Decline assigned task with mandatory reason
  async rejectTask(taskId: string, reason: string): Promise<Issue> {
    const res: any = await api.patch(`/resolver/tasks/${taskId}/reject`, { reason });
    return res?.data !== undefined ? res.data : res;
  },

  // Mark task work started (Accepted -> InProgress)
  async startTask(taskId: string): Promise<Issue> {
    const res: any = await api.patch(`/resolver/tasks/${taskId}/start`);
    return res?.data !== undefined ? res.data : res;
  },

  // Submit photographic resolution proof (multipart)
  async submitResolutionProof(
    taskId: string,
    formData: FormData
  ): Promise<{ issue: Issue; resolution: ResolutionProof }> {
    const res: any = await api.post(
      `/resolver/tasks/${taskId}/resolve`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res?.data !== undefined ? res.data : res;
  },
};

export default resolverTaskService;
