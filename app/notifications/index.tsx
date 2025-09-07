import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  MoreVertical,
  Search as SearchIcon,
  ChevronRight,
  CheckCircle2,
  Trash2,
} from "lucide-react-native";
import { Notice, noticesSeed } from "@/types/notifications";

export default function NotificationsIndex() {
  const router = useRouter();

  // local list so we can mark-read / clear
  const [items, setItems] = useState<Notice[]>(noticesSeed);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo<Notice[]>(
    () =>
      items.filter(
        (n) =>
          n.title.toLowerCase().includes(q.toLowerCase()) ||
          n.body.toLowerCase().includes(q.toLowerCase())
      ),
    [items, q]
  );

  const handleOpen = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    router.push(`/notifications/${id}`); // omit route group
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setMenuOpen(false);
  };

  const clearAll = () => {
    setItems([]);
    setMenuOpen(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: fetch from Laravel API
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <ArrowLeft size={20} color="#111827" />
          </Pressable>

          <Text className="font-general-semibold text-2xl text-gray-900">
            Notifications
          </Text>

          <Pressable
            onPress={() => setMenuOpen((s) => !s)}
            className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <MoreVertical size={18} color="#111827" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="mt-4 h-12 rounded-full bg-gray-100/70 flex-row items-center px-4">
          <SearchIcon size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={q}
            onChangeText={setQ}
            className="flex-1 ml-2 font-general text-gray-700"
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-gray-200/70 mx-5" />
        )}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleOpen(item.id)} className="px-5 py-4">
            <View className="flex-row items-start">
              {/* unread dot */}
              <View className="mt-1 mr-3">
                {!item.read ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-primary-base" />
                ) : (
                  <View className="h-2.5 w-2.5 rounded-full bg-transparent" />
                )}
              </View>

              <View className="flex-1 pr-3">
                <Text
                  className={`font-general text-[18px] text-gray-900 ${!item.read ? "font-general-medium" : ""}`}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  className="font-general text-sm text-gray-500 mt-1"
                >
                  {item.body}
                </Text>
              </View>

              <View className="items-end">
                <Text className="font-general text-xs text-gray-400 mb-2">
                  {item.time}
                </Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </View>
          </Pressable>
        )}
        // Empty-state
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center px-6 py-16">
            <View className="h-12 w-12 rounded-full bg-gray-100 items-center justify-center mb-3">
              <SearchIcon size={20} color="#9CA3AF" />
            </View>
            <Text className="font-general text-base text-gray-900">
              No results
            </Text>
            <Text className="font-general text-sm text-gray-500 text-center mt-1">
              {q
                ? `We couldn't find any notifications matching “${q}”.`
                : "No notifications found."}
            </Text>

            {q.length > 0 && (
              <Pressable
                onPress={() => setQ("")}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-base"
              >
                <Text className="font-general text-white">Clear search</Text>
              </Pressable>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Popover menu */}
      {menuOpen && (
        <>
          <Pressable
            className="absolute inset-0"
            onPress={() => setMenuOpen(false)}
          />
          <View className="absolute right-5 top-[92px] w-48 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            <Pressable
              onPress={markAllRead}
              className="flex-row items-center px-4 py-3 active:opacity-70"
            >
              <View className="h-8 w-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <CheckCircle2 size={18} color="#111827" />
              </View>
              <Text className="font-general text-gray-800">
                Mark all as read
              </Text>
            </Pressable>

            <View className="h-[1px] bg-gray-100" />

            <Pressable
              onPress={clearAll}
              className="flex-row items-center px-4 py-3 active:opacity-70"
            >
              <View className="h-8 w-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <Trash2 size={18} color="#111827" />
              </View>
              <Text className="font-general text-gray-800">Clear all</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
