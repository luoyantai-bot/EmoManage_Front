/**
 * TypeScript 类型定义 - 扩展后台所需类型
 * 与后端 API 返回格式对齐
 */

// ========== 基础实体类型 ==========

// 用户
export interface User {
  id: string;
  tenant_id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number;
  weight: number;
  bmi: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// 设备
export interface Device {
  id: string;
  code: string;
  name: string;
  model: string;
  tenant_id: string;
  status: 'online' | 'offline' | 'measuring';
  current_user_id?: string;
  current_user?: User;
  firmware_version: string;
  last_online_at?: string;
  created_at: string;
  updated_at: string;
}

// 租户
export interface Tenant {
  id: string;
  name: string;
  contact_name: string;
  contact_phone: string;
  address?: string;
  settings?: Record<string, unknown>;
  created_at: string;
}

// 测量记录
export interface MeasurementRecord {
  id: string;
  user_id: string;
  user?: User;
  device_code: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  health_score: number;
  metrics: DerivedMetrics;
  time_series?: TimeSeriesData[];
  ai_analysis?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// 派生指标
export interface DerivedMetrics {
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

// 风险项
export interface RiskItem {
  level: 'low' | 'medium' | 'high';
  name: string;
  desc: string;
}

// 时序数据
export interface TimeSeriesData {
  time: string;
  heartRate: number;
  breathing: number;
  sympathetic: number;
  parasympathetic?: number;
}

// 实时数据
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

// ========== 干预规则类型 ==========

// 条件配置
export interface ConditionConfig {
  metric: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number;
}

// 动作配置
export interface ActionConfig {
  type: string;
  params: Record<string, unknown>;
}

// 干预规则
export interface InterventionRule {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  condition_logic: 'AND' | 'OR';
  conditions: ConditionConfig[];
  actions: ActionConfig[];
  is_enabled: boolean;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

// 干预日志
export interface InterventionLog {
  id: string;
  tenant_id: string;
  rule_id: string;
  rule_name: string;
  user_id: string;
  user?: User;
  triggered_at: string;
  trigger_metrics: Record<string, number>;
  actions_executed: ActionConfig[];
  status: 'pending' | 'executing' | 'success' | 'failed';
  error_message?: string;
  created_at: string;
}

// 干预效果评估
export interface InterventionEffect {
  user_id: string;
  rule_id?: string;
  before_avg: Record<string, number>;
  after_avg: Record<string, number>;
  improvement: Record<string, number>;
  timeline: Array<{
    date: string;
    metrics: Record<string, number>;
    interventions: string[];
  }>;
}

// ========== 活动类型 ==========

// 活动
export interface Activity {
  id: string;
  tenant_id: string;
  title: string;
  type: 'singing_bowl' | 'meditation' | 'yoga' | 'lecture' | 'other';
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  target_tags: string[];
  description?: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  matched_users?: number;
  pushed_users?: number;
  created_at: string;
  updated_at: string;
}

// 活动推送记录
export interface ActivityPushRecord {
  id: string;
  activity_id: string;
  user_id: string;
  user?: User;
  matched_tags: string[];
  match_reason: string;
  push_status: 'pending' | 'sent' | 'failed';
  pushed_at?: string;
  created_at: string;
}

// ========== Dashboard 类型 ==========

// Dashboard 概览
export interface DashboardOverview {
  tenant_id: string;
  today_measurements: number;
  today_measurements_trend: number;
  online_devices: number;
  total_devices: number;
  anomaly_rate: number;
  anomaly_rate_trend: number;
  avg_health_score: number;
  avg_health_score_trend: number;
  online_users: number;
  stress_distribution: {
    relaxed: number;
    calm: number;
    focused: number;
    stressed: number;
  };
  live_members: LiveMember[];
  hourly_measurements: Array<{ hour: string; count: number }>;
  daily_trends: Array<{ date: string; stress_avg: number; health_score_avg: number }>;
}

// 实时会员
export interface LiveMember {
  user_id: string;
  user: User;
  device_code: string;
  started_at: string;
  current_metrics: {
    stress_index: number;
    heart_rate: number;
    breathing_rate: number;
  };
  emotion_state: 'relaxed' | 'calm' | 'focused' | 'stressed';
  has_alert: boolean;
}

// ========== API 响应类型 ==========

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ========== 可用选项类型 ==========

export interface AvailableMetric {
  key: string;
  name: string;
  unit: string;
  min: number;
  max: number;
}

export interface AvailableAction {
  type: string;
  name: string;
  params: Array<{
    key: string;
    name: string;
    type: 'select' | 'number' | 'text';
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
    default?: unknown;
  }>;
}

// ========== 情绪类型 ==========

export type EmotionType = 'relaxed' | 'calm' | 'focused' | 'stressed';

export interface EmotionColor {
  primary: string;
  gradient: string;
  glow: string;
  label: string;
}

// ========== 表单类型 ==========

export interface RuleFormData {
  name: string;
  description?: string;
  condition_logic: 'AND' | 'OR';
  conditions: ConditionConfig[];
  actions: ActionConfig[];
  is_enabled: boolean;
}

export interface ActivityFormData {
  title: string;
  type: Activity['type'];
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  target_tags: string[];
  description?: string;
}
