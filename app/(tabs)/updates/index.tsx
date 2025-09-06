import React, { useMemo } from "react";
import { View, FlatList, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { campusUpdates, CampusUpdate } from "@/types/home";
import UpdateListCard from "@/components/updates/UpdateListCard";

export default function UpdatesIndexScreen() {
  const router = useRouter();

  // Replace with API later
  const data = useMemo<CampusUpdate[]>(() => campusUpdates, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* Header */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
            hitSlop={8}
          >
            <ArrowLeft size={20} color="#111827" />
          </Pressable>
          <Text className="font-general text-2xl text-gray-900">Campus Updates</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <UpdateListCard
            update={item}
            onPress={() => router.push(`/updates/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}
