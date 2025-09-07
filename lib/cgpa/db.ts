// lib/cgpa/db.ts
import * as SQLite from "expo-sqlite";
import { CourseRow } from "./compute";

const db = SQLite.openDatabaseSync("unipaddy_cgpa.db");

export async function initCgpaDb() {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS semesters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,           -- 1..8
      semester INTEGER NOT NULL,       -- 1 or 2
      totalUnits INTEGER NOT NULL,
      totalPoints INTEGER NOT NULL,
      gpa REAL NOT NULL,
      UNIQUE(year, semester)
    );

    CREATE TABLE IF NOT EXISTS semester_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      semester_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      units INTEGER NOT NULL,
      grade TEXT NOT NULL,
      points INTEGER NOT NULL,
      FOREIGN KEY(semester_id) REFERENCES semesters(id) ON DELETE CASCADE
    );
  `);
}

export type SemesterRecord = {
  id: number;
  year: number;
  semester: 1 | 2;
  totalUnits: number;
  totalPoints: number;
  gpa: number;
};

export async function upsertSemesterWithCourses(
  year: number,
  semester: 1 | 2,
  totalUnits: number,
  totalPoints: number,
  gpa: number,
  courses: CourseRow[]
): Promise<number> {
  // Check if (year, semester) exists
  const existing = await db.getFirstAsync<SemesterRecord>(
    "SELECT * FROM semesters WHERE year=? AND semester=?",
    [year, semester]
  );

  let sid: number;
  if (existing) {
    sid = existing.id;
    await db.runAsync(
      "UPDATE semesters SET totalUnits=?, totalPoints=?, gpa=? WHERE id=?",
      [totalUnits, totalPoints, gpa, sid]
    );
    await db.runAsync("DELETE FROM semester_courses WHERE semester_id=?", [
      sid,
    ]);
  } else {
    const res = await db.runAsync(
      "INSERT INTO semesters (year, semester, totalUnits, totalPoints, gpa) VALUES (?, ?, ?, ?, ?)",
      [year, semester, totalUnits, totalPoints, gpa]
    );
    sid = Number(res.lastInsertRowId);
  }

  // Bulk insert courses
  for (const c of courses) {
    await db.runAsync(
      "INSERT INTO semester_courses (semester_id, code, units, grade, points) VALUES (?, ?, ?, ?, ?)",
      [sid, c.code, c.units, c.grade, c.points]
    );
  }
  return sid;
}

export async function getAllSemesters(): Promise<SemesterRecord[]> {
  return await db.getAllAsync<SemesterRecord>(
    "SELECT * FROM semesters ORDER BY year ASC, semester ASC"
  );
}

export async function getSemesterCourses(
  semesterId: number
): Promise<CourseRow[]> {
  const rows = await db.getAllAsync<any>(
    "SELECT code, units, grade, points FROM semester_courses WHERE semester_id=?",
    [semesterId]
  );
  return rows.map((r, i) => ({
    id: `db-${semesterId}-${i}`,
    code: r.code,
    units: r.units,
    grade: r.grade,
    points: r.points,
  }));
}

export async function getOverallCgpa(): Promise<{
  tcu: number;
  tgp: number;
  cgpa: number;
}> {
  const row = await db.getFirstAsync<any>(
    "SELECT SUM(totalUnits) as tcu, SUM(totalPoints) as tgp FROM semesters"
  );
  const tcu = row?.tcu ?? 0;
  const tgp = row?.tgp ?? 0;
  const cgpa = tcu > 0 ? Number((tgp / tcu).toFixed(2)) : 0;
  return { tcu, tgp, cgpa };
}
