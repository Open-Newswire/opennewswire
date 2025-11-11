import { z } from "zod";

export type SaveLicenseParams = z.infer<typeof SaveLicenseSchema>;

export const SaveLicenseSchema = z.object({
  name: z.string(),
  slug: z.string(),
  symbols: z.string().optional(),
  backgroundColor: z.string(),
  textColor: z.string(),
});
