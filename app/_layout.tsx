// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    General: require("../assets/fonts/GeneralSans-Regular.otf"),
    "General-Bold": require("../assets/fonts/GeneralSans-Bold.otf"),
    "General-Italic": require("../assets/fonts/GeneralSans-Italic.otf"),
    "General-SemiBold": require("../assets/fonts/GeneralSans-Semibold.otf"),
    "General-Medium": require("../assets/fonts/GeneralSans-Medium.otf"),
    "General-BoldItalic": require("../assets/fonts/GeneralSans-BoldItalic.otf"),
    "General-SemiBoldItalic": require("../assets/fonts/GeneralSans-SemiboldItalic.otf"),
    "General-MediumItalic": require("../assets/fonts/GeneralSans-MediumItalic.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Entry point */}
      <StatusBar style="dark" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="(onboarding)/index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/otp-verification" />
      <Stack.Screen name="(auth)/create-new-password" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
