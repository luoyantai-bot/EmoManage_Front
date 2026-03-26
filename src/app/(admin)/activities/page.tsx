'use client';

/**
 * 活动管理页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import GlowBadge from '@/components/design-system/GlowBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockActivities, mockPushRecords } from '@/lib/admin-mock-data';
import { Activity, ActivityPushRecord } from '@/lib/types';
import { Plus, Users, Send, Download, Calendar, MapPin, Clock } from 'lucide-react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  // 获取活动类型标签
  const getTypeLabel = (type: Activity['type']) => {
    const labels: Record<Activity['type'], string> = {
      singing_bowl: '🧘 颂钵音疗',
      meditation: '🧠 冥想课程',
      yoga: '🤸 瑜伽课程',
      lecture: '📚 健康讲座',
      other: '📅 其他活动',
    };
    return labels[type];
  };

  // 获取状态配置
  const getStatusConfig = (status: Activity['status']) => {
    const configs = {
      draft: { label: '草稿', color: '#9CA3AF' },
      published: { label: '已发布', color: '#50C878' },
      ongoing: { label: '进行中', color: '#4A90D9' },
      completed: { label: '已完成', color: '#6B7280' },
      cancelled: { label: '已取消', color: '#EF4444' },
    };
    return configs[status];
  };

  // 匹配用户
  const handleMatchUsers = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowMatchDialog(true);
  };

  // 执行推送
  const handlePush = (activityId: string) => {
    alert(`已向匹配用户推送活动通知`);
  };

  // 导出名单
  const handleExport = (activityId: string) => {
    alert(`正在导出活动参与者名单...`);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">活动管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理健康活动和智能推送</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          新建活动
        </Button>
      </div>

      {/* 活动卡片列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activities.map((activity, index) => {
          const statusConfig = getStatusConfig(activity.status);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-5 h-full">
                {/* 标题行 */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{getTypeLabel(activity.type)}</p>
                  </div>
                  <GlowBadge color={statusConfig.color} variant="glow" size="sm">
                    {statusConfig.label}
                  </GlowBadge>
                </div>

                {/* 时间地点 */}
                <div className="space-y-1 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(activity.start_time).toLocaleDateString('zh-CN', {
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      -
                      {new Date(activity.end_time).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                {/* 目标标签 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {activity.target_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 匹配统计 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>
                    <Users className="w-4 h-4 inline mr-1" />
                    匹配用户: {activity.matched_users}人
                  </span>
                  <span>已推送: {activity.pushed_users}人</span>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMatchUsers(activity)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    匹配用户
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePush(activity.id)}
                    disabled={activity.status === 'draft'}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    执行推送
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(activity.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    导出名单
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* 新建活动对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建活动</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>活动标题</Label>
              <Input placeholder="如：周五颂钵音疗" />
            </div>
            <div className="space-y-2">
              <Label>活动类型</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="singing_bowl">🧘 颂钵音疗</SelectItem>
                  <SelectItem value="meditation">🧠 冥想课程</SelectItem>
                  <SelectItem value="yoga">🤸 瑜伽课程</SelectItem>
                  <SelectItem value="lecture">📚 健康讲座</SelectItem>
                  <SelectItem value="other">📅 其他活动</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label>结束时间</Label>
                <Input type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>活动地点</Label>
              <Input placeholder="如：3楼冥想室" />
            </div>
            <div className="space-y-2">
              <Label>最大参与人数</Label>
              <Input type="number" placeholder="20" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                创建活动
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 匹配用户对话框 */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>匹配用户 - {selectedActivity?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">用户</th>
                  <th className="text-left py-2">匹配标签</th>
                  <th className="text-left py-2">匹配原因</th>
                  <th className="text-left py-2">推送状态</th>
                </tr>
              </thead>
              <tbody>
                {mockPushRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50">
                    <td className="py-3">{record.user?.name}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {record.matched_tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-gray-500">{record.match_reason}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          record.push_status === 'sent'
                            ? 'bg-emerald-50 text-emerald-600'
                            : record.push_status === 'failed'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {record.push_status === 'sent'
                          ? '已推送'
                          : record.push_status === 'failed'
                          ? '推送失败'
                          : '待推送'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
