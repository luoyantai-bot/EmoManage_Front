/**
 * 情绪主题引擎
 * 根据用户健康指标自动计算情绪色彩主题
 */

import { EmotionType, EmotionColor } from './types';

// ========== 情绪色彩定义 ==========
export const EMOTION_COLORS: Record<EmotionType, EmotionColor> = {
  relaxed: {
    primary: '#4A90D9',
    gradient: 'from-blue-400/20 to-cyan-300/10',
    glow: 'shadow-blue-400/20',
    label: '深层放松',
  },
  calm: {
    primary: '#50C878',
    gradient: 'from-emerald-400/20 to-teal-300/10',
    glow: 'shadow-emerald-400/20',
    label: '平静专注',
  },
  focused: {
    primary: '#F5A623',
    gradient: 'from-amber-400/20 to-yellow-300/10',
    glow: 'shadow-amber-400/20',
    label: '高度专注',
  },
  stressed: {
    primary: '#E74C3C',
    gradient: 'from-red-400/20 to-orange-300/10',
    glow: 'shadow-red-400/20',
    label: '情绪波动',
  },
};

// ========== 情绪文案 ==========
export const EMOTION_MESSAGES: Record<EmotionType, string[]> = {
  relaxed: [
    '你的情绪如一片平静的湖水。',
    '身心处于深度放松状态。',
    '此刻的你，宁静而祥和。',
  ],
  calm: [
    '情绪稳定，状态良好。',
    '你的内心充满平和与专注。',
    '放松与专注达到了平衡。',
  ],
  focused: [
    '思维活跃，注意力集中。',
    '大脑正在高效运转中。',
    '适合处理复杂任务的时期。',
  ],
  stressed: [
    '星空有些躁动，请试着深呼吸。',
    '情绪有些波动，建议稍作休息。',
    '此刻适合放慢脚步，调整状态。',
  ],
};

// ========== 根据指标计算情绪类型 ==========
export function getEmotionType(
  stressIndex: number,
  autonomicBalance: number
): EmotionType {
  // 低压力 + 低自主神经平衡值（副交感占优）= 深层放松
  if (stressIndex < 30 && autonomicBalance < 1.5) {
    return 'relaxed';
  }
  // 低压力 = 平静
  if (stressIndex < 50) {
    return 'calm';
  }
  // 中等压力 = 专注
  if (stressIndex < 70) {
    return 'focused';
  }
  // 高压力 = 紧张
  return 'stressed';
}

// ========== 根据心率判断颜色 ==========
export function getHeartRateColor(heartRate: number): string {
  if (heartRate < 60) return EMOTION_COLORS.relaxed.primary;
  if (heartRate <= 100) return EMOTION_COLORS.calm.primary;
  return EMOTION_COLORS.stressed.primary;
}

// ========== 根据压力指数获取颜色 ==========
export function getStressColor(stressIndex: number): string {
  if (stressIndex < 30) return EMOTION_COLORS.calm.primary;
  if (stressIndex < 50) return EMOTION_COLORS.focused.primary;
  if (stressIndex < 70) return '#F97316'; // 橙色
  return EMOTION_COLORS.stressed.primary;
}

// ========== 获取健康评分颜色 ==========
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return EMOTION_COLORS.calm.primary;
  if (score >= 60) return EMOTION_COLORS.focused.primary;
  return EMOTION_COLORS.stressed.primary;
}

// ========== 获取状态等级 ==========
export function getStatusLevel(
  value: number,
  thresholds: { good: number; warning: number } = { good: 50, warning: 70 }
): 'good' | 'warning' | 'danger' {
  if (value < thresholds.good) return 'good';
  if (value < thresholds.warning) return 'warning';
  return 'danger';
}

// ========== 获取随机情绪文案 ==========
export function getRandomEmotionMessage(emotion: EmotionType): string {
  const messages = EMOTION_MESSAGES[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
}

// ========== 将心率转换为 RR 间期（模拟） ==========
export function heartRateToRRIntervals(heartRates: number[]): number[] {
  return heartRates.map(hr => {
    const baseRR = 60000 / hr; // RR间期(ms) = 60000 / 心率(bpm)
    const jitter = (Math.random() - 0.5) * baseRR * 0.08; // ±8% 波动
    return Math.round(baseRR + jitter);
  });
}

// ========== 生成模拟心率数据 ==========
export function generateMockHeartRates(count: number, baseRate: number = 72): number[] {
  return Array.from({ length: count }, (_, i) => {
    const variation = Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 8;
    return Math.round(baseRate + variation);
  });
}

// ========== 生成模拟时序数据 ==========
export function generateMockTimeSeries(minutes: number): Array<{
  time: string;
  heartRate: number;
  breathing: number;
  sympathetic: number;
}> {
  const dataPoints = minutes * 60; // 每秒一个数据点
  const now = new Date();
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const time = new Date(now.getTime() - (dataPoints - i) * 1000);
    const baseHeartRate = 72;
    const baseBreathing = 16;
    const baseSympathetic = 40;
    
    return {
      time: time.toISOString(),
      heartRate: baseHeartRate + Math.sin(i / 60) * 5 + (Math.random() - 0.5) * 6,
      breathing: baseBreathing + Math.sin(i / 120) * 2 + (Math.random() - 0.5) * 2,
      sympathetic: baseSympathetic + Math.sin(i / 300) * 15 + (Math.random() - 0.5) * 10,
    };
  });
}

// ========== 体质中文名称映射 ==========
export const CONSTITUTION_NAMES: Record<string, string> = {
  '平和质': '平和质',
  '气虚质': '气虚质',
  '阳虚质': '阳虚质',
  '阴虚质': '阴虚质',
  '痰湿质': '痰湿质',
  '湿热质': '湿热质',
  '血瘀质': '血瘀质',
  '气郁质': '气郁质',
  '特禀质': '特禀质',
};

// ========== 体质描述 ==========
export const CONSTITUTION_DESCRIPTIONS: Record<string, string> = {
  '平和质': '阴阳气血调和，体态适中',
  '气虚质': '元气不足，易疲乏',
  '阳虚质': '阳气不足，畏寒怕冷',
  '阴虚质': '阴液亏少，口燥咽干',
  '痰湿质': '痰湿蕴结，形体肥胖',
  '湿热质': '湿热内蕴，面垢油光',
  '血瘀质': '血行不畅，肤色晦暗',
  '气郁质': '气机郁滞，情绪低落',
  '特禀质': '先天失常，过敏体质',
};

// ========== 体质图标 ==========
export const CONSTITUTION_ICONS: Record<string, string> = {
  '平和质': '🏔',
  '气虚质': '💨',
  '阳虚质': '☀',
  '阴虚质': '🌙',
  '痰湿质': '💧',
  '湿热质': '🔥',
  '血瘀质': '🩸',
  '气郁质': '☁️',
  '特禀质': '✨',
};
