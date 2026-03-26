'use client';

/**
 * H5 Layout - 移动端布局
 * 
 * 设计意图：全屏沉浸式布局，无侧边栏和底部导航
 * 背景使用情绪渐变，最大宽度430px居中
 */

import React from 'react';
import EmotionGradient from '@/components/design-system/EmotionGradient';
import { useEmotionTheme } from '@/stores/useEmotionTheme';

export default function H5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { emotionColor } = useEmotionTheme();

  return (
    <div className="min-h-screen bg-[#FAFBFD] relative">
      {/* 情绪渐变背景 */}
      <EmotionGradient emotionColor={emotionColor.primary} />
      
      {/* 内容区域 */}
      <div className="relative z-10 max-w-[430px] mx-auto px-4 py-safe">
        {children}
      </div>
    </div>
  );
}
