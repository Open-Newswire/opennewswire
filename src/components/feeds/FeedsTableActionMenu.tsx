import {
  activateFeed,
  deactivateFeed,
  deleteFeed,
  editFeed,
  enqueueSync,
  refreshLogo,
} from "@/triggers/feeds";
import { FeedsWithLicenseAndLanguage } from "@/types/feeds";
import {
  ActionIcon,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

export function FeedTableActionMenu({
  feed,
}: {
  feed: FeedsWithLicenseAndLanguage;
}) {
  async function handleDelete() {
    await deleteFeed(feed);
  }

  async function handleActivate() {
    await activateFeed(feed);
  }

  async function handleDeactivate() {
    await deactivateFeed(feed);
  }

  async function handleSync() {
    await enqueueSync(feed);
  }

  async function handleLogoRefresh() {
    await refreshLogo(feed);
  }

  function handleEdit() {
    editFeed(feed);
  }

  return (
    <Menu>
      <MenuTarget>
        <ActionIcon variant="subtle">
          <IconDots size="1rem" />
        </ActionIcon>
      </MenuTarget>
      <MenuDropdown>
        <MenuItem onClick={handleSync}>Sync Articles</MenuItem>
        {feed.isActive ? (
          <MenuItem onClick={handleDeactivate}>Deactivate</MenuItem>
        ) : (
          <MenuItem onClick={handleActivate}>Activate</MenuItem>
        )}
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleLogoRefresh}>Refresh Logo</MenuItem>
        <MenuDivider />
        <MenuItem color="red" onClick={handleDelete}>
          Delete
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
