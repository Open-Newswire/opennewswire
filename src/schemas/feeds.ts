import { ContentSource, IconSource } from "@prisma/client";
import { z } from "zod";
import { PaginatedQuerySchema } from "./shared";

export type SaveFeedParams = z.infer<typeof FeedSchema>;

export type FeedQuery = z.infer<typeof FeedQuerySchema>;

export const FeedSchema = z.object({
  title: z.string(),
  url: z.string(),
  iconUrl: z.string().nullish(),
  backgroundColor: z.string(),
  textColor: z.string(),
  filterKeywords: z.string().nullish(),
  licenseUrl: z.string().nullish(),
  licenseText: z.string().nullish(),
  licenseId: z.string().nullish(),
  languageId: z.string().nullish(),
  iconSource: z.nativeEnum(IconSource).default(IconSource.NONE),
  iconAssetUrl: z.string().nullish(),
  contentSource: z.nativeEnum(ContentSource).default(ContentSource.AUTOMATIC),
});

export const FeedQuerySchema = z
  .object({
    sortBy: z
      .enum(["title", "url", "license", "language"])
      .default("title")
      .catch("title"),
    sortDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
    language: z.string().optional(),
    license: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(["all", "active", "inactive"]).default("all").catch("all"),
  })
  .merge(PaginatedQuerySchema);
