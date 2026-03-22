import { addJob, SYNC_ALL } from "@/lib/worker";
import { toCron } from "@/utils/cron";
import { CronExpressionParser } from "cron-parser";

/**
 * Schedules the next sync-all job based on the given frequency preference.
 * Uses addJob to insert into the database, so it works across processes
 * (e.g. Next.js server action → Graphile Worker process).
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
