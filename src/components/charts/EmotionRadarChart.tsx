'use client';

/**
 * EmotionRadarChart - 会员情绪分布雷达图
 * 
 * 设计意图：展示全场会员的情绪状态分布
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import { useMounted } from '@/hooks/use-mounted';

interface EmotionRadarChartProps {
  stressDistribution: {
    relaxed: number;
    calm: number;
    focused: number;
    stressed: number;
  };
  height?: number;
  className?: string;
}

const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({
  stressDistribution,
  height = 300,
  className,
}) => {
  const mounted = useMounted();
  const { emotionColor } = useEmotionTheme();

  const option = useMemo(() => {
    if (!mounted) return {};

    return {
      backgroundColor: 'transparent',
      radar: {
        shape: 'circle',
        center: ['50%', '50%'],
        radius: '60%',
        indicator: [
          { name: '🧘 放松', max: 100 },
          { name: '🧠 专注', max: 100 },
          { name: '⚡ 活跃', max: 100 },
          { name: '😰 压力', max: 100 },
        ],
        axisName: {
          color: '#6B7280',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLine: {
          lineStyle: { color: 'rgba(0,0,0,0.06)' },
        },
        splitLine: {
          lineStyle: { color: 'rgba(0,0,0,0.04)' },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.02)'],
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [
                stressDistribution.relaxed,
                stressDistribution.focused,
                100 - stressDistribution.stressed, // 活跃度 = 反向压力
                stressDistribution.stressed,
              ],
              name: '情绪分布',
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: emotionColor.primary,
              },
              lineStyle: {
                width: 2,
                color: emotionColor.primary,
                opacity: 0.8,
              },
              areaStyle: {
                color: emotionColor.primary,
                opacity: 0.2,
              },
            },
          ],
        },
      ],
    };
  }, [mounted, stressDistribution, emotionColor]);

  if (!mounted) {
    return (
      <div
        className={cn('flex items-center justify-center bg-gray-50 rounded-xl', className)}
        style={{ height }}
      >
        <div className="animate-pulse text-gray-300">加载中...</div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(EmotionRadarChart), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-50 rounded-xl h-[300px]">
      <div className="animate-pulse text-gray-300">加载中...</div>
    </div>
  ),
});
