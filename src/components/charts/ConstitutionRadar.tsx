'use client';

/**
 * ConstitutionRadar - 体质雷达图组件
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import { useMounted } from '@/hooks/use-mounted';

interface ConstitutionRadarProps {
  constitutionScores: Record<string, number>;
  primaryConstitution: string;
  height?: number;
  className?: string;
}

const ConstitutionRadar: React.FC<ConstitutionRadarProps> = ({
  constitutionScores,
  primaryConstitution,
  height = 260,
  className,
}) => {
  const mounted = useMounted();
  const { emotionColor } = useEmotionTheme();

  // 准备雷达图数据
  const radarData = useMemo(() => {
    const names = Object.keys(constitutionScores);
    const values = Object.values(constitutionScores);
    
    return {
      indicators: names.map(name => ({ name, max: 100 })),
      values,
    };
  }, [constitutionScores]);

  const option = useMemo(() => {
    if (!mounted) return {};

    return {
      backgroundColor: 'transparent',
      radar: {
        shape: 'circle',
        center: ['50%', '50%'],
        radius: '65%',
        indicator: radarData.indicators,
        axisName: {
          color: '#6B7280',
          fontSize: 10,
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
              value: radarData.values,
              name: '体质得分',
              symbol: 'circle',
              symbolSize: 4,
              itemStyle: { color: emotionColor.primary },
              lineStyle: {
                width: 2,
                color: emotionColor.primary,
                opacity: 0.8,
              },
              areaStyle: {
                color: emotionColor.primary,
                opacity: 0.15,
              },
            },
          ],
        },
      ],
    };
  }, [mounted, radarData, emotionColor]);

  if (!mounted) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
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
      
      <div className="absolute top-2 right-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 border border-gray-100">
          主：{primaryConstitution}
        </span>
      </div>
    </div>
  );
};

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(ConstitutionRadar), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[260px]">
      <div className="animate-pulse text-gray-300">加载中...</div>
    </div>
  ),
});
