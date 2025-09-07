// app/cgpa/add-grades.tsx
import FAB from "@/components/FAB";
import { CourseRow, summarize } from "@/lib/cgpa/compute";
import { loadCurrentCourses, saveCurrentCourses } from "@/lib/cgpa/storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Calculator, PencilLine } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import GradientButton from "@/components/ui/GradientButton";

export default function AddGrades() {
  const router = useRouter();
  const { semesterId } = useLocalSearchParams<{ semesterId?: string }>(); // optional if coming from DB edit
  const [rows, setRows] = useState<CourseRow[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await loadCurrentCourses();
      if (loaded.length) {
        setRows(loaded);
      } else {
        // start with 3 empty placeholders
        const seed: CourseRow[] = Array.from({ length: 3 }).map((_, i) => ({
          id: Crypto.randomUUID(),
          code: "",
          units: 0,
          grade: "F" as CourseRow["grade"],
          points: 0,
        }));
        setRows(seed);
        await saveCurrentCourses(seed);
      }
    })();
  }, []);

  const { totalUnits, totalPoints, gpa } = useMemo(
    () => summarize(rows),
    [rows]
  );

  const openEdit = (index?: number) => {
    router.push({
      pathname: "/cgpa/edit-course",
      params: { index: index ?? -1 },
    });
  };

  const addRow = async () => {
    const n = [
      ...rows,
      {
        id: Crypto.randomUUID(),
        code: "",
        units: 0,
        grade: "F" as CourseRow["grade"],
        points: 0,
      },
    ];
    setRows(n);
    await saveCurrentCourses(n);
    openEdit(n.length - 1);
  };

  const goCalculate = () => {
    router.push({
      pathname: "/cgpa/gpa",
      params: { semesterId: semesterId ?? "" },
    });
  };

  const renderItem = ({ item, index }: { item: CourseRow; index: number }) => {
    return (
      <Pressable
        onPress={() => openEdit(index)}
        className="mb-3 bg-white border border-gray-200 rounded-2xl p-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 font-general-medium text-base">
              {item.code || "Tap to edit"}
            </Text>
            <Text className="text-gray-500 font-general mt-1">
              Units: {item.units || "-"} · Grade: {item.grade || "-"} · Points:{" "}
              {item.points || 0}
            </Text>
          </View>
          <View className="h-10 w-10 rounded-xl bg-primary-base/10 items-center justify-center">
            <PencilLine color="#2563eb" />
          </View>
        </View>
      </Pressable>
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const latest = await loadCurrentCourses();
        if (isActive) setRows(latest);
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="px-5 pt-4 pb-2">
        <View
          className="flex-row gap-2 items-center mb-1"
          onTouchEnd={() => router.back()}
        >
          <ArrowLeft className="" />
          <View>
            <Text className="text-2xl font-general-semibold text-gray-900">
              Add Grades
            </Text>
            <Text className="text-gray-500 font-general">
              Add or edit your course grades
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
          paddingTop: 8,
        }}
        data={rows}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />

      <FAB onPress={addRow} />

      <View className="absolute bottom-14 left-5 right-5">
        <View className="mb-3 flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <Text className="font-general text-gray-700">
            Units: {totalUnits} | Points: {totalPoints}
          </Text>
          <Text className="font-general-medium text-gray-900">
            GPA (preview): {gpa.toFixed(2)}
          </Text>
        </View>
        <Pressable
          onPress={goCalculate}
          className="h-14 rounded-2xl bg-primary-base items-center justify-center"
        >
          <View className="flex-row items-center gap-2">
            <Calculator color="#fff" />
            <Text className="text-white font-general-semibold text-base">
              Calculate
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
