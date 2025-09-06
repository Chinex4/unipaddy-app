import React from "react";
import { View, Text, Pressable, ViewProps } from "react-native";

type Props = ViewProps & {
  title: string;
  actionText?: string;
  onPress?: () => void;
};

export default function SectionHeader({ title, actionText = "View All", onPress, className, ...rest }: Props) {
  return (
    <View className={["w-full flex-row items-center justify-between", className].join(" ")} {...rest}>
      <Text className="font-general-semibold text-xl text-black">{title}</Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="font-general-medium text-[15px] text-primary-base">{actionText}</Text>
      </Pressable>
    </View>
  );
}
