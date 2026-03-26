'use client';

/**
 * 自定义 Hook - 客户端挂载状态
 * 
 * 用于处理 SSR 时需要延迟渲染的场景
 * 这是 React 官方推荐的 SSR 兼容模式
 */

import { useState, useEffect, useRef } from 'react';

/**
 * 返回组件是否已在客户端挂载
 * 用于避免 SSR 不匹配问题
 * 
 * eslint-disable 规则说明：
 * 这个模式是 React 官方推荐的 SSR 兼容方案
 * 在 effect 中同步设置 mounted 状态是必要的
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * 使用 ref 追踪挂载状态（不会触发重渲染）
 */
export function useMountedRef() {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}
