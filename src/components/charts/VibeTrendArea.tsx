'use client';

/**
 * VibeTrendArea - 情绪能量演变面积图
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { TimeSeriesData } from '@/lib/types';
import { useMounted } from '@/hooks/use-mounted';

interface VibeTrendAreaProps {
  timeSeriesData: TimeSeriesData[];
  height?: number;
  className?: string;
}

const VibeTrendArea: React.FC<VibeTrendAreaProps> = ({
  timeSeriesData,
  height = 240,
  className,
}) => {
  const mounted = useMounted();

  // 处理数据：采样以优化性能
  const sampledData = useMemo(() => {
    if (!timeSeriesData || timeSeriesData.length === 0) return { times: [], sympathetic: [], parasympathetic: [] };
    
    const sampleRate = 60;
    const sampled = timeSeriesData.filter((_, i) => i % sampleRate === 0);
    
    return {
      times: sampled.map(d => {
        const date = new Date(d.time);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      }),
      sympathetic: sampled.map(d => d.sympathetic),
      parasympathetic: sampled.map(d => d.parasympathetic ?? (100 - d.sympathetic)),
    };
  }, [timeSeriesData]);

  const option = useMemo(() => {
    if (!mounted || !sampledData.times.length) return {};

    return {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 15, bottom: 30, left: 40 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        textStyle: { color: '#1A1D21', fontSize: 12 },
      },
      xAxis: {
        type: 'category',
        data: sampledData.times,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10, interval: 'auto' },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 25,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.04)' } },
      },
      series: [
        {
          name: '交感神经',
          type: 'line',
          stack: 'total',
          data: sampledData.sympathetic,
          symbol: 'none',
          lineStyle: { width: 1, color: '#E74C3C' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(231, 76, 60, 0.3)' },
                { offset: 1, color: 'rgba(249, 115, 22, 0.1)' },
              ],
            },
          },
        },
        {
          name: '副交感神经',
          type: 'line',
          data: sampledData.parasympathetic,
          symbol: 'none',
          lineStyle: { width: 1, color: '#4A90D9' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(74, 144, 217, 0.1)' },
                { offset: 1, color: 'rgba(52, 211, 153, 0.3)' },
              ],
            },
          },
        },
      ],
    };
  }, [mounted, sampledData]);

  if (!mounted) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-50 rounded-xl', className)} style={{ height }}>
        <div className="animate-pulse text-gray-300">加载中...</div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(VibeTrendArea), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-50 rounded-xl h-[240px]">
      <div className="animate-pulse text-gray-300">加载中...</div>
    </div>
  ),
});
