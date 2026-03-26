'use client';

/**
 * EmotionStarfield - 情绪星空图组件
 * 
 * 设计意图：美化的洛伦兹散点图，展示心率变异性
 * 视觉效果：黑色背景上的发光"星星"，聚集程度代表情绪稳定性
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { getRandomEmotionMessage } from '@/lib/emotion-theme';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import { useMounted } from '@/hooks/use-mounted';

interface EmotionStarfieldProps {
  rrIntervals: number[];
  emotionLabel?: string;
  height?: number;
  className?: string;
}

const EmotionStarfield: React.FC<EmotionStarfieldProps> = ({
  rrIntervals,
  emotionLabel,
  height = 300,
  className,
}) => {
  const mounted = useMounted();
  const { currentEmotion, emotionColor } = useEmotionTheme();

  // 准备散点数据：[RR_n, RR_n+1]
  const scatterData = useMemo(() => {
    if (!rrIntervals || rrIntervals.length < 2) return [];
    
    return rrIntervals.slice(0, -1).map((rr, i) => {
      const nextRR = rrIntervals[i + 1];
      const distance = Math.abs(rr - nextRR);
      return {
        value: [rr, nextRR],
        distance,
      };
    });
  }, [rrIntervals]);

  // 计算情绪标签
  const message = useMemo(() => {
    if (emotionLabel) return emotionLabel;
    return getRandomEmotionMessage(currentEmotion);
  }, [emotionLabel, currentEmotion]);

  const option = useMemo(() => {
    if (!mounted) return {};

    const primaryColor = emotionColor.primary;
    const secondaryColor = primaryColor === '#4A90D9' ? '#60A5FA' : 
                          primaryColor === '#50C878' ? '#34D399' :
                          primaryColor === '#F5A623' ? '#FBBF24' : '#F87171';

    return {
      backgroundColor: 'transparent',
      grid: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50,
      },
      xAxis: {
        type: 'value',
        name: 'RRₙ (ms)',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: 'rgba(255,255,255,0.4)',
          fontSize: 10,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: (value: { min: number; max: number }) => value.min - 50,
        max: (value: { min: number; max: number }) => value.max + 50,
      },
      yAxis: {
        type: 'value',
        name: 'RRₙ₊₁ (ms)',
        nameLocation: 'middle',
        nameGap: 35,
        nameTextStyle: {
          color: 'rgba(255,255,255,0.4)',
          fontSize: 10,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: (value: { min: number; max: number }) => value.min - 50,
        max: (value: { min: number; max: number }) => value.max + 50,
      },
      series: [
        // 背景星云效果
        {
          type: 'scatter',
          data: scatterData.map(d => d.value),
          symbolSize: 30,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: `${primaryColor}08` },
                { offset: 1, color: 'transparent' },
              ],
            },
          },
          silent: true,
          z: 1,
        },
        // 主散点 - 星星
        {
          type: 'scatter',
          data: scatterData.map(d => ({
            value: d.value,
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.5,
                colorStops: [
                  { offset: 0, color: '#fff' },
                  { offset: 0.3, color: '#fff' },
                  { offset: 0.5, color: d.distance < 30 ? primaryColor : secondaryColor },
                  { offset: 1, color: 'transparent' },
                ],
              },
              shadowBlur: d.distance < 30 ? 15 : 8,
              shadowColor: d.distance < 30 ? primaryColor : secondaryColor,
            },
          })),
          symbolSize: 6,
          animation: true,
          animationDuration: 1500,
          animationEasing: 'cubicOut',
          z: 2,
        },
      ],
    };
  }, [mounted, scatterData, emotionColor]);

  if (!mounted) {
    return (
      <div
        className={cn('flex items-center justify-center bg-[#0a0e27] rounded-2xl', className)}
        style={{ height }}
      >
        <div className="animate-pulse text-white/30">加载中...</div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* 深色背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] to-[#0f1729] rounded-2xl" />
      
      {/* 图表 */}
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      
      {/* 底部文案 */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-white/50">{message}</p>
      </div>
    </div>
  );
};

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(EmotionStarfield), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-[#0a0e27] rounded-2xl h-[300px]">
      <div className="animate-pulse text-white/30">加载中...</div>
    </div>
  ),
});
