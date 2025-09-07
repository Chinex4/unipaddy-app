// app/cgpa/index.tsx
import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Database, FilePlus2 } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { initCgpaDb } from "@/lib/cgpa/db";

export default function CgpaIndex() {
  const router = useRouter();

  useEffect(() => {
    // Ensure DB exists before any navigation
    initCgpaDb();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-4">
        <View
          className="flex-row gap-2 items-center mb-1"
          onTouchEnd={() => router.back()}
        >
          <ArrowLeft className="" />
          <View>
            <Text className="text-2xl font-general-semibold text-gray-900">
              CGPA
            </Text>
            <Text className="text-gray-500 mt-1 font-general">
              Calculate GPA & Save to Database
            </Text>
          </View>
        </View>

        <View className="mt-10 space-y-4">
          <Pressable
            onPress={() => router.push("/cgpa/add-grades")}
            className="rounded-2xl border border-gray-200 p-5 flex-row items-center gap-4"
          >
            <View className="h-12 w-12 rounded-xl bg-primary-base/10 items-center justify-center">
              <FilePlus2 color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-general-medium text-gray-900">
                Add Grades
              </Text>
              <Text className="text-gray-500 font-general">
                Enter courses, units & grades
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/cgpa/db-results")}
            className="rounded-2xl border border-gray-200 p-5 flex-row items-center gap-4"
          >
            <View className="h-12 w-12 rounded-xl bg-primary-base/10 items-center justify-center">
              <Database color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-general-medium text-gray-900">
                Visit Database
              </Text>
              <Text className="text-gray-500 font-general">
                See saved semesters & overall CGPA
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
