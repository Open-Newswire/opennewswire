import { DatabaseLogger } from "@/domains/sync/db-logger";
import { Context } from "@/domains/sync/types";
import prisma from "@/lib/prisma";
import { Status, SyncJob } from "@prisma/client";
import { sub } from "date-fns";
import { execute } from "./job";

export async function run(job: SyncJob) {
  const logger = new DatabaseLogger(job);

  try {
    logger.info(`Starting job for feedId ${job.feedId}`);
    const feed = await prisma.feed.findFirst({ where: { id: job.feedId! } });

    if (!feed) {
      logger.error(`Error fetching feed for feedId ${job.feedId}`);
      await markFailure(job);
      return;
    }

    // TODO: Fetch configured retention policy
    const retentionPolicy = {
      cutoffDate: sub(new Date(), {
        days: 30,
      }),
      minimumItems: 10,
    };

    const context: Context = {
      logger,
      feed,
      policy: retentionPolicy,
      count: 0,
    };

    await execute(context);

    logger.info("Completed sync");
    await markSuccess(job);
  } catch (err: any) {
    logger.error(`Error executing sync. ${err.message}`);
    await markFailure(job);
  } finally {
    await logger.flush();
  }
}

async function markSuccess(job: SyncJob) {
  await prisma.syncJob.update({
    where: {
      id: job.id,
    },
    data: {
      status: Status.COMPLETED,
      completedAt: new Date(),
    },
  });
}

async function markFailure(job: SyncJob) {
  await prisma.syncJob.update({
    where: {
      id: job.id,
    },
    data: {
      status: Status.FAILED,
    },
  });
}
