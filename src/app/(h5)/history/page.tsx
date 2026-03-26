'use client';

/**
 * 历史报告页面
 * 
 * 设计意图：极简列表展示历史测量记录
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import HistoryCard from '@/components/h5/HistoryCard';
import { mockHistoryReports } from '@/lib/mock-data';
import { MeasurementRecord } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<MeasurementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setReports(mockHistoryReports);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleReportClick = (reportId: string) => {
    router.push(`/report/${reportId}`);
  };

  return (
    <div className="min-h-screen pt-safe">
      {/* 标题 */}
      <motion.div
        className="py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-gray-800">检测记录</h1>
        <p className="text-sm text-gray-500 mt-1">
          共 {reports.length} 次检测
        </p>
      </motion.div>

      {/* 报告列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-gray-400">加载中...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HistoryCard
                report={report}
                onClick={() => handleReportClick(report.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && reports.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-gray-500">暂无检测记录</p>
          <p className="text-sm text-gray-400 mt-1">
            开始你的第一次检测吧
          </p>
        </GlassCard>
      )}
    </div>
  );
}
