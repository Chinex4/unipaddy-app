// app/coming-soon.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GradientButton from "@/components/ui/GradientButton";
import { useRouter } from "expo-router";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <StatusBar style="dark" />

      {/* Illustration / Logo */}
      <Image
        source={require("@/assets/images/unipaddy/comingsoon.png")} // <-- put any placeholder image here
        className="w-96 h-96"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-2xl font-general-semibold text-gray-900 mt-6 text-center">
        Coming Soon 🚀
      </Text>

      {/* Subtitle */}
      <Text className="text-base font-general text-gray-500 mt-3 text-center">
        This feature is currently under development.  
        Stay tuned, it will be available very soon.
      </Text>

      {/* Back Home button */}
      <View className="mt-8 w-full">
        <GradientButton
          title="Back to Home"
          onPress={() => router.push("/home")}
        />
      </View>
    </SafeAreaView>
  );
}
