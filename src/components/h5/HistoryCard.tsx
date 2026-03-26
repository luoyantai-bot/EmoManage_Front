'use client';

/**
 * HistoryCard - 历史报告卡片组件
 * 
 * 设计意图：展示历史报告列表项
 */

import React from 'react';
import { cn } from '@/lib/utils';
import BreathingOrb from '@/components/design-system/BreathingOrb';
import { MeasurementRecord } from '@/lib/types';
import { getEmotionType, EMOTION_COLORS } from '@/lib/emotion-theme';

interface HistoryCardProps {
  report: MeasurementRecord;
  onClick?: () => void;
  className?: string;
}

export function HistoryCard({ report, onClick, className }: HistoryCardProps) {
  // 计算情绪类型
  const emotion = getEmotionType(
    report.metrics.stress_index,
    report.metrics.autonomic_balance
  );
  const emotionConfig = EMOTION_COLORS[emotion];

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 格式化时长
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl',
        'bg-white/72 backdrop-blur-xl border border-white/80',
        'shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]',
        'cursor-pointer transition-all duration-300',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5',
        className
      )}
    >
      {/* 情绪球 */}
      <BreathingOrb size={40} color={emotionConfig.primary} speed="slow" />

      {/* 报告信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">
            {formatDate(report.start_time)}
          </span>
          <span className="text-xs text-gray-400">
            · {formatDuration(report.duration_minutes)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${emotionConfig.primary}15`,
              color: emotionConfig.primary,
            }}
          >
            {emotionConfig.label}
          </span>
        </div>
      </div>

      {/* 评分 */}
      <div className="text-right">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: emotionConfig.primary }}
        >
          {report.health_score}
        </span>
        <p className="text-xs text-gray-400 mt-0.5">评分</p>
      </div>
    </div>
  );
}

export default HistoryCard;
