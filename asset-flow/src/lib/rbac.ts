export const ROLE_VALUES = ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"] as const;

export type AppRole = (typeof ROLE_VALUES)[number];

export function hasAnyRole(role: string | undefined, allowedRoles: AppRole[]) {
  return allowedRoles.includes((role as AppRole) ?? "EMPLOYEE");
}

export function canAccessOrganizations(role: string | undefined) {
  return hasAnyRole(role, ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"]);
}
