"use client";

import { FeedIcon } from "@/components/feeds/FeedIcon";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ArticleWithFeedLicenseAndLanguage } from "@/types/article";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

export const columns: ColumnDef<ArticleWithFeedLicenseAndLanguage>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const article = row.original;

      return (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 relative">
              <FeedIcon
                source={article.feed.iconSource}
                faviconUrl={article.feed.iconUrl}
                assetUrl={article.feed.iconAssetUrl}
                display="inline-block"
                mr="1rem"
                style={{ verticalAlign: "bottom" }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <a
              target="_blank"
              rel="noreferrer"
              href={article.link!}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              {article.title}
            </a>
            {article.isHidden && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Hidden
              </Badge>
            )}
          </div>
        </div>
      );
    },
    meta: {
      displayName: "Title",
      headClassName: "w-[35%]",
    },
  },
  {
    accessorKey: "date",
    accessorFn: (row) => (row.date ? format(row.date, "PP p") : null),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publication Date" />
    ),
    meta: {
      displayName: "Publication Date",
      headClassName: "w-[15%]",
    },
  },
  {
    accessorKey: "feed.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feed" />
    ),
    cell: ({ row }) => {
      const feed = row.original.feed;
      return (
        <Link
          href={`/admin/feeds/${row.original.feedId}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {feed.title}
        </Link>
      );
    },
    meta: {
      displayName: "Feed",
      headClassName: "w-[20%]",
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.original.content;
      const truncatedContent = content
        ? content.length > 200
          ? content.substring(0, 200) + "..."
          : content
        : "No content";

      return (
        <div className="text-sm text-gray-600 max-w-md">{truncatedContent}</div>
      );
    },
    meta: {
      displayName: "Content",
      headClassName: "w-[30%]",
    },
  },
];
