'use client';

/**
 * StressGauge - 压力半圆仪表盘组件
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

interface StressGaugeProps {
  value: number;
  label?: string;
  height?: number;
  className?: string;
}

const StressGauge: React.FC<StressGaugeProps> = ({
  value,
  height = 180,
  className,
}) => {
  const mounted = useMounted();

  // 获取压力等级描述
  const getStressLabel = (val: number) => {
    if (val < 30) return '低压放松';
    if (val < 50) return '中等压力';
    if (val < 70) return '偏高压力';
    return '高压紧张';
  };

  const option = useMemo(() => {
    if (!mounted) return {};

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 4,
          radius: '100%',
          center: ['50%', '70%'],
          axisLine: {
            lineStyle: {
              width: 16,
              color: [
                [0.3, '#50C878'],
                [0.5, '#F5A623'],
                [0.7, '#F97316'],
                [1, '#E74C3C'],
              ],
            },
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7l12-40.1M12.8,0.7c0.5,0,1,0.4,1,1v20c0,0.5-0.4,1-1,1s-1-0.4-1-1v-20C11.8,1.1,12.3,0.7,12.8,0.7z',
            length: '60%',
            width: 6,
            offsetCenter: [0, '-10%'],
            itemStyle: { color: 'rgba(0,0,0,0.7)' },
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 12,
            itemStyle: {
              borderWidth: 4,
              borderColor: 'rgba(0,0,0,0.2)',
              color: 'rgba(255,255,255,0.9)',
            },
          },
          progress: { show: true, width: 16 },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 30,
            borderRadius: 8,
            offsetCenter: [0, '15%'],
            fontSize: 20,
            fontWeight: 'bold',
            formatter: '{value}%',
            color: 'inherit',
          },
          data: [{ value, name: '' }],
        },
      ],
    };
  }, [mounted, value]);

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
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-400">
        <span>放松</span>
        <span className="font-medium text-gray-600">{getStressLabel(value)}</span>
        <span>紧张</span>
      </div>
    </div>
  );
};

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(StressGauge), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[180px]">
      <div className="animate-pulse text-gray-300">加载中...</div>
    </div>
  ),
});
