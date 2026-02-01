"use server";

import prisma from "@/lib/prisma";
import { SyncJobQuery } from "@/domains/jobs/schemas";
import {
  buildOrderBy,
  buildWhere,
} from "@/domains/jobs/query-converter";
import { Feed } from "@/domains/feeds/types";

export const fetchJobsWithQuery = async (query: SyncJobQuery) => {
  return prisma.syncJob
    .paginate({
      orderBy: buildOrderBy(query),
      include: {
        feed: true,
      },
      where: {
        parentId: null,
        ...buildWhere(query),
      },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
};

export const fetchJobsByFeedWithQuery = async (
  feed: Feed,
  query: SyncJobQuery,
) => {
  return prisma.syncJob
    .paginate({
      orderBy: buildOrderBy(query),
      include: {
        feed: true,
      },
      where: {
        feedId: feed.id,
        ...buildWhere(query),
      },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
};

export async function fetchJobById(id: string) {
  return prisma.syncJob.findFirst({
    include: {
      feed: true,
    },
    where: {
      id,
    },
  });
}

export async function fetchChildJobsByParentId(
  parentId: string,
  query: SyncJobQuery,
) {
  return prisma.syncJob
    .paginate({
      orderBy: buildOrderBy(query),
      include: {
        feed: true,
      },
      where: {
        parentId,
        ...buildWhere(query),
      },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
}
