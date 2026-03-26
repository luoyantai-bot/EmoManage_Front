'use client';

/**
 * 首页 - 引导页
 * 
 * 设计意图：应用入口，引导用户进入 H5 移动端
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BreathingOrb from '@/components/design-system/BreathingOrb';
import { useEmotionTheme } from '@/stores/useEmotionTheme';

export default function Home() {
  const router = useRouter();
  const { emotionColor } = useEmotionTheme();

  // 自动跳转到扫码页
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/scan');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFD] relative overflow-hidden">
      {/* 背景光效 */}
      <div
        className="absolute w-[60vw] h-[60vw] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${emotionColor.primary}20 0%, transparent 70%)`,
          filter: 'blur(80px)',
          top: '20%',
          right: '-20%',
        }}
      />

      {/* 主内容 */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo 光球 */}
        <BreathingOrb size={160} color={emotionColor.primary} speed="normal">
          <div className="flex flex-col items-center">
            <span className="text-white text-lg font-semibold">情绪健康</span>
          </div>
        </BreathingOrb>

        {/* 标题 */}
        <motion.h1
          className="mt-8 text-2xl font-semibold text-gray-800 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          智能坐垫健康监测
        </motion.h1>

        <motion.p
          className="mt-2 text-sm text-gray-500 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          实时监测 · 智能分析 · 健康干预
        </motion.p>
      </motion.div>

      {/* 加载提示 */}
      <motion.div
        className="absolute bottom-20 flex items-center gap-2 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span>正在加载...</span>
      </motion.div>
    </div>
  );
}
