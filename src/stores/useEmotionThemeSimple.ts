/**
 * Zustand Store - 情绪主题 Hook
 * 
 * 提供简化版的情绪主题访问
 */

import { useEmotionTheme } from './useEmotionTheme';
import { EMOTION_COLORS } from '@/lib/emotion-theme';

export function useEmotionThemeSimple() {
  const { emotionColor, currentEmotion } = useEmotionTheme();
  return {
    primaryColor: emotionColor.primary,
    emotion: currentEmotion,
    config: EMOTION_COLORS[currentEmotion],
  };
}
