import {
  getPreference,
  registerSyncAllDiagnostics,
  registerUpdateHook,
} from "@/domains/app-preferences/service";
import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { toCron } from "@/utils/cron";
import {
  run,
  parseCronItem,
  type Runner,
  type TaskList,
  type ParsedCronItem,
  type TaskSpec,
} from "graphile-worker";
import enqueueFeedSyncs from "./tasks/enqueue-feed-syncs";
import syncFeed from "./tasks/sync-feed";
import collectSyncResults from "./tasks/collect-sync-results";
import syncSingleFeed from "./tasks/sync-single-feed";

const CONCURRENCY = 5;

const taskList: TaskList = {
  enqueueFeedSyncs,
  syncFeed,
  collectSyncResults,
  syncSingleFeed,
};

declare global {
  var _graphileRunner: Runner | undefined;
  var _graphileRunnerStarting: Promise<void> | undefined;
}

async function buildCronItems(): Promise<ParsedCronItem[]> {
  const preference = await getPreference(SyncFrequencyPreference);
  const cron = toCron(preference);

  return [
    parseCronItem({
      task: "enqueueFeedSyncs",
      match: cron,
      payload: { trigger: "AUTOMATIC" },
    }),
  ];
}

export async function startWorker(): Promise<void> {
  if (global._graphileRunner) {
    console.log("[graphile-worker] Worker already running, skipping start");
    return;
  }

  if (global._graphileRunnerStarting) {
    return global._graphileRunnerStarting;
  }

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error(
      "[graphile-worker] POSTGRES_URL not set, cannot start worker",
    );
    return;
  }

  global._graphileRunnerStarting = (async () => {
    const cronItems = await buildCronItems();

    const runner = await run({
      connectionString,
      concurrency: CONCURRENCY,
      noHandleSignals: true,
      pollInterval: 1000,
      taskList,
      parsedCronItems: cronItems,
    });

    global._graphileRunner = runner;

    // Register hooks so preference changes restart the worker
    registerUpdateHook(SyncFrequencyPreference.key, async () => {
      await restartWorker();
    });
    registerSyncAllDiagnostics(isWorkerRunning, startWorker);

    console.log("[graphile-worker] Worker started");
  })();

  try {
    await global._graphileRunnerStarting;
  } finally {
    global._graphileRunnerStarting = undefined;
  }
}

export async function stopWorker(): Promise<void> {
  const runner = global._graphileRunner;
  if (!runner) return;

  await runner.stop();
  global._graphileRunner = undefined;
  console.log("[graphile-worker] Worker stopped");
}

export async function restartWorker(): Promise<void> {
  console.log("[graphile-worker] Restarting worker...");
  await stopWorker();
  await startWorker();
}

export async function addJob(
  taskName: string,
  payload?: Record<string, unknown>,
  spec?: TaskSpec,
): Promise<void> {
  const runner = global._graphileRunner;
  if (!runner) {
    throw new Error(
      "[graphile-worker] Worker not running — cannot add job",
    );
  }

  await runner.addJob(taskName, payload, spec);
}

export function isWorkerRunning(): boolean {
  return global._graphileRunner !== undefined;
}
