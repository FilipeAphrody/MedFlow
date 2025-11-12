import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PATIENT ROUTES ============
  patients: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllPatients();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const patient = await db.getPatientById(input.id);
        if (!patient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found",
          });
        }
        return patient;
      }),

    getByCPF: protectedProcedure
      .input(z.object({ cpf: z.string() }))
      .query(async ({ input }) => {
        return await db.getPatientByCPF(input.cpf);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          cpf: z.string(),
          dateOfBirth: z.date(),
          phone: z.string().optional(),
          email: z.string().email().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          studentRegistration: z.string().optional(),
          medicalHistory: z.string().optional(),
          allergies: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if patient already exists
        const existing = await db.getPatientByCPF(input.cpf);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Patient with this CPF already exists",
          });
        }

        return await db.createPatient(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          medicalHistory: z.string().optional(),
          allergies: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updatePatient(id, data);
      }),
  }),

  // ============ APPOINTMENT ROUTES ============
  appointments: router({
    getByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByPatient(input.patientId);
      }),

    getByDoctor: protectedProcedure
      .input(z.object({ doctorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByDoctor(input.doctorId);
      }),

    getByDate: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByDate(input.date);
      }),

    create: protectedProcedure
      .input(
        z.object({
          patientId: z.number(),
          doctorId: z.number().optional(),
          studentId: z.number().optional(),
          roomId: z.number().optional(),
          appointmentDate: z.date(),
          duration: z.number().default(30),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createAppointment({
          ...input,
          status: "scheduled",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["scheduled", "completed", "cancelled", "no-show"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateAppointment(id, data);
      }),
  }),

  // ============ MEDICAL RECORD ROUTES ============
  medicalRecords: router({
    getByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMedicalRecordsByPatient(input.patientId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number(),
          patientId: z.number(),
          doctorId: z.number().optional(),
          studentId: z.number().optional(),
          complaint: z.string().optional(),
          diagnosis: z.string().optional(),
          treatment: z.string().optional(),
          prescription: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createMedicalRecord(input);
      }),
  }),

  // ============ STUDENT ROUTES ============
  students: router({
    getByUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentByUserId(input.userId);
      }),

    getBySupervisor: protectedProcedure
      .input(z.object({ supervisorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentsBySupervisor(input.supervisorId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          registration: z.string(),
          course: z.string(),
          semester: z.number(),
          supervisorId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createStudent({
          ...input,
          status: "active",
        });
      }),
  }),

  // ============ TEACHER ROUTES ============
  teachers: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllTeachers();
    }),

    getByUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTeacherByUserId(input.userId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          specialization: z.string(),
          licenseNumber: z.string().optional(),
          department: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createTeacher(input);
      }),
  }),

  // ============ ATTENDANCE ROUTES ============
  attendance: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAttendanceByStudent(input.studentId);
      }),

    checkIn: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .mutation(async ({ input }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await db.createAttendance({
          studentId: input.studentId,
          date: today,
          checkInTime: new Date(),
          status: "present",
        });
      }),

    checkOut: protectedProcedure
      .input(z.object({ attendanceId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.updateAttendance(input.attendanceId, {
          checkOutTime: new Date(),
        });
      }),
  }),

  // ============ STUDENT REPORT ROUTES ============
  studentReports: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentReportsByStudent(input.studentId);
      }),

    getBySupervisor: protectedProcedure
      .input(z.object({ supervisorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentReportsBySupervisor(input.supervisorId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          studentId: z.number(),
          supervisorId: z.number(),
          reportDate: z.date(),
          title: z.string(),
          content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createStudentReport({
          ...input,
          status: "submitted",
        });
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          reportId: z.number(),
          status: z.enum(["submitted", "approved", "rejected", "revision_requested"]),
          feedback: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { reportId, ...data } = input;
        return await db.updateStudentReport(reportId, data);
      }),
  }),

  // ============ ROOM ROUTES ============
  rooms: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllRooms();
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          capacity: z.number().default(1),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createRoom({
          ...input,
          isActive: true,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;

