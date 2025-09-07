// app/cgpa/db-results.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  getAllSemesters,
  getOverallCgpa,
  getSemesterCourses,
} from "@/lib/cgpa/db";
import { classOfDegree } from "@/lib/cgpa/compute";
import { useRouter } from "expo-router";
import { saveCurrentCourses } from "@/lib/cgpa/storage";
import { ArrowLeft, Pencil } from "lucide-react-native";

type Sem = {
  id: number;
  year: number;
  semester: 1 | 2;
  totalUnits: number;
  totalPoints: number;
  gpa: number;
};

export default function DbResults() {
  const router = useRouter();
  const [sems, setSems] = useState<Sem[]>([]);
  const [overall, setOverall] = useState<{
    tcu: number;
    tgp: number;
    cgpa: number;
  }>({ tcu: 0, tgp: 0, cgpa: 0 });

  useEffect(() => {
    (async () => {
      const all = await getAllSemesters();
      setSems(all as any);
      const o = await getOverallCgpa();
      setOverall(o);
    })();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<number, Sem[]> = {};
    for (const s of sems) {
      map[s.year] = map[s.year] || [];
      map[s.year].push(s);
    }
    return map;
  }, [sems]);

  const editSemester = async (semesterId: number) => {
    const courses = await getSemesterCourses(semesterId);
    await saveCurrentCourses(courses);
    router.push({
      pathname: "/cgpa/add-grades",
      params: { semesterId } as any,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="flex-row gap-2 items-center" onTouchEnd={() => router.back()}>
          <ArrowLeft className="" />
          <Text className="text-2xl font-general-semibold text-gray-900">
            Saved Results
          </Text>
        </View>

        <View className="mt-4 p-5 border border-gray-200 rounded-2xl">
          <Text className="font-general text-gray-700">
            Overall TCU: {overall.tcu} · Overall TGP: {overall.tgp}
          </Text>
          <Text className="mt-1 text-2xl font-general-semibold text-gray-900">
            Overall CGPA: {overall.cgpa.toFixed(2)}
          </Text>
          <Text className="mt-1 font-general text-gray-700">
            Class of Degree: {classOfDegree(overall.cgpa)}
          </Text>
        </View>

        {Array.from({ length: 8 }).map((_, i) => {
          const year = i + 1;
          const list = grouped[year] || [];
          const s1 = list.find((x) => x.semester === 1);
          const s2 = list.find((x) => x.semester === 2);

          return (
            <View
              key={year}
              className="mt-6 border border-gray-200 rounded-2xl p-5"
            >
              <Text className="text-lg font-general-medium text-gray-900">
                {year}00 Level
              </Text>

              {/* Semester rows */}
              <View className="mt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="font-general text-gray-700">Semester 1</Text>
                  {s1 ? (
                    <View className="flex-row items-center gap-4">
                      <Text className="font-general text-gray-700">
                        {s1.totalUnits} units · {s1.totalPoints} pts
                      </Text>
                      <Pressable
                        onPress={() => editSemester(s1.id)}
                        className="h-9 px-3 rounded-lg bg-primary-base/10 items-center justify-center flex-row gap-1"
                      >
                        <Pencil size={16} color="#2563eb" />
                        <Text className="text-primary-base font-general-medium">
                          Edit
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text className="font-general text-gray-400">No data</Text>
                  )}
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="font-general text-gray-700">Semester 2</Text>
                  {s2 ? (
                    <View className="flex-row items-center gap-4">
                      <Text className="font-general text-gray-700">
                        {s2.totalUnits} units · {s2.totalPoints} pts
                      </Text>
                      <Pressable
                        onPress={() => editSemester(s2.id)}
                        className="h-9 px-3 rounded-lg bg-primary-base/10 items-center justify-center flex-row gap-1"
                      >
                        <Pencil size={16} color="#2563eb" />
                        <Text className="text-primary-base font-general-medium">
                          Edit
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text className="font-general text-gray-400">No data</Text>
                  )}
                </View>
              </View>

              {/* Per-level CGPA */}
              {s1 || s2 ? (
                <View className="mt-4 p-4 bg-gray-50 rounded-xl">
                  {(() => {
                    const tcu = (s1?.totalUnits ?? 0) + (s2?.totalUnits ?? 0);
                    const tgp = (s1?.totalPoints ?? 0) + (s2?.totalPoints ?? 0);
                    const cgpa = tcu > 0 ? Number((tgp / tcu).toFixed(2)) : 0;
                    return (
                      <>
                        <Text className="font-general text-gray-700">
                          CGPA (this level): {cgpa.toFixed(2)}
                        </Text>
                      </>
                    );
                  })()}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
