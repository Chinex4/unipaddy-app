// lib/cgpa/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CourseRow } from "./compute";

export const STORAGE_KEYS = {
  CURRENT_COURSES: "@cgpa/current-courses",
  SEMESTER_SUMMARIES: "@cgpa/semester-summaries", // array of {year, semester, totalUnits, totalPoints, gpa, semesterId}
} as const;

export async function loadCurrentCourses(): Promise<CourseRow[]> {
  const s = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_COURSES);
  return s ? JSON.parse(s) : [];
}
export async function saveCurrentCourses(rows: CourseRow[]) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.CURRENT_COURSES,
    JSON.stringify(rows)
  );
}

export type SemesterSummary = {
  semesterId: number; // sqlite id
  year: number; // 1..8
  semester: 1 | 2;
  totalUnits: number;
  totalPoints: number;
  gpa: number;
};

export async function upsertSemesterSummary(summary: SemesterSummary) {
  const s = await AsyncStorage.getItem(STORAGE_KEYS.SEMESTER_SUMMARIES);
  const arr: SemesterSummary[] = s ? JSON.parse(s) : [];
  const idx = arr.findIndex((x) => x.semesterId === summary.semesterId);
  if (idx >= 0) arr[idx] = summary;
  else arr.push(summary);
  await AsyncStorage.setItem(
    STORAGE_KEYS.SEMESTER_SUMMARIES,
    JSON.stringify(arr)
  );
}

export async function loadSemesterSummaries(): Promise<SemesterSummary[]> {
  const s = await AsyncStorage.getItem(STORAGE_KEYS.SEMESTER_SUMMARIES);
  return s ? JSON.parse(s) : [];
}
