import { Prisma } from "@prisma/client";

export type SyncJobWithFeed = Prisma.SyncJobGetPayload<{
  include: { feed: true };
}>;
