"use client";

import { Button } from "@/components/ui/button";
import { editFeed } from "@/triggers/feeds";
import { Feed } from "@/types/feeds";

export function FeedActionButton({ feed }: { feed: Feed }) {
  return <Button onClick={() => editFeed(feed)}>Edit Feed</Button>;
}
