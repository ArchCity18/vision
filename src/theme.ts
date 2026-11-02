import React from 'react';

export const palette = {
  // Warm ivory, deep teal, and brushed brass for a calm, premium feel.
  background: '#F4F2EC',
  surface: '#FFFDF8',
  ink: '#172B31',
  muted: '#5C6B6B',
  primary: '#1F625B',
  primaryDark: '#174843',
  soft: '#E6EEEA',
  border: '#E5E1D7',
  amber: '#C69A55',
  danger: '#A3443D',
};

export const FeedbackContext = React.createContext({ voice: true, haptics: true });
