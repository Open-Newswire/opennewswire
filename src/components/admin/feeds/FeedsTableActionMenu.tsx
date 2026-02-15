"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  activateFeed,
  deactivateFeed,
  deleteFeed,
  editFeed,
  enqueueSync,
  refreshLogo,
} from "@/domains/feeds/triggers";
import { FeedsWithLicenseAndLanguage } from "@/domains/feeds/types";
import { MoreHorizontal } from "lucide-react";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSync}>Sync Articles</DropdownMenuItem>
        {feed.isActive ? (
          <DropdownMenuItem onClick={handleDeactivate}>
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleActivate}>Activate</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogoRefresh}>
          Refresh Logo
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
