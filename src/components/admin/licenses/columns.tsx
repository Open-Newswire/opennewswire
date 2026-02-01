"use client";

import { LicenseBadge } from "@/components/admin/licenses/LicenseBadge";
import { License } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";
import { LicenseActionMenu } from "./LicenseActionMenu";

export const columns: ColumnDef<License>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
    meta: {
      displayName: "Name",
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    meta: {
      displayName: "Slug",
    },
  },
  {
    accessorKey: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const license = row.original;
      return (
        <div className="flex items-center">
          <LicenseBadge license={license} />
        </div>
      );
    },
    meta: {
      displayName: "Preview",
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center justify-center">
        <Zap className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const license = row.original;
      return <LicenseActionMenu license={license} />;
    },
    meta: {
      headClassName: "w-[50px]",
    },
  },
];
