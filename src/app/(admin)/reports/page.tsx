'use client';

/**
 * 检测报告管理页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockHistoryReports } from '@/lib/mock-data';
import HealthScoreRing from '@/components/charts/HealthScoreRing';
import { Search, Eye, RefreshCw, Download } from 'lucide-react';

export default function ReportsPage() {
  const [reports] = useState(mockHistoryReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 过滤报告
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.user?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 获取压力等级配置
  const getStressConfig = (stressIndex: number) => {
    if (stressIndex < 30) return { label: '低压', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (stressIndex < 50) return { label: '中等', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (stressIndex < 70) return { label: '偏高', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: '高压', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">检测报告</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有用户的检测报告</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">今日报告</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {reports.filter((r) => new Date(r.start_time).toDateString() === new Date().toDateString()).length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">本周报告</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{reports.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">平均评分</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">71</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">异常报告</p>
          <p className="text-2xl font-bold text-red-500 mt-1">1</p>
        </GlassCard>
      </div>

      {/* 报告列表 */}
      <GlassCard className="overflow-hidden">
        {/* 搜索和筛选 */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户姓名..."
              className="pl-9 bg-gray-50/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-gray-50/50">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="processing">处理中</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 表格 */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>用户</TableHead>
              <TableHead>检测时间</TableHead>
              <TableHead>时长</TableHead>
              <TableHead>健康评分</TableHead>
              <TableHead>压力等级</TableHead>
              <TableHead>主要体质</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report, index) => {
              const stressConfig = getStressConfig(report.metrics.stress_index);
              return (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {report.user?.name?.charAt(0)}
                      </div>
                      <span className="font-medium">{report.user?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(report.start_time).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {report.duration_minutes} 分钟
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10">
                      <HealthScoreRing
                        score={report.health_score}
                        size={40}
                        animated={false}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm px-2 py-0.5 rounded-full ${stressConfig.bg} ${stressConfig.color}`}
                    >
                      {stressConfig.label} ({report.metrics.stress_index})
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.metrics.tcm_primary_constitution}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-emerald-600">已完成</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
