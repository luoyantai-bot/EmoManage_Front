/**
 * 状态管理 - 情绪主题
 * 管理当前的情绪色彩主题
 */

import { create } from 'zustand';
import { EmotionType } from '@/lib/types';
import { EMOTION_COLORS, getEmotionType } from '@/lib/emotion-theme';

interface EmotionThemeState {
  // 当前情绪
  currentEmotion: EmotionType;
  
  // 当前情绪色彩配置
  emotionColor: typeof EMOTION_COLORS[EmotionType];
  
  // 根据指标自动设置情绪
  setFromMetrics: (stressIndex: number, autonomicBalance: number) => void;
  
  // 手动设置情绪
  setEmotion: (emotion: EmotionType) => void;
}

export const useEmotionTheme = create<EmotionThemeState>((set) => ({
  // 默认平静状态
  currentEmotion: 'calm',
  emotionColor: EMOTION_COLORS.calm,

  // 根据指标自动设置
  setFromMetrics: (stressIndex, autonomicBalance) => {
    const emotion = getEmotionType(stressIndex, autonomicBalance);
    set({
      currentEmotion: emotion,
      emotionColor: EMOTION_COLORS[emotion],
    });
  },

  // 手动设置
  setEmotion: (emotion) => {
    set({
      currentEmotion: emotion,
      emotionColor: EMOTION_COLORS[emotion],
    });
  },
}));
