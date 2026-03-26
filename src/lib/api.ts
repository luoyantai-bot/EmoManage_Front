/**
 * API 请求封装
 * 处理与后端 API 的所有通信
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ApiResponse,
  MeasurementRecord,
  RealtimeData,
  RegisterFormData,
  PaginatedResponse,
} from './types';

// ========== API 配置 ==========
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
  (config) => {
    // 可以在这里添加 token 等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== 响应拦截器 ==========
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// ========== 设备 API ==========
export const deviceApi = {
  /**
   * 绑定设备
   */
  async bindDevice(deviceCode: string, tenantId: string): Promise<ApiResponse<{ device_id: string }>> {
    const response = await apiClient.post('/devices/bind', {
      device_code: deviceCode,
      tenant_id: tenantId,
    });
    return response.data;
  },

  /**
   * 获取设备信息
   */
  async getDevice(deviceCode: string): Promise<ApiResponse<{ device: { code: string; name: string; status: string } }>> {
    const response = await apiClient.get(`/devices/${deviceCode}`);
    return response.data;
  },

  /**
   * 检查设备是否在线
   */
  async checkDeviceStatus(deviceCode: string): Promise<ApiResponse<{ online: boolean }>> {
    const response = await apiClient.get(`/devices/${deviceCode}/status`);
    return response.data;
  },
};

// ========== 用户 API ==========
export const userApi = {
  /**
   * 创建/更新用户信息
   */
  async upsertUser(data: RegisterFormData, tenantId: string): Promise<ApiResponse<{ user_id: string }>> {
    const response = await apiClient.post('/users', {
      ...data,
      tenant_id: tenantId,
    });
    return response.data;
  },

  /**
   * 获取用户信息
   */
  async getUser(userId: string): Promise<ApiResponse<{ user: RegisterFormData & { id: string; bmi: number } }>> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};

// ========== 测量 API ==========
export const measurementApi = {
  /**
   * 开始测量
   */
  async startMeasurement(deviceCode: string, userId: string): Promise<ApiResponse<{ measurement_id: string }>> {
    const response = await apiClient.post('/measurements/start', {
      device_code: deviceCode,
      user_id: userId,
    });
    return response.data;
  },

  /**
   * 结束测量
   */
  async endMeasurement(measurementId: string): Promise<ApiResponse<{ status: string }>> {
    const response = await apiClient.post(`/measurements/${measurementId}/end`);
    return response.data;
  },

  /**
   * 获取测量状态
   */
  async getMeasurementStatus(measurementId: string): Promise<ApiResponse<{ status: string; duration: number }>> {
    const response = await apiClient.get(`/measurements/${measurementId}/status`);
    return response.data;
  },
};

// ========== 实时数据 API ==========
export const realtimeApi = {
  /**
   * 获取 SSE 流地址
   */
  getStreamUrl(deviceCode: string): string {
    return `${API_BASE_URL}/realtime/${deviceCode}/stream`;
  },

  /**
   * 创建 EventSource 连接
   */
  createEventSource(deviceCode: string): EventSource {
    const url = this.getStreamUrl(deviceCode);
    return new EventSource(url);
  },

  /**
   * 获取最新数据
   */
  async getLatestData(deviceCode: string): Promise<ApiResponse<RealtimeData>> {
    const response = await apiClient.get(`/realtime/${deviceCode}/latest`);
    return response.data;
  },
};

// ========== 报告 API ==========
export const reportApi = {
  /**
   * 获取报告详情
   */
  async getReport(reportId: string): Promise<ApiResponse<MeasurementRecord>> {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  /**
   * 获取历史报告列表
   */
  async getReports(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<MeasurementRecord>>> {
    const response = await apiClient.get('/reports', {
      params: {
        user_id: userId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  /**
   * 触发 AI 报告生成
   */
  async generateAIReport(measurementId: string): Promise<ApiResponse<{ status: string }>> {
    const response = await apiClient.post(`/reports/${measurementId}/generate-ai`);
    return response.data;
  },
};

// ========== 健康分析 API ==========
export const analysisApi = {
  /**
   * 获取健康趋势
   */
  async getHealthTrend(userId: string, days: number = 7): Promise<
    ApiResponse<{
      dates: string[];
      scores: number[];
      stress_trend: number[];
    }>
  > {
    const response = await apiClient.get('/analysis/trend', {
      params: {
        user_id: userId,
        days,
      },
    });
    return response.data;
  },

  /**
   * 获取健康洞察
   */
  async getInsights(userId: string): Promise<
    ApiResponse<{
      insights: Array<{ type: string; message: string; priority: number }>;
    }>
  > {
    const response = await apiClient.get('/analysis/insights', {
      params: { user_id: userId },
    });
    return response.data;
  },
};

// ========== 导出 ==========
export default apiClient;
