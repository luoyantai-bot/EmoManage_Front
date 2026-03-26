'use client';

/**
 * 设备管理页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import GlowBadge from '@/components/design-system/GlowBadge';
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
import { mockDevices } from '@/lib/admin-mock-data';
import { Device } from '@/lib/types';
import { Search, RefreshCw, MoreHorizontal, Eye, Unlink } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // 过滤设备
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 同步设备
  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: 调用 API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  // 获取状态徽章配置
  const getStatusConfig = (status: Device['status']) => {
    const configs = {
      online: { label: '在线', variant: 'glow' as const, color: '#50C878' },
      offline: { label: '离线', variant: 'outline' as const, color: '#9CA3AF' },
      measuring: { label: '使用中', variant: 'glow' as const, color: '#4A90D9' },
    };
    return configs[status];
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">设备管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有智能坐垫设备</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '同步中...' : '同步设备'}
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">总设备数</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{devices.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">在线设备</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {devices.filter((d) => d.status === 'online').length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">使用中</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {devices.filter((d) => d.status === 'measuring').length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-gray-500">离线设备</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">
            {devices.filter((d) => d.status === 'offline').length}
          </p>
        </GlassCard>
      </div>

      {/* 设备列表 */}
      <GlassCard className="overflow-hidden">
        {/* 搜索和筛选 */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索设备编号或名称..."
              className="pl-9 bg-gray-50/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-gray-50/50">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="online">在线</SelectItem>
              <SelectItem value="offline">离线</SelectItem>
              <SelectItem value="measuring">使用中</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 表格 */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>设备编号</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>型号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>当前用户</TableHead>
              <TableHead>最后在线</TableHead>
              <TableHead>固件版本</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device, index) => {
              const statusConfig = getStatusConfig(device.status);
              return (
                <motion.tr
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/30"
                >
                  <TableCell className="font-mono text-sm">{device.code}</TableCell>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell className="text-gray-500">{device.model}</TableCell>
                  <TableCell>
                    <GlowBadge
                      color={statusConfig.color}
                      variant={statusConfig.variant}
                      size="sm"
                    >
                      {statusConfig.label}
                    </GlowBadge>
                  </TableCell>
                  <TableCell>
                    {device.current_user ? (
                      <span className="text-sm">{device.current_user.name}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {device.last_online_at
                      ? new Date(device.last_online_at).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">
                    {device.firmware_version}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {device.current_user && (
                        <Button variant="ghost" size="sm">
                          <Unlink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            没有找到匹配的设备
          </div>
        )}
      </GlassCard>
    </div>
  );
}
