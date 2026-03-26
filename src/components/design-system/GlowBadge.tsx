'use client';

/**
 * GlowBadge - 发光徽章组件
 * 
 * 设计意图：用于标签展示，带有柔和的发光效果
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface GlowBadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlowBadge({
  children,
  color = '#4A90D9',
  variant = 'glow',
  size = 'md',
  className,
}: GlowBadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantStyles = {
    solid: {
      background: color,
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      color: color,
      border: `1px solid ${color}40`,
    },
    glow: {
      background: `${color}15`,
      color: color,
      border: `1px solid ${color}30`,
      boxShadow: `0 0 12px ${color}20`,
    },
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeStyles[size],
        className
      )}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}

export default GlowBadge;
