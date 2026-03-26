/**
 * API 请求封装 - SaaS 后台 API
 * 处理与后端 API 的所有通信
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Device,
  MeasurementRecord,
  DashboardOverview,
  InterventionRule,
  InterventionLog,
  InterventionEffect,
  Activity,
  ActivityPushRecord,
  AvailableMetric,
  AvailableAction,
  RuleFormData,
  ActivityFormData,
} from './types';

// ========== API 配置 ==========
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const TENANT_ID = 'default-tenant'; // 开发阶段写死

// ========== 创建 axios 实例 ==========
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== 请求拦截器 ==========
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 自动添加 tenant_id
    if (config.params) {
      config.params.tenant_id = config.params.tenant_id || TENANT_ID;
    } else {
      config.params = { tenant_id: TENANT_ID };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== 响应拦截器 ==========
apiClient.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data;
    if (code === 200) return data;
    throw new Error(msg || '请求失败');
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
);

// ========== Dashboard API ==========
export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    return apiClient.get('/dashboard/overview');
  },

  getTrends: async (days: number = 7): Promise<{
    daily_trends: Array<{ date: string; stress_avg: number; health_score_avg: number }>;
  }> => {
    return apiClient.get('/dashboard/trends', { params: { days } });
  },
};

// ========== Device API ==========
export const deviceApi = {
  list: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Device>> => {
    return apiClient.get('/devices', { params });
  },

  get: async (deviceCode: string): Promise<Device> => {
    return apiClient.get(`/devices/${deviceCode}`);
  },

  sync: async (): Promise<{ synced: number }> => {
    return apiClient.post('/devices/sync');
  },

  bind: async (deviceCode: string, userId: string): Promise<{ success: boolean }> => {
    return apiClient.post('/devices/bind', { device_code: deviceCode, user_id: userId });
  },

  unbind: async (deviceCode: string): Promise<{ success: boolean }> => {
    return apiClient.post(`/devices/${deviceCode}/unbind`);
  },
};

// ========== User API ==========
export const userApi = {
  list: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    constitution?: string;
    stress_level?: string;
  }): Promise<PaginatedResponse<User>> => {
    return apiClient.get('/users', { params });
  },

  get: async (userId: string): Promise<User> => {
    return apiClient.get(`/users/${userId}`);
  },

  create: async (data: Partial<User>): Promise<User> => {
    return apiClient.post('/users', data);
  },

  update: async (userId: string, data: Partial<User>): Promise<User> => {
    return apiClient.put(`/users/${userId}`, data);
  },

  getTags: async (userId: string): Promise<string[]> => {
    return apiClient.get(`/users/${userId}/tags`);
  },

  getReports: async (userId: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<MeasurementRecord>> => {
    return apiClient.get(`/reports/user/${userId}`, { params });
  },
};

// ========== Report API ==========
export const reportApi = {
  get: async (reportId: string): Promise<MeasurementRecord> => {
    return apiClient.get(`/reports/${reportId}`);
  },

  list: async (params?: {
    page?: number;
    page_size?: number;
    user_id?: string;
    device_code?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<MeasurementRecord>> => {
    return apiClient.get('/reports', { params });
  },

  regenerateAI: async (reportId: string): Promise<{ status: string }> => {
    return apiClient.post(`/reports/${reportId}/regenerate`);
  },
};

// ========== Realtime API ==========
export const realtimeApi = {
  getLatest: async (deviceCode: string): Promise<{
    heart_rate: number;
    breathing_rate: number;
    stress_index: number;
    timestamp: string;
  }> => {
    return apiClient.get(`/realtime/${deviceCode}/latest`);
  },

  startMeasurement: async (deviceCode: string, userId: string): Promise<{
    measurement_id: string;
  }> => {
    return apiClient.post(`/realtime/${deviceCode}/start`, { user_id: userId });
  },

  stopMeasurement: async (deviceCode: string): Promise<{ status: string }> => {
    return apiClient.post(`/realtime/${deviceCode}/stop`);
  },

  getStatus: async (deviceCode: string): Promise<{
    is_measuring: boolean;
    duration: number;
    user_id?: string;
  }> => {
    return apiClient.get(`/realtime/${deviceCode}/status`);
  },

  createStream: (deviceCode: string): EventSource => {
    return new EventSource(`${API_BASE_URL}/realtime/${deviceCode}/stream`);
  },
};

// ========== Intervention Rule API ==========
export const ruleApi = {
  list: async (): Promise<InterventionRule[]> => {
    return apiClient.get('/rules');
  },

  get: async (ruleId: string): Promise<InterventionRule> => {
    return apiClient.get(`/rules/${ruleId}`);
  },

  create: async (data: RuleFormData): Promise<InterventionRule> => {
    return apiClient.post('/rules', data);
  },

  update: async (ruleId: string, data: Partial<RuleFormData>): Promise<InterventionRule> => {
    return apiClient.put(`/rules/${ruleId}`, data);
  },

  delete: async (ruleId: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/rules/${ruleId}`);
  },

  toggle: async (ruleId: string, enabled: boolean): Promise<InterventionRule> => {
    return apiClient.patch(`/rules/${ruleId}/toggle`, { is_enabled: enabled });
  },

  getAvailableMetrics: async (): Promise<AvailableMetric[]> => {
    return apiClient.get('/rules/available-metrics');
  },

  getAvailableActions: async (): Promise<AvailableAction[]> => {
    return apiClient.get('/rules/available-actions');
  },

  test: async (ruleId: string, mockMetrics: Record<string, number>): Promise<{
    triggered: boolean;
    actions: Array<{ type: string; params: Record<string, unknown> }>;
  }> => {
    return apiClient.post(`/rules/${ruleId}/test`, mockMetrics);
  },
};

// ========== Intervention Log API ==========
export const interventionLogApi = {
  list: async (params?: {
    page?: number;
    page_size?: number;
    user_id?: string;
    rule_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<InterventionLog>> => {
    return apiClient.get('/intervention-logs', { params });
  },

  get: async (logId: string): Promise<InterventionLog> => {
    return apiClient.get(`/intervention-logs/${logId}`);
  },
};

// ========== Intervention Effect API ==========
export const interventionEffectApi = {
  evaluate: async (userId: string, ruleId?: string): Promise<InterventionEffect> => {
    return apiClient.get('/intervention-effect', {
      params: { user_id: userId, rule_id: ruleId },
    });
  },
};

// ========== Activity API ==========
export const activityApi = {
  list: async (): Promise<Activity[]> => {
    return apiClient.get('/activities');
  },

  get: async (activityId: string): Promise<Activity> => {
    return apiClient.get(`/activities/${activityId}`);
  },

  create: async (data: ActivityFormData): Promise<Activity> => {
    return apiClient.post('/activities', data);
  },

  update: async (activityId: string, data: Partial<ActivityFormData>): Promise<Activity> => {
    return apiClient.put(`/activities/${activityId}`, data);
  },

  delete: async (activityId: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/activities/${activityId}`);
  },

  matchUsers: async (activityId: string): Promise<{
    matched: number;
    users: ActivityPushRecord[];
  }> => {
    return apiClient.post(`/activities/${activityId}/match-users`);
  },

  push: async (activityId: string): Promise<{ pushed: number }> => {
    return apiClient.post(`/activities/${activityId}/push`);
  },

  getPushRecords: async (activityId: string): Promise<ActivityPushRecord[]> => {
    return apiClient.get(`/activities/${activityId}/push-records`);
  },

  exportCSV: async (activityId: string): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/activities/${activityId}/export`, {
      params: { tenant_id: TENANT_ID },
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========== 导出 ==========
export default apiClient;
