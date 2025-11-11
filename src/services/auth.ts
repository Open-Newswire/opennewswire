import { getSessionTokenCookie } from "@/lib/cookies";
import { SessionValidationResult, validateSessionToken } from "@/lib/sessions";
import { cache } from "react";

export const validateRequest = cache(
  async (): Promise<SessionValidationResult> => {
    const token = await getSessionTokenCookie();

    if (token === null) {
      return { session: null, user: null };
    }

    const result = await validateSessionToken(token);

    return result;
  },
);
