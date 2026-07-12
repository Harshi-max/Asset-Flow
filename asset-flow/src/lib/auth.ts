import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string; role?: string };
}
