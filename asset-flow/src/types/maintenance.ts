export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MaintenanceStatus =
  | "REQUESTED"
  | "APPROVED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  requestedById: string;
  technicianId?: string;

  issue: string;

  priority: MaintenancePriority;

  status: MaintenanceStatus;

  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";

  attachments: string[];

  resolutionNotes?: string;

  createdAt: string;

  updatedAt: string;
}