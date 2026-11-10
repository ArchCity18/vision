import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Animated, Easing } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { FeedbackContext, palette } from '../theme';
import { useSpokenGuidance } from '../hooks/useSpokenGuidance';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [result, setResult] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const feedback = useContext(FeedbackContext);
  const readyPulse = useRef(new Animated.Value(0)).current;
  const readyOpacity = readyPulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const readyScale = readyPulse.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.18] });
  const cameraGuidance = !permission
    ? 'Detect. Checking camera access. I will tell you when the preview is ready.'
    : permission.granted
      ? 'Detect. Your camera preview is ready. Hold one banknote steady in the frame. I cannot identify or save a note yet. Choose Home to return or Settings to change feedback.'
      : permission.canAskAgain
        ? 'Detect. Camera access is off. Choose Allow camera access to see a live preview. You can still use Home and Settings without allowing camera access.'
        : 'Detect. Camera access is off. To show a preview, change Vision Assist camera permission in your phone settings. You can still use Home and Settings.';
  const { announce, voiceEnabled } = useSpokenGuidance(cameraGuidance);

  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(readyPulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(readyPulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    pulse.start();
    return () => pulse.stop();
  }, [readyPulse]);

  const detect = async () => {
    if (!cameraRef.current || isDetecting) return;
    setIsDetecting(true);
    try {
      const msg = 'We can’t identify banknotes just yet. No result was produced.';
      setResult(msg);
      if (feedback.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (feedback.voice) Speech.speak(msg);
    } catch {
      const msg = 'Detection failed. Try again.';
      setResult(msg);
      if (feedback.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (feedback.voice) Speech.speak(msg);
    } finally {
      setIsDetecting(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIcon}><Text style={styles.permissionGlyph}>◎</Text></View>
        <Text style={styles.permissionTitle} accessibilityRole="header">Your camera, your call</Text>
        <Text style={styles.permissionCopy}>Allow camera access to see a live preview of your banknote. We’re still getting currency recognition ready.</Text>
        {voiceEnabled && <Pressable onPress={announce} style={styles.repeatButton} accessibilityRole="button" accessibilityLabel="Repeat camera instructions" accessibilityHint="Plays a brief spoken orientation for this screen."><Text style={styles.repeatButtonText}>Hear these instructions again</Text></Pressable>}
        <Pressable style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]} onPress={requestPermission} accessibilityRole="button" accessibilityLabel="Allow camera access">
          <Text style={styles.permissionButtonText}>{permission?.canAskAgain === false ? 'Camera access unavailable' : 'Allow camera access'}</Text>
        </Pressable>
        {permission?.canAskAgain === false && <Text style={styles.deniedHint}>Update camera access in your device settings.</Text>}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.cameraFrame} accessibilityLabel="Live camera preview. Align a banknote within the corner guides. This app cannot identify currency yet.">
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        <View pointerEvents="none" style={styles.frameOverlay}>
          <View style={[styles.corner, styles.topLeft]} /><View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} /><View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={styles.instruction}><Text style={styles.instructionText}>ALIGN BANKNOTE WITH GUIDES</Text></View>
        <View style={styles.cameraHint}><Text style={styles.hintText}>Hold steady · Find even light</Text></View>
        <View style={styles.scanIndicator}><Animated.View style={[styles.scanDot, { opacity: readyOpacity, transform: [{ scale: readyScale }] }]} /><Text style={styles.scanText}>PREVIEW ACTIVE</Text></View>
      </View>
      <View style={styles.controls}>
        <Text style={styles.controlTitle} accessibilityRole="header">Ready when you are</Text>
        <Text style={styles.controlCopy}>Center one banknote in the guides. Identification is not available yet.</Text>
        {voiceEnabled && <Pressable onPress={announce} style={styles.repeatButton} accessibilityRole="button" accessibilityLabel="Repeat camera instructions" accessibilityHint="Plays a brief spoken orientation for this screen."><Text style={styles.repeatButtonText}>Hear these instructions again</Text></Pressable>}
        {result ? <View style={styles.resultCard} accessibilityLiveRegion="polite"><View style={styles.resultDot} /><Text style={styles.resultText}>{result}</Text></View> : null}
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed, isDetecting && styles.buttonBusy]} onPress={detect} accessibilityRole="button" accessibilityLabel="Check whether currency recognition is available" disabled={isDetecting}>
          {isDetecting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonIcon}>◎</Text>}
          <Text style={styles.buttonText}>{isDetecting ? 'One moment…' : 'See what’s available'}</Text>
        </Pressable>
        <Text style={styles.privacyNote}>Banknote recognition is coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background }, cameraFrame: { flex: 1, minHeight: 260, margin: 16, marginBottom: 4, borderRadius: 22, overflow: 'hidden', backgroundColor: '#172536' },
  frameOverlay: { ...StyleSheet.absoluteFill, margin: '9%' }, corner: { position: 'absolute', width: 35, height: 35, borderColor: palette.amber, borderWidth: 3 }, topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 9 }, topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 9 }, bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 9 }, bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 9 },
  instruction: { position: 'absolute', top: '13%', alignSelf: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(18,31,45,0.82)' }, instructionText: { color: '#FFFFFF', fontSize: 9, letterSpacing: 1.5, fontWeight: '800' }, cameraHint: { position: 'absolute', bottom: '14%', alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, backgroundColor: 'rgba(18,31,45,0.80)' }, hintText: { color: '#FFFFFF', fontSize: 11 }, scanIndicator: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, backgroundColor: 'rgba(18,31,45,0.78)', paddingHorizontal: 10, paddingVertical: 7 }, scanDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.amber }, scanText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  controls: { backgroundColor: palette.surface, borderTopLeftRadius: 23, borderTopRightRadius: 23, paddingHorizontal: 22, paddingTop: 19, paddingBottom: 20, borderTopWidth: 1, borderColor: palette.border }, controlTitle: { color: palette.ink, fontSize: 17, fontWeight: '700' }, controlCopy: { color: palette.muted, fontSize: 12, marginTop: 4 }, repeatButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 11, borderWidth: 1, borderColor: palette.amber, backgroundColor: palette.brassSoft, marginTop: 13, marginBottom: 3 }, repeatButtonText: { color: palette.primaryDark, fontSize: 12, fontWeight: '700' }, resultCard: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: 12, backgroundColor: palette.soft, marginTop: 14 }, resultDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.primary }, resultText: { color: palette.primaryDark, fontSize: 13, fontWeight: '700', flex: 1 }, button: { height: 53, borderRadius: 15, marginTop: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: palette.primary }, buttonBusy: { opacity: 0.75 }, pressed: { opacity: 0.87 }, buttonIcon: { color: '#FFFFFF', fontSize: 21 }, buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }, privacyNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 11 },
  permissionScreen: { flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', padding: 29 }, permissionIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: palette.soft, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }, permissionGlyph: { color: palette.primary, fontSize: 36 }, permissionTitle: { color: palette.ink, fontSize: 22, fontWeight: '800', textAlign: 'center' }, permissionCopy: { color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10, marginBottom: 22 }, permissionButton: { width: '100%', padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: palette.primary }, permissionButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }, deniedHint: { color: palette.muted, fontSize: 12, marginTop: 13 },
});
