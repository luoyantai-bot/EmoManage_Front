'use client';

/**
 * GlassCard - 毛玻璃卡片组件
 * 
 * 设计意图：作为所有卡片的基础容器组件
 * 视觉效果：半透明白色背景 + 毛玻璃模糊 + 柔和阴影
 * 可选：添加情绪色渐变背景和外发光效果
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EmotionType } from '@/lib/types';
import { EMOTION_COLORS } from '@/lib/emotion-theme';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  emotionColor?: EmotionType;
  glowIntensity?: 'none' | 'subtle' | 'medium';
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  emotionColor,
  glowIntensity = 'none',
  onClick,
  animate = true,
  delay = 0,
}: GlassCardProps) {
  // 获取情绪色配置
  const emotionConfig = emotionColor ? EMOTION_COLORS[emotionColor] : null;
  
  // 发光强度映射
  const glowStyles = {
    none: '',
    subtle: emotionConfig ? `0 0 20px ${emotionConfig.primary}15` : '',
    medium: emotionConfig ? `0 0 40px ${emotionConfig.primary}25` : '',
  };

  const Component = animate ? motion.div : 'div';
  
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.5,
          delay: delay * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }
    : {};

  return (
    <Component
      className={cn(
        // 基础样式
        'relative overflow-hidden rounded-[20px] p-5',
        // 毛玻璃效果
        'bg-white/72 backdrop-blur-xl',
        'border border-white/80',
        // 阴影
        'shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]',
        // 点击效果
        onClick && 'cursor-pointer transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
        className
      )}
      style={{
        boxShadow: glowIntensity !== 'none' ? glowStyles[glowIntensity] : undefined,
      }}
      onClick={onClick}
      {...animationProps}
    >
      {/* 情绪色渐变背景层 */}
      {emotionConfig && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${emotionConfig.primary}15 0%, transparent 60%)`,
          }}
        />
      )}
      
      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}

// 导出简化版本
export default GlassCard;
