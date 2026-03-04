import { run } from "@/domains/sync/executor";
import prisma from "@/lib/prisma";
import { Status, Trigger } from "@prisma/client";
import { type Helpers, type Task } from "graphile-worker";

interface SyncSingleFeedPayload {
  feedId: string;
  trigger?: "MANUAL" | "AUTOMATIC";
}

const syncSingleFeed: Task = async (
  payload: unknown,
  helpers: Helpers,
) => {
  const { feedId, trigger = "MANUAL" } = payload as SyncSingleFeedPayload;

  const job = await prisma.syncJob.create({
    data: {
      feedId,
      status: Status.NOT_STARTED,
      trigger: trigger === "MANUAL" ? Trigger.MANUAL : Trigger.AUTOMATIC,
      triggeredAt: new Date(),
    },
  });

  await run(job);
};

export default syncSingleFeed;