'use client';

/**
 * TrendChart - 趋势图组件
 * 
 * 设计意图：Dashboard 底部的趋势图表
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

interface HourlyData {
  hour: string;
  count: number;
}

interface DailyTrend {
  date: string;
  stress_avg: number;
  health_score_avg: number;
}

interface HourlyChartProps {
  data: HourlyData[];
  height?: number;
  className?: string;
}

interface DailyTrendChartProps {
  data: DailyTrend[];
  height?: number;
  className?: string;
}

// 每小时测量人次柱状图
const HourlyChart: React.FC<HourlyChartProps> = ({ data, height = 200, className }) => {
  const mounted = useMounted();

  const option = useMemo(() => {
    if (!mounted) return {};

    return {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        textStyle: { color: '#1A1D21', fontSize: 12 },
        formatter: '{b}<br/>测量: {c} 次',
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.hour),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.04)' } },
      },
      series: [
        {
          type: 'bar',
          data: data.map(d => d.count),
          barWidth: '50%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#4A90D9' },
                { offset: 1, color: '#4A90D980' },
              ],
            },
          },
        },
      ],
    };
  }, [mounted, data]);

  if (!mounted) {
    return <div className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />;
  }

  return (
    <div className={className}>
      <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};

// 每日压力趋势面积图
const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ data, height = 200, className }) => {
  const mounted = useMounted();

  const option = useMemo(() => {
    if (!mounted) return {};

    return {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        textStyle: { color: '#1A1D21', fontSize: 12 },
      },
      legend: {
        data: ['压力指数', '健康评分'],
        bottom: 0,
        textStyle: { color: '#6B7280', fontSize: 11 },
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date.slice(5)), // 只显示 MM-DD
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10 },
      },
      yAxis: [
        {
          type: 'value',
          name: '压力',
          min: 0,
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#9CA3AF', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(0,0,0,0.04)' } },
        },
        {
          type: 'value',
          name: '评分',
          min: 0,
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#9CA3AF', fontSize: 10 },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '压力指数',
          type: 'line',
          data: data.map(d => d.stress_avg),
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#E74C3C' },
          itemStyle: { color: '#E74C3C' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(231, 76, 60, 0.3)' },
                { offset: 1, color: 'rgba(231, 76, 60, 0.05)' },
              ],
            },
          },
        },
        {
          name: '健康评分',
          type: 'line',
          yAxisIndex: 1,
          data: data.map(d => d.health_score_avg),
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#50C878' },
          itemStyle: { color: '#50C878' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(80, 200, 120, 0.3)' },
                { offset: 1, color: 'rgba(80, 200, 120, 0.05)' },
              ],
            },
          },
        },
      ],
    };
  }, [mounted, data]);

  if (!mounted) {
    return <div className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />;
  }

  return (
    <div className={className}>
      <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};

import dynamic from 'next/dynamic';

export const HourlyMeasurementChart = dynamic(() => Promise.resolve(HourlyChart), {
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />,
});

export const DailyTrendAreaChart = dynamic(() => Promise.resolve(DailyTrendChart), {
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />,
});

export { HourlyChart, DailyTrendChart };
