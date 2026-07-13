export const ROLE_VALUES = ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"] as const;

export type AppRole = (typeof ROLE_VALUES)[number];

export function hasAnyRole(role: string | undefined, allowedRoles: AppRole[]) {
  return allowedRoles.includes((role as AppRole) ?? "EMPLOYEE");
}

export function canAccessOrganizations(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"]);
}

// Common convenience checks for admin flows
export function isAdmin(role: string | undefined) {
  return role === "ADMIN";
}

export function canApproveEmployees(role: string | undefined) {
  // Admins and department heads can approve employees
  return hasAnyRole(role, ["ADMIN", "DEPARTMENT_HEAD"]);
}

export function canApproveAssets(role: string | undefined) {
  // Admins and asset managers can approve assets
  return hasAnyRole(role, ["ADMIN", "ASSET_MANAGER"]);
}

export function canApproveBookings(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN", "DEPARTMENT_HEAD"]);
}

export function canCompleteMaintenance(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN", "ASSET_MANAGER"]);
}

export function canManageEmployees(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN"]);
}

export function canManageOrganizations(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN"]);
}
