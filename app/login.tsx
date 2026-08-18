import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveSession } from "../services/tokenStore"; // ✅ proper top-level import

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "error" | "success" | "info";

function useToast() {
  const opacity = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("error");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string, kind: ToastType = "error") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setType(kind);
    Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }, 3000);
  };

  const bgColor: Record<ToastType, string> = {
    error: "#A32D2D",
    success: "#3B6D11",
    info: "#5C3317",
  };

  const icon: Record<ToastType, string> = {
    error: "alert-circle-outline",
    success: "checkmark-circle-outline",
    info: "information-circle-outline",
  };

  const Toast = () => (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 60,
        left: 24,
        right: 24,
        zIndex: 999,
        opacity,
        backgroundColor: bgColor[type],
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name={icon[type] as any} size={20} color="#FFFFFF" />
      <Text style={{ color: "#FFFFFF", fontFamily: "Sora-Regular", fontSize: 14, flex: 1 }}>
        {message}
      </Text>
    </Animated.View>
  );

  return { show, Toast };
}

// ─── Login screen ─────────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { show: showToast, Toast } = useToast();

  const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const uType = data.user?.user_type || (email.toLowerCase().includes("admin") ? "admin" : "customer");
        const uName = data.user?.name || "Coffee Lover";

        if (token) {
          await saveSession(token, uType, uName);
        }
        
        showToast("Logged in successfully!", "success");

        setTimeout(() => {
          if (uType === "admin") {
            router.replace("/admin" as any);
          } else {
            router.replace({ pathname: "/(tabs)/home", params: { userName: uName } } as any);
          }
        }, 600);

      } else {
        const errorMsg =
          data?.detail === "Incorrect password" ? "Incorrect password. Please try again." :
            data?.detail === "User not found" ? "No account found with this email." :
              data?.detail ? data.detail :
                "Login failed. Please check your credentials.";
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showToast("Cannot connect to server. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Toast />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 28 }}>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", top: 20, left: 10, zIndex: 10 }}
          >
            <Ionicons name="arrow-back" size={28} color="#1A1A1A" />
          </TouchableOpacity>

          <View style={{ marginBottom: 40, marginTop: 40 }}>
            <Text style={{ fontSize: 32, fontFamily: "Sora-SemiBold", color: "#1A1A1A", marginBottom: 8 }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 16, fontFamily: "Sora-Regular", color: "#AAAAAA" }}>
              Log in to your account
            </Text>
          </View>

          <View style={{ gap: 20 }}>
            <View>
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: "#1A1A1A", marginBottom: 8 }}>
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1.5, borderColor: "#EDD9C0", borderRadius: 12,
                  padding: 16, fontFamily: "Sora-Regular", fontSize: 14,
                  color: "#1A1A1A", backgroundColor: "#FAFAFA",
                }}
                placeholder="Enter your email"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: "#1A1A1A", marginBottom: 8 }}>
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1.5, borderColor: "#EDD9C0", borderRadius: 12,
                  padding: 16, fontFamily: "Sora-Regular", fontSize: 14,
                  color: "#1A1A1A", backgroundColor: "#FAFAFA",
                }}
                placeholder="Enter your password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#A0826A" : "#5C3317",
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: "center",
              marginTop: 40,
              shadowColor: "#5C3317",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Sora-SemiBold" }}>
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
            <Text style={{ fontFamily: "Sora-Regular", color: "#AAAAAA", fontSize: 14 }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup" as any)}>
              <Text style={{ fontFamily: "Sora-SemiBold", color: "#5C3317", fontSize: 14 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}