import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadSession } from "../services/tokenStore";

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const illustrationScale = useRef(new Animated.Value(0.85)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  const hasRedirected = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      if (hasRedirected.current) return;
      
      try {
        const session = await loadSession();
        if (session?.token) {
          hasRedirected.current = true;
          if (session.userType === 'admin') {
            router.replace('/admin');
          } else {
            router.replace({ 
              pathname: '/(tabs)/home', 
              params: { userName: session.userName } 
            });
          }
        }
      } catch (e) {
        // Session check error handled silently
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    // Logo pops in first
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: 150,
      useNativeDriver: true,
    }).start();

    // Illustration scales up
    Animated.spring(illustrationScale, {
      toValue: 1,
      tension: 60,
      friction: 10,
      delay: 350,
      useNativeDriver: true,
    }).start();

    // Text slides up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 12,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Button comes in last
    Animated.parallel([
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.spring(buttonSlide, {
        toValue: 0,
        tension: 70,
        friction: 12,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between", paddingVertical: 36, paddingHorizontal: 28 }}>

          {/* ── Top Logo ── */}
          <Animated.View
            style={{
              transform: [{ scale: logoScale }],
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Coffee cup icon */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: "#EDD9C0",
              }}
            >
              <Image
                source={require('../assets/images/Logo.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                fontSize: 12,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#7B4A1E",
                fontFamily: "Sora-SemiBold",
              }}
            >
              Apna Cafe
            </Text>
          </Animated.View>

          {/* ── Center Illustration ── */}
          <Animated.View
            style={{
              transform: [{ scale: illustrationScale }],
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <Image
              source={require('../assets/images/index_bg_image.png')}
              style={{
                width: 380,
                height: 300,
              }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* ── Bottom Text + Button ── */}
          <View style={{ width: "100%", alignItems: "center", gap: 0 }}>

            {/* Headline */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: "#1A1A1A",
                  fontFamily: "Sora-Regular",
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                Find your favorite
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  color: "#1A1A1A",
                  fontFamily: "Sora-SemiBold",
                  textAlign: "center",
                  fontStyle: "italic",
                  lineHeight: 40,
                }}
              >
                Apna Cafe!
              </Text>
            </Animated.View>

            {/* Subtitle */}
            <Animated.Text
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                fontSize: 13,
                color: "#AAAAAA",
                textAlign: "center",
                fontFamily: "Sora-Regular",
                lineHeight: 20,
                marginBottom: 32,
                paddingHorizontal: 16,
              }}
            >
              We're a cozy coffee shop, serving artisan brews {"\n"}& delightful bites for every occasion
            </Animated.Text>

            {/* Get Started Button */}
            <Animated.View
              style={{
                opacity: buttonFade,
                transform: [{ translateY: buttonSlide }],
                width: "75%",
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/login" as any)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: "#5C3317",
                  paddingVertical: 16,
                  paddingHorizontal: 28,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  shadowColor: "#5C3317",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 14,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontFamily: "Sora-SemiBold",
                    letterSpacing: 0.3,
                  }}
                >
                  Get Started
                </Text>

                {/* Arrow circle */}
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "rgba(176, 174, 20, 0.72)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}