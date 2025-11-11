import { validateRequest } from "@/services/auth";
import type { UserWithoutPassword } from "@/types/users";
import type { Session } from "@prisma/client";

/**
 * Generic wrapper for server actions that require authentication.
 * Validates that an active session exists and provides user/session data to the wrapped function.
 */
export function withAuth<TArgs extends unknown[], TReturn>(
  action: (
    user: UserWithoutPassword,
    session: Session,
    ...args: TArgs
  ) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const { user, session } = await validateRequest();

    if (!user || !session) {
      throw new Error("Must be authenticated");
    }

    return action(user, session, ...args);
  };
}

/**
 * Simplified wrapper for server actions that only need to ensure authentication exists.
 * Use this when you don't need access to user/session data in your action.
 */
export function requireAuth<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const { user, session } = await validateRequest();

    if (!user || !session) {
      throw new Error("Must be authenticated");
    }

    return action(...args);
  };
}
