import React from "react";
import { Text, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
}

export default function GradientButton({
  title,
  onPress,
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full rounded-xl overflow-hidden mt-16"
      android_ripple={{ color: "rgba(255, 255, 255, 0.3)" }}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={["#1136ae", "#265bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-xl"
          style={{ opacity: pressed ? 0.85 : 1 }}
        >
          <View className="py-4 items-center justify-center">
            <Text className="text-white font-general-bold text-center text-lg">
              {title}
            </Text>
          </View>
        </LinearGradient>
      )}
    </Pressable>
  );
}
