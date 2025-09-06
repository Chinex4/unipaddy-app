import React from "react";
import { View, Text, Pressable } from "react-native";
import { Activity } from "@/types/home";

export default function ActivityItem({
  activity,
  onPress,
  showDivider = true,
}: {
  activity: Activity;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  const initials = activity.badge.toUpperCase();
  const amountColor =
    activity.amount == null ? "text-gray-500" : activity.amount < 0 ? "text-red-500" : "text-emerald-600";

  const statusColor =
    activity.status === "Successful"
      ? "text-emerald-600"
      : activity.status === "Failed"
      ? "text-red-500"
      : "text-gray-500";

  return (
    <Pressable onPress={onPress} className="bg-[#F7F7F8] rounded-2xl px-4 py-3 mb-3">
      <View className="flex-row items-center">
        <View className="h-10 w-10 rounded-full bg-gray-200 items-center justify-center mr-3">
          <Text className="font-general font-semibold text-gray-700">{initials}</Text>
        </View>

        <View className="flex-1">
          <Text className="font-general-medium text-base text-gray-900">{activity.title}</Text>
          <Text className="font-general text-xs text-gray-500 mt-0.5">{activity.subtitle}</Text>
        </View>

        <View className="items-end">
          {activity.amount != null ? (
            <Text className={`font-general text-base ${amountColor}`}>
              {activity.amount < 0 ? "" : "+"}
              {activity.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          ) : (
            <Text className={`font-general text-base ${statusColor}`}>{activity.status}</Text>
          )}
          <Text className="font-general text-[11px] text-gray-400 mt-0.5">{activity.meta}</Text>
        </View>
      </View>

      {showDivider && <View className="h-[1px] bg-gray-200 mt-3 -mb-2" />}
    </Pressable>
  );
}
