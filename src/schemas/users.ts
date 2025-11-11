import { z } from "zod";

export type CreateUserParams = z.infer<typeof CreateUserSchema>;

export type ChangePasswordParams = z.infer<typeof ChangePasswordSchema>;

const SaveUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const ChangePasswordSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

export const CreateUserSchema = ChangePasswordSchema.merge(SaveUserSchema);
