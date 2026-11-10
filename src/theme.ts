import React from 'react';

export const palette = {
  // Warm ivory, tailored navy, and brushed brass.
  background: '#F3EEE4',
  surface: '#FFFCF6',
  ink: '#1B2938',
  muted: '#626A72',
  primary: '#263B52',
  primaryDark: '#192B3D',
  soft: '#EEE6D8',
  border: '#E3D9C9',
  amber: '#B78B50',
  brassSoft: '#F1E5D1',
  danger: '#A3443D',
};

export const FeedbackContext = React.createContext({
  voice: true,
  haptics: true,
  setRepeatGuidance: (_callback: (() => void) | null) => {},
});
