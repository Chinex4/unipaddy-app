import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MoreVertical, Search as SearchIcon, Archive, Trash2 } from "lucide-react-native";
import { noticesSeed } from "@/types/notifications";

export default function NotificationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const notice = useMemo(() => noticesSeed.find((n) => n.id === id), [id]);

  const handleArchive = () => {
    setMenuOpen(false);
    // TODO: call Laravel API to archive
    Alert.alert("Archived", "Message moved to Archive.");
    router.back();
  };

  const handleTrash = () => {
    setMenuOpen(false);
    // TODO: call Laravel API to delete
    Alert.alert("Deleted", "Message moved to Trash.");
    router.back();
  };

  if (!notice) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <StatusBar style="dark" />
        <Text className="font-general text-gray-500">Message not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center">
            <ArrowLeft size={20} color="#111827" />
          </Pressable>

          <Text className="font-general-semibold text-2xl text-gray-900">Message</Text>

          <Pressable onPress={() => setMenuOpen((s) => !s)} className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center">
            <MoreVertical size={18} color="#111827" />
          </Pressable>
        </View>

        {/* Search (visual as per design) */}
        <View className="mt-4 h-12 rounded-full bg-gray-100/70 flex-row items-center px-4">
          <SearchIcon size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 font-general text-gray-700"
          />
        </View>
      </View>

      {/* Body */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between mt-2">
          <Text className="font-general text-[20px] text-gray-900 flex-1 pr-3">{notice.title}</Text>
          <Text className="font-general text-xs text-gray-400 mt-1">{notice.time}</Text>
        </View>

        <Text className="font-general text-[15px] leading-6 text-gray-600 mt-3">
          {notice.body}
          {"\n\n"}
          {notice.body}
        </Text>
      </ScrollView>

      {/* Popover menu */}
      {menuOpen && (
        <>
          {/* backdrop */}
          <Pressable className="absolute inset-0" onPress={() => setMenuOpen(false)} />
          <View className="absolute right-5 top-[92px] w-44 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            <Pressable onPress={handleArchive} className="flex-row items-center px-4 py-3 active:opacity-70">
              <View className="h-8 w-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <Archive size={18} color="#111827" />
              </View>
              <Text className="font-general text-gray-800">Archive</Text>
            </Pressable>

            <View className="h-[1px] bg-gray-100" />

            <Pressable onPress={handleTrash} className="flex-row items-center px-4 py-3 active:opacity-70">
              <View className="h-8 w-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <Trash2 size={18} color="#111827" />
              </View>
              <Text className="font-general text-gray-800">Trash</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
