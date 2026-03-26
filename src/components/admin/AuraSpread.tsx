'use client';

/**
 * AuraSpread - 场域能量流体动画
 * 
 * 设计意图：Dashboard 顶部的全场情绪能量可视化
 * 视觉效果：流动的流体光球（类似熔岩灯）
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EMOTION_COLORS, EmotionType } from '@/lib/emotion-theme';
import { useMounted } from '@/hooks/use-mounted';

interface AuraSpreadProps {
  avgHealthScore: number;
  stressDistribution: {
    relaxed: number;
    calm: number;
    focused: number;
    stressed: number;
  };
  onlineUsers: number;
  className?: string;
}

// 根据压力分布计算主导情绪
function getDominantEmotion(distribution: {
  relaxed: number;
  calm: number;
  focused: number;
  stressed: number;
}): EmotionType {
  const emotions: EmotionType[] = ['relaxed', 'calm', 'focused', 'stressed'];
  let maxKey: EmotionType = 'calm';
  let maxVal = 0;
  
  emotions.forEach((key) => {
    if (distribution[key] > maxVal) {
      maxVal = distribution[key];
      maxKey = key;
    }
  });
  
  return maxKey;
}

// 获取场域状态文案
function getFieldStateLabel(emotion: EmotionType): string {
  const labels: Record<EmotionType, string> = {
    relaxed: '深层平静',
    calm: '平和安宁',
    focused: '专注活跃',
    stressed: '情绪波动',
  };
  return labels[emotion];
}

export function AuraSpread({
  avgHealthScore,
  stressDistribution,
  onlineUsers,
  className,
}: AuraSpreadProps) {
  const mounted = useMounted();
  const emotion = useMemo(() => getDominantEmotion(stressDistribution), [stressDistribution]);
  const emotionConfig = EMOTION_COLORS[emotion];
  
  // 计算副交感占比（放松+平静）
  const parasympatheticPercent = Math.round(stressDistribution.relaxed + stressDistribution.calm);

  if (!mounted) {
    return (
      <div className={cn('h-[200px] bg-[#0f1629] rounded-[20px] overflow-hidden', className)}>
        <div className="animate-pulse h-full flex items-center justify-center text-white/30">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative h-[200px] rounded-[20px] overflow-hidden',
        'bg-gradient-to-br from-[#0f1629] via-[#0a0e27] to-[#0f1629]',
        className
      )}
    >
      {/* 流体光球 - 方案A: 多个 motion div */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主光球 */}
        <motion.div
          className="absolute"
          style={{
            width: '300px',
            height: '300px',
            left: '30%',
            top: '20%',
            background: `radial-gradient(circle, ${emotionConfig.primary}40 0%, ${emotionConfig.primary}20 40%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 50, 30, -20, 0],
            y: [0, 30, 60, 40, 0],
            scale: [1, 1.1, 1.05, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 次光球 */}
        <motion.div
          className="absolute"
          style={{
            width: '200px',
            height: '200px',
            right: '20%',
            bottom: '10%',
            background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, ${emotionConfig.primary}15 50%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: [0, -40, -20, 30, 0],
            y: [0, 40, -20, -30, 0],
            scale: [1, 0.9, 1.1, 1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 第三光球 */}
        <motion.div
          className="absolute"
          style={{
            width: '150px',
            height: '150px',
            left: '60%',
            top: '50%',
            background: `radial-gradient(circle, ${emotionConfig.primary}30 0%, transparent 60%)`,
            filter: 'blur(25px)',
          }}
          animate={{
            x: [0, 30, -40, 20, 0],
            y: [0, -30, 20, -40, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* 主文案 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white/60 text-sm mb-2">当前场域</p>
          <h2
            className="text-3xl font-semibold"
            style={{ color: emotionConfig.primary }}
          >
            {getFieldStateLabel(emotion)}
          </h2>
          <p className="text-white/50 text-sm mt-2">
            副交感占优 {parasympatheticPercent}% · {onlineUsers}人在线
          </p>
        </motion.div>

        {/* 情绪分布条 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 mt-4"
        >
          {Object.entries(stressDistribution).map(([key, value]) => {
            const emotionKey = key as EmotionType;
            const config = EMOTION_COLORS[emotionKey];
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.primary }}
                />
                <span className="text-white/50 text-xs">{Math.round(value)}%</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1629] to-transparent pointer-events-none" />
    </div>
  );
}

export default AuraSpread;
