import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import {
  buildSyncAllCronItem,
  syncAllTask,
  syncFeedTask,
  enrichEventsTask,
  cleanupArticlesTask,
  cleanupEventsTask,
  cleanupJobsTask,
} from "@/domains/sync/tasks";
import { toCron } from "@/utils/cron";
import {
  makeWorkerUtils,
  parseCronItems,
  run,
  type TaskSpec,
  type WorkerUtils,
  type CronItem,
} from "graphile-worker";

export const SYNC_FEED = "sync-feed";
export const SYNC_ALL = "sync-all";
export const ENRICH_EVENTS = "enrich-events";
export const CLEANUP_ARTICLES = "cleanup-articles";
export const CLEANUP_EVENTS = "cleanup-events";
export const CLEANUP_JOBS = "cleanup-jobs";

let workerUtils: WorkerUtils | null = null;

async function ensureWorkerUtils(): Promise<WorkerUtils> {
  if (!workerUtils) {
    workerUtils = await makeWorkerUtils({
      connectionString: process.env.POSTGRES_URL!,
    });
  }
  return workerUtils;
}

export async function addJob(
  task: string,
  payload: Record<string, unknown>,
  spec?: TaskSpec,
) {
  const utils = await ensureWorkerUtils();
  await utils.addJob(task, payload, spec);
}

export async function startWorker() {
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY ?? "4", 10);

  const cronItems: CronItem[] = [
    {
      task: ENRICH_EVENTS,
      match: "*/15 * * * *",
      identifier: "scheduled-enrich-events",
    },
    {
      task: CLEANUP_ARTICLES,
      match: "0 0 * * *",
      identifier: "scheduled-cleanup-articles",
    },
    {
      task: CLEANUP_EVENTS,
      match: "0 0 * * *",
      identifier: "scheduled-cleanup-events",
    },
    {
      task: CLEANUP_JOBS,
      match: "0 11 * * *",
      identifier: "scheduled-cleanup-jobs",
    },
  ];

  try {
    const preference = await getPreference(SyncFrequencyPreference);
    const cron = toCron(preference);
    cronItems.push(buildSyncAllCronItem(cron));
    console.log(`[graphile-worker] Sync schedule: ${cron}`);
  } catch {
    console.warn(
      "[graphile-worker] Could not load sync preference, starting without sync cron schedule",
    );
  }

  const parsedCrons = parseCronItems(cronItems);

  try {
    await run({
      connectionString: process.env.POSTGRES_URL!,
      concurrency,
      taskList: {
        [SYNC_FEED]: syncFeedTask,
        [SYNC_ALL]: syncAllTask,
        [ENRICH_EVENTS]: enrichEventsTask,
        [CLEANUP_ARTICLES]: cleanupArticlesTask,
        [CLEANUP_EVENTS]: cleanupEventsTask,
        [CLEANUP_JOBS]: cleanupJobsTask,
      },
      parsedCronItems: parsedCrons,
    });

    console.log(
      `[graphile-worker] Worker started (concurrency: ${concurrency})`,
    );
  } catch (err) {
    console.error(
      "[graphile-worker] Failed to start — is the database reachable?",
      err,
    );
  }
}
