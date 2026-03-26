/**
 * Mock 数据 - 用于开发阶段预览 UI
 * 包含完整的模拟报告数据
 */

import { MeasurementRecord, TimeSeriesData, RealtimeData } from './types';

// ========== 完整模拟报告数据 ==========
export const mockReportData: MeasurementRecord = {
  id: 'mock-001',
  user: {
    id: 'user-001',
    name: '张三',
    gender: 'male',
    age: 35,
    height: 175,
    weight: 70,
    bmi: 22.9,
  },
  device_code: 'TA0096400014',
  start_time: '2025-06-19 14:00:00',
  end_time: '2025-06-19 14:32:00',
  duration_minutes: 32,
  health_score: 72,
  metrics: {
    avg_heart_rate: 75,
    max_heart_rate: 82,
    min_heart_rate: 68,
    avg_breathing: 16,
    max_breathing: 19,
    min_breathing: 14,
    hrv_score: 55,
    hrv_level: 'normal',
    stress_index: 42,
    stress_level: 'moderate',
    autonomic_balance: 1.8,
    autonomic_state: 'balanced',
    anxiety_index: 35,
    anxiety_level: 'low',
    fatigue_index: 42,
    fatigue_level: 'moderate',
    posture_stability: 85,
    movement_frequency: 0.3,
    tcm_primary_constitution: '平和质',
    tcm_primary_score: 72,
    tcm_secondary_constitution: '阴虚质',
    tcm_secondary_score: 55,
    tcm_constitution_detail: {
      '平和质': 72,
      '气虚质': 38,
      '阳虚质': 30,
      '阴虚质': 55,
      '痰湿质': 25,
      '湿热质': 35,
      '血瘀质': 40,
      '气郁质': 45,
      '特禀质': 20,
    },
    overall_health_score: 72,
    risk_items: [
      {
        level: 'medium',
        name: '压力偏高',
        desc: '压力敏感度42%，处于中等水平，建议适当放松',
      },
      {
        level: 'low',
        name: '坐姿可优化',
        desc: '坐姿稳定性85%，偶有重心偏移，注意调整姿势',
      },
    ],
  },
  time_series: generateMockTimeSeriesData(32 * 60),
  ai_analysis: `### 📊 总体健康状态概述

您本次检测持续 **32 分钟**，综合健康评分 **72 分**，处于良好水平。

整体来看，您的身心状态较为平衡，自主神经系统调节能力正常。心率保持在正常范围内波动，呼吸节律平稳。压力指数处于中等水平，建议在日常工作中注意劳逸结合。

### 🔍 各板块详细分析

**心率分析**
- 平均心率 75 bpm，处于正常静息心率范围
- 最高心率 82 bpm，最低 68 bpm，波动幅度适中
- HRV 评分为 55 ms，心率变异性正常

**呼吸分析**
- 平均呼吸频率 16 次/分，处于正常范围
- 呼吸节律较为平稳，未见明显异常

**自主神经平衡**
- 自主神经平衡指数 1.8，接近平衡状态
- 副交感神经略占优势，身体处于恢复放松状态

**压力与情绪**
- 压力指数 42%，处于中等水平
- 焦虑指数较低（35%），情绪较为稳定
- 疲劳指数 42%，有轻度疲劳感

**体质分析**
- 主要体质：平和质（72分）- 阴阳气血调和
- 次要体质：阴虚质（55分）- 注意滋阴养阴

### ⚠️ 风险指标预警

**压力指数偏高（中等风险）**
当前压力敏感度为 42%，虽然处于正常范围内，但已接近警戒线。建议：
- 保持规律作息，每天睡眠 7-8 小时
- 适当进行有氧运动，如散步、慢跑
- 学习放松技巧，如深呼吸、冥想

**坐姿稳定性（低风险）**
检测过程中发现有轻微的重心偏移，建议：
- 注意调整坐姿，保持脊柱自然曲线
- 每隔 1 小时起身活动 5-10 分钟
- 可考虑使用腰靠等辅助工具

### 💡 个性化健康建议

1. **运动建议**
   - 建议每周进行 3-5 次中等强度运动
   - 推荐快走、游泳、瑜伽等有氧运动
   - 每次运动时长 30-45 分钟为宜

2. **饮食建议**
   - 饮食宜清淡，少油少盐
   - 多食用新鲜蔬菜水果
   - 适量补充优质蛋白

3. **作息建议**
   - 建议晚上 11 点前入睡
   - 保持规律的作息时间
   - 午休时间不宜过长，建议 20-30 分钟

4. **情绪管理**
   - 培养积极乐观的心态
   - 适当参与社交活动
   - 学会情绪宣泄和压力释放

---
*本报告由 AI 辅助生成，仅供健康参考，不构成医疗诊断建议。如有不适，请及时就医。*`,
  status: 'completed',
  created_at: '2025-06-19 14:32:00',
};

