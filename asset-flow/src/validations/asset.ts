import { z } from "zod";

export const assetCreateSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  tag: z.string().min(1),
  qrCode: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  purchaseCost: z.number().optional().nullable(),
  condition: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  sharedResource: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

export const assetUpdateSchema = assetCreateSchema.partial();
