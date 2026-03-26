'use client';

/**
 * BreathingOrb - 呼吸光球组件
 * 
 * 设计意图：核心视觉元素，代表用户的情绪状态
 * 视觉效果：缓慢呼吸的发光球体，颜色根据情绪变化
 * 动画：8秒完整呼吸周期（吸气4秒 + 呼气4秒）
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BreathingOrbProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function BreathingOrb({
  size = 120,
  color = '#4A90D9',
  speed = 'normal',
  intensity = 0.7,
  children,
  className,
}: BreathingOrbProps) {
  // 呼吸速度映射（完整周期时长）
  const durationMap = {
    slow: 12,
    normal: 8,
    fast: 4,
  };

  const duration = durationMap[speed];

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* 外层发光圈 - 跟随呼吸 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 主球体 */}
      <motion.div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: `
            radial-gradient(circle at 30% 30%, ${color}40 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${color}30 0%, transparent 50%),
            radial-gradient(circle, ${color} 0%, ${color}90 100%)
          `,
          boxShadow: `
            0 0 ${size * 0.3}px ${color}40,
            0 0 ${size * 0.6}px ${color}20,
            inset 0 0 ${size * 0.3}px rgba(255,255,255,0.3)
          `,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [intensity * 0.8, intensity, intensity * 0.8],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 内部高光 */}
        <div
          className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />

        {/* 内容（如数字） */}
        {children && (
          <div className="relative z-10 text-center">
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default BreathingOrb;
