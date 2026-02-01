"use client";

import { EventTypeBadge } from "@/components/admin/analytics/EventTypeBadge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AnalyticsEvent } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<AnalyticsEvent>[] = [
  {
    accessorKey: "occuredAt",
    accessorFn: (row) => format(row.occuredAt, "P p"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    meta: {
      displayName: "Date",
    },
  },
  {
    accessorKey: "eventType",
    header: "Type",
    cell: ({ row }) => <EventTypeBadge type={row.original.eventType} />,
    meta: {
      displayName: "Type",
    },
  },
  {
    accessorKey: "sessionId",
    header: "Session ID",
    meta: {
      displayName: "Session ID",
      hiddenByDefault: true,
    },
  },
  {
    accessorKey: "searchQuery",
    header: "Search Query",
    meta: {
      displayName: "Search Query",
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    meta: {
      displayName: "IP Address",
      hiddenByDefault: true,
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    meta: {
      displayName: "City",
    },
  },
  {
    accessorKey: "countryCode",
    accessorFn: (event) => {
      // @ts-ignore countryName is a derived field
      return event.countryName || event.countryCode;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    meta: {
      displayName: "Country",
    },
  },
  {
    accessorKey: "regionCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    meta: {
      displayName: "Region",
    },
  },
];
