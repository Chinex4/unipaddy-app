import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { CampusUpdate } from "@/types/home";

type Props = {
  update: CampusUpdate;
  onPress?: () => void;
};

export default function UpdateListCard({ update, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-white rounded-2xl overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <Image source={{ uri: update.image }} className="w-full h-40" />
      <View className="p-4">
        <Text className="font-general-medium text-[17px] text-gray-900" numberOfLines={2}>
          {update.title}
        </Text>
        <Text className="font-general text-sm text-gray-600 mt-1" numberOfLines={2}>
          {update.snippet}
        </Text>
        <Text className="font-general text-sm text-primary-base mt-3">Read more</Text>
      </View>
    </Pressable>
  );
}
