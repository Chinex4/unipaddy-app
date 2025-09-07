import React, { useEffect, useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Triple = { push: boolean; email: boolean; sms: boolean };
type GroupKey = "system" | "marketing" | "reminder";

export default function NotificationsScreen() {
  const [prefs, setPrefs] = useState<Record<GroupKey, Triple>>({
    system: { push: true, email: false, sms: false },
    marketing: { push: true, email: false, sms: false },
    reminder: { push: true, email: false, sms: true },
  });

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("up_notify_prefs");
      if (saved) setPrefs(JSON.parse(saved));
    })();
  }, []);

  const toggle = (group: GroupKey, key: keyof Triple) => {
    const next = { ...prefs, [group]: { ...prefs[group], [key]: !prefs[group][key] } };
    setPrefs(next);
    AsyncStorage.setItem("up_notify_prefs", JSON.stringify(next));
  };

  const Block = ({ title, group, desc }: { title: string; group: GroupKey; desc: string }) => (
    <View className="bg-gray-50 rounded-2xl p-4 mb-6">
      <Text className="font-general-semibold text-[17px] text-gray-900 mb-1">{title}</Text>
      <Text className="font-general text-gray-500 mb-4">{desc}</Text>

      {(["push", "email", "sms"] as (keyof Triple)[]).map((k) => (
        <View key={k} className="flex-row items-center justify-between py-3">
          <Text className="font-general text-gray-800 capitalize">{k}</Text>
          <Switch
            value={prefs[group][k]}
            onValueChange={() => toggle(group, k)}
            trackColor={{ false: "#E5E7EB", true: "#BFDBFE" }}
            thumbColor={prefs[group][k] ? "#2563EB" : "#9CA3AF"}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <GradientHeader title="Notification" height={100} />
      <ScrollView className="px-4 -mt-10">
        <Block
          title="System Notifications"
          group="system"
          desc="Receive notifications about latest news & system updates from us."
        />
        <Block
          title="Marketing Notifications"
          group="marketing"
          desc="Receive notifications with personalized offers and information about promotions."
        />
        <Block
          title="Reminder Notifications"
          group="reminder"
          desc="Receive reminders about dues, classes, and deadlines."
        />
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
