import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import HomeHeader from "@/components/home/HomeHeader";
import QuickActionsGrid from "@/components/home/QuickActionsGrid";
import SectionHeader from "@/components/home/SectionHeader";
import UpdateCard from "@/components/home/UpdateCard";
import ActivityItem from "@/components/home/ActivityItem";
import { campusUpdates, quickActions, recentActivities } from "@/types/home";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      {/* Top Greeting & Avatars */}
      <HomeHeader
        greeting="Good Morning! 👋"
        name="Confidence Izu"
        onBellPress={() => router.push("/(notifications)")}
        onAvatarPress={() => router.push("/(profile)")}
      />

      {/* Quick Actions */}
      <View className="px-5 mt-3">
        <QuickActionsGrid
          data={quickActions}
          onItemPress={(item) => {
            if (item.route) router.push(item.route as any);
          }}
        />
      </View>

      {/* Campus Updates */}
      <View className="mt-6">
        <SectionHeader
          title="Campus Updates"
          onPress={() => router.push("/(updates)")}
          actionText="View All"
          className="px-5"
        />
        <View className="mt-3">
          <FlatList
            horizontal
            data={campusUpdates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UpdateCard
                update={item}
                onPress={() => router.push(`/updates/${item.id}`)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            // optional: smoother horizontal feel
            snapToAlignment="start"
            decelerationRate="fast"
          />
        </View>
      </View>

      {/* Recent Activities */}
      <View className="mt-6">
        <SectionHeader
          title="Recent Activities"
          onPress={() => router.push("/(activities)/activities")}
          actionText="View All"
          className="px-5"
        />
        <View className="mt-3 px-5">
          {recentActivities.map((a, idx) => (
            <ActivityItem
              key={a.id}
              activity={a}
              showDivider={idx !== recentActivities.length - 1}
              onPress={() => {
                if (a.title.toLowerCase().includes("dues")) {
                  router.push(`/(receipt)/${a.id}`);
                }
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
