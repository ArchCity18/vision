import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { palette } from '../theme';

export default function HomeScreen({ navigation }: any) {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.speak('Opening currency identification');
    navigation.navigate('Camera');
  };
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.eyebrow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrowText}>INDEPENDENCE, IN FOCUS</Text></View>
      <Text style={styles.title}>Know what’s{ '\n' }in your hands.</Text>
      <Text style={styles.subtitle}>Identify banknotes with a quick scan and clear spoken guidance.</Text>
      <Animated.View style={[styles.heroDepth, { transform: [{ perspective: 900 }, { scale: depthScale }, { rotateX: depthTilt }, { translateY: depthLift }] }]}>
      <Pressable style={({ pressed }) => [styles.hero, pressed && styles.pressed]} onPress={openCamera} onPressIn={() => animateDepth(1)} onPressOut={() => animateDepth(0)} accessibilityRole="button" accessibilityLabel="Start identifying currency">
        <View style={styles.heroTop}><View style={styles.cameraGlyph}><Text style={styles.glyphText}>◎</Text></View><Text style={styles.arrow}>↗</Text></View>
        <View><Text style={styles.heroTitle}>Identify a banknote</Text><Text style={styles.heroCaption}>Point your camera at any note to begin</Text></View>
      </Pressable>
      </Animated.View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Designed for confidence</Text><Text style={styles.sectionMeta}>A BETTER WAY TO CHECK</Text></View>
      <Animated.View style={{ opacity: featureEntrance[0], transform: [{ translateY: featureEntrance[0].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}><View style={styles.featureCard}><View style={styles.featureIcon}><Text style={styles.featureGlyph}>◖</Text></View><View style={styles.featureCopy}><Text style={styles.featureTitle}>Hear your results</Text><Text style={styles.featureDescription}>Clear voice guidance, right when you need it.</Text></View></View></Animated.View>
      <Animated.View style={{ opacity: featureEntrance[1], transform: [{ translateY: featureEntrance[1].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}><View style={styles.featureCard}><View style={styles.featureIcon}><Text style={styles.featureGlyph}>⌁</Text></View><View style={styles.featureCopy}><Text style={styles.featureTitle}>Simple by design</Text><Text style={styles.featureDescription}>An accessible experience with room to focus.</Text></View></View></Animated.View>
      <Text style={styles.footer}>Made to put clarity in your hands.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background }, content: { padding: 24, paddingTop: 30, paddingBottom: 32 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 17 }, eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber }, eyebrowText: { color: palette.primary, fontWeight: '800', fontSize: 10, letterSpacing: 1.8 },
  title: { color: palette.ink, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.5 }, subtitle: { color: palette.muted, fontSize: 15, lineHeight: 23, marginTop: 12, marginBottom: 25 },
  heroDepth: { marginHorizontal: 1, borderRadius: 22, shadowColor: palette.primaryDark, shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 7 }, hero: { backgroundColor: palette.primary, borderRadius: 22, minHeight: 185, justifyContent: 'space-between', padding: 22, overflow: 'hidden' }, pressed: { opacity: 0.96 }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cameraGlyph: { backgroundColor: 'rgba(255,255,255,0.16)', width: 43, height: 43, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, glyphText: { color: '#FFFFFF', fontSize: 28 }, arrow: { color: '#D6E9D9', fontSize: 23 }, heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' }, heroCaption: { color: '#D9E9DE', fontSize: 12, marginTop: 5 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 31, marginBottom: 11 }, sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '700' }, sectionMeta: { color: palette.amber, fontSize: 8, letterSpacing: 1.1, fontWeight: '700' },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, padding: 15, marginTop: 9, borderWidth: 1, borderColor: palette.border }, featureIcon: { backgroundColor: palette.soft, width: 41, height: 41, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, featureGlyph: { color: palette.primary, fontSize: 21 }, featureCopy: { flex: 1 }, featureTitle: { color: palette.ink, fontSize: 13, fontWeight: '700' }, featureDescription: { color: palette.muted, fontSize: 11, lineHeight: 17, marginTop: 3 },
  footer: { textAlign: 'center', color: '#929B95', fontSize: 11, marginTop: 26 },
});
