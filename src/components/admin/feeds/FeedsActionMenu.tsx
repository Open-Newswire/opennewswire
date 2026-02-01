"use client";

import { ActionMenu } from "@/components/ActionMenu";
import {
  activateFeed,
  deactivateFeed,
  deleteFeed,
  enqueueSync,
  refreshLogo,
} from "@/domains/feeds/triggers";
import { FeedsWithLicenseAndLanguage } from "@/domains/feeds/types";
import { MenuDivider, MenuItem } from "@mantine/core";

export function FeedsActionMenu({
  feed,
}: {
  feed: FeedsWithLicenseAndLanguage;
}) {
  async function handleDelete() {
    await deleteFeed(feed);
  }

  async function handleSync() {
    await enqueueSync(feed);
  }

  async function handleActivate() {
    await activateFeed(feed);
  }

  async function handleDeactivate() {
    await deactivateFeed(feed);
  }

  async function handleLogoRefresh() {
    await refreshLogo(feed);
  }

  return (
    <ActionMenu>
      <MenuItem onClick={handleSync}>Sync Articles</MenuItem>
      {feed.isActive ? (
        <MenuItem onClick={handleDeactivate}>Deactivate</MenuItem>
      ) : (
        <MenuItem onClick={handleActivate}>Activate</MenuItem>
      )}
      <MenuItem onClick={handleLogoRefresh}>Refresh Logo</MenuItem>
      <MenuDivider />
      <MenuItem color="red" onClick={handleDelete}>
        Delete
      </MenuItem>
    </ActionMenu>
  );
}
