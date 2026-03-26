'use client';

/**
 * AdminLayout - SaaS 商家后台布局
 * 
 * 设计意图：桌面端后台布局，左侧边栏 + 顶栏 + 内容区
 * 与 H5 共享设计系统（GlassCard、情绪色彩、通透感）
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEmotionTheme } from '@/stores/useEmotionTheme';
import EmotionGradient from '@/components/design-system/EmotionGradient';
import {
  LayoutDashboard,
  Smartphone,
  Users,
  FileText,
  Zap,
  ClipboardList,
  Target,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
} from 'lucide-react';

// 导航项配置
const navItems = [
  { icon: LayoutDashboard, label: '能量概览', href: '/dashboard' },
  { icon: Smartphone, label: '设备管理', href: '/devices' },
  { icon: Users, label: '用户管理', href: '/users' },
  { icon: FileText, label: '检测报告', href: '/reports' },
  { icon: Zap, label: '干预规则', href: '/rules' },
  { icon: ClipboardList, label: '干预日志', href: '/intervention-logs' },
  { icon: Target, label: '活动管理', href: '/activities' },
  { icon: Settings, label: '设置', href: '/settings' },
];

// 商家信息（开发阶段写死）
const TENANT_INFO = {
  name: '静心冥想馆',
  logo: '🧘',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { emotionColor } = useEmotionTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-60';

  return (
    <div className="min-h-screen bg-[#FAFBFD] relative">
      {/* 背景渐变（非常淡的版本） */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <EmotionGradient emotionColor={emotionColor.primary} animated />
      </div>

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40',
          'bg-white/70 backdrop-blur-xl border-r border-white/80',
          'flex flex-col transition-all duration-300',
          sidebarWidth
        )}
      >
        {/* Logo 区域 */}
        <div className="h-14 flex items-center px-4 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl shrink-0">{TENANT_INFO.logo}</span>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-semibold text-gray-800 whitespace-nowrap"
              >
                情绪场域
              </motion.span>
            )}
          </div>
        </div>

        {/* 导航项 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      'hover:bg-gray-100/80',
                      isActive && 'bg-gradient-to-r from-gray-100/80 to-transparent',
                      isCollapsed && 'justify-center'
                    )}
                    style={
                      isActive
                        ? {
                            boxShadow: `inset 3px 0 0 ${emotionColor.primary}`,
                          }
                        : {}
                    }
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0',
                        isActive ? 'text-gray-800' : 'text-gray-500'
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          'text-sm whitespace-nowrap',
                          isActive ? 'text-gray-800 font-medium' : 'text-gray-600'
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 底部区域 */}
        <div className="border-t border-gray-100 p-3">
          {/* 商家名称 */}
          {!isCollapsed && (
            <div className="px-2 mb-2 text-xs text-gray-400">
              {TENANT_INFO.name}
            </div>
          )}

          {/* 折叠按钮 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
              'text-gray-500 hover:bg-gray-100 transition-colors'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">收起菜单</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        {/* 顶栏 */}
        <header className="h-14 bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">首页</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-medium">
                {navItems.find((item) => pathname.startsWith(item.href))?.label || '概览'}
              </span>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center gap-4">
              {/* 通知 */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* 用户菜单 */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    管
                  </div>
                  <span className="text-sm text-gray-700">管理员</span>
                </button>

                {/* 下拉菜单 */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <User className="w-4 h-4" />
                          个人设置
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <main className="p-6 max-w-[1440px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
