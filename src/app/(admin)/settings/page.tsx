'use client';

/**
 * 设置页面
 */

import React, { useState } from 'react';
import GlassCard from '@/components/design-system/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Bell, Shield, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 通知设置
    emailNotification: true,
    smsNotification: false,
    pushNotification: true,
    alertThreshold: 'high',
    
    // 安全设置
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // 数据设置
    dataRetention: '365',
    autoBackup: true,
    
    // 显示设置
    theme: 'light',
    language: 'zh-CN',
  });

  const handleSave = () => {
    alert('设置已保存');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">系统设置</h1>
        <p className="text-sm text-gray-500 mt-1">配置系统参数和偏好设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 通知设置 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-800">通知设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">邮件通知</Label>
              <Switch
                id="email"
                checked={settings.emailNotification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotification: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms">短信通知</Label>
              <Switch
                id="sms"
                checked={settings.smsNotification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotification: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push">推送通知</Label>
              <Switch
                id="push"
                checked={settings.pushNotification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotification: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>告警阈值</Label>
              <Select
                value={settings.alertThreshold}
                onValueChange={(v) => setSettings({ ...settings, alertThreshold: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低敏感度</SelectItem>
                  <SelectItem value="medium">中等敏感度</SelectItem>
                  <SelectItem value="high">高敏感度</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* 安全设置 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-800">安全设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa">两步验证</Label>
              <Switch
                id="2fa"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorAuth: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>会话超时时间（分钟）</Label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: e.target.value })
                }
              />
            </div>
          </div>
        </GlassCard>

        {/* 数据设置 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-800">数据设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>数据保留时间（天）</Label>
              <Input
                type="number"
                value={settings.dataRetention}
                onChange={(e) =>
                  setSettings({ ...settings, dataRetention: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backup">自动备份</Label>
              <Switch
                id="backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoBackup: checked })
                }
              />
            </div>
          </div>
        </GlassCard>

        {/* 显示设置 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-800">显示设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>主题</Label>
              <Select
                value={settings.theme}
                onValueChange={(v) => setSettings({ ...settings, theme: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色模式</SelectItem>
                  <SelectItem value="dark">深色模式</SelectItem>
                  <SelectItem value="system">跟随系统</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>语言</Label>
              <Select
                value={settings.language}
                onValueChange={(v) => setSettings({ ...settings, language: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">简体中文</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
          <Save className="w-4 h-4 mr-2" />
          保存设置
        </Button>
      </div>
    </div>
  );
}
