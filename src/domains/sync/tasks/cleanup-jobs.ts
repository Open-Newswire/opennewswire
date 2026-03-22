import prisma from "@/lib/prisma";
import { SyncJobHistoryRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { sub } from "date-fns";
import { Task } from "graphile-worker";

export const cleanupJobsTask: Task = async (_payload, _helpers) => {
  const retentionPolicy = await getPreference(
    SyncJobHistoryRetentionPreference,
  );
  const cutoffDate = sub(new Date(), {
    [retentionPolicy.unit]: retentionPolicy.period,
  });

  await prisma.syncJob.deleteMany({
    where: {
      triggeredAt: {
        lt: cutoffDate,
      },
    },
  });

  console.info("Sync job history cleaned up");
};
