import { PaginatedQuerySchema } from "@/domains/shared/schemas";
import { UTCDate } from "@date-fns/utc";
import { startOfDay, subDays } from "date-fns";
import {
  createLoader,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

export const AnalyticsReportQuerySchema = z.object({
  reportType: z
    .enum(["events", "top-articles", "top-searches", "locations"])
    .default("events")
    .nullable(),
  sd: z.coerce.date(),
  ed: z.coerce.date(),
  language: z.string().nullable(),
  license: z.string().nullable(),
  countryCode: z.string().nullable(),
  browserLanguage: z.string().nullable(),
  sessionId: z.string().nullable(),
  eventType: z.enum(["INTERACTION", "QUERY"]).nullable(),
});

export type AnalyticsReportQuery = z.infer<typeof AnalyticsReportQuerySchema>;

export const AnalyticsQuerySchema = z.object({
  sortBy: z
    .enum(["occuredAt", "countryCode", "region", "city"])
    .default("occuredAt")
    .catch("occuredAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  sd: z.date().nullable(),
  ed: z.date().nullable(),
  language: z.string().nullable(),
  license: z.string().nullable(),
  countryCode: z.string().nullable(),
  browserLanguage: z.string().nullable(),
  sessionId: z.string().nullable(),
  eventType: z.enum(["INTERACTION", "QUERY"]).nullable(),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;

export const PaginatedAnalyticsQuerySchema =
  AnalyticsQuerySchema.merge(PaginatedQuerySchema);

export type PaginatedAnalyticsQuery = z.infer<
  typeof PaginatedAnalyticsQuerySchema
>;

export const analyticsQuerySearchParams = {
  sd: parseAsIsoDate.withDefault(startOfDay(subDays(new UTCDate(), 7))),
  ed: parseAsIsoDate.withDefault(startOfDay(new UTCDate())),
  language: parseAsString,
  license: parseAsString,
  countryCode: parseAsString,
  browserLanguage: parseAsString,
  sessionId: parseAsString,
  eventType: parseAsString,
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(20),
  sortBy: parseAsString,
  sortDirection: parseAsString,
};

export const loadAnalyticsQueryParams = createLoader(
  analyticsQuerySearchParams,
);
