/**
 * The dispatcher is responsible for receiving sync job requets and dispatching them to workers.
 */
import prisma from "@/lib/prisma";
import { QStashBroker } from "@/services/sync/dispatcher/qstash-broker";
import { Feed } from "@/types/feeds";
import { Status, SyncJob, Trigger } from "@prisma/client";

export interface MessageBroker {
  publish(message: MessageBrokerPayload): Promise<void>;
  publishBulk(messages: MessageBrokerPayload[]): Promise<void>;
}

export interface MessageBrokerPayload {
  url: string;
  body: any;
}

let broker: MessageBroker = new QStashBroker();

// For local development, we run QStash in a Docker container. We need to use the host machine's Docker DNS name to connect to it
const HOST =
  process.env.NODE_ENV === "development"
    ? "http://host.docker.internal:3000"
    : process.env.NEXT_PUBLIC_WEBSITE_URL;
const BASE_URL = HOST + "/api/jobs";

export async function dispatchSync(feed: Feed) {
  const job = await prisma.syncJob.create({
    data: {
      feedId: feed.id,
      status: Status.NOT_STARTED,
      trigger: Trigger.MANUAL,
      triggeredAt: new Date(),
    },
  });

  await broker.publish({
    url: BASE_URL + "/sync-feed",
    body: {
      jobId: job.id,
    },
  });
}

export async function dispatchAllSync() {
  await broker.publish({
    url: BASE_URL + "/sync-all",
    body: {
      isAutomatic: false,
    },
  });
}

export async function dispatchChildSync(parentJob: SyncJob) {
  const feedIds = await prisma.feed.findMany({
    select: {
      id: true,
      isActive: true,
    },
  });

  const jobs = await prisma.syncJob.createManyAndReturn({
    data: feedIds
      .filter((feed) => feed.isActive)
      .map((feed) => {
        return {
          feedId: feed.id,
          status: Status.NOT_STARTED,
          trigger: parentJob.trigger,
          triggeredAt: new Date(),
          parentId: parentJob.id,
        };
      }),
  });

  // Dispatch messages for every child job
  const messages = jobs.map(({ id }) => ({
    body: {
      jobId: id,
    },
    url: BASE_URL + "/sync-feed",
  }));

  await broker.publishBulk(messages);

  // Dispatch a message to collect results after jobs complete
  await broker.publish({
    body: {
      jobId: parentJob.id,
    },
    url: BASE_URL + "/collect-results",
  });
}
