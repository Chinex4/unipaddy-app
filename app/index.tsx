// app/splash.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const translateY = useRef(new Animated.Value(20)).current; // slide up

  useEffect(() => {
    // run text animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // navigate
    const timer = setTimeout(async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      const token = await AsyncStorage.getItem("user");

      if (!onboarded) {
        router.replace("/onboarding");
      } else if (!token) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/home");
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary-base justify-center items-center">
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/unipaddy/logo.png")}
        className="w-20 h-20"
        resizeMode="contain"
      />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }],
        }}
      >
        <Animated.Text className="text-white text-5xl font-general-bold mt-4 text-center">
          Unipaddy
        </Animated.Text>
        <Animated.Text className="text-white text-[16px] font-general-mediumitalic mt-1 text-center">
          Your university friend
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
