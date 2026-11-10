import { useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { FeedbackContext } from '../theme';

export function useSpokenGuidance(message: string) {
  const { voice, setRepeatGuidance } = useContext(FeedbackContext);

  const announce = useCallback(() => {
    if (!voice) return;
    Speech.stop();
    Speech.speak(message, { rate: 0.92 });
  }, [message, voice]);

  useFocusEffect(useCallback(() => {
    setRepeatGuidance(announce);
    announce();
    return () => {
      setRepeatGuidance(null);
      Speech.stop();
    };
  }, [announce, setRepeatGuidance]));

  return { announce, voiceEnabled: voice };
}
