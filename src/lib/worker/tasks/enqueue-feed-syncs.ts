import prisma from "@/lib/prisma";
import { Status, Trigger } from "@prisma/client";
import { type Helpers, type Task } from "graphile-worker";

interface EnqueueFeedSyncsPayload {
  trigger?: "MANUAL" | "AUTOMATIC";
}

const enqueueFeedSyncs: Task = async (
  payload: unknown,
  helpers: Helpers,
) => {
  const { trigger = "AUTOMATIC" } = (payload ?? {}) as EnqueueFeedSyncsPayload;

  const activeFeeds = await prisma.feed.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  if (activeFeeds.length === 0) {
    helpers.logger.info("No active feeds to sync");
    return;
  }

  // Create parent SyncJob for this batch
  const parentJob = await prisma.syncJob.create({
    data: {
      status: Status.IN_PROGRESS,
      trigger: trigger === "MANUAL" ? Trigger.MANUAL : Trigger.AUTOMATIC,
      triggeredAt: new Date(),
    },
  });

  // Create child SyncJob records for each active feed
  const childJobs = await prisma.syncJob.createManyAndReturn({
    data: activeFeeds.map((feed) => ({
      feedId: feed.id,
      status: Status.NOT_STARTED,
      trigger: parentJob.trigger,
      triggeredAt: new Date(),
      parentId: parentJob.id,
    })),
  });

  // Enqueue a syncFeed job for each child
  for (const child of childJobs) {
    await helpers.addJob("syncFeed", { jobId: child.id });
  }

  // Enqueue collectSyncResults with a delay to give feed syncs time to complete
  await helpers.addJob(
    "collectSyncResults",
    { jobId: parentJob.id },
    { runAt: new Date(Date.now() + 60_000) },
  );

  helpers.logger.info(
    `Enqueued ${childJobs.length} feed syncs (parent: ${parentJob.id})`,
  );
};

export default enqueueFeedSyncs;
