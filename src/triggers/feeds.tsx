"use client";

import * as actions from "@/actions/feeds";
import { ModalType } from "@/components/modals/modal-types";
import { FeedPreview } from "@/types/feeds";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Feed } from "@prisma/client";

export function addFeed() {
  modals.openContextModal({
    modal: ModalType.FindFeed,
    title: "Add Feed",
    size: "sm",
    innerProps: {
      onNext: (feedPreview: FeedPreview) => {
        modals.openContextModal({
          modal: ModalType.AddFeed,
          title: "Add Feed",
          size: "lg",
          innerProps: { feedPreview },
        });
      },
    },
  });
}

export function editFeed(feed: Feed) {
  modals.openContextModal({
    modal: ModalType.EditFeed,
    title: "Edit Feed",
    size: "lg",
    innerProps: { feed },
  });
}

export async function activateFeed(feed: Feed) {
  await actions.activateFeed(feed.id);

  notifications.show({
    title: "Feed Activated",
    message: `${feed.title} has been activated. Articles from this feed will appear in OpenNewswire.`,
  });
}

export async function deactivateFeed(feed: Feed) {
  await actions.deactivateFeed(feed.id);

  notifications.show({
    title: "Feed Deactivated",
    message: `${feed.title} has been deactivated. Articles from this feed will not appear in OpenNewswire.`,
  });
}

export async function refreshLogo(feed: Feed) {
  await actions.refreshLogo(feed.id);

  notifications.show({
    title: "Logo Refreshed",
    message: `${feed.title}'s logo has been refreshed'.`,
    color: "green",
  });
}

export async function deleteFeed(feed: Feed) {
  modals.openConfirmModal({
    title: "Delete Feed",
    centered: true,
    children: (
      <>
        <Text size="sm">
          Are you sure you want to delete <strong>{feed.title}</strong>?
        </Text>
        <Text size="sm" mt="sm">
          Articles from this feed will be immediately removed and no longer
          synced.
        </Text>
      </>
    ),
    labels: { confirm: "Delete Feed", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      await actions.deleteFeed(feed.id);

      notifications.show({
        title: "Feed Deleted",
        message: `${feed.title} has been removed.`,
      });
    },
  });
}

export async function enqueueSync(feed: Feed) {
  await actions.enqueueSync(feed.id);

  notifications.show({
    title: "Sync started",
    message: `${feed.title} has been queued up for sync.`,
  });
}

export async function enqueueAllSync() {
  await actions.enqueueAllSync();

  notifications.show({
    title: "Sync started",
    message: `All active feeds have been queued up for sync.`,
  });
}
