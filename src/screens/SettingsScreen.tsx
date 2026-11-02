import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { palette } from '../theme';

export default function SettingsScreen({ voice, setVoice, haptics, setHaptics }: { voice: boolean; setVoice: (value: boolean) => void; haptics: boolean; setHaptics: (value: boolean) => void }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.intro}><View style={styles.eyebrow}><View style={styles.dot} /><Text style={styles.eyebrowText}>MAKE IT YOURS</Text></View><Text style={styles.title}>Make this feel{ '\n' }right for you.</Text><Text style={styles.subtitle}>Choose whether you’d like spoken or touch feedback.</Text></View>
      <Text style={styles.sectionLabel}>ACCESSIBILITY</Text>
      <View style={styles.card}>
        <SettingRow icon="◖" title="Voice guidance" description="I’ll read helpful updates aloud." value={voice} onValueChange={setVoice} />
        <View style={styles.divider} />
        <SettingRow icon="⌁" title="Touch feedback" description="Feel a gentle tap when you use the app." value={haptics} onValueChange={setHaptics} />
      </View>
      <View style={styles.info}><View style={styles.infoIcon}><Text style={styles.infoGlyph}>i</Text></View><Text style={styles.infoText}>You can change these whenever you like.</Text></View>
      <View style={styles.brand}><View style={styles.brandMark}><Text style={styles.brandGlyph}>V</Text></View><Text style={styles.brandTitle}>VISION ASSIST</Text><Text style={styles.brandCaption}>Thoughtful technology. Greater independence.</Text></View>
    </ScrollView>
  );
}
function SettingRow({ icon, title, description, value, onValueChange }: { icon: string; title: string; description: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return <View style={styles.row}><View style={styles.rowIcon}><Text style={styles.rowGlyph}>{icon}</Text></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDescription}>{description}</Text></View><Switch value={value} onValueChange={onValueChange} accessibilityLabel={`Toggle ${title}`} trackColor={{ false: '#DDE3DE', true: palette.amber }} thumbColor="#FFFFFF" /></View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background }, content: { padding: 24, paddingTop: 26, paddingBottom: 36 }, intro: { marginBottom: 27 }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber }, eyebrowText: { color: palette.primary, fontWeight: '800', fontSize: 10, letterSpacing: 1.6 }, title: { color: palette.ink, fontSize: 31, lineHeight: 37, fontWeight: '800', marginTop: 13, letterSpacing: -0.8 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  sectionLabel: { color: palette.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 11 }, card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, borderRadius: 18, paddingHorizontal: 15 }, row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 17 }, rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: palette.soft, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, rowGlyph: { color: palette.amber, fontSize: 20 }, rowCopy: { flex: 1, paddingRight: 8 }, rowTitle: { color: palette.ink, fontSize: 13, fontWeight: '700' }, rowDescription: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }, divider: { height: 1, backgroundColor: palette.border, marginLeft: 52 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: palette.brassSoft, borderRadius: 13, padding: 13, marginTop: 17 }, infoIcon: { borderColor: palette.amber, borderWidth: 1, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' }, infoGlyph: { color: palette.primary, fontSize: 11, fontWeight: '700' }, infoText: { color: palette.primaryDark, fontSize: 11, flex: 1 },
  brand: { alignItems: 'center', marginTop: 42 }, brandMark: { width: 37, height: 37, borderRadius: 13, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' }, brandGlyph: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' }, brandTitle: { color: palette.ink, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 10 }, brandCaption: { color: palette.muted, fontSize: 10, marginTop: 5 },
});
