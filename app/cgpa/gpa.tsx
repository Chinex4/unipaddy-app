// app/cgpa/gpa.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { classOfDegree, summarize } from "@/lib/cgpa/compute";
import { loadCurrentCourses } from "@/lib/cgpa/storage";
import { initCgpaDb, upsertSemesterWithCourses } from "@/lib/cgpa/db";
import { upsertSemesterSummary } from "@/lib/cgpa/storage";
import { ArrowLeft } from "lucide-react-native";

const YEAR_OPTIONS = Array.from({ length: 8 }).map((_, i) => i + 1);
const SEMESTERS: (1 | 2)[] = [1, 2];

export default function GpaScreen() {
  const router = useRouter();
  const { semesterId } = useLocalSearchParams<{ semesterId?: string }>(); // optional, if editing an existing semester

  const [rows, setRows] = useState<any[]>([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [semester, setSemester] = useState<1 | 2 | null>(null);

  useEffect(() => {
    (async () => {
      await initCgpaDb();
      const arr = await loadCurrentCourses();
      setRows(arr);
    })();
  }, []);

  const summary = useMemo(() => summarize(rows), [rows]);
  const klass = useMemo(() => classOfDegree(summary.gpa), [summary.gpa]);

  const doPersist = async () => {
    if (!year || !semester) return;
    const id = await upsertSemesterWithCourses(
      year,
      semester,
      summary.totalUnits,
      summary.totalPoints,
      summary.gpa,
      rows
    );

    await upsertSemesterSummary({
      semesterId: id,
      year,
      semester,
      totalUnits: summary.totalUnits,
      totalPoints: summary.totalPoints,
      gpa: summary.gpa,
    });

    setSaveOpen(false);
    router.replace("/cgpa/db-results");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center gap-2" onTouchEnd={() => router.back()}>
            <ArrowLeft />
        <Text className="text-2xl font-general-semibold text-gray-900">GPA Result (This Semester)</Text>
        </View>

        <View className="mt-5 rounded-2xl border border-gray-200 p-5">
          <Text className="font-general-medium text-gray-900">Totals</Text>
          <View className="mt-3 flex-row justify-between">
            <Text className="font-general text-gray-700">Total Courses</Text>
            <Text className="font-general-medium text-gray-900">{summary.totalCourses}</Text>
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="font-general text-gray-700">Total Units</Text>
            <Text className="font-general-medium text-gray-900">{summary.totalUnits}</Text>
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="font-general text-gray-700">Total Points</Text>
            <Text className="font-general-medium text-gray-900">{summary.totalPoints}</Text>
          </View>
          <View className="mt-4 p-4 bg-primary-base/5 rounded-xl">
            <Text className="font-general text-gray-700">GPA</Text>
            <Text className="text-2xl font-general-semibold text-gray-900">{summary.gpa.toFixed(2)}</Text>
            <Text className="mt-1 font-general text-gray-700">Class of Degree: {klass}</Text>
          </View>
        </View>

        <View className="mt-8 space-y-3">
          <Pressable
            onPress={() => setSaveOpen(true)}
            className="h-14 rounded-2xl bg-primary-base items-center justify-center"
          >
            <Text className="text-white font-general-semibold">Save to Database</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/cgpa/add-grades")}
            className="h-14 rounded-2xl bg-gray-100 items-center justify-center"
          >
            <Text className="text-gray-900 font-general-semibold">Back to Edit</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Save modal: choose Year + Semester */}
      <Modal visible={saveOpen} transparent animationType="fade" onRequestClose={() => setSaveOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setSaveOpen(false)}>
          <View className="mt-auto bg-white rounded-t-3xl p-5">
            <Text className="text-lg font-general-medium text-gray-900">Select Session</Text>

            <Text className="mt-4 mb-2 font-general text-gray-700">Year (100L → 800L)</Text>
            <View className="flex-row flex-wrap gap-2">
              {YEAR_OPTIONS.map((y) => (
                <Pressable
                  key={y}
                  onPress={() => setYear(y)}
                  className={`h-11 px-4 rounded-xl items-center justify-center ${year === y ? "bg-primary-base" : "bg-gray-100"}`}
                >
                  <Text className={`font-general-medium ${year === y ? "text-white" : "text-gray-900"}`}>
                    {y}00 Level
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="mt-5 mb-2 font-general text-gray-700">Semester</Text>
            <View className="flex-row gap-2">
              {SEMESTERS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSemester(s)}
                  className={`h-11 px-4 rounded-xl items-center justify-center ${semester === s ? "bg-primary-base" : "bg-gray-100"}`}
                >
                  <Text className={`font-general-medium ${semester === s ? "text-white" : "text-gray-900"}`}>
                    {s === 1 ? "First" : "Second"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={doPersist}
              disabled={!year || !semester}
              className="mt-6 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: !year || !semester ? "#94a3b8" : "#2563eb" }}
            >
              <Text className="text-white font-general-semibold">Save & Go to Database</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
