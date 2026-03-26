'use client';

/**
 * PulseRing - 脉冲圆环组件
 * 
 * 设计意图：用于实时心率展示，模拟心跳脉冲
 * 视觉效果：从中心向外扩散的波纹，频率与心率同步
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getHeartRateColor } from '@/lib/emotion-theme';

interface PulseRingProps {
  heartRate: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function PulseRing({
  heartRate,
  size = 160,
  showLabel = true,
  className,
}: PulseRingProps) {
  // 根据心率计算脉冲间隔（秒）
  const pulseInterval = useMemo(() => 60 / heartRate, [heartRate]);
  
  // 根据心率获取颜色
  const color = useMemo(() => getHeartRateColor(heartRate), [heartRate]);

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* 外层脉冲波纹 - 3层 */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            border: `2px solid ${color}`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: pulseInterval,
            repeat: Infinity,
            delay: index * (pulseInterval / 3),
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 中心圆 */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `2px solid ${color}40`,
          boxShadow: `0 0 20px ${color}30, inset 0 0 20px ${color}10`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: pulseInterval,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 心率数字 */}
        <div className="text-center">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {heartRate}
          </span>
          {showLabel && (
            <p className="text-xs text-gray-400 font-medium -mt-0.5">bpm</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default PulseRing;
