import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("AssetFlow"),
  UPLOAD_PATH: z.string().default("/tmp/uploads"),
});

export const env = envSchema.parse(process.env);
