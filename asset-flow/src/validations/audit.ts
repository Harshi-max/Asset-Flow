import { z } from "zod";

export const auditCreateSchema = z.object({
  title: z.string().min(2),

  departmentScope: z.string().optional().nullable(),

  locationScope: z.string().optional().nullable(),

  assignedAuditors: z.array(z.string()),

  status: z
    .enum([
      "PLANNED",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .optional(),
});

export const auditUpdateSchema =
  auditCreateSchema.partial();