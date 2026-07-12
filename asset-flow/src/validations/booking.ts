import { z } from "zod";

export const bookingCreateSchema = z.object({
  title: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string().optional().nullable(),
  startAt: z.string(),
  endAt: z.string(),
  organizerId: z.string().optional().nullable(),
});
