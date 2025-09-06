import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { CampusUpdate } from "@/types/home";

export default function UpdateCard({
  update,
  onPress,
}: {
  update: CampusUpdate;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-64 bg-gray-100 rounded-2xl overflow-hidden"
    >
      <Image source={{ uri: update.image }} className="h-36 w-full" />
      <View className="p-4">
        <Text className="font-general-medium text-base text-black">{update.title}</Text>
        <Text numberOfLines={2} className="font-general text-sm text-gray-600 mt-1">
          {update.snippet}
        </Text>
        <Text className="font-general text-sm text-primary-base mt-3">Read More...</Text>
      </View>
    </Pressable>
  );
}
