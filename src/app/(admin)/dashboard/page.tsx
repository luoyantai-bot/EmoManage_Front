'use client';

/**
 * Dashboard 能量概览页
 * 
 * 设计意图：SaaS 后台核心页面，展示全场情绪能量状态
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import { AuraSpread } from '@/components/admin/AuraSpread';
import { StatCard } from '@/components/admin/StatCard';
import LiveMemberFeed from '@/components/admin/LiveMemberFeed';
import { HourlyMeasurementChart, DailyTrendAreaChart } from '@/components/charts/TrendChart';
import { mockDashboardOverview } from '@/lib/admin-mock-data';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import {
  Activity,
  Smartphone,
  AlertTriangle,
  Heart,
} from 'lucide-react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(mockDashboardOverview);
  const { setFromMetrics } = useEmotionTheme();

  // 根据数据设置情绪主题
  useEffect(() => {
    const avgStress = Object.entries(dashboardData.stress_distribution).reduce(
      (acc, [key, val]) => {
        if (key === 'stressed') return acc + val * 0.8;
        if (key === 'focused') return acc + val * 0.5;
        return acc;
      },
      0
    );
    setFromMetrics(avgStress, 2);
  }, [dashboardData, setFromMetrics]);

  // 刷新数据
  const handleRefresh = () => {
    // TODO: 调用真实 API
    console.log('Refreshing dashboard data...');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">能量概览</h1>
          <p className="text-sm text-gray-500 mt-1">实时监控全场情绪能量状态</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm bg-white/70 backdrop-blur border border-white/80 rounded-lg hover:bg-white transition-colors"
        >
          🔄 刷新
        </button>
      </div>

      {/* 模块1：场域能量流体 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AuraSpread
          avgHealthScore={dashboardData.avg_health_score}
          stressDistribution={dashboardData.stress_distribution}
          onlineUsers={dashboardData.online_users}
        />
      </motion.div>

      {/* 模块2：四个统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<Activity className="w-6 h-6 text-blue-500" />}
            value={dashboardData.today_measurements}
            label="今日测量"
            trend={dashboardData.today_measurements_trend}
            suffix="次"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            icon={<Smartphone className="w-6 h-6 text-emerald-500" />}
            value={`${dashboardData.online_devices}/${dashboardData.total_devices}`}
            label="在线设备"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
            value={`${dashboardData.anomaly_rate}%`}
            label="异常占比"
            trend={dashboardData.anomaly_rate_trend}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            icon={<Heart className="w-6 h-6 text-rose-500" />}
            value={dashboardData.avg_health_score}
            label="平均评分"
            trend={dashboardData.avg_health_score_trend}
          />
        </motion.div>
      </div>

      {/* 模块3+4：会员情绪分布 + 实时会员列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：情绪分布雷达图 */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="h-full">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              会员情绪分布
            </h3>
            <div className="h-[300px] flex items-center justify-center">
              {/* 简化版的情绪分布展示 */}
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                {Object.entries(dashboardData.stress_distribution).map(([key, value]) => {
                  const emotionLabels: Record<string, { label: string; color: string; icon: string }> = {
                    relaxed: { label: '深层放松', color: '#4A90D9', icon: '🧘' },
                    calm: { label: '平静专注', color: '#50C878', icon: '😌' },
                    focused: { label: '高度专注', color: '#F5A623', icon: '🎯' },
                    stressed: { label: '情绪波动', color: '#E74C3C', icon: '😰' },
                  };
                  const config = emotionLabels[key];
                  return (
                    <div key={key} className="text-center">
                      <div className="text-3xl mb-2">{config.icon}</div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: config.color }}
                      >
                        {Math.round(value)}%
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{config.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 右侧：实时会员列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                实时会员
              </h3>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full">
                {dashboardData.live_members.length} 人在线
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <LiveMemberFeed
                members={dashboardData.live_members}
                onMemberClick={(member) => {
                  console.log('Member clicked:', member);
                  // TODO: 跳转到用户详情页
                }}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 模块5：趋势图区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每小时测量人次 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              每小时测量人次
            </h3>
            <HourlyMeasurementChart data={dashboardData.hourly_measurements} height={200} />
          </GlassCard>
        </motion.div>

        {/* 最近7天压力趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              最近7天趋势
            </h3>
            <DailyTrendAreaChart data={dashboardData.daily_trends} height={200} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
