import { run } from "@/domains/sync/executor";
import prisma from "@/lib/prisma";
import { type Helpers, type Task } from "graphile-worker";

interface SyncFeedPayload {
  jobId: string;
}

const syncFeed: Task = async (payload: unknown, helpers: Helpers) => {
  const { jobId } = payload as SyncFeedPayload;

  const job = await prisma.syncJob.findUniqueOrThrow({
    where: { id: jobId },
  });

  await run(job);
};

export default syncFeed;
