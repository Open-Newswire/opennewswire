import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import {
  cleanupArticlesTask,
  cleanupEventsTask,
  cleanupJobsTask,
  enrichEventsTask,
  rescheduleNextSyncAll,
  syncAllTask,
  syncFeedTask,
} from "@/domains/sync/tasks";
import { withTimeouts } from "@/lib/task-timeout";
import {
  makeWorkerUtils,
  parseCronItems,
  run,
  type CronItem,
  type Runner,
  type Task,
  type TaskSpec,
  type WorkerUtils,
} from "graphile-worker";

export const SYNC_FEED = "sync-feed";
export const SYNC_ALL = "sync-all";
export const ENRICH_EVENTS = "enrich-events";
export const CLEANUP_ARTICLES = "cleanup-articles";
export const CLEANUP_EVENTS = "cleanup-events";
export const CLEANUP_JOBS = "cleanup-jobs";

/**
 * Per-task time budgets (ms). A task that overruns its budget is aborted and
 * failed (then retried) rather than silently holding its worker slot forever.
 */
const DEFAULT_TASK_TIMEOUT_MS = parseInt(
  process.env.WORKER_TASK_TIMEOUT_MS ?? "120000",
  10,
);

const TASK_TIMEOUTS_MS: Record<string, number> = {
  [SYNC_FEED]: 90_000,
  [SYNC_ALL]: 180_000,
  [ENRICH_EVENTS]: 300_000,
  [CLEANUP_ARTICLES]: 900_000,
  [CLEANUP_EVENTS]: 600_000,
  [CLEANUP_JOBS]: 600_000,
};

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
  await utils.addJob(task, payload, { maxAttempts: 3, ...spec });
}

export async function startWorker() {
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY ?? "2", 10);

  const cronItems: CronItem[] = [
    {
      task: ENRICH_EVENTS,
      match: "*/15 * * * *",
      identifier: "scheduled-enrich-events",
      options: { maxAttempts: 3, backfillPeriod: 0 },
    },
    {
      task: CLEANUP_ARTICLES,
      match: "0 0 * * *",
      identifier: "scheduled-cleanup-articles",
      options: { maxAttempts: 3, backfillPeriod: 0 },
    },
    {
      task: CLEANUP_EVENTS,
      match: "0 0 * * *",
      identifier: "scheduled-cleanup-events",
      options: { maxAttempts: 3, backfillPeriod: 0 },
    },
    {
      task: CLEANUP_JOBS,
      match: "0 11 * * *",
      identifier: "scheduled-cleanup-jobs",
      options: { maxAttempts: 3, backfillPeriod: 0 },
    },
  ];

  const parsedCrons = parseCronItems(cronItems);

  const taskList: Record<string, Task> = {
    [SYNC_FEED]: syncFeedTask,
    [SYNC_ALL]: syncAllTask,
    [ENRICH_EVENTS]: enrichEventsTask,
    [CLEANUP_ARTICLES]: cleanupArticlesTask,
    [CLEANUP_EVENTS]: cleanupEventsTask,
    [CLEANUP_JOBS]: cleanupJobsTask,
  };

  let runner: Runner;

  try {
    runner = await run({
      connectionString: process.env.POSTGRES_URL!,
      concurrency,
      taskList: withTimeouts(
        taskList,
        TASK_TIMEOUTS_MS,
        DEFAULT_TASK_TIMEOUT_MS,
      ),
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
    return;
  }

  runner.events.on("pool:listen:error", (err) => {
    console.error("[graphile-worker] Listen connection error:", err.error);
  });

  runner.events.on("pool:gracefulShutdown", (evt) => {
    console.log(`[graphile-worker] Graceful shutdown (${evt.message})`);
  });

  runner.events.on("worker:fatalError", (evt) => {
    console.error("[graphile-worker] Fatal worker error:", evt.error);
  });

  runner.events.on("job:error", (evt) => {
    console.error(
      `[graphile-worker] Job ${evt.job.task_identifier} failed:`,
      evt.error,
    );
  });

  runner.promise.then(
    () => {
      console.log("[graphile-worker] Runner stopped cleanly");
    },
    (err) => {
      console.error("[graphile-worker] Runner stopped with error:", err);
    },
  );

  // Seed the first sync-all job. Subsequent runs are self-scheduled
  // by syncAllTask after each completion.
  try {
    const preference = await getPreference(SyncFrequencyPreference);
    await rescheduleNextSyncAll(preference);
    console.log("[graphile-worker] Seeded initial sync-all job");
  } catch {
    console.warn(
      "[graphile-worker] Could not seed sync-all job — preference not found",
    );
  }
}
