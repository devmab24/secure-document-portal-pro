import { UserRole } from "@/lib/types";

/**
 * Single source of truth mapping a user role to its dashboard landing route.
 * Used by the login redirect, the landing page redirect and the generic
 * `/dashboard` redirect so the three can never drift apart.
 */
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "/dashboard/super-admin",
  [UserRole.ADMIN]: "/dashboard/admin",
  [UserRole.CMD]: "/dashboard/cmd",
  [UserRole.CMAC]: "/dashboard/cmac",
  [UserRole.HEAD_OF_NURSING]: "/dashboard/head-of-nursing",
  [UserRole.CHIEF_ACCOUNTANT]: "/dashboard/chief-accountant",
  [UserRole.CHIEF_PROCUREMENT_OFFICER]: "/dashboard/chief-procurement",
  [UserRole.MEDICAL_RECORDS_OFFICER]: "/dashboard/medical-records",
  [UserRole.REGISTRY]: "/dashboard/registry",
  [UserRole.DIRECTOR_ADMIN]: "/dashboard/director-admin",
  [UserRole.HOD]: "/dashboard/hod",
  [UserRole.HEAD_OF_UNIT]: "/dashboard/head-of-unit",
  [UserRole.BOARD_MEMBER]: "/dashboard/board-member",
  [UserRole.AUDITOR]: "/dashboard/board-member",
  [UserRole.STAFF]: "/dashboard/staff",
};

/** Legacy / alternate role spellings that may still exist in seeded data. */
const ROLE_ALIASES: Record<string, UserRole> = {
  MD: UserRole.CMD,
  CHIEF_MEDICAL_DIRECTOR: UserRole.CMD,
  CMAC_OFFICER: UserRole.CMAC,
  HEAD_NURSING: UserRole.HEAD_OF_NURSING,
  HEAD_OF_NURSING_OFFICER: UserRole.HEAD_OF_NURSING,
  REGISTRY_OFFICER: UserRole.REGISTRY,
  DIRECTORADMIN: UserRole.DIRECTOR_ADMIN,
  DIRECTOR_OF_ADMIN: UserRole.DIRECTOR_ADMIN,
  DIRECTOR_ADMIN_OFFICER: UserRole.DIRECTOR_ADMIN,
  CA: UserRole.CHIEF_ACCOUNTANT,
  CHIEF_PROCUREMENT: UserRole.CHIEF_PROCUREMENT_OFFICER,
  CPO: UserRole.CHIEF_PROCUREMENT_OFFICER,
  MEDICAL_RECORDS: UserRole.MEDICAL_RECORDS_OFFICER,
  MEDRECORDS: UserRole.MEDICAL_RECORDS_OFFICER,
  HEAD_OF_DEPARTMENT: UserRole.HOD,
  UNIT_HEAD: UserRole.HEAD_OF_UNIT,
  HEADOFUNIT: UserRole.HEAD_OF_UNIT,
  BOARD: UserRole.BOARD_MEMBER,
  BOARD_OF_MANAGEMENT: UserRole.BOARD_MEMBER,
  INTERNAL_AUDITOR: UserRole.AUDITOR,
};

/** Normalizes any raw role value (casing, spaces, hyphens, aliases) to a UserRole. */
export const normalizeUserRole = (rawRole: unknown): UserRole => {
  const key = String(rawRole ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (key in ROLE_DASHBOARD_ROUTES) return key as UserRole;
  return ROLE_ALIASES[key] ?? UserRole.STAFF;
};

/** Returns the dashboard landing route for a role. Never returns a 404 path. */
export const getDashboardRoute = (rawRole: unknown): string =>
  ROLE_DASHBOARD_ROUTES[normalizeUserRole(rawRole)];
