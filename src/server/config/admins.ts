// Admin configuration
export const ADMIN_USERS = [
  'rony0110', // Primary admin
] as const;

export type AdminUsername = (typeof ADMIN_USERS)[number];

export function isAdmin(username: string): boolean {
  return ADMIN_USERS.includes(username as AdminUsername);
}

export function getAdminList(): AdminUsername[] {
  return [...ADMIN_USERS];
}
