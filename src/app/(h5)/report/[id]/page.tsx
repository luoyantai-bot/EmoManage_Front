'use client';

/**
 * 报告详情页面
 * 
 * 设计意图：整个产品最核心的展示页面
 * 长滚动页面，由多个 GlassCard 模块组成
 * 背景颜色由报告整体情绪决定
 */

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import HealthScoreRing from '@/components/charts/HealthScoreRing';
import EmotionStarfield from '@/components/charts/EmotionStarfield';
import VibeTrendArea from '@/components/charts/VibeTrendArea';
import StressGauge from '@/components/charts/StressGauge';
import ConstitutionRadar from '@/components/charts/ConstitutionRadar';
import AutonomicSpectrum from '@/components/charts/AutonomicSpectrum';
import MetricDisplay from '@/components/design-system/MetricDisplay';
import ReportSection from '@/components/h5/ReportSection';
import AIAnalysisPanel from '@/components/h5/AIAnalysisPanel';
import { Button } from '@/components/ui/button';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import { mockReportData, mockRRIntervals } from '@/lib/mock-data';
import { getEmotionType, EMOTION_COLORS, heartRateToRRIntervals } from '@/lib/emotion-theme';
import { MeasurementRecord } from '@/lib/types';

// 内部组件
function ReportContent() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const { setFromMetrics, emotionColor, currentEmotion } = useEmotionTheme();
  const [report, setReport] = useState<MeasurementRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载报告数据
  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setReport(mockReportData);
      
      // 设置情绪主题
      setFromMetrics(
        mockReportData.metrics.stress_index,
        mockReportData.metrics.autonomic_balance
      );
      
      setIsLoading(false);
    }, 500);
  }, [reportId, setFromMetrics]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 格式化时长
  const formatDuration = (minutes: number) => {
    return `${minutes} 分钟`;
  };

  // 获取情绪文案
  const getEmotionMessage = () => {
    const emotion = getEmotionType(
      report?.metrics.stress_index || 0,
      report?.metrics.autonomic_balance || 0
    );
    return EMOTION_COLORS[emotion].label;
  };

  // 生成 RR 间期数据
  const rrIntervals = heartRateToRRIntervals(
    Array.from({ length: 500 }, () => 70 + Math.random() * 10)
  );

  if (isLoading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">正在加载报告...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe">
      {/* 模块1：健康评分 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="text-center mb-3">
          <div className="flex justify-center py-4">
            <HealthScoreRing
              score={report.health_score}
              label="综合评分"
              size={180}
            />
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            {formatDate(report.start_time)}
          </p>
          <p className="text-xs text-gray-400">
            检测时长 {formatDuration(report.duration_minutes)}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">你今天的能量场偏向</p>
            <p
              className="text-lg font-semibold mt-1"
              style={{ color: emotionColor.primary }}
            >
              「{getEmotionMessage()}」
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* 模块2：情绪星空 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GlassCard className="mb-3">
          <ReportSection
            title="情绪星空"
            subtitle="基于心率变异性分析"
            collapsible
            defaultExpanded
          >
            <EmotionStarfield
              rrIntervals={rrIntervals}
              height={280}
            />
          </ReportSection>
        </GlassCard>
      </motion.div>

      {/* 模块3：能量演变 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard className="mb-3">
          <ReportSection
            title="能量演变"
            subtitle="交感-副交感平衡"
          >
            <VibeTrendArea
              timeSeriesData={report.time_series || []}
              height={220}
            />
            
            <div className="mt-4">
              <AutonomicSpectrum
                value={report.metrics.autonomic_balance}
                showLabels
              />
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              {report.metrics.autonomic_balance < 1.5
                ? `副交感占优 ${Math.round((2 - report.metrics.autonomic_balance) / 2 * 100)}% — 身体处于恢复放松状态`
                : report.metrics.autonomic_balance > 2.5
                ? `交感占优 ${Math.round((report.metrics.autonomic_balance - 1.5) / 3.5 * 100)}% — 身体处于活跃紧张状态`
                : '自主神经平衡 — 身体状态良好'}
            </p>
          </ReportSection>
        </GlassCard>
      </motion.div>

      {/* 模块4：压力与情绪 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard className="mb-3">
          <ReportSection title="压力与情绪">
            <StressGauge
              value={report.metrics.stress_index}
              height={160}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <MetricDisplay
                icon="😰"
                label="焦虑指数"
                value={report.metrics.anxiety_index}
                unit="%"
                status={{
                  level: report.metrics.anxiety_index < 40 ? 'good' : report.metrics.anxiety_index < 60 ? 'warning' : 'danger',
                  text: report.metrics.anxiety_level === 'low' ? '低' : report.metrics.anxiety_level === 'moderate' ? '中等' : '高',
                }}
                showBar
                barValue={report.metrics.anxiety_index}
              />
              <MetricDisplay
                icon="😴"
                label="疲劳指数"
                value={report.metrics.fatigue_index}
                unit="%"
                status={{
                  level: report.metrics.fatigue_index < 40 ? 'good' : report.metrics.fatigue_index < 60 ? 'warning' : 'danger',
                  text: report.metrics.fatigue_level === 'low' ? '低' : report.metrics.fatigue_level === 'moderate' ? '中等' : '高',
                }}
                showBar
                barValue={report.metrics.fatigue_index}
              />
            </div>
          </ReportSection>
        </GlassCard>
      </motion.div>

      {/* 模块5：中医体质 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard className="mb-3">
          <ReportSection title="体质能量图谱">
            {/* 主要体质 */}
            <div className="bg-gradient-to-r from-white/50 to-transparent rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏔</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {report.metrics.tcm_primary_constitution}
                  </p>
                  <p className="text-xs text-gray-500">
                    阴阳气血调和，体态适中
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: emotionColor.primary }}>
                    {report.metrics.tcm_primary_score}
                  </p>
                  <p className="text-xs text-gray-400">分</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${report.metrics.tcm_primary_score}%`,
                    background: `linear-gradient(90deg, ${emotionColor.primary}80 0%, ${emotionColor.primary} 100%)`,
                  }}
                />
              </div>
            </div>

            {/* 次要体质 */}
            {report.metrics.tcm_secondary_constitution && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span>次要体质：</span>
                <span className="font-medium text-gray-700">
                  {report.metrics.tcm_secondary_constitution}
                </span>
                <span>{report.metrics.tcm_secondary_score}分</span>
              </div>
            )}

            {/* 雷达图 */}
            <ConstitutionRadar
              constitutionScores={report.metrics.tcm_constitution_detail}
              primaryConstitution={report.metrics.tcm_primary_constitution}
              height={260}
            />
          </ReportSection>
        </GlassCard>
      </motion.div>

      {/* 模块6：AI 分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <GlassCard className="mb-3">
          <AIAnalysisPanel content={report.ai_analysis || ''} />
        </GlassCard>
      </motion.div>

      {/* 底部操作栏 */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-[430px] mx-auto px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              onClick={() => {
                // 分享功能
              }}
            >
              📤 分享报告
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              onClick={() => router.push('/history')}
            >
              📋 历史报告
            </Button>
            <Button
              className="flex-1 h-11 rounded-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${emotionColor.primary} 0%, ${emotionColor.primary}CC 100%)`,
              }}
              onClick={() => router.push('/scan')}
            >
              🔄 再次检测
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 导出组件
export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ReportContent />
    </Suspense>
  );
}
