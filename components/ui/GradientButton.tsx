import React from "react";
import { Text, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function GradientButton({
  title,
  onPress,
  disabled = false,
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className="w-full rounded-xl overflow-hidden mt-16"
    >
      {({ pressed }) => (
        <LinearGradient
          colors={
            disabled
              ? ["#9ca3af", "#9ca3af"] // grey gradient when disabled
              : ["#1136ae", "#265bff"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-xl"
          style={{ opacity: pressed && !disabled ? 0.85 : 1 }}
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
