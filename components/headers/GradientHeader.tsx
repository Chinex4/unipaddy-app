// components/headers/GradientHeader.tsx
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft, MoreVertical } from "lucide-react-native";

type Props = {
  title: string;
  right?: React.ReactNode;
  center?: React.ReactNode;
  subtitle?: string;
  /** Desired minimum height; content can exceed this without creating blank space */
  height?: number; // default 256
};

export default function GradientHeader({
  title,
  right,
  center,
  subtitle,
  height = 256,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white" edges={["left", "right"]}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#E8F0FF", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full"
      >
        <View
          style={{ paddingTop: insets.top + 9 }}
          className="w-full relative"
        >
          {/* Decorative BG now fills the dynamic height */}
          <View
            pointerEvents="none"
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              source={require("@/assets/images/unipaddy/bg-skyblue.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Top Row */}
          <View className="px-5 flex-row items-center justify-between mt-10">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/70 items-center justify-center"
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>

            <View className="opacity-0" />
            {/* <View>{right ?? <MoreVertical size={22} color="#111827" />}</View> */}
          </View>

          {/* Title / Center */}
          <View
            className="px-5 items-center justify-center mt-4 pb-6"
            style={{ minHeight: height }}
          >
            <Text className="text-center font-general-semibold text-3xl text-black">
              {title}
            </Text>

            {center && <View className="mt-3">{center}</View>}

            {!!subtitle && (
              <Text className="text-center mt-2 text-gray-500 font-general">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
