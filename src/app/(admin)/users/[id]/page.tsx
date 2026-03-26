'use client';

/**
 * 用户详情页
 */

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockUsers, mockReportData } from '@/lib/admin-mock-data';
import { mockHistoryReports } from '@/lib/mock-data';
import HealthScoreRing from '@/components/charts/HealthScoreRing';
import VibeTrendArea from '@/components/charts/VibeTrendArea';
import { ArrowLeft, User, Activity, Heart, Target } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // 获取用户数据
  const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

  // 获取用户历史报告
  const userReports = mockHistoryReports.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回用户列表
      </button>

      {/* 用户基本信息卡片 */}
      <GlassCard className="p-6">
        <div className="flex items-start gap-6">
          {/* 头像 */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>

          {/* 基本信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
              <Badge variant="outline">
                {user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '其他'}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">
              {user.age}岁 · {user.height}cm · {user.weight}kg · BMI {user.bmi}
            </p>
            <div className="flex items-center gap-2 mt-3">
              {user.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <Button variant="outline">编辑信息</Button>
            <Button className="bg-blue-500 hover:bg-blue-600">开始检测</Button>
          </div>
        </div>
      </GlassCard>

      {/* 标签页 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/70 backdrop-blur border border-gray-100">
          <TabsTrigger value="overview">基本信息</TabsTrigger>
          <TabsTrigger value="reports">检测报告</TabsTrigger>
          <TabsTrigger value="interventions">干预记录</TabsTrigger>
          <TabsTrigger value="effects">效果评估</TabsTrigger>
          <TabsTrigger value="tags">用户标签</TabsTrigger>
        </TabsList>

        {/* 基本信息 Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 健康评分趋势 */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">健康评分趋势</h3>
              <VibeTrendArea
                timeSeriesData={mockReportData.time_series?.slice(0, 100) || []}
                height={250}
              />
            </GlassCard>

            {/* 关键指标 */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">最近检测指标</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Heart className="w-4 h-4" />
                    平均心率
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-1">75 bpm</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Activity className="w-4 h-4" />
                    压力指数
                  </div>
                  <p className="text-2xl font-bold text-amber-500 mt-1">42%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Target className="w-4 h-4" />
                    健康评分
                  </div>
                  <p className="text-2xl font-bold text-emerald-500 mt-1">72分</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User className="w-4 h-4" />
                    检测次数
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-1">12次</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* 检测报告 Tab */}
        <TabsContent value="reports">
          <div className="space-y-4">
            {userReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12">
                        <HealthScoreRing
                          score={report.health_score}
                          size={48}
                          animated={false}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(report.start_time).toLocaleDateString('zh-CN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          检测时长 {report.duration_minutes} 分钟
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">压力指数</p>
                      <p className="font-medium text-amber-500">
                        {report.metrics.stress_index}%
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* 干预记录 Tab */}
        <TabsContent value="interventions">
          <GlassCard className="p-6">
            <p className="text-center text-gray-400 py-8">暂无干预记录</p>
          </GlassCard>
        </TabsContent>

        {/* 效果评估 Tab */}
        <TabsContent value="effects">
          <GlassCard className="p-6">
            <p className="text-center text-gray-400 py-8">
              暂无干预效果评估数据
            </p>
          </GlassCard>
        </TabsContent>

        {/* 用户标签 Tab */}
        <TabsContent value="tags">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">系统自动计算的标签</h3>
            <div className="flex flex-wrap gap-2">
              {user.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
