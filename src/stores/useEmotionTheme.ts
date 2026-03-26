/**
 * Zustand Store - 情绪主题状态
 * 
 * 管理当前的情绪色彩主题
 */

import { create } from 'zustand';
import { EmotionType } from '@/lib/types';
import { EMOTION_COLORS, getEmotionType } from '@/lib/emotion-theme';

interface EmotionThemeState {
  currentEmotion: EmotionType;
  emotionColor: typeof EMOTION_COLORS[EmotionType];
  setFromMetrics: (stressIndex: number, autonomicBalance: number) => void;
  setEmotion: (emotion: EmotionType) => void;
}

export const useEmotionTheme = create<EmotionThemeState>((set) => ({
  currentEmotion: 'calm',
  emotionColor: EMOTION_COLORS.calm,

  setFromMetrics: (stressIndex, autonomicBalance) => {
    const emotion = getEmotionType(stressIndex, autonomicBalance);
    set({
      currentEmotion: emotion,
      emotionColor: EMOTION_COLORS[emotion],
    });
  },

  setEmotion: (emotion) => {
    set({
      currentEmotion: emotion,
      emotionColor: EMOTION_COLORS[emotion],
    });
  },
}));

export default useEmotionTheme;
