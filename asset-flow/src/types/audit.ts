export type AuditStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type AssetVerificationStatus =
  | "VERIFIED"
  | "MISSING"
  | "DAMAGED";

export interface Audit {
  id: string;

  title: string;

  departmentScope?: string;

  locationScope?: string;

  assignedAuditors: string[];

  status: AuditStatus;

  createdAt: string;

  updatedAt: string;
}

export interface AuditItem {
  assetId: string;

  verificationStatus: AssetVerificationStatus;

  remarks?: string;
}