import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  role: z.string().nullable(),
});

export const adviseeSchema = z.object({
  id: z.string(),
  adviserId: z.string(),
  studentId: z.string(),
  status: z.enum(["PENDING", "ACTIVE", "INACTIVE"]),
  createdAt: z.string().transform((val) => new Date(val)),
  student: userSchema,
  adviser: userSchema,
});

export type Advisee = z.infer<typeof adviseeSchema>;
