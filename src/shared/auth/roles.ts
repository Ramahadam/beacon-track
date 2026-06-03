export const ROLES = {
  STANDARD: 'standard',
  ANALYST: 'analyst',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
