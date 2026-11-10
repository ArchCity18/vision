import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FeedbackContext, palette } from '../theme';
import { useSpokenGuidance } from '../hooks/useSpokenGuidance';

export default function HomeScreen({ navigation }: any) {
  const feedback = useContext(FeedbackContext);
  const { announce, voiceEnabled } = useSpokenGuidance(`Home. Vision Assist helps you explore a banknote with your camera. Camera preview is available. Currency identification is not available yet, and no scan will be saved. Voice navigation is ${feedback.voice ? 'on' : 'off'}. Choose Open camera or Settings.`);
  const pressDepth = useRef(new Animated.Value(0)).current;
  const featureEntrance = useRef([new Animated.Value(0), new Animated.Value(0)]).current;
  const depthScale = pressDepth.interpolate({ inputRange: [0, 1], outputRange: [1, 0.975] });
  const depthTilt = pressDepth.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-1.5deg'] });
  const depthLift = pressDepth.interpolate({ inputRange: [0, 1], outputRange: [0, 3] });

  useEffect(() => {
    Animated.stagger(100, featureEntrance.map((value) => Animated.timing(value, {
      toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }))).start();
  }, [featureEntrance]);

  const animateDepth = (toValue: number) => Animated.spring(pressDepth, {
    toValue, useNativeDriver: true, tension: 220, friction: 16,
  }).start();

  const openCamera = () => {
    if (feedback.haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Camera');
  };
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.eyebrow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrowText}>VISION ASSIST  /  BANKNOTE GUIDE</Text></View>
      <Text style={styles.title} accessibilityRole="header">Explore your{ '\n' }banknote.</Text>
      <Text style={styles.subtitle}>Use the camera preview to position a note. Identification is not available yet, so the app will not tell you whether a note is genuine.</Text>
      {voiceEnabled && <Pressable onPress={announce} style={styles.repeatButton} accessibilityRole="button" accessibilityLabel="Repeat spoken guidance" accessibilityHint="Plays a brief spoken orientation for this screen."><Text style={styles.repeatButtonText}>Hear these instructions again</Text></Pressable>}
      <Animated.View style={[styles.heroDepth, { transform: [{ perspective: 900 }, { scale: depthScale }, { rotateX: depthTilt }, { translateY: depthLift }] }]}>
      <Pressable style={({ pressed }) => [styles.hero, pressed && styles.pressed]} onPress={openCamera} onPressIn={() => animateDepth(1)} onPressOut={() => animateDepth(0)} accessibilityRole="button" accessibilityLabel="Open camera preview">
        <View style={styles.heroTop}><View style={styles.cameraGlyph}><Text style={styles.glyphText}>◎</Text></View><Text style={styles.arrow}>↗</Text></View>
        <View><Text style={styles.heroTitle}>Open the camera</Text><Text style={styles.heroCaption}>Recognition is coming soon; preview is ready.</Text></View>
      </Pressable>
      </Animated.View>
      <View style={styles.statusCard} accessibilityLabel="Service status. Camera preview available. Banknote identification not available yet. No images are saved.">
        <View style={styles.statusLine}><View style={styles.statusMark} /><Text style={styles.statusHeading}>Camera preview available</Text></View>
        <Text style={styles.statusCopy}>Banknote identification is still in development. Your camera stays on your device.</Text>
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle} accessibilityRole="header">Designed around you</Text><Text style={styles.sectionMeta}>ACCESSIBILITY</Text></View>
      <Animated.View style={{ opacity: featureEntrance[0], transform: [{ translateY: featureEntrance[0].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}><View style={styles.featureCard}><View style={styles.featureIcon}><Text style={styles.featureGlyph}>◖</Text></View><View style={styles.featureCopy}><Text style={styles.featureTitle}>Listen when you need to</Text><Text style={styles.featureDescription}>Spoken guidance can make each step easier.</Text></View></View></Animated.View>
      <Animated.View style={{ opacity: featureEntrance[1], transform: [{ translateY: featureEntrance[1].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}><View style={styles.featureCard}><View style={styles.featureIcon}><Text style={styles.featureGlyph}>⌁</Text></View><View style={styles.featureCopy}><Text style={styles.featureTitle}>Take it at your pace</Text><Text style={styles.featureDescription}>Simple controls, with room to focus.</Text></View></View></Animated.View>
      <Text style={styles.footer}>We’re glad you’re here.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background }, content: { padding: 24, paddingTop: 30, paddingBottom: 108 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 17 }, eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber }, eyebrowText: { color: palette.primary, fontWeight: '800', fontSize: 10, letterSpacing: 1.3 }, repeatButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 12, borderWidth: 1, borderColor: palette.amber, backgroundColor: palette.brassSoft, marginBottom: 18 }, repeatButtonText: { color: palette.primaryDark, fontSize: 13, fontWeight: '700' },
  title: { color: palette.ink, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.5 }, subtitle: { color: palette.muted, fontSize: 15, lineHeight: 23, marginTop: 12, marginBottom: 25 },
  heroDepth: { marginHorizontal: 1, borderRadius: 22, shadowColor: palette.primaryDark, shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 7 }, hero: { backgroundColor: palette.primary, borderRadius: 22, minHeight: 185, justifyContent: 'space-between', padding: 22, overflow: 'hidden' }, pressed: { opacity: 0.96 }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cameraGlyph: { backgroundColor: 'rgba(255,255,255,0.16)', width: 43, height: 43, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, glyphText: { color: '#FFFFFF', fontSize: 28 }, arrow: { color: '#D6E9D9', fontSize: 23 }, heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' }, heroCaption: { color: '#D9E9DE', fontSize: 12, marginTop: 5 },
  statusCard: { backgroundColor: 'rgba(255,252,246,0.78)', borderWidth: 1, borderColor: palette.border, borderRadius: 17, padding: 16, marginTop: 16 }, statusLine: { flexDirection: 'row', alignItems: 'center', gap: 9 }, statusMark: { width: 9, height: 9, borderRadius: 5, backgroundColor: palette.primary }, statusHeading: { color: palette.ink, fontSize: 14, fontWeight: '700' }, statusCopy: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 25, marginBottom: 11 }, sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '700' }, sectionMeta: { color: palette.amber, fontSize: 8, letterSpacing: 1.1, fontWeight: '700' },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, padding: 15, marginTop: 9, borderWidth: 1, borderColor: palette.border }, featureIcon: { backgroundColor: palette.soft, width: 41, height: 41, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, featureGlyph: { color: palette.primary, fontSize: 21 }, featureCopy: { flex: 1 }, featureTitle: { color: palette.ink, fontSize: 13, fontWeight: '700' }, featureDescription: { color: palette.muted, fontSize: 11, lineHeight: 17, marginTop: 3 },
  footer: { textAlign: 'center', color: '#929B95', fontSize: 11, marginTop: 26 },
});
