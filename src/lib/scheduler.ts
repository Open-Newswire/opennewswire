import { QStashScheduler } from "@/lib/qstash-scheduler";

const PLATFORM = process.env.PLATFORM ?? "";
const NAME_SUFFIX = process.env.NODE_ENV + "-" + PLATFORM;

// Schedule defines a unique scheduled API callback to Open Newswire
export interface Schedule {
  // Unique name
  name: string;

  // The API path that's called on schedule
  path: string;

  defaultCron?: string;
}

// SavedSchedule represents a scheduled that's been created by the scheduler
export interface SavedSchedule {
  name: string;

  cron: string;
}

// Scheduler provides an interface for creating and updating scheduled callbacks
export interface Scheduler {
  setSchedule(schedule: Schedule, cron: string, body?: any): Promise<void>;
  getSchedules(): Promise<SavedSchedule[]>;
}

// Shared scheduler for use across codebase
export const scheduler: Scheduler = new QStashScheduler();

// Defines all schedule types
export const schedules: Record<string, Schedule> = {
  enrichEvents: {
    name: "enrich-events-" + NAME_SUFFIX,
    path: "/api/jobs/enrich-events",
    defaultCron: "*/15 * * * *",
  },
  cleanupJobs: {
    name: "cleanup-jobs-" + NAME_SUFFIX,
    path: "/api/jobs/cleanup-jobs",
    defaultCron: "0 11 * * *",
  },
  cleanupArticles: {
    name: "cleanup-articles-" + NAME_SUFFIX,
    path: "/api/jobs/cleanup-articles",
    defaultCron: "0 0 * * *",
  },
  syncAll: {
    name: "sync-all-" + NAME_SUFFIX,
    path: "/api/jobs/sync-all",
  },
};
