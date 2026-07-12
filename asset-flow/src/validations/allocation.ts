import { z } from "zod";

export const allocationCreateSchema = z.object({
  assetId: z.string().min(1),
  holderId: z.string().min(1),
  departmentId: z.string().optional().nullable(),
  expectedReturn: z.string().optional().nullable(),
});

export const transferRequestSchema = z.object({
  assetId: z.string().min(1),
  toDeptId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  requestedById: z.string().min(1),
  fromDeptId: z.string().optional().nullable(),
});
