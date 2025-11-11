"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Language } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Zap } from "lucide-react";
import { LanguagesActionMenu } from "./LanguagesActionMenu";

export const columns: ColumnDef<Language>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
    meta: {
      displayName: "Name",
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    meta: {
      displayName: "Slug",
    },
  },
  {
    accessorKey: "isRtl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RTL" />
    ),
    cell: ({ row }) => {
      const isRtl = row.getValue("isRtl") as boolean;
      return (
        <div className="flex items-center">
          {isRtl && <Check className="h-4 w-4 text-green-600" />}
        </div>
      );
    },
    meta: {
      displayName: "RTL",
    },
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-600">{row.getValue("order")}</div>
      );
    },
    meta: {
      displayName: "Order",
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
      const language = row.original;
      return <LanguagesActionMenu language={language} />;
    },
    meta: {
      displayName: "Actions",
      headClassName: "w-[50px]",
    },
  },
];
