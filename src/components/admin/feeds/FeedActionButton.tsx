"use client";

import { Button } from "@/components/ui/button";
import { editFeed } from "@/domains/feeds/triggers";
import { Feed } from "@/domains/feeds/types";

export function FeedActionButton({ feed }: { feed: Feed }) {
  return <Button onClick={() => editFeed(feed)}>Edit Feed</Button>;
}
