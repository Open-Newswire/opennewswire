import { AppPreference, AppPreferenceKey } from "@/domains/app-preferences/types";
import { z } from "zod";

const syncFrequencyPreferenceSchema = z.object({
  period: z.number().catch(30),
  unit: z.enum(["minutes", "hours", "days"]).catch("minutes"),
});

export const SyncFrequencyPreference: AppPreference<
  typeof syncFrequencyPreferenceSchema
> = {
  key: AppPreferenceKey.SyncFrequency,
  schema: syncFrequencyPreferenceSchema,
};

const syncJobHistoryRetentionPreferenceSchema = z.object({
  period: z.number().catch(30),
  unit: z.enum(["hours", "days", "weeks", "months"]).catch("days"),
});

export const SyncJobHistoryRetentionPreference: AppPreference<
  typeof syncJobHistoryRetentionPreferenceSchema
> = {
  key: AppPreferenceKey.SyncJobHistoryRetention,
  schema: syncJobHistoryRetentionPreferenceSchema,
};

const articleRetentionPreferenceSchema = z.object({
  period: z.number().catch(30),
  unit: z.enum(["days", "weeks", "months"]).catch("days"),
  minCount: z.number().catch(10),
});

export const ArticleRetentionPreference: AppPreference<
  typeof articleRetentionPreferenceSchema
> = {
  key: AppPreferenceKey.ArticleRetention,
  schema: articleRetentionPreferenceSchema,
};

const eventsHistoryRetentionPreferenceSchema = z.object({
  period: z.number().catch(6),
  unit: z.enum(["days", "weeks", "months"]).catch("months"),
});

export const EventsHistoryRetentionPreference: AppPreference<
  typeof eventsHistoryRetentionPreferenceSchema
> = {
  key: AppPreferenceKey.EventsHistoryRetention,
  schema: eventsHistoryRetentionPreferenceSchema,
};
