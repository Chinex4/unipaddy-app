import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import { QuickAction } from "@/types/home";

type Props = {
  data: QuickAction[];
  onItemPress?: (item: QuickAction) => void;
};

const CircleButton = ({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: LucideIcon;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress} className="items-center gap-2 w-[23%]">
      <View className="h-14 w-14 rounded-full items-center justify-center bg-primary-base">
        <Icon size={24} color="white" />
      </View>
      <Text className="text-center text-[12px] text-gray-700 font-general">
        {label}
      </Text>
    </Pressable>
  );
};

export default function QuickActionsGrid({ data, onItemPress }: Props) {
  // render 2 rows * 4 columns (like your design)
  const rows = [data.slice(0, 4), data.slice(4, 8)];

  return (
    <View className="rounded-3xl bg-[#F6F9FF] p-4 mt-4">
      {rows.map((row, i) => (
        <View
          key={i}
          className={`flex-row justify-between ${i === 1 ? "mt-5" : ""}`}
        >
          {row.map((item) => (
            <CircleButton
              key={item.key}
              label={item.label}
              Icon={item.icon}
              onPress={() => onItemPress?.(item)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
