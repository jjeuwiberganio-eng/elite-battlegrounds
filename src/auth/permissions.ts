import { auth } from "./auth";

/**
 * Returns the current authenticated session.
 */
export async function getSession() {
  return auth();
}

/**
 * Returns the current authenticated user.
 */
export async function getCurrentUser() {
  const session = await auth();

  return session?.user ?? null;
}

/**
 * Returns true if the current user has the specified role.
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.roles.includes(role);
}

/**
 * Returns true if the current user has at least one
 * of the supplied roles.
 */
export async function hasAnyRole(
  roles: readonly string[]
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return roles.some((role) => user.roles.includes(role));
}

/**
 * Throws if the user is not authenticated.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

/**
 * Throws if the authenticated user does not have
 * the required role.
 */
export async function requireRole(role: string) {
  const user = await requireAuth();

  if (!user.roles.includes(role)) {
    throw new Error("Forbidden");
  }

  return user;
}

/**
 * Throws if the authenticated user does not have
 * at least one of the supplied roles.
 */
export async function requireAnyRole(
  roles: readonly string[]
) {
  const user = await requireAuth();

  const allowed = roles.some((role) =>
    user.roles.includes(role)
  );

  if (!allowed) {
    throw new Error("Forbidden");
  }

  return user;
}