import { run } from "@/domains/sync/executor";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { Task } from "graphile-worker";

interface SyncFeedPayload {
  jobId: string;
}

export const syncFeedTask: Task = async (payload, _helpers) => {
  const { jobId } = payload as SyncFeedPayload;

  const job = await prisma.syncJob.findUniqueOrThrow({
    where: { id: jobId },
    include: { feed: true },
  });

  await run(job);

  // If this is a child job, check if all siblings are done
  if (job.parentId) {
    await maybeCollectResults(job.parentId);
  }
};

async function maybeCollectResults(parentId: string) {
  const incomplete = await prisma.syncJob.count({
    where: {
      parentId,
      status: { in: [Status.NOT_STARTED, Status.IN_PROGRESS] },
    },
  });

  if (incomplete > 0) {
    return;
  }

  const childStatuses = await prisma.syncJob.groupBy({
    by: ["status"],
    where: { parentId },
    _count: { status: true },
  });

  const totalSuccess =
    childStatuses.find((s) => s.status === Status.COMPLETED)?._count.status ??
    0;
  const totalFailure =
    childStatuses.find((s) => s.status === Status.FAILED)?._count.status ?? 0;

  await prisma.syncJob.update({
    where: { id: parentId },
    data: {
      status: Status.COMPLETED,
      completedAt: new Date(),
      totalSuccess,
      totalFailure,
    },
  });
}
