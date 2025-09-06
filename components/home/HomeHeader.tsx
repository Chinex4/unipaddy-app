import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Bell } from "lucide-react-native";

type Props = {
  greeting: string;
  name: string;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
};

export default function HomeHeader({
  greeting,
  name,
  onBellPress,
  onAvatarPress,
}: Props) {
  return (
    <View className="px-5 pt-4 mt-16">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-700 font-general-medium text-base">
            {greeting}
          </Text>
          <Text className="text-black font-general-semibold font-semibold text-2xl mt-0.5">
            {name}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onBellPress}
            className="h-11 w-11 rounded-full bg-gray-100 items-center justify-center"
          >
            <Bell size={20} color="#111827" />
          </Pressable>

          <Pressable onPress={onAvatarPress}>
            <Image
              source={require("@/assets/images/unipaddy/dummy-profile.png")}
              className="h-11 w-11 rounded-full"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
