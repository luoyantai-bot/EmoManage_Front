'use client';

/**
 * 测量中页面
 * 
 * 设计意图：全屏沉浸式测量体验
 * 实时展示心率、呼吸、波形
 */

import React, { useEffect, useState, Suspense, useMemo, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import RealTimeMonitor from '@/components/h5/RealTimeMonitor';
import { Button } from '@/components/ui/button';
import { useMeasurementStore } from '@/stores/useMeasurementStore';
import { useEmotionTheme } from '@/stores/useEmotionTheme';

// 内部组件
function MeasuringContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceCode = searchParams.get('device') || 'TA0096400014';

  const { isMeasuring, startMockMode, stopMockMode, realtimeData } = useMeasurementStore();
  const { setFromMetrics, emotionColor } = useEmotionTheme();

  const [elapsed, setElapsed] = useState(0); // 秒

  // 计算是否可以结束 - 使用 useMemo 而非 useEffect + setState
  const canFinish = useMemo(() => elapsed >= 300, [elapsed]);

  // 启动测量
  useLayoutEffect(() => {
    if (!isMeasuring) {
      startMockMode(deviceCode);
    }

    return () => {
      stopMockMode();
    };
  }, [deviceCode]); // 只依赖 deviceCode，避免重复触发

  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 根据实时数据更新情绪主题
  useEffect(() => {
    if (realtimeData) {
      setFromMetrics(realtimeData.stress_index, realtimeData.stress_index / 25);
    }
  }, [realtimeData, setFromMetrics]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 结束测量
  const handleFinish = () => {
    if (!canFinish) return;
    
    stopMockMode();
    // 跳转到报告页（使用mock数据）
    router.push('/report/mock-001');
  };

  // 返回
  const handleBack = () => {
    stopMockMode();
    router.push('/scan');
  };

  return (
    <div className="min-h-screen flex flex-col pt-safe">
      {/* 顶栏 */}
      <div className="flex items-center justify-between py-3 px-1">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
        >
          ← 返回
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">检测中</span>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col">
        {/* 实时监控区 */}
        <div className="flex-1">
          <RealTimeMonitor />
        </div>

        {/* 计时器卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="text-center">
            <p className="text-3xl font-bold tabular-nums text-gray-800">
              {formatTime(elapsed)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {canFinish ? '检测时长已足够，可以结束' : '至少需要 5 分钟'}
            </p>
          </GlassCard>
        </motion.div>

        {/* 结束按钮 */}
        <motion.div
          className="mt-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleFinish}
            disabled={!canFinish}
            className={`w-full h-12 rounded-xl font-medium transition-all ${
              canFinish
                ? 'text-white shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={
              canFinish
                ? {
                    background: `linear-gradient(135deg, ${emotionColor.primary} 0%, ${emotionColor.primary}CC 100%)`,
                    boxShadow: `0 8px 24px ${emotionColor.primary}40`,
                  }
                : {}
            }
          >
            {canFinish ? '结束检测并生成报告' : `还需 ${formatTime(300 - elapsed)}`}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// 导出组件
export default function MeasuringPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <MeasuringContent />
    </Suspense>
  );
}
