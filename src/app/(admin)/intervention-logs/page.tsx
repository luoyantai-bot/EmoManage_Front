'use client';

/**
 * 干预日志页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import GlowBadge from '@/components/design-system/GlowBadge';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { mockInterventionLogs } from '@/lib/admin-mock-data';
import { InterventionLog } from '@/lib/types';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function InterventionLogsPage() {
  const [logs] = useState<InterventionLog[]>(mockInterventionLogs);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // 过滤日志
  const filteredLogs = logs.filter((log) => {
    if (statusFilter === 'all') return true;
    return log.status === statusFilter;
  });

  // 获取状态图标
  const getStatusIcon = (status: InterventionLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  // 获取状态文字
  const getStatusText = (status: InterventionLog['status']) => {
    const texts = {
      pending: '待执行',
      executing: '执行中',
      success: '已执行',
      failed: '执行失败',
    };
    return texts[status];
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">干预日志</h1>
          <p className="text-sm text-gray-500 mt-1">查看所有干预触发记录</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">今日触发</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{logs.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">执行成功</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {logs.filter((l) => l.status === 'success').length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">执行失败</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {logs.filter((l) => l.status === 'failed').length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">待处理</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {logs.filter((l) => l.status === 'pending').length}
          </p>
        </GlassCard>
      </div>

      {/* 日志列表 */}
      <GlassCard className="overflow-hidden">
        {/* 筛选器 */}
        <div className="p-4 border-b border-gray-100">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-gray-50/50">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="success">已执行</SelectItem>
              <SelectItem value="failed">执行失败</SelectItem>
              <SelectItem value="pending">待执行</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 表格 */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead />
              <TableHead>时间</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>触发规则</TableHead>
              <TableHead>触发指标</TableHead>
              <TableHead>执行动作</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <Collapsible
                key={log.id}
                open={expandedLog === log.id}
                onOpenChange={(open) => setExpandedLog(open ? log.id : null)}
                asChild
              >
                <>
                  <CollapsibleTrigger asChild>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-50 hover:bg-gray-50/30 cursor-pointer"
                    >
                      <TableCell className="w-8">
                        {expandedLog === log.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(log.triggered_at).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.user?.name}</span>
                      </TableCell>
                      <TableCell>
                        <GlowBadge color="#4A90D9" variant="outline" size="sm">
                          {log.rule_name}
                        </GlowBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(log.trigger_metrics).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="text-xs text-gray-500">
                              {key.split('_')[0]}: {value}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.actions_executed.map((action, idx) => (
                            <GlowBadge key={idx} color="#50C878" variant="outline" size="sm">
                              {action.type}
                            </GlowBadge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="text-sm">{getStatusText(log.status)}</span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50/50 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* 触发指标快照 */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">触发指标快照</h4>
                            <div className="space-y-1">
                              {Object.entries(log.trigger_metrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-gray-500">{key}</span>
                                  <span className="font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* 执行动作详情 */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">执行动作详情</h4>
                            <div className="space-y-2">
                              {log.actions_executed.map((action, idx) => (
                                <div key={idx} className="p-2 bg-white rounded-lg">
                                  <p className="text-sm font-medium">{action.type}</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {Object.entries(action.params).map(([k, v]) => (
                                      <span key={k} className="text-xs text-gray-500">
                                        {k}: {String(v)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-400">暂无干预日志</div>
        )}
      </GlassCard>
    </div>
  );
}
