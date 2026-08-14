/**
 * Elite Battlegrounds
 * Global Application Constants
 */

export const APP_NAME = "Elite Battlegrounds";

export const APP_SHORT_NAME = "EB";

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_PAGE_SIZE = 100;

export const PASSWORD_BCRYPT_ROUNDS = 12;

export const USER_ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  ORGANIZER: "organizer",
  REFEREE: "referee",
  MODERATOR: "moderator",
} as const;

export const TOURNAMENT_STATUSES = {
  DRAFT: "DRAFT",
  REGISTRATION_OPEN: "REGISTRATION_OPEN",
  REGISTRATION_CLOSED: "REGISTRATION_CLOSED",
  CHECK_IN: "CHECK_IN",
  UPCOMING: "UPCOMING",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
] as const;