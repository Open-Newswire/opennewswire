import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { type Helpers, type Task } from "graphile-worker";

interface CollectSyncResultsPayload {
  jobId: string;
  attempt?: number;
}

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 30_000;

const collectSyncResults: Task = async (
  payload: unknown,
  helpers: Helpers,
) => {
  const { jobId, attempt = 0 } = payload as CollectSyncResultsPayload;

  const parentJob = await prisma.syncJob.findUnique({
    where: { id: jobId },
  });

  if (!parentJob) {
    helpers.logger.error(`Parent job ${jobId} not found`);
    return;
  }

  // Check if all child jobs are done
  const pendingCount = await prisma.syncJob.count({
    where: {
      parentId: parentJob.id,
      status: { in: [Status.NOT_STARTED, Status.IN_PROGRESS] },
    },
  });

  if (pendingCount > 0) {
    if (attempt >= MAX_RETRIES) {
      helpers.logger.warn(
        `Giving up waiting for ${pendingCount} pending child jobs after ${MAX_RETRIES} attempts`,
      );
    } else {
      // Re-enqueue with delay to check again later
      await helpers.addJob(
        "collectSyncResults",
        { jobId, attempt: attempt + 1 },
        { runAt: new Date(Date.now() + RETRY_DELAY_MS) },
      );
      return;
    }
  }

  // Aggregate results
  const childStatuses = await prisma.syncJob.groupBy({
    by: ["status"],
    where: { parentId: parentJob.id },
    _count: { status: true },
  });

  const totalSuccess =
    childStatuses.find((s) => s.status === Status.COMPLETED)?._count.status ??
    0;
  const totalFailure =
    childStatuses.find((s) => s.status === Status.FAILED)?._count.status ?? 0;

  await prisma.syncJob.update({
    where: { id: parentJob.id },
    data: {
      status: Status.COMPLETED,
      completedAt: new Date(),
      totalSuccess,
      totalFailure,
    },
  });

  helpers.logger.info(
    `Collected results for ${parentJob.id}: ${totalSuccess} success, ${totalFailure} failed`,
  );
};

export default collectSyncResults;