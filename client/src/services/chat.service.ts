import { api, ApiResponse } from './api';

export type ChatState = 'GREETING' | 'COLLECT' | 'CONFIRM' | 'SUBMITTED' | 'HANDOFF';

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  quickReplies?: string[];
  timestamp?: string;
}

export interface ChatDraft {
  title?: string | null;
  description?: string | null;
  category?: string | null;
  categoryName?: string | null;
  suggestedPriority?: 'Low' | 'Medium' | 'High' | 'Critical';
  coordinates?: [number, number] | null;
  address?: {
    street?: string;
    city?: string;
    pincode?: string;
  };
  contactNumber?: string | null;
}

export interface ChatImageRef {
  publicId: string;
  url: string;
  format?: string;
  bytes?: number;
}

export interface ChatSession {
  _id: string;
  user?: string | null;
  state: ChatState;
  draft: ChatDraft;
  messages: ChatMessage[];
  imageRefs: ChatImageRef[];
  issue?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  reply: string;
  state: ChatState;
  draft: ChatDraft;
  quickReplies: string[];
}

export interface SubmitResponse {
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
  quote: any;
}

export const chatService = {
  createSession: async (): Promise<ChatSession> => {
    const res = await api.post<any, ApiResponse<ChatSession>>('/chat/sessions');
    return res.data!;
  },

  getSession: async (sessionId: string): Promise<ChatSession> => {
    const res = await api.get<any, ApiResponse<ChatSession>>(`/chat/sessions/${sessionId}`);
    return res.data!;
  },

  sendMessage: async (sessionId: string, message: string): Promise<MessageResponse> => {
    const res = await api.post<any, ApiResponse<MessageResponse>>(`/chat/sessions/${sessionId}/messages`, {
      message,
    });
    return res.data!;
  },

  uploadImage: async (sessionId: string, file: File): Promise<ChatSession> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<any, ApiResponse<ChatSession>>(`/chat/sessions/${sessionId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data!;
  },

  submitDraft: async (sessionId: string): Promise<SubmitResponse> => {
    const res = await api.post<any, ApiResponse<SubmitResponse>>(`/chat/sessions/${sessionId}/submit`);
    return res.data!;
  },
};

export default chatService;
