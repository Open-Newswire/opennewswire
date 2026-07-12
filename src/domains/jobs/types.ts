import { Prisma } from "@/lib/prisma-client";

export type SyncJobWithFeed = Prisma.SyncJobGetPayload<{
  include: { feed: true };
}>;
