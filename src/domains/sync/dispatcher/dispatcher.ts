/**
 * The dispatcher is responsible for receiving sync job requests and dispatching them to workers.
 */
import prisma from "@/lib/prisma";
import { addJob, SYNC_FEED, SYNC_ALL } from "@/lib/worker";
import { Feed } from "@/domains/feeds/types";
import { Status, Trigger } from "@prisma/client";

export async function dispatchSync(feed: Feed) {
  const job = await prisma.syncJob.create({
    data: {
      feedId: feed.id,
      status: Status.NOT_STARTED,
      trigger: Trigger.MANUAL,
      triggeredAt: new Date(),
    },
  });

  await addJob(SYNC_FEED, { jobId: job.id });
}

export async function dispatchAllSync() {
  await addJob(SYNC_ALL, { isAutomatic: false });
}
