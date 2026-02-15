"use client";

import { FeedIcon } from "@/components/admin/feeds/FeedIcon";
import { FeedTableActionMenu } from "@/components/admin/feeds/FeedsTableActionMenu";
import { LicenseBadge } from "@/components/admin/licenses/LicenseBadge";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { FeedsWithLicenseAndLanguage } from "@/domains/feeds/types";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<FeedsWithLicenseAndLanguage>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const feed = row.original;

      return (
        <div className="flex items-center gap-3">
          <FeedIcon
            source={feed.iconSource}
            faviconUrl={feed.iconUrl}
            assetUrl={feed.iconAssetUrl}
            display="inline-block"
            style={{ verticalAlign: "bottom" }}
          />
          <Link
            href={`/admin/feeds/${feed.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {feed.title}
          </Link>
          {!feed.isActive && (
            <Badge variant="secondary" className="text-xs">
              Inactive
            </Badge>
          )}
        </div>
      );
    },
    meta: {
      displayName: "Title",
      headClassName: "w-[25%]",
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 break-all">{row.original.url}</div>
    ),
    meta: {
      displayName: "URL",
      headClassName: "w-[40%]",
    },
  },
  {
    accessorKey: "license",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="License" />
    ),
    cell: ({ row }) => {
      const license = row.original.license;
      return license ? <LicenseBadge license={license} /> : null;
    },
    meta: {
      displayName: "License",
      headClassName: "w-[15%]",
    },
  },
  {
    accessorKey: "language",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Language" />
    ),
    cell: ({ row }) => {
      const language = row.original.language;
      return language ? (
        <span className="text-sm">{language.name}</span>
      ) : null;
    },
    meta: {
      displayName: "Language",
      headClassName: "w-[15%]",
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center justify-center">
        <Zap className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => <FeedTableActionMenu feed={row.original} />,
    meta: {
      displayName: "Actions",
      headClassName: "w-[50px]",
    },
  },
];
