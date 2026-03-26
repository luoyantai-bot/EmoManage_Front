'use client';

/**
 * 扫码绑定页面
 * 
 * 设计意图：用户首次进入时的设备绑定页面
 * 极简设计，呼吸光球吸引注意力
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BreathingOrb from '@/components/design-system/BreathingOrb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmotionTheme } from '@/stores/useEmotionTheme';

export default function ScanPage() {
  const router = useRouter();
  const { emotionColor } = useEmotionTheme();
  const [deviceCode, setDeviceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    if (!deviceCode.trim()) {
      // 使用默认设备码
      setDeviceCode('TA0096400014');
      return;
    }
    
    setIsLoading(true);
    
    // 跳转到注册页
    setTimeout(() => {
      router.push(`/register?device=${deviceCode}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      {/* 呼吸光球 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <BreathingOrb size={200} color={emotionColor.primary} speed="normal">
          <div className="text-center">
            <p className="text-white text-sm font-medium px-4">
              请扫描坐垫二维码
            </p>
          </div>
        </BreathingOrb>
      </motion.div>

      {/* 说明文字 */}
      <motion.p
        className="text-sm text-gray-500 mt-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        或手动输入设备编号
      </motion.p>

      {/* 设备编号输入 */}
      <motion.div
        className="w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Input
          value={deviceCode}
          onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
          placeholder="例如: TA0096400014"
          className="h-12 bg-white/80 backdrop-blur border-gray-200 rounded-xl text-center font-mono"
        />
      </motion.div>

      {/* 开始按钮 */}
      <motion.div
        className="mt-6 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full h-12 rounded-xl text-white font-medium shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${emotionColor.primary} 0%, ${emotionColor.primary}CC 100%)`,
            boxShadow: `0 8px 24px ${emotionColor.primary}40`,
          }}
        >
          {isLoading ? '正在连接...' : '开始体验'}
        </Button>
      </motion.div>

      {/* 底部提示 */}
      <motion.p
        className="text-xs text-gray-400 mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        确保智能坐垫已开机并靠近设备
      </motion.p>
    </div>
  );
}
