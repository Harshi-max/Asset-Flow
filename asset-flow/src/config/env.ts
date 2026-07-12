import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_NAME: z.string().default("AssetFlow"),
  UPLOAD_PATH: z.string().default("./storage/uploads"),
});

export const env = envSchema.parse(process.env);
