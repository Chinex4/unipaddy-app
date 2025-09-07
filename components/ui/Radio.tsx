import React from "react";
import { Pressable, View, Text } from "react-native";

export function Radio({
  label,
  checked,
  onPress,
  disabled,
}: {
  label: string;
  checked: boolean;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center px-5 py-4 rounded-2xl border ${checked ? "border-primary-base bg-primary-base/5" : "border-gray-200 bg-gray-100/60"} ${disabled ? "opacity-60" : ""}`}
    >
      <View
        className={`h-5 w-5 rounded-full items-center justify-center mr-3 ${checked ? "bg-primary-base/10" : "bg-white"}`}
      >
        <View
          className={`h-3 w-3 rounded-full ${checked ? "bg-primary-base" : "bg-gray-300"}`}
        />
      </View>
      <Text className="text-[15px] text-gray-900 font-general">{label}</Text>
    </Pressable>
  );
}
