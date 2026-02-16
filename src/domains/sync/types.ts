import { Feed } from "@/domains/feeds/types";

export enum FetchStatus {
  NotModified,
  Completed,
}

interface FetchHeaders {
  lastModified: string | null;
  etag: string | null;
}

export type FetchResult =
  | { status: FetchStatus.NotModified }
  | {
      status: FetchStatus.Completed;
      body: string;
      headers: FetchHeaders;
    };

export type ParserResult =
  | {
      status: FetchStatus.Completed;
      items: TransientItem[];
      headers: FetchHeaders;
    }
  | { status: FetchStatus.NotModified };

export interface TransientItem {
  guid: string;
  date: Date;
  title: string;
  content: string | null;
  link: string;
  author: string | null;
  isHidden: boolean;
}

interface RetentionPolicy {
  cutoffDate: Date;
  minimumItems: number;
}

export interface SyncLogger {
  info: (msg: string, ...args: any) => void;
  warn: (msg: string, ...args: any) => void;
  error: (msg: string, ...args: any) => void;
  debug: (msg: string, ...args: any) => void;
}
export interface Context {
  // Common job logger
  logger: SyncLogger;
  // Feed being parsed
  feed: Feed;
  // Retention policy describing how many items should be captured
  policy: RetentionPolicy;
  // Total count of items parsed
  count: number;
}
export interface PageResult {
  items: TransientItem[];
  shouldContinue: boolean;
}
