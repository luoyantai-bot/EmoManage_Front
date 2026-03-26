'use client';

/**
 * MetricDisplay - 指标数值展示组件
 * 
 * 设计意图：极简的指标展示，用于报告中各种数值
 * 布局：图标 + 标签 + 数值 + 单位 + 状态
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricDisplayProps {
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
  className?: string;
}

const statusColors = {
  good: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    bar: 'bg-emerald-500',
  },
  warning: {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    bar: 'bg-amber-500',
  },
  danger: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    bar: 'bg-red-500',
  },
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function MetricDisplay({
  icon,
  label,
  value,
  unit,
  status,
  trend,
  showBar,
  barValue,
  barColor,
  className,
}: MetricDisplayProps) {
  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* 图标 + 标签 */}
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="text-base">
            {typeof icon === 'string' ? icon : icon}
          </span>
        )}
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>

      {/* 数值 + 单位 + 趋势 */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-gray-900 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
        {TrendIcon && (
          <TrendIcon
            className={cn(
              'w-4 h-4',
              trend === 'up' && 'text-red-500',
              trend === 'down' && 'text-emerald-500',
              trend === 'stable' && 'text-gray-400'
            )}
          />
        )}
      </div>

      {/* 进度条 */}
      {showBar && barValue !== undefined && (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor || (status ? statusColors[status.level].bar : 'bg-blue-500'))}
            style={{ width: `${Math.min(100, Math.max(0, barValue))}%` }}
          />
        </div>
      )}

      {/* 状态标签 */}
      {status && (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 w-fit',
            statusColors[status.level].bg,
            statusColors[status.level].text
          )}
        >
          {status.text}
        </span>
      )}
    </div>
  );
}

export default MetricDisplay;
