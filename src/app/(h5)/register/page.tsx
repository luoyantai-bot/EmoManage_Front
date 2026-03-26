'use client';

/**
 * 用户注册页面
 * 
 * 设计意图：极简表单收集用户基本信息
 * 输入框无边框设计，focus时变为情绪色
 */

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmotionTheme } from '@/stores/useEmotionTheme';

// 内部组件，使用 useSearchParams
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceCode = searchParams.get('device') || 'TA0096400014';
  const { emotionColor } = useEmotionTheme();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female' | 'other',
    age: '',
    height: '',
    weight: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'other') => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);

    // 跳转到测量页
    setTimeout(() => {
      router.push(`/measuring?device=${deviceCode}`);
    }, 500);
  };

  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      {/* 标题 */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-gray-800">完善个人信息</h1>
        <p className="text-sm text-gray-500 mt-1">用于生成个性化健康报告</p>
      </motion.div>

      {/* 表单卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="space-y-5">
          {/* 姓名 */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs text-gray-500">
              姓名 <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="请输入姓名"
              className="h-11 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus:border-b-2 focus:ring-0 focus:ring-offset-0"
              style={{ '--focus-color': emotionColor.primary } as React.CSSProperties}
            />
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">性别</Label>
            <div className="flex gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenderSelect(option.value as typeof formData.gender)}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    formData.gender === option.value
                      ? 'text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  style={
                    formData.gender === option.value
                      ? {
                          background: `linear-gradient(135deg, ${emotionColor.primary} 0%, ${emotionColor.primary}CC 100%)`,
                          boxShadow: `0 4px 12px ${emotionColor.primary}30`,
                        }
                      : {}
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 年龄 */}
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs text-gray-500">
              年龄
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="请输入年龄"
              className="h-11 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus:border-b-2 focus:ring-0 focus:ring-offset-0"
            />
          </div>

          {/* 身高体重 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="height" className="text-xs text-gray-500">
                身高
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="cm"
                className="h-11 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus:border-b-2 focus:ring-0 focus:ring-offset-0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight" className="text-xs text-gray-500">
                体重
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="kg"
                className="h-11 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus:border-b-2 focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 提交按钮 */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !formData.name.trim()}
          className="w-full h-12 rounded-xl text-white font-medium shadow-lg disabled:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${emotionColor.primary} 0%, ${emotionColor.primary}CC 100%)`,
            boxShadow: `0 8px 24px ${emotionColor.primary}40`,
          }}
        >
          {isLoading ? '正在准备...' : '开始检测'}
        </Button>
      </motion.div>
    </div>
  );
}

// 导出组件，使用 Suspense 包裹
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
