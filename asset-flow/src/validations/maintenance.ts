import { z } from "zod";

export const maintenanceCreateSchema = z.object({
  assetId: z.string().min(1),
  requestedById: z.string().min(1),
  technicianId: z.string().optional().nullable(),

  issue: z.string().min(5),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),

  attachments: z.array(z.string()).optional(),

  approvalStatus: z
    .enum(["PENDING", "APPROVED", "REJECTED"])
    .optional(),

  status: z
    .enum([
      "REQUESTED",
      "APPROVED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
    ])
    .optional(),

  resolutionNotes: z.string().optional().nullable(),
});

export const maintenanceUpdateSchema =
  maintenanceCreateSchema.partial();