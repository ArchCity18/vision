import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useState } from 'react';
import React from 'react';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { FeedbackContext, palette } from './src/theme';
const Tab = createBottomTabNavigator();
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
  return (
    <FeedbackContext.Provider value={{ voice, haptics }}>
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator screenOptions={({ route }) => ({
          headerTitleAlign: 'left', headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header, headerShadowVisible: false,
          headerRight: () => <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>READY</Text></View>,
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
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 18, backgroundColor: palette.brassSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: palette.border },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber },
  statusText: { color: palette.primaryDark, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  tabBar: { position: 'absolute', height: 78, paddingTop: 9, paddingBottom: 10, backgroundColor: Platform.OS === 'ios' ? 'rgba(255,252,246,0.88)' : 'rgba(255,252,246,0.96)', borderTopColor: 'rgba(227,217,201,0.9)', borderTopWidth: 1, elevation: 0 },
  tabIconWrap: { alignItems: 'center', justifyContent: 'center', minWidth: 34 },
  tabIcon: { color: palette.muted, fontSize: 22 }, tabIconActive: { color: palette.amber },
  tabAccent: { width: 14, height: 2, borderRadius: 1, backgroundColor: palette.amber, marginTop: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
