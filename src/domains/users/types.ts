import { User as PrismaUser } from "@/lib/prisma-client";

export type User = PrismaUser;

export type UserWithoutPassword = Omit<User, "password_hash">;
