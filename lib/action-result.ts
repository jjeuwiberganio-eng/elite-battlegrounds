/*
 * Shared result shape for admin server actions.
 *
 * WHY THIS EXISTS: in a production build, Next.js replaces the message of
 * any error THROWN from a server action with a generic one, so
 * `throw new Error("Match #4 already exists")` reaches the browser as
 * "An error occurred in the Server Components render". Returning the
 * message as a normal value is the only way it survives. Actions using
 * this helper return { ok: false, error } instead of throwing.
 */

export type ActionFailure = {
  ok: false;
  error: string;
};

export type ActionSuccess<T extends object = object> = {
  ok: true;
} & T;

export type ActionResult<T extends object = object> =
  | ActionSuccess<T>
  | ActionFailure;

/*
 * redirect() / notFound() / auth redirects work by throwing a special
 * error. Those must keep propagating, never be turned into a message.
 */
function isNextControlFlowError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;

  return typeof digest === "string" && digest.startsWith("NEXT_");
}

function describeUniqueTarget(meta: unknown) {
  const target =
    typeof meta === "object" && meta !== null
      ? (meta as { target?: unknown }).target
      : undefined;

  const fields = Array.isArray(target)
    ? target.map(String)
    : typeof target === "string"
      ? [target]
      : [];

  const text = fields.join(" ").toLowerCase();

  if (text.includes("slug")) {
    return "That URL slug is already in use.";
  }

  if (text.includes("name")) {
    return "That name is already in use.";
  }

  if (text.includes("matchnumber") || text.includes("match_number")) {
    return "That match number is already used in this stage.";
  }

  if (text.includes("ingamename")) {
    return "A player with that in-game name already exists on this team.";
  }

  return "A record with those details already exists.";
}

/*
 * Turns anything thrown inside an action into a safe, human message.
 * - Errors WE throw on purpose (validation) keep their own message.
 * - Known database constraint errors get a readable explanation.
 * - Any other database/internal error gets the generic fallback, so raw
 *   Prisma text is never shown to the admin.
 */
export function actionError(
  error: unknown,
  fallback: string,
): ActionFailure {
  if (isNextControlFlowError(error)) {
    throw error;
  }

  if (typeof error === "object" && error !== null) {
    const code = (error as { code?: unknown }).code;
    const meta = (error as { meta?: unknown }).meta;

    if (code === "P2002") {
      return { ok: false, error: describeUniqueTarget(meta) };
    }

    if (code === "P2025") {
      return {
        ok: false,
        error:
          "That record no longer exists. Refresh the page and try again.",
      };
    }

    if (code === "P2003") {
      return {
        ok: false,
        error:
          "This record is linked to other data, so that change isn't allowed.",
      };
    }
  }

  const name =
    error instanceof Error ? error.name : "";

  if (
    error instanceof Error &&
    error.message &&
    !name.startsWith("PrismaClient")
  ) {
    return { ok: false, error: error.message };
  }

  return { ok: false, error: fallback };
}
