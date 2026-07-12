"use client";

import { FeedDetailsEditor } from "@/components/admin/feeds/FeedDetailsEditor";
import { updateFeed } from "@/domains/feeds/actions";
import { SaveFeedParams } from "@/domains/feeds/schemas";
import { Feed } from "@/lib/prisma-client";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function EditFeedModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ feed: Feed }>) {
  async function handleSave(updatedFeed: SaveFeedParams) {
    await updateFeed(innerProps.feed.id, updatedFeed);
    context.closeModal(id);

    notifications.show({
      title: "Feed Updated",
      message: `${innerProps.feed.title} has been updated.`,
    });
  }

  function handleCancel() {
    context.closeModal(id);
  }

  // @ts-ignore
  return (
    <FeedDetailsEditor
      // @ts-ignore
      feed={innerProps.feed}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
