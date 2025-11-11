"use server";

import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/cookies";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "@/lib/sessions";
import { LoginSchema } from "@/schemas/auth";
import { validateRequest } from "@/services/auth";
import { findUserForAuth } from "@/services/users";
import { getSafeRedirectUrl } from "@/utils/redirect-validation";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";

export async function login({
  email,
  password,
  redirectTo,
}: Partial<{ email: string; password: string; redirectTo: string }>): Promise<ActionResult> {
  const result = LoginSchema.safeParse({ email, password });

  if (result.error) {
    return {
      error: "Invalid credentials",
    };
  }

  const user = await findUserForAuth(result.data.email);

  if (!user) {
    return {
      error: "Invalid credentials",
    };
  }

  const validPassword = await verify(user.password_hash, result.data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      error: "Invalid credentials",
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  // Use the safe redirect URL, fallback to /admin
  const safeRedirectUrl = getSafeRedirectUrl(redirectTo);
  redirect(safeRedirectUrl);
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  redirect("/login");
}

interface ActionResult {
  error: string;
}
