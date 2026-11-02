import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import React from 'react';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { FeedbackContext, palette } from './src/theme';
const Tab = createBottomTabNavigator();
const tabIcons: Record<string, string> = { Home: '⌂', Camera: '◎', History: '◷', Settings: '⚙' };
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
  return (
    <FeedbackContext.Provider value={{ voice: true, haptics: true }}>
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator screenOptions={({ route }) => ({
          headerTitleAlign: 'left', headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header, headerShadowVisible: false,
          headerRight: () => <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>READY</Text></View>,
          tabBarLabel: route.name === 'Camera' ? 'Detect' : route.name,
          tabBarIcon: ({ focused }) => <View style={styles.tabIconWrap}><Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{tabIcons[route.name]}</Text>{focused && <View style={styles.tabAccent} />}</View>,
          tabBarActiveTintColor: palette.amber, tabBarInactiveTintColor: palette.muted,
          tabBarLabelStyle: styles.tabLabel, tabBarStyle: styles.tabBar,
          tabBarAccessibilityLabel: 'Main navigation',
        })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Vision Assist' }} />
          <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Identify currency' }} />
          <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Your activity' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Preferences' }} />
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
  tabBar: { height: 78, paddingTop: 9, paddingBottom: 10, backgroundColor: palette.surface, borderTopColor: palette.border, borderTopWidth: 1 },
  tabIconWrap: { alignItems: 'center', justifyContent: 'center', minWidth: 34 },
  tabIcon: { color: palette.muted, fontSize: 22 }, tabIconActive: { color: palette.amber },
  tabAccent: { width: 14, height: 2, borderRadius: 1, backgroundColor: palette.amber, marginTop: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
