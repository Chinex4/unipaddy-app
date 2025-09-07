import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import { useThemeMode } from "@/lib/theme";

const Card = ({ label, selected, onPress, img }: any) => (
  <Pressable onPress={onPress} className={`flex-1 items-center ${selected ? "opacity-100" : "opacity-80"}`}>
    <Image source={img} resizeMode="contain" className="h-40 w-full" />
    <Text className="mt-2 text-gray-700 font-general">{label}</Text>
    <View className={`mt-2 h-6 w-6 rounded-full border-2 ${selected ? "border-primary-base" : "border-gray-300"} items-center justify-center`}>
      <View className={`h-3.5 w-3.5 rounded-full ${selected ? "bg-primary-base" : "bg-transparent"}`} />
    </View>
  </Pressable>
);

export default function ThemeScreen() {
  const { mode, setMode } = useThemeMode();

  return (
    <View className="flex-1 bg-white">
      <GradientHeader title="Theme" height={100} />
      <ScrollView className="px-4 -mt-10">
        <Text className="text-gray-900 font-general-semibold text-[18px] mt-2">Application Theme</Text>
        <Text className="text-gray-500 font-general mb-6">
          Select your preferred theme option, this change will reflect across the entire application
        </Text>

        <View className="flex-row items-start space-x-3">
          <Card
            label="Light"
            selected={mode === "light"}
            onPress={() => setMode("light")}
            img={require("@/assets/images/unipaddy/theme-light.png")}
          />
          <Card
            label="Dark"
            selected={mode === "dark"}
            onPress={() => setMode("dark")}
            img={require("@/assets/images/unipaddy/theme-dark.png")}
          />
          <Card
            label="System"
            selected={mode === "system"}
            onPress={() => setMode("system")}
            img={require("@/assets/images/unipaddy/theme-system.png")}
          />
        </View>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
