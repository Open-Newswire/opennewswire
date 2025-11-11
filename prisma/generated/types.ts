import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Status = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
} as const;
export type Status = (typeof Status)[keyof typeof Status];
export const Trigger = {
    MANUAL: "MANUAL",
    AUTOMATIC: "AUTOMATIC"
} as const;
export type Trigger = (typeof Trigger)[keyof typeof Trigger];
export const IconSource = {
    NONE: "NONE",
    UPLOAD: "UPLOAD",
    FAVICON: "FAVICON"
} as const;
export type IconSource = (typeof IconSource)[keyof typeof IconSource];
export const AnalyticsEventType = {
    QUERY: "QUERY",
    INTERACTION: "INTERACTION"
} as const;
export type AnalyticsEventType = (typeof AnalyticsEventType)[keyof typeof AnalyticsEventType];
export const EnrichmentStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
} as const;
export type EnrichmentStatus = (typeof EnrichmentStatus)[keyof typeof EnrichmentStatus];
export const ContentSource = {
    AUTOMATIC: "AUTOMATIC",
    CONTENT: "CONTENT",
    CONTENT_SNIPPET: "CONTENT_SNIPPET",
    SUMMARY: "SUMMARY"
} as const;
export type ContentSource = (typeof ContentSource)[keyof typeof ContentSource];
export type AnalyticsEvent = {
    id: string;
    occuredAt: Generated<Timestamp>;
    sessionId: string;
    eventType: AnalyticsEventType;
    browserLanguage: string | null;
    ipAddress: string | null;
    countryCode: string | null;
    regionCode: string | null;
    city: string | null;
    articleId: string | null;
    selectedLanguages: string[];
    selectedLicenses: string[];
    searchQuery: string | null;
    isEnriched: Generated<boolean>;
    enrichmentStatus: Generated<EnrichmentStatus>;
    enrichmentError: string | null;
};
export type AppPreference = {
    key: string;
    value: unknown;
};
export type Article = {
    id: string;
    createdAt: Generated<Timestamp>;
    guid: string | null;
    title: string;
    author: string | null;
    link: string;
    date: Timestamp | null;
    content: string | null;
    isHidden: Generated<boolean>;
    feedId: string;
};
export type Feed = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
    isActive: Generated<boolean>;
    title: string;
    url: string;
    iconSource: Generated<IconSource>;
    iconUrl: string | null;
    iconAssetUrl: string | null;
    description: string | null;
    backgroundColor: string;
    textColor: string;
    filterKeywords: string | null;
    licenseId: string | null;
    licenseUrl: string | null;
    licenseText: string | null;
    languageId: string | null;
    lastModifiedHeader: string | null;
    etag: string | null;
    contentSource: Generated<ContentSource>;
};
export type IpAddressCache = {
    ipAddress: string;
    countryCode: string | null;
    regionCode: string | null;
    city: string | null;
};
export type Language = {
    id: string;
    slug: string | null;
    createdAt: Generated<Timestamp>;
    name: string;
    isRtl: Generated<boolean>;
    order: Generated<number>;
};
export type License = {
    id: string;
    slug: string | null;
    createdAt: Generated<Timestamp>;
    name: string;
    symbols: string | null;
    backgroundColor: string;
    textColor: string;
};
export type Session = {
    id: string;
    userId: string;
    createdAt: Generated<Timestamp>;
    expiresAt: Timestamp;
};
export type SyncJob = {
    id: string;
    status: Generated<Status>;
    trigger: Trigger;
    triggeredAt: Generated<Timestamp>;
    completedAt: Timestamp | null;
    feedId: string | null;
    parentId: string | null;
    log: unknown | null;
    totalSuccess: number | null;
    totalFailure: number | null;
};
export type User = {
    id: string;
    createdAt: Generated<Timestamp>;
    name: string;
    email: string;
    password_hash: string;
};
export type DB = {
    AnalyticsEvent: AnalyticsEvent;
    AppPreference: AppPreference;
    Article: Article;
    Feed: Feed;
    IpAddressCache: IpAddressCache;
    Language: Language;
    License: License;
    Session: Session;
    SyncJob: SyncJob;
    User: User;
};
