import React, { useMemo } from "react";
import { View, Text, Image, ScrollView, Pressable, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Share2 } from "lucide-react-native";
import { campusUpdates, CampusUpdate } from "@/types/home";

export default function UpdateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const update = useMemo<CampusUpdate | undefined>(
    () => campusUpdates.find((u) => u.id === id),
    [id]
  );

  // Fallback content if you haven't added "body" to your type/data yet
  const body =
    (update as any)?.body ??
    `${update?.snippet ?? ""}\n\n` +
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

  const handleShare = async () => {
    if (!update) return;
    await Share.share({
      title: update.title,
      message: `${update.title}\n\n${update.snippet}\n\n— Shared from Unipaddy`,
    });
  };

  if (!update) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <StatusBar style="dark" />
        <Text className="font-general text-base text-gray-500 mb-4">Update not found.</Text>
        <Pressable
          onPress={() => router.back()}
          className="px-4 py-2 rounded-xl bg-gray-100"
        >
          <Text className="font-general text-gray-800">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
              hitSlop={8}
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>
            <Text className="font-general text-2xl text-gray-900" numberOfLines={1}>
              Update
            </Text>
          </View>

          <Pressable
            onPress={handleShare}
            className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Share2 size={18} color="#111827" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <Image source={{ uri: update.image }} className="w-full h-60" />

        <View className="px-5 mt-4">
          {/* Title */}
          <Text className="font-general text-[22px] text-gray-900">
            {update.title}
          </Text>

          {/* Meta (you can wire date/author later) */}
          <Text className="font-general text-xs text-gray-500 mt-1">
            Today • 3 min read • Admin
          </Text>

          {/* Body */}
          <Text className="font-general text-[15px] leading-6 text-gray-700 mt-4">
            {body}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
