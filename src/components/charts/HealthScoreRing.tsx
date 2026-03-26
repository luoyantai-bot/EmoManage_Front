'use client';

/**
 * HealthScoreRing - 健康评分圆环组件
 * 
 * 设计意图：报告页顶部的核心视觉元素
 * 视觉效果：大圆环显示评分，带渐变色和外发光
 * 动画：从0%到目标分数的进入动画
 */

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getHealthScoreColor } from '@/lib/emotion-theme';
import { useMounted } from '@/hooks/use-mounted';

interface HealthScoreRingProps {
  score: number;
  label?: string;
  size?: number;
  animated?: boolean;
  className?: string;
}

export function HealthScoreRing({
  score,
  label = '综合评分',
  size = 200,
  animated = true,
  className,
}: HealthScoreRingProps) {
  const isClient = useMounted();
  const [displayScore, setDisplayScore] = useState(0);
  const animationRef = useRef<number | null>(null);

  // 分数动画 - 只在客户端执行
  useEffect(() => {
    if (!isClient) return;
    
    if (!animated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayScore(score);
      return;
    }

    // 清除之前的动画
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 动画：从0到目标分数
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayScore(Math.round(score * eased));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, animated, isClient]);

  // 根据分数获取颜色
  const color = useMemo(() => getHealthScoreColor(score), [score]);
  
  // 圆环参数
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  // 获取情绪类型用于渐变
  const getEmotionGradient = useCallback((scoreVal: number) => {
    if (scoreVal >= 80) return ['rgba(80, 200, 120, 0.8)', 'rgba(52, 211, 153, 1)'];
    if (scoreVal >= 60) return ['rgba(245, 166, 35, 0.8)', 'rgba(251, 191, 36, 1)'];
    return ['rgba(231, 76, 60, 0.8)', 'rgba(248, 113, 113, 1)'];
  }, []);

  const gradientColors = getEmotionGradient(score);

  if (!isClient) {
    return (
      <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
        <div className="animate-pulse text-2xl font-bold">{score}</div>
      </div>
    );
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      {/* 背景圆环 */}
      <svg width={size} height={size} className="absolute transform -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* 背景轨道 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />
        
        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          filter="url(#glow)"
        />
      </svg>

      {/* 外围光点 */}
      <motion.div
        className="absolute"
        style={{ width: size * 1.1, height: size * 1.1 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: color,
              opacity: 0.3 + (i % 2) * 0.2,
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateY(-${size * 0.55}px)`,
            }}
          />
        ))}
      </motion.div>

      {/* 中心内容 */}
      <div className="relative z-10 text-center">
        <motion.div
          className="text-5xl font-bold tabular-nums"
          style={{ color }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {displayScore}
        </motion.div>
        <motion.p
          className="text-sm text-gray-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
}

export default HealthScoreRing;
