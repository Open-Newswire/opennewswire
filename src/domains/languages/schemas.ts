import { PaginatedQuerySchema } from "@/domains/shared/schemas";
import { z } from "zod";

export type LanguageQuery = z.infer<typeof LanguageQuerySchema>;

export type SaveLanguageParams = z.infer<typeof SaveLanguageSchema>;

export const LanguageQuerySchema = z
  .object({
    sortBy: z
      .enum(["name", "isRtl", "slug", "order"])
      .default("order")
      .catch("order"),
    sortDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
    direction: z.enum(["rtl", "ltr"]).optional(),
    search: z.string().optional(),
  })
  .merge(PaginatedQuerySchema);

export const SaveLanguageSchema = z.object({
  name: z.string().nonempty("Name is required"),
  slug: z.string().nonempty("Slug is required"),
  isRtl: z.boolean(),
});
