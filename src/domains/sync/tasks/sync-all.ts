import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import prisma from "@/lib/prisma";
import { addJob, SYNC_FEED } from "@/lib/worker";
import { Status, Trigger } from "@prisma/client";
import { Task } from "graphile-worker";
import { rescheduleNextSyncAll } from "./schedule-helpers";

interface SyncAllPayload {
  isAutomatic?: boolean;
}

export const syncAllTask: Task = async (payload, _helpers) => {
  const { isAutomatic } = payload as SyncAllPayload;
  const trigger = isAutomatic ? Trigger.AUTOMATIC : Trigger.MANUAL;

  // Schedule the next run first, so it's always queued even if this run fails
  if (isAutomatic) {
    const preference = await getPreference(SyncFrequencyPreference);
    await rescheduleNextSyncAll(preference);
  }

  const parentJob = await prisma.syncJob.create({
    data: {
      status: Status.IN_PROGRESS,
      trigger,
      triggeredAt: new Date(),
    },
  });

  const activeFeeds = await prisma.feed.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  if (activeFeeds.length === 0) {
    await prisma.syncJob.update({
      where: { id: parentJob.id },
      data: {
        status: Status.COMPLETED,
        completedAt: new Date(),
        totalSuccess: 0,
        totalFailure: 0,
      },
    });
    return;
  }

  const childJobs = await prisma.syncJob.createManyAndReturn({
    data: activeFeeds.map((feed) => ({
      feedId: feed.id,
      status: Status.NOT_STARTED,
      trigger,
      triggeredAt: new Date(),
      parentId: parentJob.id,
    })),
  });

  for (const child of childJobs) {
    await addJob(SYNC_FEED, { jobId: child.id });
  }
};
