import { ArticleVisibility } from "@/domains/articles/types";
import { FeedStatus } from "@/domains/feeds/types";
import { z } from "zod";
import { PaginatedQuerySchema } from "@/domains/shared/schemas";

export type ArticleQuery = z.infer<typeof ArticleQuerySchema>;

export type ArticleFeedReaderQuery = z.infer<
  typeof ArticleFeedReaderQuerySchema
>;

export const ArticleQuerySchema = z
  .object({
    sortBy: z.enum(["date", "title", "feed"]).default("date").catch("date"),
    sortDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
    language: z.string().optional(),
    languages: z.array(z.string()).optional(),
    license: z.string().optional(),
    licenses: z.array(z.string()).optional(),
    search: z.string().optional(),
    feedStatus: z
      .nativeEnum(FeedStatus)
      .default(FeedStatus.all)
      .catch(FeedStatus.all),
    visibility: z
      .nativeEnum(ArticleVisibility)
      .default(ArticleVisibility.all)
      .catch(ArticleVisibility.all),
  })
  .merge(PaginatedQuerySchema);

export const ArticleFeedReaderQuerySchema = z
  .object({
    languages: z
      .string()
      .transform((str) => str.split(","))
      .optional(),
    licenses: z
      .string()
      .transform((str) => str.split(","))
      .optional(),
    search: z.string().optional(),
  })
  .merge(PaginatedQuerySchema);
