export type Role = "ADMIN" | "MANAGER" | "USER";
export type Status = "ACTIVE" | "PENDING" | "ARCHIVED";

export interface UserRecord {
  id: string;
  name?: string | null;
  email: string;
  role?: Role;
}
