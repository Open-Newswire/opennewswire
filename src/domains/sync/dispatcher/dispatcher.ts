/**
 * The dispatcher is responsible for receiving sync job requests and dispatching them to workers.
 */
import { Feed } from "@/domains/feeds/types";
import prisma from "@/lib/prisma";
import { Status, Trigger } from "@/lib/prisma-client";
import { addJob, SYNC_ALL, SYNC_FEED } from "@/lib/worker";

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
