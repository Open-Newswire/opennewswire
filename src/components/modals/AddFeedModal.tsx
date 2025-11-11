"use client";

import { saveNewFeed } from "@/actions/feeds";
import { FeedDetailsEditor } from "@/components/FeedDetailsEditor";
import { Feed, FeedPreview } from "@/types/feeds";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function AddFeedModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ feedPreview: FeedPreview }>) {
  async function handleSave(feedParams: Feed) {
    const feed = await saveNewFeed(feedParams);
    context.closeModal(id);
    notifications.show({
      title: "Feed Added",
      message: `Open Newswire will automatically download new items from ${feed.title}.`,
      color: "green",
    });
  }

  return (
    <FeedDetailsEditor
      feed={innerProps.feedPreview}
      // @ts-ignore
      onSave={handleSave}
      onCancel={() => context.closeModal(id)}
    />
  );
}
