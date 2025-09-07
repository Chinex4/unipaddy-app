// app/cgpa/edit-course.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { loadCurrentCourses, saveCurrentCourses } from "@/lib/cgpa/storage";
import {
  calcPoints,
  CourseRow,
  GradeLetter,
  GRADE_TO_POINT,
} from "@/lib/cgpa/compute";

const UNITS = Array.from({ length: 18 }).map((_, i) => i + 1);
const GRADES: GradeLetter[] = ["A", "B", "C", "D", "E", "F"];

export default function EditCourse() {
  const router = useRouter();
  const { index } = useLocalSearchParams<{ index: string }>();
  const idx = Number(index ?? -1);

  const [rows, setRows] = useState<CourseRow[]>([]);
  const [code, setCode] = useState("");
  const [units, setUnits] = useState<number>(0);
  const [grade, setGrade] = useState<GradeLetter>("F");

  const [unitsOpen, setUnitsOpen] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const arr = await loadCurrentCourses();
      setRows(arr);
      // If new row (idx === -1) append later; otherwise hydrate fields
      if (idx >= 0 && arr[idx]) {
        setCode(arr[idx].code);
        setUnits(arr[idx].units);
        setGrade(arr[idx].grade);
      }
    })();
  }, [idx]);

  const points = useMemo(() => calcPoints(units || 0, grade), [units, grade]);

  const save = async () => {
    let n = [...rows];
    if (idx >= 0 && n[idx]) {
      n[idx] = { ...n[idx], code: code.trim(), units, grade, points };
    } else {
      // if opened via FAB directly (safety)
      n.push({
        id: Math.random().toString(36).slice(2),
        code: code.trim(),
        units,
        grade,
        points,
      });
    }
    await saveCurrentCourses(n);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="px-5 pt-5">
        <View
          className="flex-row gap-2 items-center"
          onTouchEnd={() => router.back()}
        >
          <ArrowLeft />
          <View>
            <Text className="text-2xl font-general-semibold text-gray-900">
              Edit Course
            </Text>
            <Text className="text-gray-500 font-general">
              Fill in the details below
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 mt-6 space-y-5">
        {/* Course Code */}
        <View>
          <Text className="mb-2 text-gray-700 font-general">Course Code</Text>
          <TextInput
            placeholder="e.g. CHM101"
            value={code}
            onChangeText={setCode}
            className="h-14 px-4 bg-gray-100 rounded-xl font-general text-gray-900"
            autoCapitalize="characters"
          />
        </View>

        {/* Units */}
        <View>
          <Text className="mb-2 text-gray-700 font-general">Units</Text>
          <Pressable
            onPress={() => setUnitsOpen(true)}
            className="h-14 px-4 bg-gray-100 rounded-xl justify-center"
          >
            <Text className="font-general text-gray-900">
              {units || "Select units (1-18)"}
            </Text>
          </Pressable>
        </View>

        {/* Grade */}
        <View>
          <Text className="mb-2 text-gray-700 font-general">Grade</Text>
          <Pressable
            onPress={() => setGradesOpen(true)}
            className="h-14 px-4 bg-gray-100 rounded-xl justify-center"
          >
            <Text className="font-general text-gray-900">
              {grade || "Select grade (A-F)"}
            </Text>
          </Pressable>
        </View>

        {/* Points */}
        <View className="mt-2 p-4 bg-primary-base/5 rounded-xl">
          <Text className="font-general text-gray-700">
            Grade value: {GRADE_TO_POINT[grade]} · Units: {units || 0}
          </Text>
          <Text className="mt-1 font-general-medium text-gray-900">
            Points: {points}
          </Text>
        </View>
      </View>

      <View className="absolute left-5 right-5 bottom-12">
        <Pressable
          onPress={save}
          disabled={!code.trim() || !units}
          className="h-14 rounded-2xl items-center justify-center"
          style={{
            backgroundColor: !code.trim() || !units ? "#94a3b8" : "#2563eb",
          }}
        >
          <Text className="text-white font-general-semibold text-base">
            Save
          </Text>
        </Pressable>
      </View>

      {/* Units Modal */}
      <Modal
        visible={unitsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setUnitsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setUnitsOpen(false)}
        >
          <View className="mt-auto bg-white rounded-t-3xl p-5">
            <Text className="text-lg font-general-medium text-gray-900 mb-3">
              Select Units
            </Text>
            <FlatList
              data={UNITS}
              numColumns={6}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 12,
              }}
              keyExtractor={(i) => String(i)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setUnits(item);
                    setUnitsOpen(false);
                  }}
                  className="h-10 w-10 rounded-xl bg-gray-100 items-center justify-center"
                >
                  <Text className="font-general text-gray-900">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Grades Modal */}
      <Modal
        visible={gradesOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setGradesOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setGradesOpen(false)}
        >
          <View className="mt-auto bg-white rounded-t-3xl p-5">
            <Text className="text-lg font-general-medium text-gray-900 mb-3">
              Select Grade
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {GRADES.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => {
                    setGrade(g);
                    setGradesOpen(false);
                  }}
                  className="h-12 w-[18%] rounded-xl bg-gray-100 items-center justify-center"
                >
                  <Text className="font-general-medium text-gray-900">{g}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
