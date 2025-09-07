import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";

type Props = {
  icon?: React.ReactNode;
  title: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

export default function SettingsRow({
  icon,
  title,
  onPress,
  right,
  danger,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-4 bg-white/60 rounded-2xl ${danger ? "border border-red-200" : ""}`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center space-x-3">
        <View className="h-9 w-9 rounded-full bg-gray-100 items-center justify-center">
          {icon}
        </View>
        <Text
          className={`text-[16px] ${danger ? "text-red-600" : "text-gray-900"} font-general`}
        >
          {title}
        </Text>
      </View>
      {right ?? (
        <ChevronRight size={18} color={danger ? "#EF4444" : "#9CA3AF"} />
      )}
    </Pressable>
  );
}
