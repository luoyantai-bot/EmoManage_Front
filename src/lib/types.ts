/**
 * TypeScript 类型定义
 * 定义所有 API 响应和组件 Props 的类型
 */

// ========== 情绪色彩类型 ==========
export type EmotionType = 'relaxed' | 'calm' | 'focused' | 'stressed';

export interface EmotionColor {
  primary: string;
  gradient: string;
  glow: string;
  label: string;
}

// ========== 用户类型 ==========
export interface User {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number;
  weight: number;
  bmi: number;
}

// ========== 设备类型 ==========
export interface Device {
  id: string;
  code: string;
  name: string;
  status: 'online' | 'offline' | 'measuring';
}

// ========== 测量记录类型 ==========
export interface MeasurementRecord {
  id: string;
  user: User;
  device_code: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  health_score: number;
  metrics: MeasurementMetrics;
  time_series?: TimeSeriesData[];
  ai_analysis?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// ========== 测量指标类型 ==========
export interface MeasurementMetrics {
  // 心率
  avg_heart_rate: number;
  max_heart_rate: number;
  min_heart_rate: number;
  
  // 呼吸
  avg_breathing: number;
  max_breathing: number;
  min_breathing: number;
  
  // HRV
  hrv_score: number;
  hrv_level: 'low' | 'normal' | 'high';
  
  // 压力
  stress_index: number;
  stress_level: 'low' | 'moderate' | 'high';
  
  // 自主神经
  autonomic_balance: number;
  autonomic_state: 'parasympathetic' | 'balanced' | 'sympathetic';
  
  // 情绪
  anxiety_index: number;
  anxiety_level: 'low' | 'moderate' | 'high';
  fatigue_index: number;
  fatigue_level: 'low' | 'moderate' | 'high';
  
  // 姿态
  posture_stability: number;
  movement_frequency: number;
  
  // 中医体质
  tcm_primary_constitution: string;
  tcm_primary_score: number;
  tcm_secondary_constitution?: string;
  tcm_secondary_score?: number;
  tcm_constitution_detail: Record<string, number>;
  
  // 综合
  overall_health_score: number;
  risk_items?: RiskItem[];
}

// ========== 风险项类型 ==========
export interface RiskItem {
  level: 'low' | 'medium' | 'high';
  name: string;
  desc: string;
}

// ========== 时序数据类型 ==========
export interface TimeSeriesData {
  time: string;
  heartRate: number;
  breathing: number;
  sympathetic: number;
  parasympathetic?: number;
}

// ========== 实时数据类型 ==========
export interface RealtimeData {
  device_code: string;
  timestamp: string;
  heart_rate: number;
  breathing_rate: number;
  hrv: number;
  stress_index: number;
  posture_score: number;
  movement_intensity: number;
}

// ========== API 响应类型 ==========
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ========== 组件 Props 类型 ==========
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  emotionColor?: EmotionType;
  glowIntensity?: 'none' | 'subtle' | 'medium';
  onClick?: () => void;
}

export interface BreathingOrbProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: number;
  children?: React.ReactNode;
}

export interface EmotionGradientProps {
  emotionColor: string;
  animated?: boolean;
}

export interface MetricDisplayProps {
  icon?: React.ReactNode | string;
  label: string;
  value: number | string;
  unit?: string;
  status?: {
    level: 'good' | 'warning' | 'danger';
    text: string;
  };
  trend?: 'up' | 'down' | 'stable';
  showBar?: boolean;
  barValue?: number;
  barColor?: string;
}

export interface PulseRingProps {
  heartRate: number;
  size?: number;
  showLabel?: boolean;
}

// ========== 图表 Props 类型 ==========
export interface EmotionStarfieldProps {
  rrIntervals: number[];
  emotionLabel?: string;
  height?: number;
}

export interface VibeTrendAreaProps {
  timeSeriesData: TimeSeriesData[];
  height?: number;
}

export interface HealthScoreRingProps {
  score: number;
  label?: string;
  size?: number;
  animated?: boolean;
}

export interface StressGaugeProps {
  value: number;
  label?: string;
}

export interface ConstitutionRadarProps {
  constitutionScores: Record<string, number>;
  primaryConstitution: string;
}

export interface AutonomicSpectrumProps {
  value: number;
  showLabels?: boolean;
}

export interface HeartBreathWaveProps {
  data: number[];
  type: 'heartRate' | 'breathing';
  color?: string;
  height?: number;
}

// ========== 表单类型 ==========
export interface RegisterFormData {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number;
  weight: number;
}

// ========== 状态管理类型 ==========
export interface MeasurementState {
  isMeasuring: boolean;
  deviceCode: string | null;
  startTime: Date | null;
  realtimeData: RealtimeData | null;
  historyData: TimeSeriesData[];
  error: string | null;
}

export interface EmotionThemeState {
  currentEmotion: EmotionType;
  setColor: (emotion: EmotionType) => void;
}
