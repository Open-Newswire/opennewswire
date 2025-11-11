"use server";

import { requireAuth, withAuth } from "@/actions/auth-wrapper";
import {
  ChangePasswordParams,
  ChangePasswordSchema,
  CreateUserParams,
  CreateUserSchema,
} from "@/schemas/users";
import * as users from "@/services/users";
import { hash } from "@node-rs/argon2";
import { revalidatePath } from "next/cache";

/**
 * Creates a new user.
 *
 * @param user The user to be created
 * @returns Newly created user with ID
 */
export const createUser = requireAuth(async function createUser(params: CreateUserParams) {
  const { email, name, password, confirmPassword } =
    CreateUserSchema.parse(params);

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match"); // TODO: Better error handling
  }

  const hashedPassword = await hash(password);

  await users.createUser({
    name,
    email,
    password_hash: hashedPassword,
  });

  revalidatePath("/admin/settings");
});

/**
 * Changes
 */
export const changePassword = withAuth(async function changePassword(user, _session, params: ChangePasswordParams) {
  const { password, confirmPassword } = ChangePasswordSchema.parse(params);

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match"); // TODO: Better error handling
  }

  await users.changePassword(user, password);
});

/**
 * Deletes an existing user.
 *
 * @param id ID assigned to user to delete
 * @returns The deleted user
 */
export const deleteUser = requireAuth(async function deleteUser(id: string) {
  await users.deleteUser(id);

  revalidatePath("/admin/settings");
});
