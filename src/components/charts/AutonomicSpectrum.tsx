'use client';

/**
 * AutonomicSpectrum - 自主神经光谱条组件
 * 
 * 设计意图：替代太极图，用渐变光谱条展示自主神经平衡
 * 视觉效果：水平渐变条 + 指示器
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AutonomicSpectrumProps {
  value: number; // 0-5, 1.5为平衡点
  showLabels?: boolean;
  className?: string;
}

export function AutonomicSpectrum({
  value,
  showLabels = true,
  className,
}: AutonomicSpectrumProps) {
  // 将值映射到百分比位置（0-5 → 0-100）
  const position = (value / 5) * 100;
  
  // 判断当前状态
  const getState = () => {
    if (value < 1.5) return { label: '副交感占优', color: '#4A90D9' };
    if (value > 2.5) return { label: '交感占优', color: '#E74C3C' };
    return { label: '平衡状态', color: '#50C878' };
  };

  const state = getState();

  return (
    <div className={cn('w-full', className)}>
      {/* 上方标签 */}
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>副交感主导</span>
          <span className="font-medium" style={{ color: state.color }}>
            {state.label}
          </span>
          <span>交感主导</span>
        </div>
      )}
      
      {/* 光谱条 */}
      <div className="relative h-2 rounded-full overflow-hidden bg-gray-100">
        {/* 渐变背景 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #4A90D9, #50C878, #F5A623, #E74C3C)',
          }}
        />
        
        {/* 半透明遮罩 */}
        <div className="absolute inset-0 bg-white/30" />
      </div>
      
      {/* 指示器 */}
      <motion.div
        className="relative -mt-3 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            marginLeft: `${position}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* 三角形指示器 */}
          <div
            className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: state.color }}
          />
          
          {/* 数值标签 */}
          <div
            className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: state.color }}
          >
            {value.toFixed(1)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AutonomicSpectrum;
