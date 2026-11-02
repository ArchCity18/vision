import React from 'react';

export const palette = {
  background: '#F5F7F4',
  surface: '#FFFFFF',
  ink: '#182620',
  muted: '#748078',
  primary: '#176B50',
  primaryDark: '#10523D',
  soft: '#E8F1EB',
  border: '#E8ECE8',
  amber: '#F3B84B',
  danger: '#A3443D',
};

export const FeedbackContext = React.createContext({ voice: true, haptics: true });
