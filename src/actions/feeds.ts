"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import prisma from "@/lib/prisma";
import { FeedQuery, FeedSchema, SaveFeedParams } from "@/schemas/feeds";
import * as FeedService from "@/services/feeds";
import { FeedPreview } from "@/types/feeds";
import { revalidatePath } from "next/cache";

/**
 * Fetches a list of feeds satisfying the provided query, paginated.
 *
 * @param query Filtering query
 * @returns List of feeds
 */
export const fetchFeeds = requireAuth(async function fetchFeeds(
  query: FeedQuery,
) {
  return FeedService.fetchFeeds(query);
});

/**
 * Returns a feed by id, if it exists.
 *
 * @param id String of the feed's id
 * @returns Feed, if exists
 */
export const fetchFeedById = requireAuth(async function fetchFeedById(
  id: string,
) {
  return FeedService.fetchFeedById(id);
});

/**
 * Saves a new feed for the app to track.
 *
 * @param feed Feed details to save
 */
export const saveNewFeed = requireAuth(async function saveNewFeed(
  feedParams: SaveFeedParams,
) {
  const feed = FeedSchema.parse(feedParams);
  const savedFeed = await FeedService.saveFeed(feed);

  revalidatePath("/admin/feeds");

  return savedFeed;
});

/**
 * Updates a feed's metadata. Input parameters are validated before saving.
 *
 * @param id ID of the feed to update
 * @param feedParams Object containg feed metadata
 * @returns The newly updated feed
 */
export const updateFeed = requireAuth(async function updateFeed(
  id: string,
  feedParams: SaveFeedParams,
) {
  const feed = FeedSchema.parse(feedParams);

  const updatedFeed = await FeedService.updateFeed(id, feed);

  revalidatePath(`/admin/feeds/${id}`);

  return updatedFeed;
});

/**
 * Deletes a feed.
 *
 * @param id ID of the feed to delete
 */
export const deleteFeed = requireAuth(async function deleteFeed(id: string) {
  await FeedService.deleteFeed(id);

  revalidatePath(`/admin/feeds/${id}`);
});

/**
 * Fetches a feed from the provided url and returns a summary of the feed's metadata.
 * Used to pre-populate the Add Feed form with basic metadata.
 *
 * @param url The url of the feed
 * @returns Summary object
 */
export const getFeedSummary = requireAuth(async function getFeedSummary(
  url: string,
): Promise<FeedPreview> {
  // TODO: Validate url

  try {
    return FeedService.fetchFeedPreview(url);
  } catch (e) {
    throw e;
  }
});

export const enqueueSync = requireAuth(async function enqueueSync(
  feedId: string,
) {
  const feed = await prisma.feed.findFirst({ where: { id: feedId } });
  if (!feed) {
    return;
  }

  await FeedService.triggerSync(feedId);

  revalidatePath(`/admin/jobs`);
});

export const enqueueAllSync = requireAuth(async function enqueueAllSync() {
  await FeedService.triggerAllSync();

  revalidatePath(`/admin/jobs`);
});

/**
 * Marks a feed as active, which means it appears in the visitor view.
 */
export const activateFeed = requireAuth(async function activateFeed(
  id: string,
) {
  await FeedService.activateFeed(id);

  revalidatePath(`/admin/feeds/${id}`);
});

/**
 * Marks a feed as active, which means articles from this feed do not appear visitor view.
 */
export const deactivateFeed = requireAuth(async function deactivateFeed(
  id: string,
) {
  await FeedService.deactivateFeed(id);

  revalidatePath(`/admin/feeds/${id}`);
});

/**
 * Refetches and saves the favicon logo for the given feed.
 *
 * @param id The feed to refresh
 */
export const refreshLogo = requireAuth(async function refreshLogo(id: string) {
  await FeedService.refreshLogo(id);

  revalidatePath(`/admin/feeds/${id}`);
});
