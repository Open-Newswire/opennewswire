"use server";

import { requireAuth } from "@/domains/auth/wrapper";
import { SyncJobQuery } from "@/domains/jobs/schemas";
import * as JobService from "@/domains/jobs/service";
import { Feed } from "@/domains/feeds/types";

/**
 * Fetches sync jobs, paginated.
 *
 * @param params Pagination query parameters
 * @returns Sync jobs and pagination metadata
 */
export const fetchJobs = requireAuth(async function fetchJobs(
  query: SyncJobQuery,
) {
  return JobService.fetchJobsWithQuery(query);
});

export const fetchJobsByFeed = requireAuth(async function fetchJobsByFeed(
  feed: Feed,
  query: SyncJobQuery,
) {
  return JobService.fetchJobsByFeedWithQuery(feed, query);
});

/**
 * Fetches a sync job by ID.
 *
 * @param id ID to query by
 * @returns The job if found, null otherwise
 */
export const fetchJob = requireAuth(async function fetchJob(id: string) {
  return JobService.fetchJobById(id);
});

export const fetchChildJobs = requireAuth(async function fetchChildJobs(
  parentId: string,
  query: SyncJobQuery,
) {
  return JobService.fetchChildJobsByParentId(parentId, query);
});
