import prisma from "@/lib/prisma";
import { Context } from "@/domains/sync/types";
import { Status, SyncJob } from "@prisma/client";
import { sub } from "date-fns";
import { execute } from "../job/job";

class BasicDbLogger {
  private job: SyncJob;
  private log: string[] = [];

  constructor(job: SyncJob) {
    this.job = job;
  }

  async info(message: string) {
    console.log(message);
    await this.write(message);
  }

  async error(message: string) {
    console.error(message);
    await this.write(message);
  }

  async flush() {
    await prisma.syncJob.update({
      where: {
        id: this.job.id,
      },
      data: {
        log: this.log,
      },
    });
  }

  private async write(message: string) {
    this.log.push(message);
  }
}

export async function run(job: SyncJob) {
  const logger = new BasicDbLogger(job);

  try {
    await logger.info(`Starting job for feedId ${job.feedId}`);
    const feed = await prisma.feed.findFirst({ where: { id: job.feedId! } });

    if (!feed) {
      await logger.error(`Error fetching feed for feedId ${job.feedId}`);
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

    await logger.info("Completed sync");
    await markSuccess(job);
  } catch (err: any) {
    await logger.error(`Error executing sync. ${err.message}`);
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
