import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  useColorScheme,
} from "react-native";

export default function BrandedSplash() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(taglineAnim, {
      toValue: 1,
      delay: 350,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, taglineAnim, dotAnim]);

  const bg = isDark ? "#0F0F0F" : "#FF6B6B";
  const cardBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)";
  const subtitleColor = isDark ? "#CCCCCC" : "rgba(255,255,255,0.9)";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.decorCircle, styles.decorTop]} />
      <View style={[styles.decorCircle, styles.decorBottom]} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: cardBg }]}>
          <Text style={styles.emoji}>🍽️</Text>
        </View>

        <Text style={styles.title}>The Intelligent Bistro</Text>

        <Animated.Text
          style={[styles.tagline, { color: subtitleColor, opacity: taglineAnim }]}
        >
          Fresh • Delicious • Smart
        </Animated.Text>

        <Animated.View style={[styles.loadingRow, { opacity: dotAnim }]}>
          <Text style={styles.loadingText}>Preparing your experience</Text>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </Animated.View>

      <Text style={[styles.footer, { color: subtitleColor }]}>
        AI-Powered Ordering
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  decorTop: {
    width: 280,
    height: 280,
    top: -80,
    right: -60,
  },
  decorBottom: {
    width: 200,
    height: 200,
    bottom: 60,
    left: -50,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  emoji: {
    fontSize: 52,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 1.2,
    marginBottom: 36,
  },
  loadingRow: {
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  footer: {
    position: "absolute",
    bottom: 48,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
