"use server";

import prisma from "@/lib/prisma";
import { invalidateAllSessions } from "@/lib/sessions";
import { PaginatedQuery } from "@/schemas/shared";
import { UserWithoutPassword } from "@/types/users";
import { hash } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";

export const fetchUsers = async ({ page = 0, size = 0 }: PaginatedQuery) => {
  return prisma.user.paginate().withPages({
    page,
    limit: size,
    includePageCount: true,
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};

export async function changePassword(
  user: UserWithoutPassword,
  newPassword: string,
) {
  const hashedPassword = await hash(newPassword);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password_hash: hashedPassword,
    },
  });
}

export const deleteUser = async (id: string) => {
  await invalidateAllSessions(id);
  return prisma.user.delete({ where: { id } });
};

export async function findUserForAuth(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    omit: {
      password_hash: false,
    },
  });
}
