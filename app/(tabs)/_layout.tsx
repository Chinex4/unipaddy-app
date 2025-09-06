import React from "react";
import { Tabs } from "expo-router";
import {
  Home as HomeIcon,
  Receipt,
  CalendarCheck2,
  GraduationCap,
  Megaphone,
  UserRound,
} from "lucide-react-native";

const PRIMARY = "#2563eb"; // text-primary-base
const INACTIVE = "#9CA3AF"; // gray-400

function TabIcon({
  color,
  focused,
  size,
  type,
}: {
  color: string;
  focused: boolean;
  size: number;
  type: "home" | "dues" | "attendance" | "cgpa" | "updates" | "profile";
}) {
  const Icon =
    type === "home" ? HomeIcon :
    type === "dues" ? Receipt :
    type === "attendance" ? CalendarCheck2 :
    type === "cgpa" ? GraduationCap :
    type === "updates" ? Megaphone :
    UserRound;

  return <Icon size={size} color={focused ? PRIMARY : color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index" // 👈 ensures Home (index.tsx) is the default
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          height: 64,
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "white",
        },
        tabBarLabelStyle: {
          fontFamily: "GeneralSans-Regular",
          fontSize: 12,
        },
      }}
    >
      {/* HOME: app/(tabs)/index.tsx */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (p) => <TabIcon {...p} type="home" />,
        }}
      />

      {/* DUES: app/(tabs)/dues/index.tsx */}
      <Tabs.Screen
        name="dues/index"
        options={{
          title: "Dues",
          tabBarIcon: (p) => <TabIcon {...p} type="dues" />,
        }}
      />

      {/* ATTENDANCE: app/(tabs)/attendance/index.tsx */}
      <Tabs.Screen
        name="attendance/index"
        options={{
          title: "Attendance",
          tabBarIcon: (p) => <TabIcon {...p} type="attendance" />,
        }}
      />

      {/* CGPA: app/(tabs)/cgpa/index.tsx */}
      <Tabs.Screen
        name="cgpa/index"
        options={{
          title: "CGPA",
          tabBarIcon: (p) => <TabIcon {...p} type="cgpa" />,
        }}
      />

      {/* UPDATES: app/(tabs)/updates/index.tsx */}
      <Tabs.Screen
        name="updates/index"
        options={{
          title: "Updates",
          tabBarIcon: (p) => <TabIcon {...p} type="updates" />,
        }}
      />

      {/* OPTIONAL PROFILE TAB: app/(tabs)/profile/index.tsx */}
      {/* You can remove this if you want only 5 tabs */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: (p) => <TabIcon {...p} type="profile" />,
        }}
      />
    </Tabs>
  );
}
