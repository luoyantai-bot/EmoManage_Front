/**
 * 状态管理 - 测量状态
 * 管理测量过程中的所有状态
 */

import { create } from 'zustand';
import { RealtimeData, TimeSeriesData } from '@/lib/types';
import { generateMockRealtimeData } from '@/lib/mock-data';

interface MeasurementState {
  // 状态
  isMeasuring: boolean;
  deviceCode: string | null;
  measurementId: string | null;
  startTime: Date | null;
  
  // 实时数据
  realtimeData: RealtimeData | null;
  historyData: TimeSeriesData[];
  heartRateWaveData: number[];
  breathingWaveData: number[];
  
  // 错误
  error: string | null;
  
  // SSE 连接
  eventSource: EventSource | null;
  
  // Actions
  startMeasurement: (deviceCode: string, measurementId: string) => void;
  stopMeasurement: () => void;
  updateRealtimeData: (data: RealtimeData) => void;
  addHistoryData: (data: TimeSeriesData) => void;
  setError: (error: string | null) => void;
  
  // Mock 模式
  mockInterval: NodeJS.Timeout | null;
  startMockMode: (deviceCode: string) => void;
  stopMockMode: () => void;
}

export const useMeasurementStore = create<MeasurementState>((set, get) => ({
  // 初始状态
  isMeasuring: false,
  deviceCode: null,
  measurementId: null,
  startTime: null,
  realtimeData: null,
  historyData: [],
  heartRateWaveData: [],
  breathingWaveData: [],
  error: null,
  eventSource: null,
  mockInterval: null,

  // 开始测量
  startMeasurement: (deviceCode, measurementId) => {
    set({
      isMeasuring: true,
      deviceCode,
      measurementId,
      startTime: new Date(),
      realtimeData: null,
      historyData: [],
      heartRateWaveData: [],
      breathingWaveData: [],
      error: null,
    });
  },

  // 停止测量
  stopMeasurement: () => {
    const { eventSource, mockInterval } = get();
    
    // 关闭 SSE 连接
    if (eventSource) {
      eventSource.close();
    }
    
    // 清除 mock 定时器
    if (mockInterval) {
      clearInterval(mockInterval);
    }
    
    set({
      isMeasuring: false,
      eventSource: null,
      mockInterval: null,
    });
  },

  // 更新实时数据
  updateRealtimeData: (data) => {
    const { heartRateWaveData, breathingWaveData } = get();
    
    // 保持最近 300 个数据点（约 30 秒）
    const newHeartRateData = [...heartRateWaveData, data.heart_rate].slice(-300);
    const newBreathingData = [...breathingWaveData, data.breathing_rate].slice(-300);
    
    set({
      realtimeData: data,
      heartRateWaveData: newHeartRateData,
      breathingWaveData: newBreathingData,
    });
  },

  // 添加历史数据
  addHistoryData: (data) => {
    set((state) => ({
      historyData: [...state.historyData, data],
    }));
  },

  // 设置错误
  setError: (error) => {
    set({ error });
  },

  // 启动 Mock 模式（开发用）
  startMockMode: (deviceCode) => {
    set({
      isMeasuring: true,
      deviceCode,
      startTime: new Date(),
      realtimeData: null,
      historyData: [],
      heartRateWaveData: [],
      breathingWaveData: [],
      error: null,
    });

    const interval = setInterval(() => {
      const mockData = generateMockRealtimeData();
      mockData.device_code = deviceCode;
      
      const { realtimeData, historyData, heartRateWaveData, breathingWaveData } = get();
      
      // 更新波形数据
      const newHeartRateData = [...heartRateWaveData, mockData.heart_rate].slice(-300);
      const newBreathingData = [...breathingWaveData, mockData.breathing_rate].slice(-300);
      
      // 添加到历史数据（每秒一个）
      const newHistoryData = [
        ...historyData,
        {
          time: new Date().toISOString(),
          heartRate: mockData.heart_rate,
          breathing: mockData.breathing_rate,
          sympathetic: mockData.stress_index,
        },
      ];
      
      set({
        realtimeData: mockData,
        heartRateWaveData: newHeartRateData,
        breathingWaveData: newBreathingData,
        historyData: newHistoryData,
      });
    }, 1000);

    set({ mockInterval: interval });
  },

  // 停止 Mock 模式
  stopMockMode: () => {
    const { mockInterval } = get();
    if (mockInterval) {
      clearInterval(mockInterval);
    }
    set({
      isMeasuring: false,
      mockInterval: null,
    });
  },
}));