// ========== 生成模拟时序数据 ==========
function generateMockTimeSeriesData(count: number): TimeSeriesData[] {
  const now = new Date();
  const startTime = new Date(now.getTime() - count * 1000);
  
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(startTime.getTime() + i * 1000);
    const baseHeartRate = 72;
    const baseBreathing = 16;
    const baseSympathetic = 35;
    
    // 添加一些变化和噪声
    const heartRateVar = Math.sin(i / 60) * 5 + (Math.random() - 0.5) * 4;
    const breathingVar = Math.sin(i / 120) * 2 + (Math.random() - 0.5) * 1;
    const sympatheticVar = Math.sin(i / 300) * 15 + (Math.random() - 0.5) * 5;
    
    return {
      time: time.toISOString(),
      heartRate: Math.round((baseHeartRate + heartRateVar) * 10) / 10,
      breathing: Math.round((baseBreathing + breathingVar) * 10) / 10,
      sympathetic: Math.round(baseSympathetic + sympatheticVar),
      parasympathetic: Math.round(100 - (baseSympathetic + sympatheticVar)),
    };
  });
}

// ========== 模拟实时数据 ==========
export function generateMockRealtimeData(): RealtimeData {
  const baseHeartRate = 70 + Math.random() * 10;
  const baseBreathing = 15 + Math.random() * 3;
  const baseHRV = 50 + Math.random() * 15;
  const baseStress = 35 + Math.random() * 15;
  
  return {
    device_code: 'TA0096400014',
    timestamp: new Date().toISOString(),
    heart_rate: Math.round(baseHeartRate),
    breathing_rate: Math.round(baseBreathing * 10) / 10,
    hrv: Math.round(baseHRV),
    stress_index: Math.round(baseStress),
    posture_score: Math.round(80 + Math.random() * 15),
    movement_intensity: Math.random() * 0.5,
  };
}

// ========== 模拟历史报告列表 ==========
export const mockHistoryReports: MeasurementRecord[] = [
  mockReportData,
  {
    ...mockReportData,
    id: 'mock-002',
    start_time: '2025-06-18 10:00:00',
    end_time: '2025-06-18 10:25:00',
    duration_minutes: 25,
    health_score: 68,
    metrics: {
      ...mockReportData.metrics,
      avg_heart_rate: 78,
      stress_index: 52,
      autonomic_balance: 2.1,
    },
  },
  {
    ...mockReportData,
    id: 'mock-003',
    start_time: '2025-06-17 16:30:00',
    end_time: '2025-06-17 17:05:00',
    duration_minutes: 35,
    health_score: 75,
    metrics: {
      ...mockReportData.metrics,
      avg_heart_rate: 70,
      stress_index: 35,
      autonomic_balance: 1.5,
    },
  },
  {
    ...mockReportData,
    id: 'mock-004',
    start_time: '2025-06-16 09:00:00',
    end_time: '2025-06-16 09:20:00',
    duration_minutes: 20,
    health_score: 65,
    metrics: {
      ...mockReportData.metrics,
      avg_heart_rate: 82,
      stress_index: 58,
      autonomic_balance: 2.5,
    },
  },
];

// ========== 模拟心率数据用于星空图 ==========
export const mockRRIntervals = Array.from({ length: 500 }, () => {
  const baseHR = 70 + Math.random() * 10;
  return Math.round(60000 / baseHR + (Math.random() - 0.5) * 100);
});
