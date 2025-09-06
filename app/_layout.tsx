import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

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
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <StatusBar style="dark" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />            
      <Stack.Screen name="(receipt)" />         
      <Stack.Screen name="(notifications)" />
      <Stack.Screen name="updates/[id]" />      
    </Stack>
  );
}
