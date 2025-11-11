import { SyncJobQuery } from "@/schemas/sync-jobs";
import { Prisma } from "@prisma/client";

export function buildOrderBy(query: SyncJobQuery) {
  return {
    [query.sortBy]: query.sortDirection,
  };
}

export function buildWhere(query: SyncJobQuery) {
  let where: Prisma.SyncJobWhereInput = {};

  if (query.status) {
    // @ts-ignore
    where.status = statusMap[query.status];
  }

  if (query.trigger) {
    // @ts-ignore
    where.trigger = triggerMap[query.trigger];
  }

  return where;
}

const statusMap = {
  "not-started": "NOT_STARTED",
  "in-progress": "IN_PROGRESS",
  failed: "FAILED",
  completed: "COMPLETED",
};

const triggerMap = {
  manual: "MANUAL",
  automatic: "AUTOMATIC",
};
