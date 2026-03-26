'use client';

/**
 * 用户管理页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { mockUsers } from '@/lib/admin-mock-data';
import { User } from '@/lib/types';
import { getStressColor } from '@/lib/emotion-theme';
import { Search, Eye, ChevronRight } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [constitutionFilter, setConstitutionFilter] = useState<string>('all');

  // 过滤用户
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConstitution =
      constitutionFilter === 'all' ||
      user.tags?.some((tag) => tag.includes(constitutionFilter));
    return matchesSearch && matchesConstitution;
  });

  // 获取用户主要体质
  const getMainConstitution = (user: User) => {
    const constitutionTags = user.tags?.filter((tag) => tag.includes('质')) || [];
    return constitutionTags[0] || '-';
  };

  // 获取压力等级
  const getStressLevel = (user: User) => {
    const stressTag = user.tags?.find((tag) => tag.includes('压力'));
    if (stressTag) {
      if (stressTag.includes('高')) return { level: 'high', label: '高压力' };
      if (stressTag.includes('低')) return { level: 'low', label: '低压力' };
    }
    return { level: 'normal', label: '正常' };
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有注册用户</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          + 新增用户
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">总用户数</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">今日活跃</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">3</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">高压力用户</p>
          <p className="text-2xl font-bold text-red-500 mt-1">2</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">平均评分</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">72</p>
        </GlassCard>
      </div>

      {/* 用户列表 */}
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
          <Select value={constitutionFilter} onValueChange={setConstitutionFilter}>
            <SelectTrigger className="w-32 bg-gray-50/50">
              <SelectValue placeholder="体质筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部体质</SelectItem>
              <SelectItem value="平和质">平和质</SelectItem>
              <SelectItem value="阴虚质">阴虚质</SelectItem>
              <SelectItem value="气虚质">气虚质</SelectItem>
              <SelectItem value="痰湿质">痰湿质</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 表格 */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>姓名</TableHead>
              <TableHead>性别</TableHead>
              <TableHead>年龄</TableHead>
              <TableHead>BMI</TableHead>
              <TableHead>主要体质</TableHead>
              <TableHead>压力等级</TableHead>
              <TableHead>最近检测</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const stress = getStressLevel(user);
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/30 cursor-pointer"
                  onClick={() => router.push(`/users/${user.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '其他'}</TableCell>
                  <TableCell>{user.age}岁</TableCell>
                  <TableCell>{user.bmi}</TableCell>
                  <TableCell>
                    <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-full">
                      {getMainConstitution(user)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-sm px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          stress.level === 'high'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : stress.level === 'low'
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(156, 163, 175, 0.1)',
                        color:
                          stress.level === 'high'
                            ? '#EF4444'
                            : stress.level === 'low'
                            ? '#22C55E'
                            : '#6B7280',
                      }}
                    >
                      {stress.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">今天 14:30</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/users/${user.id}`);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
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
