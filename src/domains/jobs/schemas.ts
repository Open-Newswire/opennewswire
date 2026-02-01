import { PaginatedQuerySchema } from "@/domains/shared/schemas";
import { z } from "zod";

export type SyncJobQuery = z.infer<typeof SyncJobQuerySchema>;

export const SyncJobQuerySchema = z
  .object({
    sortBy: z
      .enum(["triggeredAt", "status"])
      .default("triggeredAt")
      .catch("triggeredAt"),
    sortDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
    status: z
      .enum(["in-progress", "not-started", "completed", "failed"])
      .optional(),
    trigger: z.enum(["manual", "automatic"]).optional(),
  })
  .merge(PaginatedQuerySchema);
