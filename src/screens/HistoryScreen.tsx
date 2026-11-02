import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../theme';

export default function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.intro}><View style={styles.eyebrow}><View style={styles.dot} /><Text style={styles.eyebrowText}>YOUR ACTIVITY</Text></View><Text style={styles.title}>Your recent checks</Text><Text style={styles.subtitle}>A handy place to find the notes you’ve checked.</Text></View>
      <View style={styles.card}><View style={styles.icon}><Text style={styles.iconText}>◷</Text></View><Text style={styles.cardTitle}>Nothing here just yet</Text><Text style={styles.description}>Once saved check history is ready, you’ll find it here. We aren’t saving scans yet.</Text></View>
      <Text style={styles.note}>Your scan history isn’t stored on this device yet.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, backgroundColor: palette.background }, intro: { marginTop: 20 }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber }, eyebrowText: { color: palette.primary, fontWeight: '800', fontSize: 10, letterSpacing: 1.6 },
  title: { color: palette.ink, fontSize: 27, fontWeight: '800', marginTop: 13, letterSpacing: -0.5 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  card: { marginTop: 30, paddingHorizontal: 24, paddingVertical: 34, backgroundColor: palette.surface, alignItems: 'center', borderRadius: 21, borderWidth: 1, borderColor: palette.border }, icon: { width: 56, height: 56, borderRadius: 18, backgroundColor: palette.soft, justifyContent: 'center', alignItems: 'center', marginBottom: 17 }, iconText: { color: palette.amber, fontSize: 27 }, cardTitle: { color: palette.ink, fontSize: 17, fontWeight: '700' }, description: { color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 250 }, note: { color: palette.muted, fontSize: 11, textAlign: 'center', marginTop: 20 },
});
