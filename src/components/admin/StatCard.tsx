'use client';

/**
 * StatCard - 统计卡片组件
 * 
 * 设计意图：Dashboard 的统计数字展示
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  trend?: number; // 正数表示上升，负数表示下降
  suffix?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  suffix = '',
  className,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    // 对于某些指标，下降是好事（如异常率）
    if (label.includes('异常') || label.includes('压力')) {
      return trend < 0 ? 'text-emerald-500' : 'text-red-500';
    }
    // 对于其他指标，上升是好事
    return trend > 0 ? 'text-emerald-500' : 'text-red-500';
  };

  return (
    <motion.div
      className={cn(
        'bg-white/70 backdrop-blur-xl rounded-2xl p-5',
        'border border-white/80',
        'shadow-[0_4px_24px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
        'hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 图标 */}
      <div className="text-2xl mb-3">{icon}</div>

      {/* 数值 */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-800 tabular-nums">
          {value}
        </span>
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </div>

      {/* 标签 */}
      <p className="text-sm text-gray-500 mt-1">{label}</p>

      {/* 趋势 */}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs', getTrendColor())}>
          {getTrendIcon()}
          <span>
            {trend > 0 ? '+' : ''}
            {trend}% vs 昨日
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
