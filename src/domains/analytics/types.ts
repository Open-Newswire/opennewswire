import { Feed } from "@/domains/feeds/types";
import { Language } from "@/domains/languages/types";
import { License } from "@/domains/licenses/types";
import { AnalyticsEventType } from "@prisma/client";

export const ANALYTICS_COOKIE_NAME = "opennewswire-analytics";

export const AnalyticsEventTypeLabels: Record<AnalyticsEventType, string> = {
  [AnalyticsEventType.INTERACTION]: "Interaction",
  [AnalyticsEventType.QUERY]: "Query",
};

export interface TopArticleCount {
  articleId: string | null;
  count: number;
  feed?: Feed;
  title: string | null;
  link: string | null;
}

export interface TopSearchesCount {
  normalizedQuery: string;
  count: number;
}

export interface AnalyticsEventDetails {
  selectedLanguages: Language[];
  selectedLicenses: License[];
}

export interface UniqueSessionsByDay {
  day: Date;
  count: number;
}

export interface EventsByCountryCount {
  countryCode: string | null;
  eventCount: number;
}
