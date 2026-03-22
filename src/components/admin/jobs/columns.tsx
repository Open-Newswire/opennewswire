"use client";

import { StatusChip } from "@/components/admin/jobs/StatusChip";
import { TriggerChip } from "@/components/admin/jobs/TriggerChip";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<SyncJobWithFeed>[] = [
  {
    accessorKey: "feed",
    header: "Feed",
    cell: ({ row }) => {
      const feed = row.original.feed;
      return feed?.title ?? (
        <span className="text-sm italic text-muted-foreground">All Feeds</span>
      );
    },
    meta: {
      displayName: "Feed",
      headClassName: "w-[30%]",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const job = row.original;
      if (job.status !== Status.COMPLETED && job.parentId === null) {
        return <StatusChip status={job.status} />;
      }
      return (
        <div className="flex items-center gap-1">
          <StatusChip status={job.status} />
          {job.totalSuccess ? (
            <Badge
              variant="outline"
              className="text-green-700 border-green-300 bg-green-50"
            >
              {job.totalSuccess}
            </Badge>
          ) : null}
          {job.totalFailure ? (
            <Badge
              variant="outline"
              className="text-red-700 border-red-300 bg-red-50"
            >
              {job.totalFailure}
            </Badge>
          ) : null}
        </div>
      );
    },
    meta: {
      displayName: "Status",
      headClassName: "w-[25%]",
    },
  },
  {
    accessorKey: "trigger",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trigger" />
    ),
    cell: ({ row }) => <TriggerChip trigger={row.original.trigger} />,
    meta: {
      displayName: "Trigger",
      headClassName: "w-[15%]",
    },
  },
  {
    accessorKey: "triggeredAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Triggered At" />
    ),
    cell: ({ row }) => format(row.original.triggeredAt, "PP p"),
    meta: {
      displayName: "Triggered At",
      headClassName: "w-[30%]",
    },
  },
];
