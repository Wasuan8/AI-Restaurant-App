import { CartProvider } from '@/components/CartContext';
import { useFonts } from "expo-font";
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { loadSession } from '../services/tokenStore';

export default function RootLayout() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await loadSession(); // Populates in-memory token/user data
      } catch (e) {
        console.warn("[RootLayout] Prepare error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !appIsReady) {
    return null;
  }


  return (
    <CartProvider>
      <RootSiblingParent>
        <Stack>
          <Stack.Screen name="index" 
          options={{ headerShown: false }}
          />
          <Stack.Screen name="login" 
          options={{ headerShown: false }}
          />
          <Stack.Screen name="signup" 
          options={{ headerShown: false }}
          />
          <Stack.Screen name="admin" 
          options={{ headerShown: false }}
          />
          <Stack.Screen name="details" 
          options={{ headerShown: true }}
          />
          <Stack.Screen name="thankyou"
          options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RootSiblingParent>
    </CartProvider>
  );
}
