import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNavigationContainerRef } from '@react-navigation/native';
import { Text, View, StyleSheet, Platform, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import React from 'react';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { FeedbackContext, palette } from './src/theme';
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef<any>();
const tabIcons: Record<string, string> = { Home: '⌂', Camera: '◎', Settings: '⚙' };
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    primary: palette.amber,
    text: palette.ink,
    border: palette.border,
    notification: palette.amber,
  },
};

export default function App() {
  const [voice, setVoice] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [repeatGuidance, setRepeatGuidance] = useState<(() => void) | null>(null);
  return (
    <FeedbackContext.Provider value={{ voice, haptics, setRepeatGuidance }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Tab.Navigator screenOptions={({ route }) => ({
          headerTitleAlign: 'left', headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header, headerShadowVisible: false,
          headerRight: () => <View style={styles.headerActions}><View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>READY</Text></View><VoiceCommandControl voice={voice} repeatGuidance={repeatGuidance} /></View>,
          tabBarLabel: route.name === 'Camera' ? 'Detect' : route.name,
          tabBarIcon: ({ focused }) => <View style={styles.tabIconWrap}><Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{tabIcons[route.name]}</Text>{focused && <View style={styles.tabAccent} />}</View>,
          tabBarActiveTintColor: palette.amber, tabBarInactiveTintColor: palette.muted,
          tabBarLabelStyle: styles.tabLabel, tabBarStyle: styles.tabBar,
          tabBarAccessibilityLabel: `${route.name === 'Camera' ? 'Detect' : route.name} tab`,
        })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Vision Assist' }} />
          <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera preview' }} />
          <Tab.Screen name="Settings" options={{ title: 'Preferences' }}>
            {() => <SettingsScreen voice={voice} setVoice={setVoice} haptics={haptics} setHaptics={setHaptics} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </FeedbackContext.Provider>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: palette.background }, headerTitle: { color: palette.ink, fontSize: 19, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 18, backgroundColor: palette.brassSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: palette.border },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber },
  statusText: { color: palette.primaryDark, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  voiceButton: { minWidth: 58, minHeight: 44, paddingHorizontal: 8, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.primary, marginRight: 12 },
  voiceButtonActive: { backgroundColor: palette.danger },
  voiceButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  tabBar: { position: 'absolute', height: 78, paddingTop: 9, paddingBottom: 10, backgroundColor: Platform.OS === 'ios' ? 'rgba(255,252,246,0.88)' : 'rgba(255,252,246,0.96)', borderTopColor: 'rgba(227,217,201,0.9)', borderTopWidth: 1, elevation: 0 },
  tabIconWrap: { alignItems: 'center', justifyContent: 'center', minWidth: 34 },
  tabIcon: { color: palette.muted, fontSize: 22 }, tabIconActive: { color: palette.amber },
  tabAccent: { width: 14, height: 2, borderRadius: 1, backgroundColor: palette.amber, marginTop: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});

function VoiceCommandControl({ voice, repeatGuidance }: { voice: boolean; repeatGuidance: (() => void) | null }) {
  const [listening, setListening] = useState(false);
  const [commandStatus, setCommandStatus] = useState('');
  const handled = useRef(false);

  useSpeechRecognitionEvent('start', () => {
    setListening(true);
    setCommandStatus('Listening');
  });
  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('error', (event) => {
    setListening(false);
    setCommandStatus(event.error === 'not-allowed' ? 'Microphone permission needed' : 'Did not catch that. Try again.');
  });
  useSpeechRecognitionEvent('result', (event) => {
    if (!event.isFinal || handled.current) return;
    handled.current = true;
    const transcript = event.results[0]?.transcript?.toLowerCase().trim() ?? '';
    const command = transcript.replace(/[.!?,]/g, '');
    if (/\b(home|go home|back home)\b/.test(command)) {
      navigationRef.navigate('Home');
      setCommandStatus('Going home');
    } else if (/\b(camera|detect|open camera|scan)\b/.test(command)) {
      navigationRef.navigate('Camera');
      setCommandStatus('Opening camera');
    } else if (/\b(settings|preferences|open settings)\b/.test(command)) {
      navigationRef.navigate('Settings');
      setCommandStatus('Opening settings');
    } else if (/\b(repeat|repeat instructions|say that again)\b/.test(command)) {
      repeatGuidance?.();
      setCommandStatus(repeatGuidance ? 'Repeating instructions' : 'No screen instructions available');
      if (!repeatGuidance && voice) Speech.speak('Choose home, camera, or settings.');
    } else if (/\b(help|commands)\b/.test(command)) {
      setCommandStatus('Available: home, camera, settings, repeat instructions');
      if (voice) Speech.speak('You can say home, camera, settings, or repeat instructions.');
    } else {
      setCommandStatus('Command not recognized. Say help for options.');
      if (voice) Speech.speak('I did not recognize that. Say home, camera, settings, or help.');
    }
  });

  const toggleListening = async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    handled.current = false;
    setCommandStatus('Requesting microphone access');
    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        setCommandStatus('Microphone permission needed');
        if (voice) Speech.speak('Allow microphone access in system settings to use voice commands.');
        return;
      }
      const startRecognition = () => ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: false, continuous: false, maxAlternatives: 1 });
      if (voice) {
        setCommandStatus('Starting voice command');
        Speech.stop();
        Speech.speak('I’m listening. Say home, camera, settings, repeat instructions, or help.', {
          rate: 0.92,
          onDone: startRecognition,
          onError: startRecognition,
        });
      } else {
        startRecognition();
      }
    } catch {
      setCommandStatus('Voice commands need the Vision Assist development build');
    }
  };

  const buttonText = listening ? 'Listening…'
    : commandStatus === 'Command not recognized. Say help for options.' ? 'Try again'
      : commandStatus.startsWith('Microphone') ? 'Allow mic'
        : commandStatus.startsWith('Voice commands need') ? 'Build needed'
          : commandStatus ? 'Done' : 'Voice';

  return (
    <Pressable onPress={toggleListening} style={[styles.voiceButton, listening && styles.voiceButtonActive]} accessibilityRole="button" accessibilityLabel={listening ? 'Stop listening for a voice command' : commandStatus || 'Start a voice command'} accessibilityHint="Listens only after you press this button. Say home, camera, settings, repeat instructions, or help.">
      <Text accessibilityLiveRegion="polite" style={styles.voiceButtonText}>{buttonText}</Text>
    </Pressable>
  );
}
