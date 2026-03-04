/**
 * The dispatcher is responsible for receiving sync job requests and dispatching them to workers.
 */
import { addJob } from "@/lib/worker";
import { Feed } from "@/domains/feeds/types";

export async function dispatchSync(feed: Feed) {
  await addJob("syncSingleFeed", { feedId: feed.id, trigger: "MANUAL" });
}

export async function dispatchAllSync() {
  await addJob("enqueueFeedSyncs", { trigger: "MANUAL" });
}
