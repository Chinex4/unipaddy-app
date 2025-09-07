import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import ActivityItem from "@/components/home/ActivityItem";
import { recentActivities, Activity } from "@/types/home";
import { ArrowLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function ActivitiesScreen() {
  const router = useRouter();

  // Example: longer list for demo; replace with API later
  const data = useMemo<Activity[]>(
    () => [
      ...recentActivities,
      ...Array.from({ length: 16 }).map((_, i) => ({
        id: `ax-${i}`,
        badge: "AS",
        title: "Attendance Sheet",
        subtitle: "Today",
        status: "Successful" as const,
        amount: null,
        meta: "Today",
      })),
    ],
    []
  );

  return (
    <View className="flex-1 bg-white pt-16">
      <StatusBar style="dark" />
      <View className="px-5 pt-6 pb-3">
        {/* Back Icon */}

        <View className="flex-row items-center gap-4 mb-2">
        <View>
          <ArrowLeft size={24} color="#111827" onPress={() => router.back()} />
        </View>
          <Text className="font-general-semibold text-2xl text-gray-900">Recent Activities</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            showDivider={false}
            onPress={() => {
              // Open receipt only for dues payment (debit txns). Adjust to your logic.
              if (item.title.toLowerCase().includes("dues")) {
                router.push(`/(receipt)/${item.id}`);
              }
            }}
          />
        )}
      />
    </View>
  );
}
