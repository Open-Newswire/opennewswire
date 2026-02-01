import { parseAsInteger } from "nuqs/server";
import { z } from "zod";

export type PaginatedQuery = z.infer<typeof PaginatedQuerySchema>;

export const PaginatedQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number()).default(1),
  size: z.preprocess((val) => Number(val), z.number()).default(20),
});

export const PaginatedQueryParsers = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(20),
};
