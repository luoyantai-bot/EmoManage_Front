'use client';

/**
 * LiveMemberFeed - 实时会员列表组件
 * 
 * 设计意图：展示当前在线的会员及其情绪状态
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LiveMember } from '@/lib/types';
import { EMOTION_COLORS, EmotionType } from '@/lib/emotion-theme';

interface LiveMemberFeedProps {
  members: LiveMember[];
  onMemberClick?: (member: LiveMember) => void;
  className?: string;
}

export function LiveMemberFeed({
  members,
  onMemberClick,
  className,
}: LiveMemberFeedProps) {
  // 按告警状态排序（告警用户优先）
  const sortedMembers = [...members].sort((a, b) => {
    if (a.has_alert && !b.has_alert) return -1;
    if (!a.has_alert && b.has_alert) return 1;
    return 0;
  });

  return (
    <div className={cn('space-y-2', className)}>
      {sortedMembers.map((member, index) => (
        <motion.div
          key={member.user_id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onMemberClick?.(member)}
          className={cn(
            'p-3 rounded-xl cursor-pointer transition-all duration-200',
            'bg-white/70 backdrop-blur border border-white/80',
            'hover:bg-white/90 hover:shadow-lg',
            member.has_alert && 'bg-red-50/50 border-red-100'
          )}
        >
          <div className="flex items-center gap-3">
            {/* 头像 + 情绪光圈 */}
            <div className="relative">
              {/* 情绪光圈 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${EMOTION_COLORS[member.emotion_state].primary}40 0%, transparent 70%)`,
                }}
                animate={{
                  scale: member.has_alert ? [1, 1.3, 1] : [1, 1.1, 1],
                  opacity: member.has_alert ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: member.has_alert ? 1 : 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* 头像 */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                  'bg-gradient-to-br from-blue-400 to-blue-600'
                )}
              >
                {member.user?.name?.charAt(0) || '?'}
              </div>
            </div>

            {/* 信息区 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 truncate">
                  {member.user?.name || '未知用户'}
                </span>
                {member.has_alert && (
                  <span className="text-red-500 text-sm">⚠️</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: EMOTION_COLORS[member.emotion_state].primary,
                    }}
                  />
                  压力 {member.current_metrics.stress_index}
                </span>
                <span>❤️ {member.current_metrics.heart_rate}</span>
                <span>🫁 {member.current_metrics.breathing_rate}</span>
              </div>
            </div>

            {/* 右侧标签 */}
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-400">
                {member.user?.tags?.[0] || '-'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {new Date(member.started_at).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 开始
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {members.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          暂无在线会员
        </div>
      )}
    </div>
  );
}

export default LiveMemberFeed;
