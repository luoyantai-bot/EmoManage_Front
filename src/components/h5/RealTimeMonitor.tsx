'use client';

/**
 * RealTimeMonitor - 实时监控组件
 * 
 * 设计意图：测量中页面的核心组件，展示实时心率、呼吸、波形
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PulseRing from '@/components/design-system/PulseRing';
import HeartBreathWave from '@/components/charts/HeartBreathWave';
import { useMeasurementStore } from '@/stores/useMeasurementStore';
import { getHeartRateColor } from '@/lib/emotion-theme';

interface RealTimeMonitorProps {
  className?: string;
}

export function RealTimeMonitor({ className }: RealTimeMonitorProps) {
  const { realtimeData, heartRateWaveData, breathingWaveData } = useMeasurementStore();

  const heartRate = realtimeData?.heart_rate || 72;
  const breathingRate = realtimeData?.breathing_rate || 16;
  const heartRateColor = getHeartRateColor(heartRate);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* 心率显示区 */}
      <motion.div
        className="flex justify-center py-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PulseRing heartRate={heartRate} size={160} />
      </motion.div>

      {/* 心率波形 */}
      <div className="relative bg-white/30 backdrop-blur-sm rounded-2xl p-3">
        <HeartBreathWave
          data={heartRateWaveData.length > 0 ? heartRateWaveData : Array(100).fill(72)}
          type="heartRate"
          color={heartRateColor}
          height={60}
        />
      </div>

      {/* 呼吸波形 */}
      <div className="relative bg-white/30 backdrop-blur-sm rounded-2xl p-3">
        <HeartBreathWave
          data={breathingWaveData.length > 0 ? breathingWaveData : Array(100).fill(16)}
          type="breathing"
          color="#50C878"
          height={50}
        />
      </div>

      {/* 呼吸数值 */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500">呼吸</span>
        <span className="text-xl font-semibold text-gray-800 tabular-nums">
          {breathingRate.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">次/分</span>
      </div>
    </div>
  );
}

export default RealTimeMonitor;
