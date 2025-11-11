import { z } from "zod";

export enum AppPreferenceKey {
  SyncFrequency = "syncFrequency",
  SyncJobHistoryRetention = "syncJobHistoryRetention",
  ArticleRetention = "articleRetention",
  EventsHistoryRetention = "eventsHistoryRetention",
}

export type AppPreferenceSchema = z.ZodTypeAny;

export interface AppPreference<S extends AppPreferenceSchema> {
  key: string;
  schema: S;
}
