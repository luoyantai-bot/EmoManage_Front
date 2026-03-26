'use client';

/**
 * EmotionGradient - 情绪渐变背景组件
 * 
 * 设计意图：用于页面背景，营造"流体玻璃"的通透感
 * 视觉效果：两个大的半透明色块缓慢移动
 * 动画：30秒一个循环的位移动画
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmotionGradientProps {
  emotionColor: string;
  animated?: boolean;
  className?: string;
}

export function EmotionGradient({
  emotionColor,
  animated = true,
  className,
}: EmotionGradientProps) {
  return (
    <div className={cn('fixed inset-0 overflow-hidden pointer-events-none z-0', className)}>
      {/* 主情绪色块 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: `radial-gradient(circle, ${emotionColor}15 0%, transparent 70%)`,
          filter: 'blur(80px)',
          top: '-10%',
          right: '-20%',
        }}
        animate={
          animated
            ? {
                x: [0, 100, 50, 0],
                y: [0, 50, 100, 0],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 30,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      />

      {/* 白色光晕 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '-20%',
          left: '-10%',
        }}
        animate={
          animated
            ? {
                x: [0, -50, -100, 0],
                y: [0, -80, -40, 0],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      />

      {/* 辅助色块 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '40vw',
          height: '40vw',
          background: `radial-gradient(circle, ${emotionColor}08 0%, transparent 70%)`,
          filter: 'blur(50px)',
          top: '40%',
          left: '30%',
        }}
        animate={
          animated
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      />
    </div>
  );
}

export default EmotionGradient;
