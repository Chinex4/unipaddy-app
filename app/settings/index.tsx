import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import SettingsRow from "@/components/settings/SettingsRow";
import { useRouter } from "expo-router";
import { Bell, Palette, LogOut, CircleUserRound, Info, MessageCircle } from "lucide-react-native";
import { useAppDispatch } from "@/store/hooks";
import { localLogout } from "@/redux/auth/auth.thunks";

export default function SettingsIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <View className="flex-1 bg-white">
      <GradientHeader
        title="Settings"
        center={
          <View className="items-center">
            <View className="h-28 w-28 rounded-full bg-primary-base/10 items-center justify-center border-4 border-white">
              <Image
                source={require("@/assets/images/unipaddy/memoji.png")}
                className="h-24 w-24"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-3 font-general-semibold text-xl text-gray-900">Travis Scott</Text>
            <Text className="font-general text-gray-500">travisscott@gmail.com</Text>
            <Pressable
              onPress={() => router.push("/settings/profile")}
              className="mt-4 px-6 py-3 rounded-2xl bg-primary-base"
            >
              <Text className="text-white font-general-semibold">Edit Profile</Text>
            </Pressable>
          </View>
        }
        subtitle=""
        height={160}
      />

      <ScrollView className="px-4 -mt-6">
        <Text className="text-gray-700 font-general mb-3">General</Text>

        <View className="gap-3">
          <SettingsRow
            icon={<CircleUserRound size={18} color="#111827" />}
            title="Account Information"
            onPress={() => router.push("/settings/account-info")}
          />
          <SettingsRow
            icon={<Palette size={18} color="#111827" />}
            title="Theme"
            onPress={() => router.push("/settings/theme")}
          />
          <SettingsRow
            icon={<Bell size={18} color="#111827" />}
            title="Notification"
            onPress={() => router.push("/settings/notifications")}
            right={<View className="h-6 w-12 rounded-full bg-primary-base/10 items-center justify-center"><Text className="text-[12px] text-primary-base font-general">On</Text></View>}
          />
          <SettingsRow
            icon={<MessageCircle size={18} color="#111827" />}
            title="Contact Support"
            onPress={() => router.push("/settings/faq")}
          />
          <SettingsRow
            icon={<Info size={18} color="#111827" />}
            title="Report an Issue"
            onPress={() => router.push("/settings/faq")}
          />
          <SettingsRow
            icon={<LogOut size={18} color="#EF4444" />}
            title="Logout"
            danger
            onPress={() => dispatch(localLogout())}
          />
        </View>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
