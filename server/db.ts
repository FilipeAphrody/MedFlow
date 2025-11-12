import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  patients,
  appointments,
  medicalRecords,
  students,
  teachers,
  attendance,
  studentReports,
  rooms,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PATIENT QUERIES ============

export async function getPatientById(patientId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPatientByCPF(cpf: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.cpf, cpf))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPatients() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(patients).orderBy(desc(patients.createdAt));
}

export async function createPatient(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(patients).values(data);
  return result;
}

export async function updatePatient(patientId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(patients)
    .set(data)
    .where(eq(patients.id, patientId));
}

// ============ APPOINTMENT QUERIES ============

export async function getAppointmentById(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAppointmentsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByDoctor(doctorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, startOfDay),
        lte(appointments.appointmentDate, endOfDay)
      )
    )
    .orderBy(appointments.appointmentDate);
}

export async function createAppointment(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(appointments).values(data);
}

export async function updateAppointment(appointmentId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(appointments)
    .set(data)
    .where(eq(appointments.id, appointmentId));
}

// ============ MEDICAL RECORD QUERIES ============

export async function getMedicalRecordsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId))
    .orderBy(desc(medicalRecords.createdAt));
}

export async function createMedicalRecord(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(medicalRecords).values(data);
}

// ============ STUDENT QUERIES ============

export async function getStudentByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentsBySupervisor(supervisorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(students)
    .where(eq(students.supervisorId, supervisorId))
    .orderBy(students.registration);
}

export async function createStudent(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(students).values(data);
}

// ============ TEACHER QUERIES ============

export async function getTeacherByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(teachers)
    .where(eq(teachers.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllTeachers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(teachers).orderBy(desc(teachers.createdAt));
}

export async function createTeacher(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(teachers).values(data);
}

// ============ ATTENDANCE QUERIES ============

export async function getAttendanceByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(attendance)
    .where(eq(attendance.studentId, studentId))
    .orderBy(desc(attendance.date));
}

export async function createAttendance(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(attendance).values(data);
}

export async function updateAttendance(attendanceId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(attendance)
    .set(data)
    .where(eq(attendance.id, attendanceId));
}

// ============ STUDENT REPORT QUERIES ============

export async function getStudentReportsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(studentReports)
    .where(eq(studentReports.studentId, studentId))
    .orderBy(desc(studentReports.reportDate));
}

export async function getStudentReportsBySupervisor(supervisorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(studentReports)
    .where(eq(studentReports.supervisorId, supervisorId))
    .orderBy(desc(studentReports.reportDate));
}

export async function createStudentReport(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(studentReports).values(data);
}

export async function updateStudentReport(reportId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(studentReports)
    .set(data)
    .where(eq(studentReports.id, reportId));
}

// ============ ROOM QUERIES ============

export async function getAllRooms() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(rooms)
    .where(eq(rooms.isActive, true))
    .orderBy(rooms.name);
}

export async function createRoom(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(rooms).values(data);
}

