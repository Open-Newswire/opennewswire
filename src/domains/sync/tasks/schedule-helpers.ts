import { addJob, SYNC_ALL } from "@/lib/worker";
import { toCron } from "@/utils/cron";
import { CronExpressionParser } from "cron-parser";
import { CronItem } from "graphile-worker";

export function buildSyncAllCronItem(cron: string): CronItem {
  return {
    task: SYNC_ALL,
    match: cron,
    options: {
      backfillPeriod: 0,
      jobKey: "scheduled-sync-all",
      jobKeyMode: "replace",
    },
    payload: { isAutomatic: true },
    identifier: "scheduled-sync-all",
  };
}

/**
 * Reschedules the next sync-all job immediately using addJob with a computed runAt.
 * Called when the sync frequency preference changes at runtime.
 */
export async function rescheduleNextSyncAll(preference: {
  period: number;
  unit: "minutes" | "hours" | "days";
}) {
  const cron = toCron(preference);
  const runAt = CronExpressionParser.parse(cron).next().toDate();

  await addJob(
    SYNC_ALL,
    { isAutomatic: true },
    {
      runAt,
      jobKey: "scheduled-sync-all",
      jobKeyMode: "replace",
    },
  );
}
