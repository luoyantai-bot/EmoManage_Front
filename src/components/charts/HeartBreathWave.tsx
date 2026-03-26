'use client';

/**
 * HeartBreathWave - 实时波形组件
 * 
 * 设计意图：测量中页面展示实时心率/呼吸波形
 * 视觉效果：从右向左滚动的动态波形线
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HeartBreathWaveProps {
  data: number[];
  type: 'heartRate' | 'breathing';
  color?: string;
  height?: number;
  className?: string;
}

export function HeartBreathWave({
  data,
  type,
  color = '#4A90D9',
  height = 80,
  className,
}: HeartBreathWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // 根据类型计算基准值和范围
  const config = useMemo(() => {
    if (type === 'heartRate') {
      return { baseline: 72, range: 30, label: '心率' };
    }
    return { baseline: 16, range: 8, label: '呼吸' };
  }, [type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let offset = 0;

    const draw = () => {
      // 清除画布
      ctx.clearRect(0, 0, rect.width, rect.height);

      // 绘制背景网格
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < rect.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(rect.width, i);
        ctx.stroke();
      }

      if (data.length < 2) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // 绘制波形
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 添加发光效果
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      const step = width / (data.length - 1);

      data.forEach((value, i) => {
        const x = i * step - offset;
        // 将数值转换为Y坐标
        const normalizedValue = (value - config.baseline) / config.range;
        const y = centerY - normalizedValue * (height * 0.4);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // 重置阴影
      ctx.shadowBlur = 0;

      // 更新偏移量，实现滚动效果
      offset += 0.5;
      if (offset > step) {
        offset = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color, config, height]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height }}
      />
      {/* 类型标签 */}
      <div className="absolute top-1 left-2 text-xs text-gray-400">
        {config.label}
      </div>
    </div>
  );
}

export default HeartBreathWave;
