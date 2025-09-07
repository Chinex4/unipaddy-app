// lib/cgpa/compute.ts
export type GradeLetter = "A" | "B" | "C" | "D" | "E" | "F";

export const GRADE_TO_POINT: Record<GradeLetter, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export type CourseRow = {
  id: string;           // uuid
  code: string;         // e.g. "CHM101"
  units: number;        // 1..18
  grade: GradeLetter;   // A..F
  points: number;       // units * gradeValue
};

export const calcPoints = (units: number, grade: GradeLetter) =>
  units * GRADE_TO_POINT[grade];

export const summarize = (rows: CourseRow[]) => {
  const totalCourses = rows.length;
  const totalUnits = rows.reduce((a, r) => a + (r.units || 0), 0);
  const totalPoints = rows.reduce((a, r) => a + (r.points || 0), 0);
  const gpa = totalUnits > 0 ? Number((totalPoints / totalUnits).toFixed(2)) : 0;
  return { totalCourses, totalUnits, totalPoints, gpa };
};

export const classOfDegree = (gpa: number) => {
  if (gpa >= 4.5) return "First Class";
  if (gpa >= 3.5) return "2nd Class Upper";
  if (gpa >= 2.4) return "2nd Class Lower";
  if (gpa >= 1.5) return "3rd Class";
  if (gpa >= 1.0) return "Pass";
  return "Fail";
};
