"use client";

import { updateFeed } from "@/actions/feeds";
import { SaveFeedParams } from "@/schemas/feeds";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Feed } from "@prisma/client";
import { FeedDetailsEditor } from "../FeedDetailsEditor";

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
