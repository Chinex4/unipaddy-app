// app/_layout.tsx
import { ThemeProvider } from "@/lib/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "@/global.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import type { ToastConfig } from "react-native-toast-message";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          {/* Put StatusBar OUTSIDE the <Stack> */}
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const Base = ({
  text1,
  text2,
  bgClass = "bg-black/90",
}: {
  text1?: string;
  text2?: string;
  bgClass?: string;
}) => (
  <View className={`mx-4 mt-4 rounded-2xl px-4 py-3 ${bgClass}`}>
    <Text
      className="text-white font-[font-general] text-base"
      numberOfLines={2}
    >
      {text1}
    </Text>
    {!!text2 && (
      <Text
        className="text-white/80 font-[font-general] text-xs mt-1"
        numberOfLines={3}
      >
        {text2}
      </Text>
    )}
  </View>
);

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <Base text1={text1} text2={text2} bgClass="bg-primary-base" />
  ),
  error: ({ text1, text2 }) => (
    <Base text1={text1} text2={text2} bgClass="bg-red-600" />
  ),
  info: ({ text1, text2 }) => (
    <Base text1={text1} text2={text2} bgClass="bg-black/90" />
  ),
};
