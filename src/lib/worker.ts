import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import {
  buildSyncAllCronItem,
  syncAllTask,
  syncFeedTask,
} from "@/domains/sync/tasks";
import { toCron } from "@/utils/cron";
import {
  makeWorkerUtils,
  parseCronItems,
  run,
  type TaskSpec,
  type WorkerUtils,
  type ParsedCronItem,
} from "graphile-worker";

export const SYNC_FEED = "sync-feed";
export const SYNC_ALL = "sync-all";

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
  let parsedCrons: ParsedCronItem[] = [];

  try {
    const preference = await getPreference(SyncFrequencyPreference);
    const cron = toCron(preference);
    parsedCrons = parseCronItems([buildSyncAllCronItem(cron)]);
    console.log(`[graphile-worker] Sync schedule: ${cron}`);
  } catch {
    console.warn(
      "[graphile-worker] Could not load sync preference, starting without cron schedule",
    );
  }

  try {
    await run({
      connectionString: process.env.POSTGRES_URL!,
      concurrency,
      taskList: {
        [SYNC_FEED]: syncFeedTask,
        [SYNC_ALL]: syncAllTask,
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
